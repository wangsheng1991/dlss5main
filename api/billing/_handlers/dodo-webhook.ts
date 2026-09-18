import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dodo, dodoConfigured, dodoWebhookKey } from '../../_lib/dodo.js';
import { rawBody } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { isPurchasablePlan, PLANS, type PurchasablePlanId } from '../../../src/config/plans.js';

type DodoData = { payment_id?: string; subscription_id?: string; product_id?: string; customer?: { customer_id?: string; email?: string }; metadata?: Record<string, string>; total_amount?: number; currency?: string; next_billing_date?: string; status?: string };
type DodoEvent = { type?: string; data?: DodoData };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!dodoConfigured() || !dodoWebhookKey()) return res.status(503).json({ error: 'Dodo Payments is not configured yet' });
  let event: DodoEvent;
  try {
    const body = (await rawBody(req)).toString('utf8');
    event = dodo().webhooks.unwrap(body, { headers: { 'webhook-id': String(req.headers['webhook-id'] || ''), 'webhook-signature': String(req.headers['webhook-signature'] || ''), 'webhook-timestamp': String(req.headers['webhook-timestamp'] || '') } }) as unknown as DodoEvent;
  } catch {
    return res.status(401).json({ error: 'Invalid Dodo webhook signature' });
  }
  const data = event.data || {};
  const store = new BillingStore(database());
  try {
    if (event.type === 'payment.succeeded' || event.type === 'subscription.renewed') {
      const plan = data.metadata?.plan;
      let uid = data.metadata?.uid || '';
      if (!uid && data.customer?.email) uid = await store.byField('email', data.customer.email);
      if (!uid || !isPurchasablePlan(plan)) return res.status(200).json({ received: true, handled: false, reason: 'missing_account_or_plan' });
      const subscriptionId = data.subscription_id || '';
      const periodKey = `dodo:${data.payment_id || event.type}:${subscriptionId || data.product_id || 'payment'}`;
      const result = await store.grantPayment({ uid, plan: plan as PurchasablePlanId, provider: 'dodo', periodKey, kind: event.type === 'subscription.renewed' ? 'renewal' : 'subscription', amountTotal: data.total_amount || Math.round(PLANS[plan].priceUsd * 100), currency: String(data.currency || 'usd').toLowerCase(), customerId: data.customer?.customer_id, subscriptionId, periodEnd: data.next_billing_date ? Date.parse(data.next_billing_date) : undefined });
      if (subscriptionId) await store.db.doc(`users/${uid}`).set({ dodoSubscriptionId: subscriptionId, dodoSubscriptionStatus: 'active' }, { merge: true });
      return res.status(200).json({ received: true, handled: true, granted: result.granted });
    }
    if (['subscription.on_hold', 'subscription.cancelled', 'subscription.expired'].includes(String(event.type)) && data.subscription_id) {
      const status = event.type === 'subscription.on_hold' ? 'past_due' : 'canceled';
      await store.syncSubscription(data.subscription_id, status, data.next_billing_date ? Date.parse(data.next_billing_date) : undefined, 'dodo');
    }
    return res.status(200).json({ received: true, handled: false });
  } catch (error) {
    console.error('Dodo webhook processing failed', { type: event.type, message: (error as Error).message });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
