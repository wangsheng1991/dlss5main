import { randomUUID, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { adminAuth, database, privateStorage } from './admin.js';
import { ApiError } from './errors.js';
import { readVideoGateway, readVideoGatewayResult, submitVideoGateway, type HighlightsPhase } from './video-highlights-alphanet.js';
import { HIGHLIGHTS_EVENTS, HIGHLIGHTS_MAX_BYTES, HIGHLIGHTS_MAX_SECONDS, highlightsStallReason, highlightsWorkerAvailable, type HighlightsSegment } from '../lib/video-highlights-beta.js';

const day = 24 * 60 * 60 * 1000;
const leaseMs = 5 * 60 * 1000;
const isInvited = (uid: string) => process.env.VIDEO_HIGHLIGHTS_INVITE_UIDS?.split(',').some(id => id.trim() === uid);
const phaseValue = (phase: unknown): HighlightsPhase => {
  if (phase === 'analyze' || phase === 'export') return phase;
  throw new ApiError(400, 'invalid_phase', 'Invalid phase');
};
export function useHighlightsGateway(uid: string, enabled?: string, canaryUid?: string, open = false) {
  return enabled === '1' && Boolean(uid) && (open || canaryUid?.trim() === uid);
}
const phaseField = (phase: HighlightsPhase) => phase === 'analyze' ? 'alphaAnalyze' : 'alphaExport';
const matchingChannelKey = (req: VercelRequest) => {
  const key = Buffer.from(process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY ?? '');
  const presented = Buffer.from(bearer(req));
  return key.length > 0 && key.length === presented.length && timingSafeEqual(key, presented);
};
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
  if (!account.email_verified) return fail(403, 'email_unverified', 'Verify your email to continue');
  const open = process.env.VIDEO_HIGHLIGHTS_ACCESS_MODE !== 'invite';
  if (!open && !isInvited(account.uid)) {
    return fail(403, 'invite_required', 'An invitation is required');
  }
  const { db, jobs, control, bucket } = services();
  const now = Date.now();
  const activity = db.collection('videoHighlightOwners').doc(account.uid);
  const action = body.action;

  async function uploadTicket(id: string, input: string, size: number) {
    const [uploadUrl] = await bucket.file(input).getSignedUrl({
      version: 'v4', action: 'write', expires: now + 600000, contentType: 'video/mp4',
      extensionHeaders: { ...uploadHeaders, 'content-length': String(size) },
    });
    return { id, uploadUrl, headers: uploadHeaders };
  }

  if (action === 'access') {
    const worker = (await control.get()).data();
    return res.json({ available: highlightsWorkerAvailable(worker, now) });
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
    const viaAlphaNet = useHighlightsGateway(account.uid, process.env.VIDEO_HIGHLIGHTS_ALPHANET_ENABLED, process.env.VIDEO_HIGHLIGHTS_ALPHANET_CANARY_UID, open);
    if ((open && !viaAlphaNet) || (viaAlphaNet && (!process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY || !process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY))) {
      return fail(503, 'video_gateway_unavailable', 'Video gateway temporarily unavailable');
    }
    const id = randomUUID();
    const doc = jobs.doc(id);
    const input = `highlights/${id}/input.mp4`;
    await db.runTransaction(async tx => {
      const [owner, worker] = await tx.getAll(activity, control);
      if (!highlightsWorkerAvailable(worker.data(), now)) {
        return fail(503, 'worker_offline', 'Worker temporarily unavailable');
      }
      const lastId = owner.data()?.job;
      const previous = typeof lastId === 'string' ? (await tx.get(jobs.doc(lastId))).data() : null;
      if (previous && previous.expiresAt > now && ['upload', 'queued', 'running', 'ready'].includes(previous.status)) {
        return fail(409, 'active_job', 'Resume or discard the previous job first');
      }
      if (Number(owner.data()?.startedAt) + 45000 > now) return fail(429, 'rate_limit', 'Please wait before starting another job');
      const quotaDay = new Date(now).toISOString().slice(0, 10);
      const ownerData = owner.data();
      const dailyJobs = ownerData?.quotaDay === quotaDay ? Number(ownerData.dailyJobs ?? 0) : 0;
      if (dailyJobs >= 5) return fail(429, 'daily_limit', 'Daily highlights limit reached');
      tx.create(doc, { uid: account.uid, input, size, event, status: 'upload', phase: 'analyze', attempts: 0, createdAt: now, expiresAt: now + day,
        ...(viaAlphaNet ? { transport: 'alphanet' } : {}) });
      tx.set(activity, { job: id, startedAt: now, quotaDay, dailyJobs: dailyJobs + 1 });
    });
    return res.json(await uploadTicket(id, input, size));
  }

  const id = matchJob(body.id);
  const doc = jobs.doc(id);
  let job = (await doc.get()).data();
  if (!job || job.uid !== account.uid || job.expiresAt <= now) return fail(404, 'not_found', 'Job not found');

  if (action === 'status') {
    job = await expireStalledJob(id, job, doc, db, control, now);
    if (job.transport === 'alphanet' && ['queued', 'running', 'ready', 'done', 'failed'].includes(job.status)) {
      const phase = phaseValue(job.phase);
      const entry = job[phaseField(phase)];
      if (entry?.accepted) {
        const taskId = entry.taskId ?? await dispatchToAlphaNet(id, phase);
        const task = await readVideoGateway(taskId);
        if (task.status === 'SUCCESS' && (job.status === 'ready' || job.status === 'done')) {
          const result = await readVideoGatewayResult(taskId);
          if (result.id !== id || result.phase !== phase || !['ready', 'done'].includes(String(result.status))) {
            return fail(503, 'video_gateway_unavailable', 'Video gateway temporarily unavailable');
          }
          return res.json(result);
        }
        if (task.status === 'FAILURE') {
          return res.json(await jobResponse(id, { ...job, status: 'failed', error: job.error ?? 'gateway_failed' }, bucket, now));
        }
        // The gateway's poll may lag an already completed worker update.
        return res.json({ id, status: task.status === 'IN_PROGRESS' ? 'running' : 'queued', phase, segments: [], error: null });
      }
    }
    return res.json(await jobResponse(id, job, bucket, now));
  }

  if (action === 'retry_upload') {
    if (job.status !== 'upload') return fail(409, 'job_busy', 'Upload is no longer pending');
    if (body.size !== job.size) return fail(400, 'invalid_upload', 'Choose the original MP4');
    const owner = (await activity.get()).data();
    if (owner?.job !== id) return fail(404, 'not_found', 'Job not found');
    const [exists] = await bucket.file(job.input).exists();
    return res.json(exists ? { id, alreadyUploaded: true } : await uploadTicket(id, job.input, job.size));
  }

  async function dispatchToAlphaNet(id: string, phase: HighlightsPhase) {
    const taskId = await submitVideoGateway(id, phase);
    const field = phaseField(phase);
    await db.runTransaction(async tx => {
      const fresh = (await tx.get(doc)).data();
      if (!fresh || fresh.uid !== account.uid || fresh.expiresAt <= Date.now()) return fail(404, 'not_found', 'Job not found');
      const entry = fresh[field];
      if (!entry?.accepted || (entry.taskId && entry.taskId !== taskId)) {
        return fail(503, 'video_gateway_unavailable', 'Video gateway temporarily unavailable');
      }
      if (!entry.taskId) tx.update(doc, { [field]: { ...entry, taskId } });
    });
    return taskId;
  }

  if (action === 'submit' || action === 'export' || action === 'discard') {
    if (action === 'submit' && job.status === 'upload') {
      const [meta] = await bucket.file(job.input).getMetadata().catch(error => {
        if (Number(error.code) === 404) return fail(400, 'upload_missing', 'Upload not found');
        throw error;
      });
      if (Number(meta.size) !== job.size || meta.contentType !== 'video/mp4') return fail(400, 'invalid_upload', 'Invalid uploaded object');
    }
    const dispatch = await db.runTransaction(async tx => {
      const [fresh, owner] = await tx.getAll(doc, activity);
      const current = fresh.data();
      if (!current || current.uid !== account.uid || current.expiresAt <= now || owner.data()?.job !== id) {
        return fail(404, 'not_found', 'Job not found');
      }
      if (action === 'submit') {
        if (current.transport === 'alphanet') {
          if (current.status === 'upload' && !current.alphaAnalyze) {
            tx.update(doc, { alphaAnalyze: { authorized: true } });
          }
          return current.status === 'upload' || (current.alphaAnalyze?.accepted && !current.alphaAnalyze.taskId) ? 'analyze' : null;
        }
        if (current.status === 'upload') tx.update(doc, { status: 'queued', queuedAt: now });
        return null;
      }
      if (action === 'discard') {
        if (!['ready', 'upload', 'queued'].includes(current.status)) return fail(409, 'job_busy', 'The job cannot be discarded');
        tx.update(doc, { status: 'discarded' });
        return null;
      }
      if (current.phase === 'export') return current.transport === 'alphanet' && !current.alphaExport?.taskId ? 'export' : null;
      if (current.status !== 'ready') return fail(409, 'not_ready', 'Wait for analysis to finish');
      const indices = body.indices;
      const segments = getSegments(current.segments);
      if (!Array.isArray(indices) || indices.length === 0 ||
        indices.some(index => !Number.isInteger(index) || index < 0 || index >= segments.length)) {
        return fail(400, 'invalid_segments', 'Select at least one valid segment');
      }
      const selected = [...new Set(indices as number[])].sort((a, b) => a - b).map(index => segments[index]);
      if (current.transport === 'alphanet') {
        if (current.alphaExport) {
          if (JSON.stringify(current.alphaExport.selected) !== JSON.stringify(selected)) {
            return fail(409, 'export_pending', 'The original export selection is still pending');
          }
        } else {
          tx.update(doc, { alphaExport: { authorized: true, selected } });
        }
        return 'export';
      }
      tx.update(doc, { status: 'queued', queuedAt: now, phase: 'export', selected, attempts: 0 });
      return null;
    });
    if (dispatch) await dispatchToAlphaNet(id, dispatch);
    return res.json({ id });
  }
  return fail(400, 'unknown_action', 'Unknown action');
}

