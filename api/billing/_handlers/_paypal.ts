import type { BillingStore } from '../../../server/billing-store.js';
import { PLANS, type PurchasablePlanId } from '../../../src/config/plans.js';
import { amountOf, currencyOf, periodOf, planOfPaypalId, type PaypalSubscription } from '../../_lib/paypal.js';

/** Shared by the PayPal return redirect and the PayPal webhook, so both grant the same way. */
export type GrantKind = 'subscription' | 'renewal';

/**
 * Grants the credits of exactly one paid PayPal period. The plan and the account are read from the
 * subscription itself (its `custom_id` and `plan_id`), and the period key is derived from PayPal's
 * own payment time, so a retried webhook or a return redirect can never grant twice.
 */
export async function grantPaypalPeriod(store: BillingStore, subscription: PaypalSubscription, kind: GrantKind, eventTime?: string) {
  const period = periodOf(subscription, eventTime);
  let uid = subscription.custom_id || '';
  let plan = await planOfPaypalId(store, subscription.plan_id || '');
  if (!uid || !plan) {
    // Fall back to the account this subscription was bound to before the buyer approved it.
    const owner = await store.byField('paypalSubscriptionId', subscription.id);
    if (!owner) return { handled: false, reason: 'unknown_subscription' };
    uid = uid || owner;
    if (!plan) {
      const account = await store.account(owner);
      plan = account.tier === 'pro' || account.tier === 'team' ? account.tier : '';
    }
  }
  if (!uid || !plan) return { handled: false, reason: 'unknown_plan' };
  const result = await store.grantPayment({
    uid,
    plan: plan as PurchasablePlanId,
    provider: 'paypal',
    periodKey: period.key,
    kind,
    amountTotal: amountOf(subscription, PLANS[plan].priceUsd),
    currency: currencyOf(subscription),
    customerId: subscription.subscriber?.payer_id || '',
    subscriptionId: subscription.id,
    periodEnd: period.end,
  });
  return { handled: true, granted: result.granted, uid };
}

/** PayPal tells us the subscription stopped paying; Stripe's vocabulary is what the account stores. */
export const statusOfEvent = (eventType: string) =>
  (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED'
    ? 'canceled'
    : eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ? 'past_due' : '');
