import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { reconcileWaffoSnapshot, type WaffoReconciliationSnapshot } from '../server/waffo-reconciliation';
import { test } from './harness';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const periodKey = 'order-1:1';
function snapshot(): WaffoReconciliationSnapshot {
  const now = Date.now();
  const common = { uid: 'alice', provider: 'waffo', plan: 'pro', subscriptionId: 'order-1', createdAt: now };
  return {
    scope: { environment: 'test', storeId: 'store-fixture', orderIds: ['order-1'] }, capturedAt: now,
    orders: { complete: true, records: [{
      id: 'order-1', storeId: 'store-fixture', testMode: true, status: 'active',
      merchantProvidedBuyerIdentity: 'alice', orderMerchantExternalId: `wpi_${'a'.repeat(32)}`,
      subscriptionProduct: { id: 'product-pro' }, billingPeriod: 'monthly', currentPeriodNumber: 1,
      currentPeriodEnd: new Date(now + 86_400_000).toISOString(),
    }] },
    successfulPayments: { complete: true, records: [{ paymentId: 'payment-1', orderId: 'order-1', periodNumber: 1, amountCents: 1900, currency: 'USD', environment: 'test', storeId: 'store-fixture' }] },
    successfulRefunds: { complete: true, records: [] },
    firestore: {
      waffo_checkout_intents: { complete: true, records: [{ id: `wpi_${'a'.repeat(32)}`, data: { id: `wpi_${'a'.repeat(32)}`, uid: 'alice', plan: 'pro', productId: 'product-pro', environment: 'test', createdAt: now, expiresAt: now + 31 * 60_000 } }] },
      waffo_payments: { complete: true, records: [{ id: hash('payment-1'), data: { ...common, paymentId: 'payment-1', periodKey, amountTotal: 1900, currency: 'USD', refundedAmount: 0, granted: true } }] },
      waffo_periods: { complete: true, records: [{ id: hash(periodKey), data: { ...common, periodKey, periodNumber: 1, paymentId: 'payment-1', granted: true } }] },
      waffo_refunds: { complete: true, records: [] },
      billing_orders: { complete: true, records: [{ id: `waffo_${hash(periodKey)}`, data: { ...common, kind: 'subscription', periodKey, paymentId: 'payment-1', credits: 490, amountTotal: 1900, currency: 'usd', stale: false } }] },
      credit_ledger: { complete: true, records: [{ id: `waffo_${hash(periodKey)}`, data: { ...common, kind: 'purchase', units: 490, delta: 490, bucket: 'monthly', periodKey, balanceBefore: 10, balanceAfter: 500 } }] },
      users: { complete: true, records: [{ id: 'alice', data: { tier: 'pro', credits: 500, bonusCredits: 17, waffoSubscriptionId: 'order-1', waffoSubscriptionStatus: 'active', subscriptionStatus: 'active', waffoAllowanceKey: periodKey, waffoLastPeriod: 1, currentPeriodEnd: Math.floor(now / 1000) + 86_400 } }] },
    },
  };
}
function expectIssues(input: WaffoReconciliationSnapshot, code?: string) {
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'issues', JSON.stringify(report.issues));
  assert.ok(report.issues.some(issue => issue.severity === 'error'));
  if (code) assert.ok(report.issues.some(issue => issue.code === code && issue.severity === 'error'), `${code}: ${JSON.stringify(report.issues)}`);
  return report;
}

function refundedSnapshot(): WaffoReconciliationSnapshot {
  const input = snapshot(), common = { uid: 'alice', provider: 'waffo', plan: 'pro', subscriptionId: 'order-1', createdAt: input.capturedAt };
  input.successfulRefunds.records.push({ refundId: 'refund-1', paymentId: 'payment-1', orderId: 'order-1', amountCents: 1900, currency: 'USD', environment: 'test', storeId: 'store-fixture' });
  input.firestore.waffo_payments!.records[0].data.refundedAmount = 1900;
  input.firestore.waffo_refunds!.records.push({ id: hash('refund-1'), data: { ...common, paymentId: 'payment-1', amountTotal: 1900, periodKey, full: true } });
  input.firestore.billing_orders!.records.push({ id: `waffo_${hash('refund:refund-1')}`, data: { ...common, kind: 'refund', paymentId: 'payment-1', amountTotal: 1900, currency: 'usd', periodKey, credits: -500, full: true, requiresReview: false } });
  input.firestore.credit_ledger!.records.push({ id: `waffo_${hash('refund:refund-1')}`, data: { ...common, kind: 'refund', units: -500, delta: -500, bucket: 'monthly', periodKey, balanceBefore: 500, balanceAfter: 0 } });
  input.firestore.users!.records[0].data.credits = 0;
  return input;
}