async function expireStalledJob(id: string, job: FirebaseFirestore.DocumentData,
  doc: FirebaseFirestore.DocumentReference, db: FirebaseFirestore.Firestore,
  control: FirebaseFirestore.DocumentReference, now: number) {
  if (job.status !== 'queued' && job.status !== 'running') return job;
  const slot = (await control.get()).data();
  if (!highlightsStallReason(job, slot, id, now)) return job;
  return db.runTransaction(async tx => {
    const [current, worker] = await tx.getAll(doc, control);
    const state = current.data();
    if (!state || state.uid !== job.uid || state.expiresAt <= now) return fail(404, 'not_found', 'Job not found');
    const error = highlightsStallReason(state, worker.data(), id, now);
    if (!error) return state;
    const status = 'failed';
    tx.update(doc, { status, error });
    if (worker.data()?.active === id) tx.set(control, {});
    return { ...state, status, error };
  });
}

async function jobResponse(id: string, job: FirebaseFirestore.DocumentData, bucket: ReturnType<typeof services>['bucket'], now: number) {
  const [downloadUrl] = job.status === 'done' ? await bucket.file(job.output).getSignedUrl({
    version: 'v4', action: 'read', expires: now + 300000,
    responseDisposition: 'attachment; filename="video-highlights.mp4"',
  }) : [];
  const [previewUrl] = job.status === 'ready' ? await bucket.file(job.input).getSignedUrl({
    version: 'v4', action: 'read', expires: now + 900000,
  }) : [];
  return { id, status: job.status, phase: job.phase, segments: job.segments ?? [], downloadUrl, previewUrl,
    error: job.error ?? null, ...(job.status === 'upload' ? { uploadSize: job.size } : {}) };
}

