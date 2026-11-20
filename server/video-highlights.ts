import { randomUUID, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminAuth, database, privateStorage } from './admin.js';
import { ApiError } from './errors.js';
import { HIGHLIGHTS_EVENTS, HIGHLIGHTS_MAX_BYTES, HIGHLIGHTS_MAX_SECONDS, type HighlightsSegment } from '../lib/video-highlights-beta.js';

const day = 24 * 60 * 60 * 1000;
const leaseMs = 5 * 60 * 1000;
const uploadHeaders = { 'x-goog-if-generation-match': '0' };
const fail = (status: number, code: string, message: string): never => { throw new ApiError(status, code, message); };

function bearer(req: VercelRequest) {
  const value = req.headers.authorization ?? '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function services() {
  const bucketName = process.env.VIDEO_HIGHLIGHTS_BUCKET;
  if (!bucketName) return fail(503, 'beta_offline', 'Video beta is offline');
  const db = database();
  return { db, jobs: db.collection('videoHighlightJobs'), control: db.doc('videoHighlightControl/worker'), bucket: privateStorage().bucket(bucketName) };
}

function matchJob(id: unknown): string {
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) return fail(404, 'not_found', 'Job not found');
  return id;
}

function getSegments(value: unknown): HighlightsSegment[] {
  if (!Array.isArray(value) || value.length > 30) return fail(400, 'invalid_segments', 'Invalid segments');
  let previousEnd = 0;
  return value.map(item => {
    if (!item || typeof item !== 'object') return fail(400, 'invalid_segments', 'Invalid segments');
    const { start, end } = item;
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < previousEnd || start >= end || end > HIGHLIGHTS_MAX_SECONDS) {
      return fail(400, 'invalid_segments', 'Invalid segments');
    }
    previousEnd = end;
    return { start, end };
  });
}

