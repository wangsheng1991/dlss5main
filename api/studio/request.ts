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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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

    return res.status(200).json({ ok: true, id: ref?.id ?? null, recorded, delivered: Boolean(webhook && secret) });
  } catch (error) {
    return fail(res, error);
  }
}
