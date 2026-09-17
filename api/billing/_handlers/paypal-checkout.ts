import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { siteOrigin } from '../../_lib/stripe.js';
import { ensurePlan, paypalApi, paypalConfigured } from '../../_lib/paypal.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { isPurchasablePlan } from '../../../src/config/plans.js';

type Subscription = { id?: string; status?: string; links?: Array<{ rel?: string; href?: string }> };

/**
 * Starts a PayPal subscription and hands back the approval link. The account is bound to the
 * subscription before the buyer approves, so the webhook PayPal sends afterwards can find it even
 * though that event carries nothing but the subscription id.
 */
async function checkout(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  const plan = (req.body || {}).plan;
  if (!isPurchasablePlan(plan)) return res.status(400).json({ error: 'Choose a paid plan: pro or team' });
  if (!paypalConfigured()) return res.status(503).json({ error: 'PayPal is not configured yet', code: 'paypal_not_configured' });
  const store = new BillingStore(database());
  const account = await store.account(user.uid);
  // Two subscriptions would compete for the same allowance; existing buyers change plan instead.
  if (account.subscriptionId && ['active', 'trialing', 'past_due'].includes(account.subscriptionStatus)) {
    return res.status(409).json({ error: 'You already have a subscription — change your plan instead', code: 'subscription_exists' });
  }
  const planId = await ensurePlan(store, plan);
  const origin = siteOrigin(req);
  const subscription = await paypalApi<Subscription>('/v1/billing/subscriptions', {
    method: 'POST',
    // Idempotency: a double-clicked button reuses the subscription instead of creating a second one.
    requestId: `dlss5-${plan}-${user.uid}`.slice(0, 100),
    body: {
      plan_id: planId,
      custom_id: user.uid,
      quantity: '1',
      application_context: {
        brand_name: 'DLSS 5',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${origin}/dashboard?paypal=success`,
        cancel_url: `${origin}/pricing?paypal=cancelled`,
      },
    },
  });
  if (!subscription?.id) throw new Error('PayPal did not return a subscription id');
  await store.bindPaypalSubscription(user.uid, subscription.id, subscription.status || 'APPROVAL_PENDING');
  const approve = (subscription.links || []).find((link) => link.rel === 'approve' || link.rel === 'approve_link')?.href;
  if (!approve) throw new Error('PayPal did not return an approval link');
  return res.status(200).json({ id: subscription.id, url: approve });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    return await checkout(req, res);
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    console.error('PayPal checkout failed', { message: (error as Error).message });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
