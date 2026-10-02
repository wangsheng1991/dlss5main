import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth.js';
import { database } from '../../server/admin.js';

/**
 * A DLSS5 Studio download request, filed from `/download`.
 *
 * The point of this route is that the visitor never leaves the page: they write one line, press
 * once, and the request exists — with a record, so the site can honestly say it arrived. Previously
 * the only way to ask was to open `mailto:`, write the mail yourself and trust that it left; the
 * site learned nothing either way.
 *
 * Two things happen, in this order, because the record matters more than the mail:
 *   1. the request is written to `studioRequests`, with `notified` telling the truth about step 2;
 *   2. a Worker (see `workers/studio-mailer`) sends the notification to the one inbox that answers
 *      these. Cloudflare only lets that Worker deliver to a verified destination, so a mail outage
 *      or a misconfigured secret can delay a notification but cannot send one anywhere else.
 *
 * The visitor's address comes from their verified token, never from the request body — one account
 * cannot file a request in someone else's name.
 */

const MAX_NOTE = 2000;
const MAX_MACHINE = 200;
/** One request a minute per account: enough for a retry, not enough to flood an inbox. */
const RATE_LIMIT_SECONDS = 60;

const text = (value: unknown, limit: number): string =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit) : '';

type MailopsPayload = {
  requestId: string;
  userId: string;
  email: string;
  machine: string;
  note: string;
  createdAt: string;
  source: string;
};

async function mirrorToMailops(payload: MailopsPayload): Promise<void> {
  const webhook = process.env.MAILOPS_WEBHOOK_URL;
  const secret = process.env.MAILOPS_WEBHOOK_SECRET;
  if (!webhook || !secret) throw new Error('MailOps is not configured');
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-mailops-secret': secret },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`MailOps answered ${response.status}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // A secret-protected maintenance call imports recent Firestore records into a newly deployed
    // MailOps instance. It deliberately reuses this function so the project keeps the same number
    // of serverless functions.
    if (req.method === 'PUT') {
      const supplied = String(req.headers['x-mailops-secret'] || '');
      const expected = process.env.MAILOPS_WEBHOOK_SECRET || '';
      if (!expected || supplied !== expected) return res.status(401).json({ error: 'Unauthorized' });
      if (!process.env.MAILOPS_WEBHOOK_URL) return res.status(503).json({ error: 'MailOps is not configured' });

      const snapshot = await database().collection('studioRequests').orderBy('createdAt', 'desc').limit(250).get();
      const payloads = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        const createdAt = data.createdAt as { toDate?: () => Date } | undefined;
        return {
          requestId: doc.id,
          userId: text(data.uid, 200),
          email: text(data.email, 320).toLowerCase(),
          machine: text(data.machine, MAX_MACHINE),
          note: text(data.note, MAX_NOTE),
          createdAt: createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          source: 'dlss5nvidia.com/download-import',
        };
      }).filter((item) => item.email);

      let synced = 0;
      let failed = 0;
      for (let index = 0; index < payloads.length; index += 20) {
        const results = await Promise.allSettled(payloads.slice(index, index + 20).map(mirrorToMailops));
        for (const result of results) result.status === 'fulfilled' ? synced++ : failed++;
      }
      return res.status(200).json({ ok: failed === 0, total: payloads.length, synced, failed });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid, email } = await requireUser(req);

    const body = (req.body || {}) as Record<string, unknown>;
    const note = text(body.note, MAX_NOTE);
    const machine = text(body.machine, MAX_MACHINE);
    if (!note && !machine) return res.status(400).json({ error: 'Say what you want to process, or which machine you are on', code: 'empty_request' });

    const createdAt = new Date();
    const record = { uid, email, machine, note, createdAt, status: 'new', notified: false, notifyError: '' };
    let ref: { id: string; update: (value: unknown) => Promise<unknown> } | undefined;
    let recorded = false;

    // Firestore is the audit trail, but it must not be the only path to the mailbox. A database
    // quota or transient read outage used to abort before the Worker was called, leaving the user
    // watching “Sending…” while their request never reached the inbox. Rate limiting and recording
    // are now best effort; notification remains the user-facing operation.
    try {
      const db = database();
      const requests = db.collection('studioRequests');
      const recent = await requests.where('uid', '==', uid).orderBy('createdAt', 'desc').limit(1).get();
      const last = recent.docs[0]?.data()?.createdAt as { toMillis?: () => number } | undefined;
      const lastMs = last?.toMillis?.() ?? 0;
      if (lastMs && Date.now() - lastMs < RATE_LIMIT_SECONDS * 1000) {
        return res.status(429).json({ error: 'That request was just sent', code: 'too_soon' });
      }
      ref = await requests.add(record);
      recorded = true;
    } catch (error) {
      console.error('Unable to record Studio request; continuing to notification:', error);
    }

    const webhook = process.env.STUDIO_NOTIFY_WEBHOOK;
    const secret = process.env.STUDIO_NOTIFY_SECRET;
    if (webhook && secret) {
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-studio-secret': secret },
          body: JSON.stringify({ email, uid, machine, note }),
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error(`mailer answered ${response.status}`);
        if (ref) await ref.update({ notified: true });
      } catch (error) {
        // The request is already stored, so a mail failure is recorded rather than reported as a
        // failure to the visitor: their part is done, and the queue is what we read from.
        if (ref) await ref.update({ notifyError: String((error as Error)?.message || error).slice(0, 300) });
      }
    }

    // Mirror the request into AlphaNet MailOps. The original Firestore record and notification
    // remain authoritative fallbacks, so a control-plane outage never makes the visitor retry a
    // request that was already accepted. `requestId` is stable when Firestore succeeded and still
    // unique for the best-effort path when it did not.
    const mailopsWebhook = process.env.MAILOPS_WEBHOOK_URL;
    const mailopsSecret = process.env.MAILOPS_WEBHOOK_SECRET;
    let mailopsQueued = false;
    if (mailopsWebhook && mailopsSecret) {
      try {
        await mirrorToMailops({
          requestId: ref?.id ?? `${uid}-${createdAt.getTime()}`,
          userId: uid,
          email,
          machine,
          note,
          createdAt: createdAt.toISOString(),
          source: 'dlss5nvidia.com/download',
        });
        mailopsQueued = true;
        if (ref) await ref.update({ mailopsQueued: true });
      } catch (error) {
        console.error('Unable to mirror Studio request into MailOps:', error);
        if (ref) await ref.update({ mailopsError: String((error as Error)?.message || error).slice(0, 300) });
      }
    }

    return res.status(200).json({ ok: true, id: ref?.id ?? null, recorded, delivered: Boolean(webhook && secret), mailopsQueued });
  } catch (error) {
    return fail(res, error);
  }
}
