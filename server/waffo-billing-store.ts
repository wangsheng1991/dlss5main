import { legacyBindingBlocksWaffo } from './payment-policy.js';
import { createHash, randomUUID } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import type { WebhookEvent } from '@waffo/pancake-ts';
import { PLANS, type PurchasablePlanId } from '../src/config/plans.js';
import { ApiError } from './errors.js';

export type WaffoIntentInput = { uid: string; plan: PurchasablePlanId; productId: string; environment: 'test' | 'prod' };
export type WaffoCheckoutIntent = WaffoIntentInput & { id: string; createdAt: number; expiresAt: number };
/** Obtained by the server from Waffo GraphQL, never from webhook/client metadata. */
export type VerifiedWaffoOrder = {
  id: string; storeId: string; testMode: boolean; status: string;
  merchantProvidedBuyerIdentity: string; orderMerchantExternalId: string;
  subscriptionProduct: { id: string }; billingPeriod: string;
  currentPeriodEnd?: string | number | null; currentPeriodNumber?: number | null;
  cancelEffectiveAt?: string | null; cancelEffectiveMode?: 'period_end' | 'now' | null;
};
export type WaffoApplyResult = { processed: boolean; status: 'processed' | 'ignored' | 'duplicate'; granted?: boolean; credits?: number };

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const count = (value: unknown) => Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0;
const fail = (code: string, message: string): never => { throw new ApiError(409, code, message); };
const nonempty = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const validUid = (value: unknown): value is string => nonempty(value) && !value.includes('/') && value.length <= 128;
const positivePeriod = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) > 0;
/** USD display amounts must be unsigned decimal strings, without rounding or exponents. */
export function parseUsdCents(value: unknown): number {
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value)) return fail('waffo_invalid_amount', 'USD amount must be a decimal string');
  const [whole, fraction = ''] = value.split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) return fail('waffo_invalid_amount', 'USD amount exceeds supported range');
  return Number(cents);
}
const seconds = (value: unknown): number => {
  if (typeof value === 'number') return Number.isSafeInteger(value) && value > 0 ? value : 0;
  if (typeof value !== 'string') return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : 0;
};
// Explicit cancellation timestamps must be unambiguous instants, never local dates.
const cancellationSeconds = (value: unknown): number => {
  if (typeof value !== 'string') return 0;
  const parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!parts) return 0;
  const [year, month, day, hour, minute, second] = parts.slice(1, 7).map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59 || second > 59) return 0;
  return seconds(value);
};
const managedEvents = new Set([
  'subscription.payment_succeeded', 'subscription.activated', 'subscription.renewed',
  'subscription.canceling', 'subscription.canceled', 'subscription.past_due',
  'subscription.payment_failed', 'subscription.updated', 'subscription.recovered', 'subscription.uncanceled', 'refund.succeeded',
]);

export class WaffoBillingStore {
  constructor(readonly db: Firestore) {}

  async createIntent(input: WaffoIntentInput): Promise<WaffoCheckoutIntent> {
    if (!validUid(input.uid) || !['pro', 'team'].includes(input.plan) || !nonempty(input.productId) || !['test', 'prod'].includes(input.environment)) {
      throw new ApiError(400, 'waffo_invalid_intent', 'Invalid checkout intent');
    }
    const now = Date.now();
    const intent = { ...input, id: `wpi_${randomUUID().replaceAll('-', '')}`, createdAt: now, expiresAt: now + 31 * 60 * 1000 };
    return this.db.runTransaction(async (tx) => {
      const userRef = this.db.doc(`users/${input.uid}`);
      const user = await tx.get(userRef);
      if (!user.exists) throw new ApiError(404, 'account_missing', 'Account is not initialized');
      const account = user.data()!;
      if (legacyBindingBlocksWaffo(account, input.environment)) return fail('waffo_provider_conflict', 'An existing subscription must be resolved before checkout');
      if (account.waffoSubscriptionId && !(account.waffoSubscriptionStatus === 'canceled'
        && seconds(account.currentPeriodEnd) > 0 && seconds(account.currentPeriodEnd) <= Math.floor(now / 1000))) {
        return fail('waffo_subscription_conflict', 'An existing Waffo subscription must expire before another checkout');
      }
      if (nonempty(account.waffoPendingIntentId) && count(account.waffoPendingUntil) > now) {
        if (!/^wpi_[a-f0-9]{32}$/.test(account.waffoPendingIntentId)) return fail('waffo_pending_checkout', 'Pending checkout requires manual review');
        const pending = await tx.get(this.db.doc(`waffo_checkout_intents/${account.waffoPendingIntentId}`));
        const existing = pending.data() as WaffoCheckoutIntent | undefined;
        if (!existing || existing.uid !== input.uid || existing.plan !== input.plan || existing.productId !== input.productId || existing.environment !== input.environment) {
          return fail('waffo_pending_checkout', 'Another checkout is pending; finish it or wait for expiration');
        }
        return existing;
      }
      tx.create(this.db.doc(`waffo_checkout_intents/${intent.id}`), intent);
      tx.update(userRef, { waffoPendingIntentId: intent.id, waffoPendingUntil: intent.expiresAt });
      return intent;
    });
  }

