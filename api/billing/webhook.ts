import type { VercelRequest, VercelResponse } from '@vercel/node';
import type Stripe from 'stripe';
import { rawBody, stripe } from '../_lib/stripe.js';
import { database } from '../../server/admin.js';
import { BillingStore } from '../../server/billing-store.js';
import { isPurchasablePlan } from '../../src/config/plans.js';

const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : value?.id || '');

/** Credits are granted for exactly one subscription period; retries and duplicates are no-ops. */
async function onInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription);
  if (!subscriptionId) return { handled: false, reason: 'not_a_subscription_invoice' };
  const metadata = invoice.parent?.subscription_details?.metadata || invoice.metadata || {};
  const store = new BillingStore(database());
  let uid = metadata.uid || '';
  let plan = metadata.plan || '';
  if (!uid || !isPurchasablePlan(plan)) {
    // Fall back to the account bound to this subscription when metadata was stripped.
    const owner = await store.db.collection('users').where('stripeSubscriptionId', '==', subscriptionId).limit(1).get();
    if (owner.empty) return { handled: false, reason: 'unknown_subscription' };
    const account = owner.docs[0];
    uid = account.id;
    plan = typeof account.data().tier === 'string' ? account.data().tier : '';
    if (!isPurchasablePlan(plan)) return { handled: false, reason: 'unknown_plan' };
  }
  const line = invoice.lines?.data?.[0]?.period;
  const periodStart = line?.start ?? invoice.period_start ?? 0;
  const result = await store.grantPayment({
    uid,
    plan,
    periodKey: `sub:${subscriptionId}:${periodStart}`,
    kind: invoice.billing_reason === 'subscription_cycle' ? 'renewal' : 'subscription',
    amountTotal: invoice.amount_paid ?? 0,
    currency: invoice.currency || 'usd',
    customerId: idOf(invoice.customer),
    subscriptionId,
    periodEnd: line?.end,
  });
  return { handled: true, granted: result.granted, uid };
}

async function onSubscription(subscription: Stripe.Subscription, canceled: boolean) {
  const store = new BillingStore(database());
  const periodEnd = subscription.items?.data?.[0]?.current_period_end;
  const result = await store.syncSubscription(
    subscription.id,
    canceled ? 'canceled' : subscription.status,
    typeof periodEnd === 'number' ? periodEnd : undefined,
  );
  return { handled: result.updated, uid: result.uid };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Billing is not configured yet' });
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string' || !signature) return res.status(400).json({ error: 'Missing Stripe signature' });
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await rawBody(req), signature, secret);
  } catch (error) {
    console.warn('Rejected Stripe webhook', (error as Error).message);
    return res.status(400).json({ error: 'Invalid Stripe signature' });
  }
  try {
    switch (event.type) {
      case 'invoice.paid':
        return res.status(200).json({ received: true, ...(await onInvoicePaid(event.data.object)) });
      case 'customer.subscription.updated':
        return res.status(200).json({ received: true, ...(await onSubscription(event.data.object, false)) });
      case 'customer.subscription.deleted':
        return res.status(200).json({ received: true, ...(await onSubscription(event.data.object, true)) });
      case 'checkout.session.completed':
        // Credits come from `invoice.paid` (one grant per period); the success redirect confirms
        // the session directly, so nothing is granted twice here.
        return res.status(200).json({ received: true, handled: false, reason: 'granted_by_invoice_or_confirm' });
      default:
        return res.status(200).json({ received: true, handled: false, reason: 'ignored_event' });
    }
  } catch (error) {
    // A non-2xx makes Stripe retry the delivery.
    console.error('Stripe webhook processing failed', { type: event.type, message: (error as Error).message });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