test('Waffo reconciliation passes a complete provider-payment and local-receipt chain', () => {
  const input = snapshot(), before = structuredClone(input);
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'pass', JSON.stringify(report.issues)); assert.equal(report.complete, true);
  assert.deepEqual(report.issues, []); assert.deepEqual(report.scope, input.scope);
  assert.deepEqual(report.counts, { orders: 1, payments: 1, refunds: 0, users: 1 });
  assert.deepEqual(input, before, 'read-only reconciliation must not mutate the evidence snapshot');
});

test('Waffo reconciliation detects a successful payment missing a local receipt, period or ledger', () => {
  for (const [collection, code] of [['waffo_payments', 'missing_payment'], ['waffo_periods', 'missing_period'], ['billing_orders', 'missing_billing_order'], ['credit_ledger', 'missing_ledger']] as const) {
    const input = snapshot(); input.firestore[collection]!.records = [];
    expectIssues(input, code);
  }
});

test('Waffo reconciliation detects repeated grant ledger entries for one paid period', () => {
  const input = snapshot();
  const existing = input.firestore.credit_ledger!.records[0];
  input.firestore.credit_ledger!.records.push({ id: 'duplicate-grant', data: { ...existing.data } });
  expectIssues(input, 'duplicate_grant');
});

test('Waffo reconciliation rejects allowance rows with no authoritative paid period', () => {
  for (const collection of ['waffo_periods', 'billing_orders', 'credit_ledger'] as const) {
    const input = snapshot(), existing = input.firestore[collection]!.records[0];
    input.firestore[collection]!.records.push({ id: 'orphan-period', data: { ...existing.data, periodKey: 'order-1:99', periodNumber: 99 } });
    expectIssues(input, 'unverified_allowance');
  }
});

test('Waffo reconciliation rejects incorrect account attribution and receipt amounts', () => {
  for (const change of [{ uid: 'bob' }, { amountTotal: 1 }, { currency: 'EUR' }]) {
    const input = snapshot(); Object.assign(input.firestore.waffo_payments!.records[0].data, change);
    expectIssues(input, 'field_mismatch');
  }
});

test('Waffo reconciliation detects a local active subscription that is canonically canceling', () => {
  const input = snapshot(); input.orders.records[0].status = 'canceling';
  expectIssues(input, 'status_mismatch');
});

test('Waffo reconciliation treats missing local or canonical subscription status as incomplete', () => {
  for (const canonical of [false, true]) {
    const input = snapshot();
    if (canonical) input.orders.records[0].status = '';
    else delete input.firestore.users!.records[0].data.waffoSubscriptionStatus;
    const report = reconcileWaffoSnapshot(input);
    assert.equal(report.status, 'incomplete', JSON.stringify(report.issues));
    assert.ok(report.issues.some(issue => issue.code === (canonical ? 'missing_canonical_status' : 'missing_subscription_status') && issue.severity === 'incomplete'));
  }
});

test('Waffo reconciliation reports a successful provider refund missing its local refund and ledger', () => {
  const input = snapshot();
  input.successfulRefunds.records.push({ refundId: 'refund-1', paymentId: 'payment-1', orderId: 'order-1', amountCents: 1900, currency: 'USD', environment: 'test', storeId: 'store-fixture' });
  expectIssues(input, 'missing_refund');
});

test('Waffo reconciliation passes an exactly matched full-refund receipt and adjustment chain', () => {
  const report = reconcileWaffoSnapshot(refundedSnapshot());
  assert.equal(report.status, 'pass', JSON.stringify(report.issues)); assert.equal(report.counts.refunds, 1);
});

test('Waffo reconciliation detects refund-total drift and a missing refund adjustment ledger', () => {
  const mismatchedTotal = refundedSnapshot();
  mismatchedTotal.firestore.waffo_payments!.records[0].data.refundedAmount = 0;
  expectIssues(mismatchedTotal, 'field_mismatch');
  const missingLedger = refundedSnapshot();
  missingLedger.firestore.credit_ledger!.records = missingLedger.firestore.credit_ledger!.records.filter(record => record.data.kind !== 'refund');
  expectIssues(missingLedger, 'missing_refund_ledger');
});