async function userAction(req: VercelRequest, res: VercelResponse, body: Record<string, unknown>) {
  if (!process.env.VIDEO_HIGHLIGHTS_BUCKET) return fail(503, 'beta_offline', 'Video beta is offline');
  const token = bearer(req);
  if (!token) return fail(401, 'sign_in', 'Sign in to continue');
  const account = await adminAuth().verifyIdToken(token).catch(() => fail(401, 'sign_in', 'Sign in to continue'));
  if (!account.email_verified || !process.env.VIDEO_HIGHLIGHTS_INVITE_UIDS?.split(',').map(id => id.trim()).includes(account.uid)) {
    return fail(403, 'invite_required', 'An invitation is required');
  }
  const { db, jobs, control, bucket } = services();
  const now = Date.now();
  const activity = db.collection('videoHighlightOwners').doc(account.uid);
  const action = body.action;

  if (action === 'access') {
    const worker = (await control.get()).data();
    return res.json({ available: Number(worker?.heartbeat) > now - 120000 || Number(worker?.leaseUntil) > now });
  }

  if (action === 'recent') {
    const id = (await activity.get()).data()?.job;
    const recent = typeof id === 'string' ? (await jobs.doc(id).get()).data() : null;
    return res.json({ id: recent?.uid === account.uid && recent.expiresAt > now ? id : null });
  }

  if (action === 'upload') {
    const size = Number(body.size);
    const event = HIGHLIGHTS_EVENTS.find(candidate => candidate === body.event);
    if (!event || !Number.isSafeInteger(size) || size < 1 || size > HIGHLIGHTS_MAX_BYTES) {
      return fail(400, 'invalid_upload', 'Choose a supported event and MP4 under 32 MiB');
    }
    const id = randomUUID();
    const doc = jobs.doc(id);
    const input = `highlights/${id}/input.mp4`;
    const [uploadUrl] = await bucket.file(input).getSignedUrl({
      version: 'v4', action: 'write', expires: now + 600000, contentType: 'video/mp4',
      extensionHeaders: { ...uploadHeaders, 'content-length': String(size) },
    });
    await db.runTransaction(async tx => {
      const [owner, worker] = await tx.getAll(activity, control);
      if (!(Number(worker.data()?.heartbeat) > now - 120000 || Number(worker.data()?.leaseUntil) > now)) {
        return fail(503, 'worker_offline', 'Worker temporarily unavailable');
      }
      const lastId = owner.data()?.job;
      const previous = typeof lastId === 'string' ? (await tx.get(jobs.doc(lastId))).data() : null;
      if (previous && previous.expiresAt > now && ['queued', 'running', 'ready'].includes(previous.status)) {
        return fail(409, 'active_job', 'Resume or discard the previous job first');
      }
      if (Number(owner.data()?.startedAt) + 45000 > now) return fail(429, 'rate_limit', 'Please wait before starting another job');
      tx.create(doc, { uid: account.uid, input, size, event, status: 'upload', phase: 'analyze', attempts: 0, createdAt: now, expiresAt: now + day });
      tx.set(activity, { job: id, startedAt: now });
    });
    return res.json({ id, uploadUrl, headers: uploadHeaders });
  }

  const id = matchJob(body.id);
  const doc = jobs.doc(id);
  const job = (await doc.get()).data();
  if (!job || job.uid !== account.uid || job.expiresAt <= now) return fail(404, 'not_found', 'Job not found');

  if (action === 'status') {
    const [downloadUrl] = job.status === 'done' ? await bucket.file(job.output).getSignedUrl({
      version: 'v4', action: 'read', expires: now + 300000,
      responseDisposition: 'attachment; filename="video-highlights.mp4"',
    }) : [];
    const [previewUrl] = job.status === 'ready' ? await bucket.file(job.input).getSignedUrl({
      version: 'v4', action: 'read', expires: now + 900000,
    }) : [];
    return res.json({ id, status: job.status, phase: job.phase, segments: job.segments ?? [], downloadUrl, previewUrl,
      error: job.error ?? null });
  }

  if (action === 'submit' || action === 'export' || action === 'discard') {
    if (action === 'submit' && job.status === 'upload') {
      const [meta] = await bucket.file(job.input).getMetadata().catch(() => fail(400, 'upload_missing', 'Upload not found'));
      if (Number(meta.size) !== job.size || meta.contentType !== 'video/mp4') return fail(400, 'invalid_upload', 'Invalid uploaded object');
    }
    await db.runTransaction(async tx => {
      const [fresh, owner] = await tx.getAll(doc, activity);
      const current = fresh.data();
      if (!current || current.uid !== account.uid || current.expiresAt <= now || owner.data()?.job !== id) {
        return fail(404, 'not_found', 'Job not found');
      }
      if (action === 'submit') {
        if (current.status === 'upload') tx.update(doc, { status: 'queued', queuedAt: now });
        return;
      }
      if (action === 'discard') {
        if (current.status !== 'ready' && current.status !== 'upload') return fail(409, 'job_busy', 'The job cannot be discarded');
        tx.update(doc, { status: 'discarded' });
        return;
      }
      if (current.phase === 'export') return;
      if (current.status !== 'ready') return fail(409, 'not_ready', 'Wait for analysis to finish');
      const indices = body.indices;
      const segments = getSegments(current.segments);
      if (!Array.isArray(indices) || indices.length === 0 ||
        indices.some(index => !Number.isInteger(index) || index < 0 || index >= segments.length)) {
        return fail(400, 'invalid_segments', 'Select at least one valid segment');
      }
      const selected = [...new Set(indices as number[])].sort((a, b) => a - b).map(index => segments[index]);
      tx.update(doc, { status: 'queued', queuedAt: now, phase: 'export', selected, attempts: 0 });
    });
    return res.json({ id });
  }
  return fail(400, 'unknown_action', 'Unknown action');
}

