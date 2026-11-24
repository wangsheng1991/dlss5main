import { createHash } from 'node:crypto';
import { waitUntil, metric } from '@vercel/functions';
import { database } from './admin.js';
import { parseFunnelEvent } from '../lib/conversion-events.js';

export async function recordConversion(uid: string, input: unknown, origin: 'browser' | 'server' = 'browser', db = database()) {
  const event = parseFunnelEvent(input);
  if (!event) return 'invalid';
  const now = Date.now(), day = new Date(now).toISOString().slice(0,10);
  const id = createHash('sha256').update(uid + ':' + event.id).digest('hex');
  const ref = db.doc('conversion_events/' + id);
  const quota = db.doc('conversion_event_limits/' + createHash('sha256').update(uid + ':' + day).digest('hex'));
  const result = await db.runTransaction(async tx => {
    const [previous, limits] = await tx.getAll(ref, quota);
    if (previous.exists) return 'duplicate';
    const count = Number(limits.data()?.count || 0);
    if (count >= 200) return 'limited';
    tx.create(ref, { uid, event: event.event, dimensions: event.dimensions, origin, createdAt: now,
      expiresAt: new Date(now + 90 * 86400000) });
    tx.set(quota, { count: count + 1, expiresAt: new Date(now + 2 * 86400000) });
    return 'recorded';
  });
  metric('studio.funnel.events', 1, { event: event.event, outcome: result });
  return result;
}

/** Logs are not part of checkout's financial transaction, and cannot change its response. */
export function observeCheckout(uid: string | undefined, plan: unknown, httpStatus: number, code?: string, elapsedMs = 0) {
  const outcome = httpStatus === 200 ? 'ready' : httpStatus === 409 ? 'conflict' : httpStatus === 401 ? 'authentication' : 'error';
  metric('studio.checkout.responses', 1, { outcome, provider: 'waffo' });
  metric('studio.checkout.duration_ms', elapsedMs, { outcome });
  console.info('studio_checkout', { outcome, http_status: httpStatus, plan: plan === 'pro' || plan === 'team' ? plan : 'unknown',
    code: typeof code === 'string' && /^[a-z_]{1,60}$/.test(code) ? code : 'none' });
  if (!uid) return;
  try { waitUntil(database().collection('conversion_checkout_responses').add({
    uid, plan: plan === 'pro' || plan === 'team' ? plan : 'unknown', outcome, httpStatus,
    code: typeof code === 'string' && /^[a-z_]{1,60}$/.test(code) ? code : 'none',
    createdAt: Date.now(), expiresAt: new Date(Date.now() + 90 * 86400000),
  }).catch(() => { console.warn('conversion_checkout_log_unavailable'); })); } catch { console.warn('conversion_checkout_log_unavailable'); }
}