test('Waffo reconciliation rejects credit clawback for a payment that never granted an allowance', () => {
  const input = refundedSnapshot();
  input.firestore.waffo_payments!.records[0].data.granted = false;
  input.firestore.waffo_periods!.records[0].data.granted = false;
  Object.assign(input.firestore.billing_orders!.records[0].data, { credits: 0, stale: true });
  Object.assign(input.firestore.credit_ledger!.records[0].data, { units: 0, delta: 0, balanceBefore: 10, balanceAfter: 10 });
  Object.assign(input.firestore.users!.records[0].data, { credits: 10, waffoSubscriptionId: '', waffoAllowanceKey: '' });
  const report = expectIssues(input, 'field_mismatch');
  assert.ok(report.issues.some(issue => issue.refs.includes('ungranted payment refund delta')));
});

test('Waffo reconciliation never merges production, test or another store payment evidence', () => {
  for (const change of [{ environment: 'prod' as const }, { storeId: 'foreign-store' }]) {
    const input = snapshot(); Object.assign(input.successfulPayments.records[0], change);
    expectIssues(input, 'scope_mismatch');
  }
});

test('Waffo reconciliation labels incomplete pagination and missing collections as incomplete', () => {
  for (const mutate of [
    (input: WaffoReconciliationSnapshot) => { input.orders.complete = false; },
    (input: WaffoReconciliationSnapshot) => { input.successfulPayments.complete = false; },
    (input: WaffoReconciliationSnapshot) => { input.successfulRefunds.complete = false; },
    (input: WaffoReconciliationSnapshot) => { delete input.firestore.users; },
  ]) {
    const input = snapshot(); mutate(input);
    const report = reconcileWaffoSnapshot(input);
    assert.equal(report.status, 'incomplete', JSON.stringify(report.issues)); assert.equal(report.complete, false);
    assert.ok(report.issues.some(issue => issue.severity === 'incomplete'));
    assert.ok(report.issues.some(issue => issue.code === 'incomplete_source'));
  }
});

test('Waffo reconciliation does not report refund-total drift from an unfinished provider refund page', () => {
  const input = refundedSnapshot();
  input.successfulRefunds = { complete: false, records: [] };
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'incomplete', JSON.stringify(report.issues)); assert.equal(report.complete, false);
  assert.ok(report.issues.every(issue => issue.severity === 'incomplete'));
});

test('Waffo reconciliation does not guess missing payment period from the current subscription period', () => {
  const input = snapshot(); input.successfulPayments.records[0].periodNumber = undefined;
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'incomplete', JSON.stringify(report.issues)); assert.equal(report.complete, false);
  assert.ok(report.issues.some(issue => issue.code === 'missing_payment_period'));
});

test('Waffo reconciliation marks an active subscription without successful payment evidence as incomplete', () => {
  const input = snapshot(); input.successfulPayments.records = [];
  for (const collection of ['waffo_payments', 'waffo_periods', 'billing_orders', 'credit_ledger'] as const) input.firestore[collection]!.records = [];
  Object.assign(input.firestore.users!.records[0].data, { tier: 'free', credits: 10, waffoSubscriptionId: '', waffoAllowanceKey: '' });
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'incomplete', JSON.stringify(report.issues));
  assert.ok(report.issues.some(issue => issue.code === 'missing_provider_payment_evidence'));
});

test('Waffo reconciliation rejects unsafe provider amounts, negative balances and over-limit paid credits', () => {
  for (const credits of [-1, 500.5, 501, Number.MAX_SAFE_INTEGER + 1]) {
    const input = snapshot(); input.firestore.users!.records[0].data.credits = credits;
    expectIssues(input, credits === 501 ? 'allowance_exceeds_plan' : 'invalid_user_balance');
  }
  for (const amount of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    const input = snapshot(); input.successfulPayments.records[0].amountCents = amount;
    expectIssues(input, 'invalid_amount');
  }
});

test('Waffo reconciliation never claims a full balance sum when consumption-ledger coverage is incomplete', () => {
  const input = snapshot(); input.firestore.credit_ledger!.complete = false;
  input.firestore.users!.records[0].data.credits = 123;
  const report = reconcileWaffoSnapshot(input);
  assert.equal(report.status, 'incomplete', JSON.stringify(report.issues)); assert.equal(report.complete, false);
  assert.ok(report.issues.some(issue => issue.severity === 'incomplete'));
  assert.equal(report.balanceCheck, 'structure-and-allowance-boundaries-only');
  assert.ok(!report.issues.some(issue => /balance.*(?:match|sum)|(?:match|sum).*balance/.test(issue.code) && issue.severity === 'error'));
});
