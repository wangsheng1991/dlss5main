import type { VercelRequest, VercelResponse } from '@vercel/node';
import { paypalApi, paypalConfigured, paypalSubscription, paypalWebhookId } from '../../_lib/paypal.js';
import { rawBody } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { grantPaypalPeriod, statusOfEvent } from './_paypal.js';

type PaypalEvent = {
  id?: string;
  event_type?: string;
  resource_type?: string;
  create_time?: string;
  resource?: {
    id?: string;
    status?: string;
    billing_agreement_id?: string;
    custom_id?: string;
    amount?: { total?: string; currency?: string };
    create_time?: string;
    state?: string;
  };
};

/** PayPal's own verification service signs every delivery; reimplementing the math is unnecessary. */
async function verified(req: VercelRequest, event: PaypalEvent) {
  const headers = {
    auth_algo: String(req.headers['paypal-auth-algo'] || ''),
    cert_url: String(req.headers['paypal-cert-url'] || ''),
    transmission_id: String(req.headers['paypal-transmission-id'] || ''),
    transmission_sig: String(req.headers['paypal-transmission-sig'] || ''),
    transmission_time: String(req.headers['paypal-transmission-time'] || ''),
  };
  if (!headers.transmission_id || !headers.transmission_sig || !headers.cert_url || !headers.auth_algo || !headers.transmission_time) {
    return false;
  }
  const result = await paypalApi<{ verification_status?: string }>('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: { ...headers, webhook_id: paypalWebhookId(), webhook_event: event },
  });
  return result?.verification_status === 'SUCCESS';
}

/** A completed sale (the first payment and every renewal) is keyed by PayPal's own payment time. */
async function onSale(resource: NonNullable<PaypalEvent['resource']>) {
  const subscriptionId = resource.billing_agreement_id || '';
  if (!subscriptionId) return { handled: false, reason: 'not_a_subscription_sale' };
  const subscription = await paypalSubscription(subscriptionId);
  const store = new BillingStore(database());
  const result = await grantPaypalPeriod(store, subscription, 'renewal', resource.create_time);
  return { ...result, subscription: subscriptionId };
}

/** A full refund of a subscription payment takes that period's credits back. */
async function onRefund(resource: NonNullable<PaypalEvent['resource']>) {
  const store = new BillingStore(database());
  const uid = await store.byField('paypalSubscriptionId', resource.billing_agreement_id || '');
  if (!uid) return { handled: false, reason: 'unknown_subscription' };
  const grant = await store.latestGrant(uid);
  const result = await store.recordAdjustment({
    uid,
    kind: 'refund',
    key: `paypal-refund:${resource.id || 'unknown'}`,
    credits: grant?.credits || 0,
    amountTotal: Math.round(Number.parseFloat(String(resource.amount?.total || '0')) * 100) || 0,
    currency: String(resource.amount?.currency || 'USD').toLowerCase(),
    subscriptionId: resource.billing_agreement_id,
  });
  return { handled: true, uid, clawback: grant?.credits || 0, credits: result.credits };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!paypalConfigured() || !paypalWebhookId()) return res.status(503).json({ error: 'PayPal is not configured yet' });
  let event: PaypalEvent;
  try {
    const text = (await rawBody(req)).toString('utf8');
    event = text ? JSON.parse(text) : {};
  } catch {
    return res.status(400).json({ error: 'Unreadable PayPal event' });
  }
  try {
    if (!(await verified(req, event))) {
      console.warn('Rejected PayPal webhook', { event: event.id, type: event.event_type });
      return res.status(400).json({ error: 'Invalid PayPal signature' });
    }
  } catch (error) {
    // Verification itself needs PayPal: answer non-2xx so the delivery is retried.
    console.error('PayPal webhook verification failed', { message: (error as Error).message });
    return res.status(500).json({ error: 'Webhook verification failed' });
  }
  const type = String(event.event_type || '');
  const resource = event.resource || {};
  try {
    if (type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscription = await paypalSubscription(String(resource.id || ''));
      return res.status(200).json({ received: true, ...(await grantPaypalPeriod(new BillingStore(database()), subscription, 'subscription', event.create_time)) });
    }
    if (type === 'PAYMENT.SALE.COMPLETED') return res.status(200).json({ received: true, ...(await onSale(resource)) });
    if (type === 'PAYMENT.SALE.REFUNDED' || type === 'PAYMENT.SALE.REVERSED') return res.status(200).json({ received: true, ...(await onRefund(resource)) });
    const status = statusOfEvent(type);
    if (status) {
      const result = await new BillingStore(database()).syncSubscription(String(resource.id || ''), status, undefined, 'paypal');
      return res.status(200).json({ received: true, ...result });
    }
    return res.status(200).json({ received: true, handled: false, reason: 'ignored_event' });
  } catch (error) {
    const status = (error as { status?: number }).status;
    // A deleted or unknown account is permanent: acknowledge it and stop PayPal retrying.
    if (status === 403 || status === 404) {
      console.warn('PayPal webhook skipped', { type, reason: (error as Error).message });
      return res.status(200).json({ received: true, handled: false, reason: 'account_missing' });
    }
    console.error('PayPal webhook processing failed', { type, message: (error as Error).message });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