export function gatewayPhaseStatus(job: FirebaseFirestore.DocumentData, phase: HighlightsPhase) {
  if (job.status === 'discarded') return 'FAILURE';
  if (phase === 'analyze' && ['ready', 'done'].includes(job.status)) return 'SUCCESS';
  if (phase === 'analyze' && job.phase === 'export') return 'SUCCESS';
  if (job.status === 'failed') return 'FAILURE';
  if (job.status === 'done') return 'SUCCESS';
  return job.status === 'running' ? 'IN_PROGRESS' : 'QUEUED';
}

async function gatewayAction(req: VercelRequest, res: VercelResponse, body: Record<string, unknown>) {
  if (!matchingChannelKey(req)) return fail(401, 'gateway_auth', 'Authentication required');
  const phase = phaseValue(body.phase);
  if (typeof body.id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(body.id)) {
    return fail(404, 'not_found', 'Job not found');
  }
  const id = body.id;
  const { db, jobs, control, bucket } = services();
  const doc = jobs.doc(id);
  const field = phaseField(phase);
  const now = Date.now();
  const validate = (state: FirebaseFirestore.DocumentData | undefined) => {
    // Authorization is recorded only after the authenticated owner requests this phase.
    // Keep accepted jobs runnable even if access is narrowed again.
    if (state?.transport !== 'alphanet' || state.expiresAt <= now || !state[field]?.authorized) {
      return fail(404, 'not_found', 'Job not found');
    }
    return state;
  };
  if (body.action === 'alpha_submit') {
    await db.runTransaction(async tx => {
      const job = validate((await tx.get(doc)).data());
      if (job[field].accepted) return;
      if (phase === 'analyze' ? job.status !== 'upload' : job.status !== 'ready') {
        return fail(409, 'not_ready', 'Job is not ready for submission');
      }
      tx.update(doc, { [field]: { ...job[field], accepted: true }, phase, status: 'queued', queuedAt: now, attempts: 0,
        ...(phase === 'export' ? { selected: getSegments(job[field].selected) } : {}) });
    });
    return res.status(202).json({ request_id: id + '.' + phase });
  }

  const current = validate((await doc.get()).data());
  const job = validate(await expireStalledJob(id, current, doc, db, control, now));
  if (!job[field].accepted) return fail(404, 'not_found', 'Job not found');
  const status = gatewayPhaseStatus(job, phase);
  if (body.action === 'alpha_status') {
    return res.json({ request_id: id + '.' + phase, status,
      ...(status === 'FAILURE' ? { error: job.error ?? 'discarded' } : {}) });
  }
  if (body.action === 'alpha_result') {
    if (status !== 'SUCCESS') return fail(409, 'not_ready', 'Result unavailable');
    const result = phase === 'analyze' ? { ...job, status: 'ready', phase } : job;
    return res.json(await jobResponse(id, result, bucket, now));
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
      const candidate = queued.filter(row => row.data().expiresAt > now &&
        !highlightsStallReason(row.data(), slot, row.id, now))
        .sort((a, b) => a.data().queuedAt - b.data().queuedAt)[0];
      const ref = retry ? expiredRef : candidate?.ref;
      const job = retry ? expired : candidate?.data();
      if (expiredRunning && !retry) tx.update(expiredRef, { status: 'failed', error: 'worker_lost' });
      for (const row of queued) {
        const error = row.data().expiresAt <= now ? 'expired' : highlightsStallReason(row.data(), slot, row.id, now);
        if (error) tx.update(row.ref, { status: 'failed', error });
      }
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
  const artifact = (req.method === 'GET' || req.method === 'HEAD') && req.query.kind === 'video-highlights-result';
  if (req.method !== 'POST' && !artifact) return res.status(405).json({ error: 'Method not allowed' });
  const body = (req.body ?? {}) as Record<string, unknown>;
  try {
    if (artifact) return await gatewayAction(req, res, { action: 'alpha_result', id: req.query.id, phase: req.query.phase });
    if (body.action === 'alpha_submit' || body.action === 'alpha_status') return await gatewayAction(req, res, body);
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
