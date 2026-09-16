import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { fail, requireUser } from '../_lib/auth.js';
import { priceIdFor, siteOrigin, stripe } from '../_lib/stripe.js';
import { database } from '../../server/admin.js';
import { BillingStore } from '../../server/billing-store.js';
import { PLANS, isPurchasablePlan, type PurchasablePlanId } from '../../src/config/plans.js';

const customerId = (customer: Stripe.Checkout.Session['customer']) =>
  typeof customer === 'string' ? customer : customer?.id || '';

/** Subscription period that a paid checkout belongs to, used as the credit grant key. */
const periodOf = (subscription: Stripe.Subscription) => {
  const item = subscription.items?.data?.[0];
  const start = item?.current_period_start;
  const end = item?.current_period_end;
  return { start: typeof start === 'number' ? start : 0, end: typeof end === 'number' ? end : undefined };
};

async function checkout(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  const plan = (req.body || {}).plan;
  if (!isPurchasablePlan(plan)) return res.status(400).json({ error: 'Choose a paid plan: pro or team' });
  const catalog = PLANS[plan];
  const store = new BillingStore(database());
  const account = await store.account(user.uid);
  // A second subscription would compete for the same allowance; existing buyers change plan instead.
  if (account.subscriptionId && ['active', 'trialing', 'past_due'].includes(account.subscriptionStatus)) {
    return res.status(409).json({ error: 'You already have a subscription — change your plan instead', code: 'subscription_exists' });
  }
  const existing = account.customerId;
  const price = priceIdFor(plan);
  const origin = siteOrigin(req);
  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    client_reference_id: user.uid,
    ...(existing ? { customer: existing } : user.email ? { customer_email: user.email } : {}),
    metadata: { uid: user.uid, plan },
    subscription_data: { metadata: { uid: user.uid, plan } },
    line_items: [price
      ? { price, quantity: 1 }
      : {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: catalog.priceUsd * 100,
          recurring: { interval: 'month' },
          product_data: { name: `DLSS 5 ${catalog.name}`, description: `${catalog.monthlyCredits} credits per month` },
        },
      }],
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
  });
  if (!session.url) throw new Error('Stripe did not return a checkout url');
  return res.status(200).json({ id: session.id, url: session.url });
}

/**
 * Confirmation used by the success redirect. The webhook stays the source of truth, but a buyer
 * who returns before delivery still gets their credits, because both paths use the same grant key.
 */
async function confirm(req: VercelRequest, res: VercelResponse) {
  const user = await requireUser(req);
  const sessionId = String(req.query.session_id || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return res.status(400).json({ error: 'session_id is required' });
  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ['subscription'] });
  if (session.metadata?.uid !== user.uid) return res.status(403).json({ error: 'This checkout belongs to another account' });
  const plan = session.metadata?.plan;
  if (!isPurchasablePlan(plan)) return res.status(409).json({ error: 'This checkout has no purchasable plan' });
  if (session.status !== 'complete') return res.status(200).json({ status: 'pending' });
  const subscription = typeof session.subscription === 'object' && session.subscription ? session.subscription : null;
  if (!subscription) return res.status(409).json({ error: 'This checkout is not a subscription' });
  if (subscription.status !== 'active' && subscription.status !== 'trialing') return res.status(200).json({ status: subscription.status });
  const period = periodOf(subscription);
  const result = await new BillingStore(database()).grantPayment({
    uid: user.uid,
    plan: plan as PurchasablePlanId,
    periodKey: `sub:${subscription.id}:${period.start}`,
    kind: 'subscription',
    amountTotal: session.amount_total ?? PLANS[plan].priceUsd * 100,
    currency: session.currency || 'usd',
    customerId: customerId(session.customer),
    subscriptionId: subscription.id,
    periodEnd: period.end,
  });
  return res.status(200).json({ status: 'active', tier: result.tier, credits: result.credits, applied: result.granted });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'POST') return await checkout(req, res);
    if (req.method === 'GET') return await confirm(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    // Auth and validation errors carry `status`; Stripe failures carry `statusCode` and stay private.
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    console.error('Billing checkout failed', { type: (error as { type?: string }).type, message: (error as Error).message });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
