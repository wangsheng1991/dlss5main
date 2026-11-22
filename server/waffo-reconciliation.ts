import { createHash } from 'node:crypto';
import { PLANS } from '../src/config/plans.js';
import type { VerifiedWaffoOrder } from './waffo-billing-store.js';

export type WaffoReconciliationScope = { environment: 'test' | 'prod'; storeId: string; orderIds: string[] };
export type WaffoSnapshotDocument = { id: string; data: Record<string, unknown> };
export type WaffoSnapshotCollection<T> = { complete: boolean; records: T[] };
export type WaffoReconciliationPayment = {
  paymentId: string; orderId: string; periodNumber?: number | null;
  amountCents: number; currency: string; environment: 'test' | 'prod'; storeId: string;
};
export type WaffoReconciliationRefund = {
  refundId: string; paymentId: string; orderId: string; amountCents: number;
  currency: string; environment: 'test' | 'prod'; storeId: string;
};
export type WaffoReconciliationCollectionName = 'waffo_checkout_intents' | 'waffo_payments' | 'waffo_periods' | 'waffo_refunds' | 'billing_orders' | 'credit_ledger' | 'users';
/**
 * The collector normalizes authoritative provider data into these records. `complete`
 * asserts pagination is exhausted and all scope orders / referenced users are covered.
 * Firestore documents retain their real document ids; arrays must not discard duplicates.
 * No network, credentials, Firestore clients, or mutation callbacks belong in this input.
 */
export type WaffoReconciliationSnapshot = {
  scope: WaffoReconciliationScope; capturedAt: number;
  orders: WaffoSnapshotCollection<VerifiedWaffoOrder>;
  successfulPayments: WaffoSnapshotCollection<WaffoReconciliationPayment>;
  successfulRefunds: WaffoSnapshotCollection<WaffoReconciliationRefund>;
  firestore: Partial<Record<WaffoReconciliationCollectionName, WaffoSnapshotCollection<WaffoSnapshotDocument>>>;
};
export type WaffoReconciliationIssue = { code: string; severity: 'error' | 'incomplete'; message: string; refs: string[] };
export type WaffoReconciliationReport = {
  status: 'pass' | 'issues' | 'incomplete'; complete: boolean;
  scope: WaffoReconciliationScope; issues: WaffoReconciliationIssue[];
  counts: { orders: number; payments: number; refunds: number; users: number };
  /** Waffo entries are checked locally; a partial consumption ledger cannot prove total balance. */
  balanceCheck: 'structure-and-allowance-boundaries-only';
};

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const nonnegative = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0;
const positive = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) > 0;
const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const collections: WaffoReconciliationCollectionName[] = [
  'waffo_checkout_intents', 'waffo_payments', 'waffo_periods', 'waffo_refunds', 'billing_orders', 'credit_ledger', 'users',
];

