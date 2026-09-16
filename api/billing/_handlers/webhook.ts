import type { VercelRequest, VercelResponse } from '@vercel/node';
import type Stripe from 'stripe';
import { rawBody, stripe } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { isPurchasablePlan } from '../../../src/config/plans.js';

const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : value?.id || '');
const periodStartOf = (subscription: Stripe.Subscription | null) => subscription?.items?.data?.[0]?.current_period_start;
const periodEndOf = (subscription: Stripe.Subscription | null) => subscription?.items?.data?.[0]?.current_period_end;
const accountId = (metadata: Stripe.Metadata | null | undefined) => metadata?.uid || '';

/**
 * Credits are granted for exactly one subscription period. The period is read from the
 * subscription itself (not the invoice lines, whose order changes on plan switches), so the
 * checkout confirmation, a renewal and a plan change all derive the same key for the same period.
 */
async function onInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription);
  if (!subscriptionId) return { handled: false, reason: 'not_a_subscription_invoice' };
  const client = stripe();
  const subscription = await client.subscriptions.retrieve(subscriptionId).catch(() => null);
  const store = new BillingStore(database());
  let uid = accountId(subscription?.metadata) || accountId(invoice.parent?.subscription_details?.metadata);
  let plan = subscription?.metadata?.plan || invoice.parent?.subscription_details?.metadata?.plan || '';
  if (!uid || !isPurchasablePlan(plan)) {
    // Fall back to the account bound to this subscription when metadata was stripped.
    const owner = await store.byField('stripeSubscriptionId', subscriptionId);
    if (!owner) return { handled: false, reason: 'unknown_subscription' };
    uid = owner;
    const account = await store.account(owner);
    plan = account.tier;
    if (!isPurchasablePlan(plan)) return { handled: false, reason: 'unknown_plan' };
  }
  const line = invoice.lines?.data?.[0]?.period;
  const periodStart = periodStartOf(subscription) ?? line?.start ?? invoice.period_start ?? 0;
  const reason = invoice.billing_reason;
  const kind: 'subscription' | 'renewal' | 'change' =
    reason === 'subscription_create' ? 'subscription' : reason === 'subscription_cycle' ? 'renewal' : 'change';
  // A plan change is keyed by its proration invoice (several changes can happen in one period);
  // first payments and renewals are keyed by the period, which the checkout confirmation shares.
  const periodKey = kind === 'change' ? `invoice:${invoice.id}` : `sub:${subscriptionId}:${periodStart}`;
  const result = await store.grantPayment({
    uid,
    plan,
    periodKey,
    kind,
    amountTotal: invoice.amount_paid ?? 0,
    currency: invoice.currency || 'usd',
    customerId: idOf(invoice.customer),
    subscriptionId,
    periodEnd: periodEndOf(subscription) ?? line?.end,
  });
  return { handled: true, granted: result.granted, uid };
}

/**
 * A failed renewal keeps access until Stripe gives up: the subscription status is flagged and
 * `customer.subscription.deleted` downgrades the account afterwards.
 */
async function onInvoiceFailed(invoice: Stripe.Invoice) {
  const subscriptionId = idOf(invoice.parent?.subscription_details?.subscription);
  if (!subscriptionId) return { handled: false, reason: 'not_a_subscription_invoice' };
  const store = new BillingStore(database());
  const uid = await store.byField('stripeSubscriptionId', subscriptionId);
  if (!uid) return { handled: false, reason: 'unknown_subscription' };
  await store.recordAdjustment({
    uid, kind: 'payment_failed', key: `failed:${invoice.id}`, amountTotal: invoice.amount_due ?? 0,
    currency: invoice.currency || 'usd', subscriptionId, customerId: idOf(invoice.customer),
  });
  await store.setStatus(uid, 'past_due');
  return { handled: true, uid };
}

/** A fully refunded charge takes that period's credits back; partial refunds are recorded only. */
async function onRefund(charge: Stripe.Charge) {
  const customerId = idOf(charge.customer);
  const store = new BillingStore(database());
  const uid = await store.byField('stripeCustomerId', customerId);
  if (!uid) return { handled: false, reason: 'unknown_customer' };
  const full = charge.refunded === true && (charge.amount_refunded ?? 0) >= (charge.amount ?? 0);
  const grant = full ? await store.latestGrant(uid) : null;
  const result = await store.recordAdjustment({
    uid, kind: 'refund', key: `refund:${charge.id}`, credits: grant?.credits || 0,
    amountTotal: charge.amount_refunded ?? 0, currency: charge.currency || 'usd',
    customerId, subscriptionId: grant?.subscriptionId,
  });
  return { handled: true, uid, clawback: full ? grant?.credits || 0 : 0, credits: result.credits };
}

/** An opened dispute flags the account for review; credits stay until an operator decides. */
async function onDispute(dispute: Stripe.Dispute) {
  const client = stripe();
  const charge = typeof dispute.charge === 'object' ? dispute.charge : await client.charges.retrieve(dispute.charge).catch(() => null);
  const customerId = idOf(charge?.customer);
  const store = new BillingStore(database());
  const uid = await store.byField('stripeCustomerId', customerId);
  if (!uid) return { handled: false, reason: 'unknown_customer' };
  await store.recordAdjustment({
    uid, kind: 'dispute', key: `dispute:${dispute.id}`, amountTotal: dispute.amount ?? 0,
    currency: dispute.currency || 'usd', customerId,
  });
  await store.setStatus(uid, 'disputed');
  console.warn('Stripe dispute opened', { dispute: dispute.id, uid, reason: dispute.reason, status: dispute.status });
  return { handled: true, uid };
}

async function onSubscription(subscription: Stripe.Subscription, canceled: boolean) {
  const store = new BillingStore(database());
  const status = canceled ? 'canceled' : subscription.status;
  const result = await store.syncSubscription(subscription.id, status, periodEndOf(subscription));
  if (!result.updated && subscription.metadata?.uid) {
    // No paid invoice has bound this subscription to an account yet: keep the id and status so a
    // later renewal or cancellation still finds the account.
    await store.db.doc(`users/${subscription.metadata.uid}`).set({ stripeSubscriptionId: subscription.id, subscriptionStatus: status }, { merge: true });
    return { handled: true, uid: subscription.metadata.uid, bound: true };
  }
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
      case 'invoice.payment_failed':
        return res.status(200).json({ received: true, ...(await onInvoiceFailed(event.data.object)) });
      case 'charge.refunded':
        return res.status(200).json({ received: true, ...(await onRefund(event.data.object)) });
      case 'charge.dispute.created':
        return res.status(200).json({ received: true, ...(await onDispute(event.data.object)) });
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
    const status = (error as { status?: number }).status;
    // A deleted or unknown account is permanent: acknowledge it, log it, and stop Stripe retrying.
    if (status === 403 || status === 404) {
      console.warn('Stripe webhook skipped', { type: event.type, reason: (error as Error).message });
      return res.status(200).json({ received: true, handled: false, reason: 'account_missing' });
    }
    // Anything else may be transient, so a non-2xx makes Stripe retry the delivery.
    console.error('Stripe webhook processing failed', { type: event.type, message: (error as Error).message });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