  async readIntent(id: string): Promise<WaffoCheckoutIntent | null> {
    if (!/^wpi_[a-f0-9]{32}$/.test(id)) return null;
    const snapshot = await this.db.doc(`waffo_checkout_intents/${id}`).get();
    return snapshot.exists ? snapshot.data() as WaffoCheckoutIntent : null;
  }

  async apply(event: WebhookEvent, order: VerifiedWaffoOrder): Promise<WaffoApplyResult> {
    if (!nonempty(event.id) || !nonempty(event.eventId) || !nonempty(event.eventType)) return fail('waffo_invalid_event', 'Event identity, business event id and type are required');
    // Waffo reuses entity ids across lifecycle types. The provider's business-event
    // identity is eventType + eventId; payload.id alone can hide later cancellations.
    const eventRef = this.db.doc(`waffo_events/${hash(`${event.eventType}:${event.eventId}`)}`);
    const legacyRef = this.db.doc(`waffo_events/${hash(event.id)}`);
    return this.db.runTransaction(async (tx): Promise<WaffoApplyResult> => {
      // Both receipts must be read before any write, including ignored-event receipts.
      const [priorEvent, legacyEvent] = await Promise.all([tx.get(eventRef), tx.get(legacyRef)]);
      const legacy = legacyEvent.data();
      if (priorEvent.exists || (legacyEvent.exists && legacy?.type === event.eventType && legacy?.businessEventId === event.eventId)) return { processed: false, status: 'duplicate' };
      const now = Date.now();
      const mark = (status: 'processed' | 'ignored' | 'duplicate') => tx.create(eventRef, {
        eventId: event.id, businessEventId: event.eventId || '', type: event.eventType,
        orderId: event.data?.orderId || '', status, processedAt: now,
      });
      if (!managedEvents.has(event.eventType)) {
        mark('ignored');
        return { processed: true, status: 'ignored' };
      }
      const data = event.data;
      const intentId = order?.orderMerchantExternalId;
      if (!order || !/^wpi_[a-f0-9]{32}$/.test(intentId || '') || data.orderMerchantExternalId !== intentId || data.orderId !== order.id || event.storeId !== order.storeId || typeof order.testMode !== 'boolean') {
        return fail('waffo_order_mismatch', 'Event does not match the verified checkout order');
      }
      const intentSnapshot = await tx.get(this.db.doc(`waffo_checkout_intents/${intentId}`));
      if (!intentSnapshot.exists) return fail('waffo_intent_missing', 'Checkout intent was not found');
      const intent = intentSnapshot.data() as WaffoCheckoutIntent;
      if (!validUid(intent.uid) || !['pro', 'team'].includes(intent.plan) || order.merchantProvidedBuyerIdentity !== intent.uid || order.subscriptionProduct?.id !== intent.productId || event.mode !== intent.environment || (order.testMode ? 'test' : 'prod') !== intent.environment || order.billingPeriod !== 'monthly' || (data.billingPeriod !== undefined && data.billingPeriod !== 'monthly')) {
        return fail('waffo_binding_mismatch', 'Verified order does not match checkout account, product or environment');
      }
      const userRef = this.db.doc(`users/${intent.uid}`);
      const user = await tx.get(userRef);
      if (!user.exists) throw new ApiError(404, 'account_missing', 'Account is not initialized');
      const account = user.data()!;
      // Missing status on an existing external binding is treated as active, requiring review.
      if (legacyBindingBlocksWaffo(account, intent.environment)) return fail('waffo_provider_conflict', 'An existing subscription must be resolved before Waffo can update the account');
      const differentSubscription = nonempty(account.waffoSubscriptionId) && account.waffoSubscriptionId !== order.id;
      const retired = await tx.get(this.db.doc(`waffo_retired_subscriptions/${hash(order.id)}`));
      const isRetired = retired.exists;
      const canReplace = differentSubscription && !isRetired
        && account.waffoSubscriptionStatus === 'canceled'
        && (!account.waffoIntentCreatedAt || intent.createdAt > account.waffoIntentCreatedAt)
        && seconds(account.currentPeriodEnd) > 0 && seconds(account.currentPeriodEnd) <= Math.floor(now / 1000);
      if (differentSubscription && !isRetired && !canReplace && event.eventType !== 'refund.succeeded') {
        return fail('waffo_subscription_conflict', 'A different Waffo subscription is still active; manual review required');
      }
      // Only a verified successful payment can replace an expired canceled subscription.
      // Retired lifecycle deliveries can never restore their old binding over the new one.
      if (differentSubscription && event.eventType !== 'subscription.payment_succeeded' && event.eventType !== 'refund.succeeded') {
        mark('ignored');
        return { processed: true, status: 'ignored', granted: false, credits: count(account.credits) };
      }
      const before = count(account.credits);
      const common = { uid: intent.uid, provider: 'waffo', plan: intent.plan, subscriptionId: order.id, createdAt: now };
      if (event.eventType === 'subscription.payment_succeeded') {
        if (!nonempty(data.paymentId) || !positivePeriod(data.periodNumber) || data.currency !== 'USD') return fail('waffo_invalid_payment', 'Payment requires payment id, positive billing period and USD');
        const amount = parseUsdCents(data.chargedAmount);
        if (amount < PLANS[intent.plan].priceUsd * 100 || (data.listPrice?.total !== undefined && parseUsdCents(data.listPrice.total) !== amount) || (data.listPrice?.discountAmount !== undefined && parseUsdCents(data.listPrice.discountAmount) !== 0)) return fail('waffo_payment_amount_mismatch', 'Payment amount requires manual review');
        const key = `${order.id}:${data.periodNumber}`;
        const periodRef = this.db.doc(`waffo_periods/${hash(key)}`);
        const paymentRef = this.db.doc(`waffo_payments/${hash(data.paymentId)}`);
        const [period, payment] = await Promise.all([tx.get(periodRef), tx.get(paymentRef)]);
        if (payment.exists && (payment.data()?.periodKey !== key || payment.data()?.uid !== intent.uid)) return fail('waffo_payment_conflict', 'Payment is already associated with a different period');
        if (period.exists || payment.exists) {
          mark('duplicate');
          return { processed: false, status: 'duplicate', granted: false, credits: before };
        }
        const lastPeriod = differentSubscription ? 0 : count(account.waffoLastPeriod);
        const canonicalPeriod = count(order.currentPeriodNumber);
        const explicitlyOld = data.periodNumber < lastPeriod
          || (positivePeriod(canonicalPeriod) && data.periodNumber < canonicalPeriod);
        // A paid webhook can arrive before the canonical order has rolled forward.
        // Retry without any receipt/period writes, so synchronization can grant it later.
        if (!isRetired && !explicitlyOld && (!positivePeriod(canonicalPeriod) || data.periodNumber > canonicalPeriod)) {
          return fail('waffo_order_period_behind', 'Canonical order has not confirmed this paid period; retry after order synchronization');
        }
        const periodEnd = seconds(order.currentPeriodEnd);
        if (!periodEnd && !isRetired && !explicitlyOld) return fail('waffo_period_end_missing', 'Canonical billing period end is required; retry after order synchronization');
        const stale = isRetired || explicitlyOld || periodEnd <= Math.floor(now / 1000);
        const after = stale ? before : PLANS[intent.plan].monthlyCredits;
        const delta = after - before;
        tx.create(periodRef, { ...common, periodKey: key, periodNumber: data.periodNumber, paymentId: data.paymentId, granted: !stale });
        tx.create(paymentRef, { ...common, paymentId: data.paymentId, periodKey: key, amountTotal: amount, currency: 'USD', refundedAmount: 0, granted: !stale });
        tx.create(this.db.doc(`billing_orders/waffo_${hash(key)}`), { ...common, kind: 'subscription', periodKey: key, paymentId: data.paymentId, credits: delta, amountTotal: amount, currency: 'usd', stale });
        tx.create(this.db.doc(`credit_ledger/waffo_${hash(key)}`), { ...common, kind: 'purchase', units: delta, delta, bucket: 'monthly', periodKey: key, balanceBefore: before, balanceAfter: after });
        if (!stale && canReplace) tx.create(this.db.doc(`waffo_retired_subscriptions/${hash(account.waffoSubscriptionId)}`), {
          uid: intent.uid, subscriptionId: account.waffoSubscriptionId, replacedBy: order.id, retiredAt: now,
        });
        if (!stale) tx.update(userRef, {
          tier: intent.plan, credits: after, waffoSubscriptionId: order.id, waffoIntentCreatedAt: intent.createdAt,
          waffoSubscriptionStatus: order.status, subscriptionStatus: order.status,
          waffoAllowanceKey: key, waffoLastPeriod: data.periodNumber,
          quotaMonth: new Date(now).toISOString().slice(0, 7), quotaDay: new Date(now).toISOString().slice(0, 10), dayUsed: 0,
          ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}), updatedAt: new Date(now).toISOString(),
        });
        mark('processed');
        return { processed: true, status: 'processed', granted: !stale, credits: after };
      }
      if (event.eventType === 'refund.succeeded') {
        if (!nonempty(data.paymentId) || !nonempty(event.eventId) || data.currency !== 'USD') return fail('waffo_invalid_refund', 'Refund requires original payment id, refund business id and USD');
        const paymentRef = this.db.doc(`waffo_payments/${hash(data.paymentId)}`);
        const refundRef = this.db.doc(`waffo_refunds/${hash(event.eventId)}`);
        const [paymentSnapshot, refund] = await Promise.all([tx.get(paymentRef), tx.get(refundRef)]);
        if (refund.exists) {
          if (refund.data()?.paymentId !== data.paymentId) return fail('waffo_refund_conflict', 'Refund id is already bound to another payment');
          mark('duplicate');
          return { processed: false, status: 'duplicate', credits: before };
        }
        if (!paymentSnapshot.exists) return fail('waffo_payment_missing', 'Original payment has not been recorded; retry after payment delivery');
        const payment = paymentSnapshot.data()!;
        if (payment.uid !== intent.uid || payment.subscriptionId !== order.id || (data.periodNumber !== undefined && payment.periodKey !== `${order.id}:${data.periodNumber}`)) return fail('waffo_refund_mismatch', 'Refund does not match original payment');
        const amount = parseUsdCents(data.refundedAmount);
        const cumulative = count(payment.refundedAmount) + amount;
        if (amount <= 0 || !Number.isSafeInteger(cumulative) || cumulative > payment.amountTotal) return fail('waffo_refund_amount_mismatch', 'Refund amount requires manual review');
        const full = cumulative === payment.amountTotal;
        const deduction = full && payment.granted && account.waffoAllowanceKey === payment.periodKey ? before : 0;
        const key = `refund:${event.eventId}`;
        tx.create(refundRef, { ...common, paymentId: data.paymentId, amountTotal: amount, periodKey: payment.periodKey, full });
        tx.update(paymentRef, { refundedAmount: cumulative });
        tx.create(this.db.doc(`billing_orders/waffo_${hash(key)}`), { ...common, kind: 'refund', periodKey: payment.periodKey, paymentId: data.paymentId, credits: -deduction, amountTotal: amount, currency: 'usd', full, requiresReview: !full });
        tx.create(this.db.doc(`credit_ledger/waffo_${hash(key)}`), { ...common, kind: 'refund', units: -deduction, delta: -deduction, bucket: 'monthly', periodKey: payment.periodKey, balanceBefore: before, balanceAfter: before - deduction });
        if (deduction) tx.update(userRef, { credits: before - deduction, updatedAt: new Date(now).toISOString() });
        mark('processed');
        return { processed: true, status: 'processed', credits: before - deduction };
      }
      // Lifecycle notifications never grant an allowance or advance its paid-through
      // boundary. A successful period payment is the only proof of a renewed allowance.
      const lastPaidPeriod = account.waffoSubscriptionId === order.id ? count(account.waffoLastPeriod) : 0;
      const hasPaidAllowance = positivePeriod(lastPaidPeriod) && account.waffoAllowanceKey === `${order.id}:${lastPaidPeriod}`;
      if (hasPaidAllowance && positivePeriod(data.periodNumber) && data.periodNumber < lastPaidPeriod) {
        mark('ignored');
        return { processed: true, status: 'ignored', granted: false, credits: before };
      }
      if (hasPaidAllowance && (!positivePeriod(order.currentPeriodNumber) || order.currentPeriodNumber < lastPaidPeriod)) {
        return fail('waffo_order_period_behind', 'Canonical order is older than the verified paid allowance; retry after order synchronization');
      }
      const state = event.eventType.slice('subscription.'.length);
      const expectedStatus: Record<string, string> = {
        activated: 'active', renewed: 'active', recovered: 'active', uncanceled: 'active',
        canceling: 'canceling', canceled: 'canceled', past_due: 'past_due', payment_failed: 'past_due',
      };
      if (state !== 'updated' && expectedStatus[state] !== order.status) {
        mark('ignored');
        return { processed: true, status: 'ignored', granted: false, credits: before };
      }
      const status = order.status;
      const canonicalEnd = seconds(order.currentPeriodEnd);
      // Period-end scheduling can be sent an hour early. Only an explicitly
      // confirmed immediate cancellation may truncate previously paid access.
      const originalPaidThrough = hasPaidAllowance ? seconds(account.currentPeriodEnd) : canonicalEnd;
      const immediateCancellation = status === 'canceled' && order.cancelEffectiveMode === 'now';
      const cancelEffectiveAt = cancellationSeconds(order.cancelEffectiveAt);
      if (immediateCancellation && (!nonempty(order.cancelEffectiveAt) || !cancelEffectiveAt)) {
        return fail('waffo_cancel_effective_at_missing', 'Confirmed immediate cancellation requires a valid canonical effective timestamp; retry after order synchronization');
      }
      const paidThrough = immediateCancellation
        ? originalPaidThrough > 0 ? Math.min(originalPaidThrough, cancelEffectiveAt) : cancelEffectiveAt
        : originalPaidThrough;
      const expired = status === 'canceled' && paidThrough > 0 && paidThrough <= Math.floor(now / 1000);
      tx.update(userRef, {
        waffoSubscriptionId: order.id, waffoIntentCreatedAt: intent.createdAt, waffoSubscriptionStatus: status, subscriptionStatus: status,
        ...((immediateCancellation || !hasPaidAllowance) && paidThrough ? { currentPeriodEnd: paidThrough } : {}), ...(expired ? { tier: 'free' } : {}), updatedAt: new Date(now).toISOString(),
      });
      tx.create(this.db.doc(`billing_orders/waffo_${hash(`lifecycle:${event.eventType}:${event.eventId}`)}`), { ...common, kind: status === 'canceled' || status === 'canceling' ? 'cancellation' : 'status', periodKey: `${order.id}:${data.periodNumber ?? 'unknown'}`, credits: 0, amountTotal: 0, currency: 'usd', status, stale: false, canonicalPeriodEnd: canonicalEnd, paidThrough, originalPaidThrough, cancelEffectiveMode: order.cancelEffectiveMode ?? null, cancelEffectiveAt: order.cancelEffectiveAt ?? null, requiresReview: status === 'canceled' && !paidThrough });
      mark('processed');
      return { processed: true, status: 'processed', granted: false, credits: before };
    });
  }
}