/** Pure, deterministic, read-only checks of a bounded snapshot. Never repairs an account. */
export function reconcileWaffoSnapshot(input: WaffoReconciliationSnapshot): WaffoReconciliationReport {
  const issues: WaffoReconciliationIssue[] = [];
  const add = (code: string, message: string, refs: string[], severity: 'error' | 'incomplete' = 'error') => issues.push({ code, severity, message, refs });
  const scope = input.scope;
  const orderIds = new Set(scope.orderIds);
  if (!orderIds.size || !text(scope.storeId) || !['test', 'prod'].includes(scope.environment) || !nonnegative(input.capturedAt)) {
    add('invalid_scope', 'A nonempty bounded environment/store/order scope and snapshot time are required', ['scope'], 'incomplete');
  }
  if (orderIds.size !== scope.orderIds.length) add('duplicate_scope_order', 'Scope repeats an order id', ['scope.orderIds']);
  const readCoverage = <T>(name: string, source: WaffoSnapshotCollection<T> | undefined): T[] => {
    if (!source || source.complete !== true || !Array.isArray(source.records)) add('incomplete_source', `${name} does not assert complete paginated scope coverage`, [name], 'incomplete');
    return Array.isArray(source?.records) ? source.records : [];
  };
  const orders = readCoverage('orders', input.orders);
  const externalPayments = readCoverage('successfulPayments', input.successfulPayments);
  const externalRefunds = readCoverage('successfulRefunds', input.successfulRefunds);
  const docs = new Map<WaffoReconciliationCollectionName, WaffoSnapshotDocument[]>();
  for (const collection of collections) {
    const records = readCoverage(`firestore.${collection}`, input.firestore?.[collection]);
    docs.set(collection, records);
    const seen = new Set<string>();
    for (const doc of records) {
      if (!text(doc.id) || !doc.data || typeof doc.data !== 'object') { add('invalid_document', 'Snapshot document requires id and data', [collection]); continue; }
      if (seen.has(doc.id)) add('duplicate_document', 'Snapshot repeats a document id', [`${collection}/${doc.id}`]);
      seen.add(doc.id);
    }
  }
  const rows = (collection: WaffoReconciliationCollectionName) => docs.get(collection)!;
  const get = (collection: WaffoReconciliationCollectionName, id: string, code: string) => {
    const found = rows(collection).find((doc) => doc.id === id);
    if (!found) add(code, `Required ${collection} document is missing`, [`${collection}/${id}`], input.firestore?.[collection]?.complete === true ? 'error' : 'incomplete');
    return found?.data;
  };
  const equal = (actual: unknown, expected: unknown, field: string, ref: string) => {
    if (actual !== expected) add('field_mismatch', `${field} does not match authoritative linkage`, [ref, field]);
  };
  const supportedMoney = (amount: unknown, currency: unknown, ref: string) => {
    let valid = true;
    if (currency !== 'USD') { add('unsupported_currency', 'Only USD reconciliation is supported', [ref]); valid = false; }
    if (!positive(amount)) { add('invalid_amount', 'Amount must be a positive safe integer in cents', [ref]); valid = false; }
    return valid;
  };
  const externalScope = (record: { environment: string; storeId: string; orderId: string }, ref: string) => {
    const valid = record.environment === scope.environment && record.storeId === scope.storeId && orderIds.has(record.orderId);
    if (!valid) add('scope_mismatch', 'Provider record belongs to a different environment, store or order scope', [ref]);
    return valid;
  };
  const orderMap = new Map<string, VerifiedWaffoOrder>();
  const intentMap = new Map<string, Record<string, unknown>>();
  const uids = new Set<string>();
  for (const order of orders) {
    const ref = `orders/${order.id}`;
    if (orderMap.has(order.id)) add('duplicate_order', 'Authoritative order snapshot repeats an order', [ref]);
    orderMap.set(order.id, order);
    if (!orderIds.has(order.id) || order.storeId !== scope.storeId || typeof order.testMode !== 'boolean' || (order.testMode ? 'test' : 'prod') !== scope.environment) add('scope_mismatch', 'Canonical order belongs to another scope', [ref]);
    if (order.billingPeriod !== 'monthly') add('unsupported_billing_period', 'Only monthly Waffo subscriptions are supported', [ref]);
    if (!text(order.merchantProvidedBuyerIdentity) || !text(order.orderMerchantExternalId) || !text(order.subscriptionProduct?.id)) {
      add('incomplete_order_binding', 'Canonical account, intent and product binding is required', [ref], 'incomplete');
      continue;
    }
    uids.add(order.merchantProvidedBuyerIdentity);
    const intent = get('waffo_checkout_intents', order.orderMerchantExternalId, 'missing_intent');
    if (!intent) continue;
    intentMap.set(order.id, intent);
    equal(intent.uid, order.merchantProvidedBuyerIdentity, 'uid', `waffo_checkout_intents/${order.orderMerchantExternalId}`);
    equal(intent.productId, order.subscriptionProduct.id, 'productId', ref);
    equal(intent.environment, scope.environment, 'environment', ref);
    if (intent.plan !== 'pro' && intent.plan !== 'team') add('invalid_plan', 'Checkout intent requires a purchasable plan', [ref]);
  }
  for (const id of orderIds) if (!orderMap.has(id)) add('missing_order', 'Canonical scoped order is missing', [`orders/${id}`], input.orders?.complete === true ? 'error' : 'incomplete');

  for (const order of orders) if (['active', 'canceling', 'past_due'].includes(order.status) && !externalPayments.some((payment) => payment.orderId === order.id && payment.environment === scope.environment && payment.storeId === scope.storeId)) {
    add('missing_provider_payment_evidence', 'Live subscription has no successful-payment evidence; payment/authorization timing needs review', [`orders/${order.id}`], 'incomplete');
  }

  const checkBinding = (data: Record<string, unknown>, uid: string, orderId: string, periodKey: string, plan: unknown, ref: string) => {
    equal(data.uid, uid, 'uid', ref); equal(data.subscriptionId, orderId, 'subscriptionId', ref);
    equal(data.periodKey, periodKey, 'periodKey', ref); equal(data.plan, plan, 'plan', ref);
    equal(data.provider, 'waffo', 'provider', ref);
  };
  const checkLedger = (ledger: Record<string, unknown>, billing: Record<string, unknown> | undefined, ref: string) => {
    if (!Number.isSafeInteger(ledger.units) || !Number.isSafeInteger(ledger.delta) || !nonnegative(ledger.balanceBefore) || !nonnegative(ledger.balanceAfter)) {
      add('invalid_ledger_balance', 'Ledger delta and before/after balances must be safe integers', [ref]);
      return;
    }
    equal(ledger.delta, ledger.units, 'delta', ref);
    equal(ledger.balanceAfter - ledger.balanceBefore, ledger.units, 'balance change', ref);
    if (billing) equal(billing.credits, ledger.units, 'billing credits', ref);
    equal(ledger.bucket, 'monthly', 'bucket', ref);
  };
  const seenPayments = new Set<string>();
  const expectedPeriodKeys = new Set<string>();
  const acceptedPayments = new Map<string, WaffoReconciliationPayment>();
  for (const payment of externalPayments) {
    const ref = `successfulPayments/${payment.paymentId}`;
    if (!externalScope(payment, ref)) continue;
    supportedMoney(payment.amountCents, payment.currency, ref);
    if (!text(payment.paymentId)) { add('incomplete_payment_id', 'Provider payment id is required', [ref], 'incomplete'); continue; }
    if (seenPayments.has(payment.paymentId)) add('duplicate_provider_payment', 'Provider snapshot repeats a successful payment', [ref]);
    seenPayments.add(payment.paymentId);
    acceptedPayments.set(payment.paymentId, payment);
    if (!positive(payment.periodNumber)) { add('missing_payment_period', 'Provider payment needs its own positive periodNumber; current order period cannot substitute', [ref], 'incomplete'); continue; }
    const key = `${payment.orderId}:${payment.periodNumber}`;
    if (expectedPeriodKeys.has(key)) add('multiple_payments_for_period', 'More than one successful payment exists for one subscription period; review possible duplicate charge', [ref, key]);
    expectedPeriodKeys.add(key);
    const order = orderMap.get(payment.orderId);
    const intent = intentMap.get(payment.orderId);
    if (!order || !intent) { add('incomplete_payment_binding', 'Payment cannot be linked to canonical order and checkout intent', [ref], 'incomplete'); continue; }
    const uid = order.merchantProvidedBuyerIdentity;
    const stored = get('waffo_payments', hash(payment.paymentId), 'missing_payment');
    const period = get('waffo_periods', hash(key), 'missing_period');
    const billing = get('billing_orders', `waffo_${hash(key)}`, 'missing_billing_order');
    const ledger = get('credit_ledger', `waffo_${hash(key)}`, 'missing_ledger');
    for (const [data, name] of [[stored, 'waffo_payments'], [period, 'waffo_periods'], [billing, 'billing_orders'], [ledger, 'credit_ledger']] as const) {
      if (data) checkBinding(data, uid, order.id, key, intent.plan, name);
    }
    if (stored) {
      equal(stored.paymentId, payment.paymentId, 'paymentId', ref); equal(stored.amountTotal, payment.amountCents, 'amountTotal', ref); equal(stored.currency, 'USD', 'currency', ref);
      if (typeof stored.granted !== 'boolean' || !nonnegative(stored.refundedAmount)) add('invalid_payment_record', 'Payment requires granted flag and safe refundedAmount', [ref]);
    }
    if (period) { equal(period.paymentId, payment.paymentId, 'paymentId', ref); equal(period.periodNumber, payment.periodNumber, 'periodNumber', ref); if (stored) equal(period.granted, stored.granted, 'granted', ref); }
    if (billing) { equal(billing.paymentId, payment.paymentId, 'paymentId', ref); equal(billing.amountTotal, payment.amountCents, 'amountTotal', ref); equal(billing.currency, 'usd', 'currency', ref); equal(billing.kind, 'subscription', 'kind', ref); if (stored) equal(billing.stale, !stored.granted, 'stale', ref); }
    if (intent.plan === 'pro' || intent.plan === 'team') {
      if (payment.amountCents < PLANS[intent.plan].priceUsd * 100) add('underpaid_allowance', 'Provider payment is below the configured monthly plan price', [ref]);
      if (ledger && stored?.granted === true) equal(ledger.balanceAfter, PLANS[intent.plan].monthlyCredits, 'monthly allowance reset', ref);
    }
    if (ledger) { equal(ledger.kind, 'purchase', 'kind', ref); checkLedger(ledger, billing, ref); if (stored?.granted === false) equal(ledger.units, 0, 'stale payment delta', ref); }
  }
  // Check business-key duplicates even if their document ids were changed or corrupted.
  for (const collection of ['waffo_payments', 'waffo_periods', 'billing_orders', 'credit_ledger'] as const) {
    const seen = new Set<string>();
    for (const doc of rows(collection)) {
      if (!orderIds.has(String(doc.data.subscriptionId))) continue;
      const key = collection === 'waffo_payments' ? doc.data.paymentId : doc.data.periodKey;
      if (!text(key) || (collection === 'billing_orders' && doc.data.kind !== 'subscription') || (collection === 'credit_ledger' && doc.data.kind !== 'purchase')) continue;
      if (seen.has(key)) add('duplicate_grant', 'Multiple records represent the same payment or allowance period', [`${collection}/${doc.id}`, key]);
      seen.add(key);
      if (collection === 'waffo_payments' && !acceptedPayments.has(String(doc.data.paymentId))) add('unverified_payment', 'Stored payment has no authoritative successful provider payment in this snapshot', [`${collection}/${doc.id}`], input.successfulPayments?.complete === true ? 'error' : 'incomplete');
      if (collection !== 'waffo_payments' && !expectedPeriodKeys.has(key)) {
        const unknownPeriod = externalPayments.some((payment) => payment.orderId === doc.data.subscriptionId && !positive(payment.periodNumber));
        add('unverified_allowance', 'Stored allowance has no authoritative paid period in this snapshot', [`${collection}/${doc.id}`, key], input.successfulPayments?.complete === true && !unknownPeriod ? 'error' : 'incomplete');
      }
    }
  }

  const refundTotals = new Map<string, number>();
  const seenRefunds = new Set<string>();
  for (const refund of externalRefunds) {
    const ref = `successfulRefunds/${refund.refundId}`;
    if (!externalScope(refund, ref)) continue;
    const validMoney = supportedMoney(refund.amountCents, refund.currency, ref);
    if (!text(refund.refundId) || !text(refund.paymentId)) { add('incomplete_refund_id', 'Provider refund and original payment ids are required', [ref], 'incomplete'); continue; }
    if (seenRefunds.has(refund.refundId)) { add('duplicate_provider_refund', 'Provider snapshot repeats a refund', [ref]); continue; }
    seenRefunds.add(refund.refundId);
    if (validMoney) refundTotals.set(refund.paymentId, (refundTotals.get(refund.paymentId) || 0) + refund.amountCents);
    const payment = acceptedPayments.get(refund.paymentId);
    if (!payment) { add('missing_refund_payment', 'Refund has no authoritative original successful payment', [ref], input.successfulPayments?.complete === true ? 'error' : 'incomplete'); continue; }
    equal(refund.orderId, payment.orderId, 'refund orderId', ref);
    const key = positive(payment.periodNumber) ? `${payment.orderId}:${payment.periodNumber}` : '';
    const order = orderMap.get(refund.orderId); const intent = intentMap.get(refund.orderId);
    if (!key || !order || !intent) { add('incomplete_refund_binding', 'Refund cannot be bound to the original payment period', [ref], 'incomplete'); continue; }
    const stored = get('waffo_refunds', hash(refund.refundId), 'missing_refund');
    const billing = get('billing_orders', `waffo_${hash(`refund:${refund.refundId}`)}`, 'missing_refund_billing_order');
    const ledger = get('credit_ledger', `waffo_${hash(`refund:${refund.refundId}`)}`, 'missing_refund_ledger');
    for (const [data, name] of [[stored, 'waffo_refunds'], [billing, 'billing_orders'], [ledger, 'credit_ledger']] as const) if (data) checkBinding(data, order.merchantProvidedBuyerIdentity, order.id, key, intent.plan, name);
    if (stored) { equal(stored.paymentId, refund.paymentId, 'paymentId', ref); equal(stored.amountTotal, refund.amountCents, 'amountTotal', ref); if (typeof stored.full !== 'boolean') add('invalid_refund_record', 'Refund requires a full/partial flag', [ref]); }
    if (billing) { equal(billing.kind, 'refund', 'kind', ref); equal(billing.paymentId, refund.paymentId, 'paymentId', ref); equal(billing.amountTotal, refund.amountCents, 'amountTotal', ref); equal(billing.currency, 'usd', 'currency', ref); if (stored) equal(billing.full, stored.full, 'full', ref); }
    if (ledger) {
      equal(ledger.kind, 'refund', 'kind', ref); checkLedger(ledger, billing, ref);
      if (typeof ledger.units === 'number' && ledger.units > 0) add('refund_grants_credits', 'Refund cannot increase monthly credits', [ref]);
      if (stored?.full === false) equal(ledger.units, 0, 'partial refund delta', ref);
      const originalStoredPayment = rows('waffo_payments').find((doc) => doc.id === hash(refund.paymentId))?.data;
      if (originalStoredPayment?.granted === false) equal(ledger.units, 0, 'ungranted payment refund delta', ref);
      if (ledger.units !== 0 && ledger.balanceAfter !== 0) add('invalid_refund_deduction', 'Full refund deduction must clear only the remaining monthly allowance', [ref]);
    }
  }
  for (const payment of acceptedPayments.values()) {
    const total = refundTotals.get(payment.paymentId) || 0;
    if (!nonnegative(total) || total > payment.amountCents) add('refund_exceeds_payment', 'Cumulative refunds exceed the original charge or safe integer range', [payment.paymentId]);
    const stored = rows('waffo_payments').find((doc) => doc.id === hash(payment.paymentId))?.data;
    if (stored && input.successfulRefunds?.complete === true) equal(stored.refundedAmount, total, 'cumulative refundedAmount', `waffo_payments/${hash(payment.paymentId)}`);
    else if (stored && nonnegative(stored.refundedAmount) && stored.refundedAmount < total) add('refund_total_underreported', 'Stored refundedAmount is below already observed successful refunds', [payment.paymentId]);
    const fullRefunds = rows('waffo_refunds').filter((doc) => doc.data.paymentId === payment.paymentId && doc.data.full === true);
    if (fullRefunds.length > 1) add('duplicate_full_refund', 'More than one refund is marked as completing the original payment refund', [payment.paymentId]);
    if (total === payment.amountCents && !fullRefunds.length) add('missing_full_refund', 'A fully refunded payment lacks its full-refund marker', [payment.paymentId], input.firestore?.waffo_refunds?.complete === true ? 'error' : 'incomplete');
    if (input.successfulRefunds?.complete === true && total < payment.amountCents && fullRefunds.length) add('incorrect_full_refund', 'Partial cumulative refund was marked full', [payment.paymentId]);
  }
  for (const doc of rows('waffo_refunds')) if (orderIds.has(String(doc.data.subscriptionId)) && !externalRefunds.some((refund) => hash(refund.refundId) === doc.id && refund.paymentId === doc.data.paymentId)) {
    add('unverified_refund', 'Stored refund has no matching authoritative successful refund', [`waffo_refunds/${doc.id}`], input.successfulRefunds?.complete === true ? 'error' : 'incomplete');
  }
  for (const uid of uids) {
    const account = get('users', uid, 'missing_user');
    if (!account) continue;
    const ref = `users/${uid}`;
    if (text(account.waffoSubscriptionId)) {
      const boundOrder = orderMap.get(account.waffoSubscriptionId);
      if (boundOrder && boundOrder.merchantProvidedBuyerIdentity === uid) {
        if (!text(account.waffoSubscriptionStatus)) add('missing_subscription_status', 'Bound Waffo subscription has no local status', [ref, `orders/${boundOrder.id}`], 'incomplete');
        else if (!text(boundOrder.status)) add('missing_canonical_status', 'Canonical bound Waffo subscription has no status', [ref, `orders/${boundOrder.id}`], 'incomplete');
        else if (account.waffoSubscriptionStatus !== boundOrder.status) add('status_mismatch', 'Bound local Waffo subscription status differs from canonical provider status', [ref, `orders/${boundOrder.id}`]);
      }
    }
    if (!nonnegative(account.credits) || !nonnegative(account.bonusCredits)) add('invalid_user_balance', 'Monthly and bonus balances must be nonnegative safe integers', [ref]);
    if (account.tier !== 'free' && account.tier !== 'pro' && account.tier !== 'team') add('invalid_user_tier', 'User tier is outside the plan catalog', [ref]);
    if (text(account.waffoAllowanceKey)) {
      const payment = rows('waffo_payments').find((doc) => doc.data.periodKey === account.waffoAllowanceKey && doc.data.uid === uid);
      if (!payment) { add('missing_user_allowance', 'Current Waffo allowance has no recorded payment in the snapshot', [ref, account.waffoAllowanceKey], 'incomplete'); continue; }
      const data = payment.data;
      equal(data.granted, true, 'current allowance granted', ref);
      equal(data.subscriptionId, account.waffoSubscriptionId, 'current allowance subscriptionId', ref);
      if (positive(account.waffoLastPeriod)) equal(data.periodKey, `${account.waffoSubscriptionId}:${account.waffoLastPeriod}`, 'current allowance period', ref);
      else add('invalid_user_period', 'Current allowance requires a positive last period', [ref]);
      if (data.plan === 'pro' || data.plan === 'team') {
        if (nonnegative(account.credits) && account.credits > PLANS[data.plan].monthlyCredits) add('allowance_exceeds_plan', 'Remaining monthly credits exceed the granted plan allowance', [ref]);
      } else add('invalid_allowance_plan', 'Current allowance has an unsupported plan', [ref]);
      if (data.refundedAmount === data.amountTotal && account.credits !== 0) add('refunded_allowance_has_balance', 'Current fully refunded allowance still has monthly credits', [ref]);
    } else if (text(account.waffoSubscriptionId) && externalPayments.some((payment) => payment.orderId === account.waffoSubscriptionId)) {
      add('missing_user_allowance', 'Paid current subscription has no allowance reference; review stale-payment handling', [ref]);
    }
  }
  const complete = !issues.some((issue) => issue.severity === 'incomplete');
  return {
    status: issues.some((issue) => issue.severity === 'error') ? 'issues' : complete ? 'pass' : 'incomplete', complete, scope,
    issues, counts: { orders: orders.length, payments: externalPayments.length, refunds: externalRefunds.length, users: uids.size },
    balanceCheck: 'structure-and-allowance-boundaries-only',
  };
}
