import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { paypalConfigured, paypalSubscription } from '../../_lib/paypal.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { grantPaypalPeriod } from './_paypal.js';

const ACTIVE = new Set(['ACTIVE', 'TRIALING']);

/**
 * Confirmation used by the return redirect from PayPal. The webhook stays the source of truth, but a
 * buyer who lands back before that delivery arrives still gets their credits, because both paths
 * derive the same period key and the grant is a transaction.
 */
async function confirm(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  if (!paypalConfigured()) return res.status(503).json({ error: 'PayPal is not configured yet', code: 'paypal_not_configured' });
  const store = new BillingStore(database());
  const requested = String(req.query.subscription_id || '');
  // PayPal appends subscription_id to the return URL; the binding written at checkout is the fallback.
  const subscriptionId = requested || (await store.account(user.uid)).subscriptionId;
  if (!subscriptionId) return res.status(409).json({ error: 'No PayPal subscription to confirm', code: 'no_subscription' });
  const subscription = await paypalSubscription(subscriptionId);
  if (subscription.custom_id && subscription.custom_id !== user.uid) {
    return res.status(403).json({ error: 'This subscription belongs to another account' });
  }
  if (!ACTIVE.has(String(subscription.status || ''))) {
    // APPROVAL_PENDING means the buyer has not finished on PayPal yet; the webhook grants later.
    return res.status(200).json({ status: subscription.status || 'pending' });
  }
  const result = await grantPaypalPeriod(store, subscription, 'subscription');
  if (!result.handled) return res.status(409).json({ error: 'This subscription is not linked to a plan yet', code: 'unknown_subscription' });
  const account = await store.account(user.uid);
  return res.status(200).json({ status: 'active', tier: account.tier, credits: account.credits, applied: result.granted });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    return await confirm(req, res);
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    console.error('PayPal confirmation failed', { message: (error as Error).message });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