async function workerAction(res: VercelResponse, body: Record<string, unknown>) {
  const { db, jobs, control, bucket } = services();
  const now = Date.now();

  if (body.action === 'claim') {
    const lease = randomUUID();
    const claimed = await db.runTransaction(async tx => {
      const slot = (await tx.get(control)).data();
      if (slot?.active && slot.leaseUntil > now) return null;
      const expiredRef = slot?.active ? jobs.doc(matchJob(slot.active)) : null;
      const expired = expiredRef ? (await tx.get(expiredRef)).data() : null;
      const expiredRunning = expiredRef && expired?.status === 'running';
      const retry = expiredRunning && expired.expiresAt > now && expired.attempts < 2;
      const queued = retry ? [] : (await tx.get(jobs.where('status', '==', 'queued').limit(20))).docs;
      const candidate = queued.filter(row => row.data().expiresAt > now)
        .sort((a, b) => a.data().queuedAt - b.data().queuedAt)[0];
      const ref = retry ? expiredRef : candidate?.ref;
      const job = retry ? expired : candidate?.data();
      if (expiredRunning && !retry) tx.update(expiredRef, { status: 'failed', error: 'worker_lost' });
      queued.filter(row => row.data().expiresAt <= now).forEach(row => tx.update(row.ref, { status: 'failed', error: 'expired' }));
      if (!ref || !job) {
        tx.set(control, { heartbeat: now });
        return null;
      }
      tx.update(ref, { status: 'running', lease, attempts: job.attempts + 1 });
      tx.set(control, { active: ref.id, lease, heartbeat: now, leaseUntil: now + leaseMs });
      return { id: ref.id, input: job.input, size: job.size, event: job.event, phase: job.phase, selected: job.selected };
    });
    if (!claimed) return res.json({ job: null });
    const [inputUrl] = await bucket.file(claimed.input).getSignedUrl({ version: 'v4', action: 'read', expires: now + leaseMs });
    const [outputUrl] = claimed.phase === 'export'
      ? await bucket.file(`highlights/${claimed.id}/${lease}.mp4`).getSignedUrl({
        version: 'v4', action: 'write', expires: now + leaseMs, contentType: 'video/mp4',
      }) : [];
    return res.json({ job: { ...claimed, input: undefined, lease, inputUrl, outputUrl } });
  }

  if (body.action === 'finish') {
    const id = matchJob(body.id);
    const lease = matchJob(body.lease);
    const ref = jobs.doc(id);
    const output = `highlights/${id}/${lease}.mp4`;
    const acceptedErrors = ['invalid_media', 'analysis_failed', 'export_failed'];
    const error = acceptedErrors.find(item => item === body.error);
    const segments = error ? [] : getSegments(body.segments ?? []);
    if (!error && body.exported === true) {
      const [meta] = await bucket.file(output).getMetadata().catch(() => fail(400, 'export_missing', 'Export missing'));
      if (Number(meta.size) < 1 || Number(meta.size) > HIGHLIGHTS_MAX_BYTES || meta.contentType !== 'video/mp4') {
        return fail(400, 'invalid_export', 'Invalid export');
      }
    }
    await db.runTransaction(async tx => {
      const [slot, snapshot] = await tx.getAll(control, ref);
      const job = snapshot.data();
      const leaseState = slot.data();
      if (job?.lastLease === lease) return;
      if (job?.status !== 'running' || job.lease !== lease || leaseState?.active !== id ||
        leaseState?.lease !== lease || leaseState.leaseUntil <= now) return fail(409, 'stale_lease', 'Stale lease');
      if (!error && (body.exported === true) !== (job.phase === 'export')) return fail(400, 'invalid_phase', 'Invalid phase');
      const updates = error ? { status: 'failed', error } : job.phase === 'export'
        ? { status: 'done', output } : { status: 'ready', segments };
      tx.update(ref, { ...updates, lastLease: lease });
      tx.set(control, { heartbeat: now });
    });
    return res.json({ ok: true });
  }
  return fail(400, 'unknown_action', 'Unknown action');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = (req.body ?? {}) as Record<string, unknown>;
  try {
    if (body.action === 'claim' || body.action === 'finish') {
      const key = Buffer.from(process.env.VIDEO_HIGHLIGHTS_WORKER_KEY ?? '');
      const presented = Buffer.from(bearer(req));
      if (!key.length || key.length !== presented.length || !timingSafeEqual(key, presented)) return fail(401, 'worker_auth', 'Authentication required');
      return await workerAction(res, body);
    }
    return await userAction(req, res, body);
  } catch (cause) {
    if (cause instanceof ApiError) return res.status(cause.status).json({ error: cause.message, code: cause.code });
    console.error('Video highlights unexpected failure', cause instanceof Error ? cause.name : 'unknown');
    return res.status(500).json({ error: 'Video job unavailable', code: 'internal_error' });
  }
}
