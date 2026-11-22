import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { collectWaffoReconciliation, type WaffoCollectorDependencies } from '../server/waffo-reconciliation-collector';
import { parseWaffoReconciliationArgs, runWaffoReconciliationCli } from '../scripts/reconcile-waffo';
import { test } from './harness';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const scope = { environment: 'test' as const, storeId: 'store-fixture', orderIds: ['order-1'] };
function collectorFixture() {
  const now = Date.now(), key = 'order-1:1', intentId = `wpi_${'a'.repeat(32)}`;
  const common = { uid: 'alice', provider: 'waffo', plan: 'pro', subscriptionId: 'order-1', createdAt: now };
  const order = { id: 'order-1', storeId: scope.storeId, testMode: true, status: 'active', merchantProvidedBuyerIdentity: 'alice', orderMerchantExternalId: intentId, subscriptionProduct: { id: 'product-pro' }, billingPeriod: 'monthly', currentPeriodNumber: 1, currentPeriodEnd: new Date(now + 86_400_000).toISOString() };
  const payments: any[] = [{ id: 'payment-1', orderId: 'order-1', status: 'succeeded', testMode: true, periodNumber: 1, amount: { amount: '19.00', currency: 'USD' }, pspAmountDetails: { amount: '19.00', currency: 'USD' } }];
  const refunds: any[] = [];
  const records = new Map<string, any>([
    [`waffo_checkout_intents/${intentId}`, { uid: 'alice', plan: 'pro', productId: 'product-pro', environment: 'test', createdAt: now }],
    ['users/alice', { tier: 'pro', credits: 500, bonusCredits: 0, waffoSubscriptionId: 'order-1', waffoSubscriptionStatus: 'active', subscriptionStatus: 'active', waffoAllowanceKey: key, waffoLastPeriod: 1, currentPeriodEnd: Math.floor(now / 1000) + 86_400, email: 'private@example.invalid', name: 'Private customer', image: 'private-image', privateKey: 'DO_NOT_EXPORT' }],
    [`waffo_payments/${hash('payment-1')}`, { ...common, paymentId: 'payment-1', periodKey: key, amountTotal: 1900, currency: 'USD', refundedAmount: 0, granted: true }],
    [`waffo_periods/${hash(key)}`, { ...common, periodKey: key, periodNumber: 1, paymentId: 'payment-1', granted: true }],
    [`billing_orders/waffo_${hash(key)}`, { ...common, kind: 'subscription', periodKey: key, paymentId: 'payment-1', credits: 490, amountTotal: 1900, currency: 'usd', stale: false }],
    [`credit_ledger/waffo_${hash(key)}`, { ...common, kind: 'purchase', units: 490, delta: 490, bucket: 'monthly', periodKey: key, balanceBefore: 10, balanceAfter: 500 }],
  ]);
  const trace = { queries: [] as Array<{ field: string; variables: any }>, docs: [] as string[], pages: [] as Array<{ collection: string; offset: number; limit: number }> };
  const failures = { provider: '', collection: '', document: '' };
  const graphql = { async query({ query, variables }: {query: string; variables?: any}) {
    const field = query.includes('subscriptionOrder(') ? 'subscriptionOrder' : query.includes('payments(') ? 'payments' : 'refunds';
    trace.queries.push({ field, variables: structuredClone(variables) });
    if (failures.provider === field) throw new Error('SECRET_PROVIDER_ERROR_DO_NOT_EXPORT');
    if (field === 'subscriptionOrder') return { data: { subscriptionOrder: structuredClone(order) } };
    const source = field === 'payments' ? payments : refunds.filter(refund => refund.paymentId === variables.paymentId);
    return { data: { [field]: structuredClone(source.slice(variables.offset, variables.offset + variables.limit)) } };
  } };
  // The mock deliberately exposes only read methods. Any mutation API access fails.
  const db = {
    doc(path: string) { return { async get() {
      trace.docs.push(path);
      if (failures.document === path) throw new Error('SECRET_DATABASE_ERROR_DO_NOT_EXPORT');
      return { exists: records.has(path), data: () => structuredClone(records.get(path)) };
    } }; },
    collection(collection: string) {
      let id = '', limit = 0, offset = 0;
      const query = {
        where(field: string, comparison: string, value: string) { assert.equal(field, 'subscriptionId'); assert.equal(comparison, '=='); id = value; return query; },
        orderBy(field: string) { assert.equal(field, '__name__'); return query; },
        limit(value: number) { limit = value; return query; }, offset(value: number) { offset = value; return query; },
        async get() {
          trace.pages.push({ collection, offset, limit });
          if (failures.collection === collection) throw new Error('SECRET_DATABASE_ERROR_DO_NOT_EXPORT');
          const selected = [...records].filter(([path, data]) => path.startsWith(`${collection}/`) && data.subscriptionId === id).sort(([a], [b]) => a.localeCompare(b)).slice(offset, offset + limit);
          return { docs: selected.map(([path, data]) => ({ id: path.split('/').at(-1), data: () => structuredClone(data) })) };
        },
      };
      return query;
    },
  };
  return { dependencies: { graphql, db } as unknown as WaffoCollectorDependencies, records, order, payments, refunds, trace, failures, now };
}

test('Waffo collector reads a complete paginated chain without writes or user PII', async () => {
  const fixture = collectorFixture(), before = structuredClone([...fixture.records]);
  const result = await collectWaffoReconciliation(fixture.dependencies, scope, { pageSize: 1, now: () => fixture.now });
  assert.equal(result.report.status, 'pass', JSON.stringify(result.report.issues));
  assert.deepEqual([...fixture.records], before);
  assert.deepEqual(fixture.trace.queries.filter(query => query.field === 'payments').map(query => query.variables.offset), [0, 1]);
  assert.ok(fixture.trace.pages.some(page => page.collection === 'credit_ledger' && page.offset === 1));
  const user = result.snapshot.firestore.users!.records[0].data;
  assert.equal(user.credits, 500); assert.equal(user.waffoSubscriptionStatus, 'active');
  for (const field of ['email', 'name', 'image', 'privateKey']) assert.ok(!(field in user));
  assert.ok(!JSON.stringify(result).includes('DO_NOT_EXPORT'));
});

test('Waffo collector reports provider and Firestore pagination caps as incomplete', async () => {
  const fixture = collectorFixture();
  const result = await collectWaffoReconciliation(fixture.dependencies, scope, { pageSize: 1, maxPages: 1 });
  assert.notEqual(result.report.status, 'pass'); assert.equal(result.report.complete, false);
  for (const code of ['provider_page_limit', 'firestore_page_limit']) assert.ok(result.collectionIssues.some(issue => issue.code === code));
});

test('Waffo collector exhausts refund pages and reconciles cumulative partial refunds', async () => {
  const fixture = collectorFixture(), key = 'order-1:1';
  const common = { uid: 'alice', provider: 'waffo', plan: 'pro', subscriptionId: 'order-1', createdAt: fixture.now };
  fixture.records.get(`waffo_payments/${hash('payment-1')}`).refundedAmount = 1900;
  fixture.records.get('users/alice').credits = 0;
  for (const [id, display, amount, full] of [['refund-1', '9.00', 900, false], ['refund-2', '10.00', 1000, true]] as const) {
    fixture.refunds.push({ id, paymentId: 'payment-1', status: 'succeeded', testMode: true, pspAmountDetails: { amount: display, currency: 'USD' } });
    fixture.records.set(`waffo_refunds/${hash(id)}`, { ...common, paymentId: 'payment-1', amountTotal: amount, periodKey: key, full });
    fixture.records.set(`billing_orders/waffo_${hash(`refund:${id}`)}`, { ...common, kind: 'refund', paymentId: 'payment-1', amountTotal: amount, currency: 'usd', periodKey: key, full, credits: full ? -500 : 0 });
    fixture.records.set(`credit_ledger/waffo_${hash(`refund:${id}`)}`, { ...common, kind: 'refund', units: full ? -500 : 0, delta: full ? -500 : 0, bucket: 'monthly', periodKey: key, balanceBefore: 500, balanceAfter: full ? 0 : 500 });
  }
  const result = await collectWaffoReconciliation(fixture.dependencies, scope, { pageSize: 1 });
  assert.equal(result.report.status, 'pass', JSON.stringify(result.report.issues));
  assert.deepEqual(result.snapshot.successfulRefunds.records.map(refund => refund.amountCents), [900, 1000]);
  assert.deepEqual(fixture.trace.queries.filter(query => query.field === 'refunds').map(query => query.variables.offset), [0, 1, 2]);
});

test('Waffo collector query failures never pass or expose provider error text', async () => {
  for (const field of ['subscriptionOrder', 'payments', 'refunds']) {
    const fixture = collectorFixture(); fixture.failures.provider = field;
    const result = await collectWaffoReconciliation(fixture.dependencies, scope);
    assert.notEqual(result.report.status, 'pass', field); assert.equal(result.report.complete, false);
    assert.ok(!JSON.stringify(result).includes('SECRET_PROVIDER_ERROR_DO_NOT_EXPORT'));
    assert.ok(result.collectionIssues.some(issue => issue.code === (field === 'subscriptionOrder' ? 'provider_order_failed' : 'provider_collection_failed')));
  }
});

test('Waffo collector database failures are incomplete and do not expose error details', async () => {
  for (const kind of ['document', 'collection']) {
    const fixture = collectorFixture();
    if (kind === 'document') fixture.failures.document = 'users/alice'; else fixture.failures.collection = 'credit_ledger';
    const result = await collectWaffoReconciliation(fixture.dependencies, scope);
    assert.notEqual(result.report.status, 'pass'); assert.equal(result.report.complete, false);
    assert.ok(!JSON.stringify(result).includes('SECRET_DATABASE_ERROR_DO_NOT_EXPORT'));
  }
});

test('Waffo collector never substitutes listed prices for missing, zero or invalid actual PSP charges', async () => {
  for (const amount of [undefined, '0.00', '19.001', '1e2']) {
    const fixture = collectorFixture();
    fixture.payments[0].pspAmountDetails = amount === undefined ? undefined : { amount, currency: 'USD' };
    const result = await collectWaffoReconciliation(fixture.dependencies, scope);
    assert.equal(result.snapshot.successfulPayments.records.length, 0);
    assert.equal(result.snapshot.successfulPayments.complete, false); assert.notEqual(result.report.status, 'pass');
    assert.ok(result.collectionIssues.some(issue => issue.code === 'payment_actual_amount_unconfirmed'));
    assert.ok(fixture.trace.queries.some(query => query.field === 'refunds'), 'refunds must still be collected for the known successful payment');
  }
});

test('Waffo collector never substitutes listed refund prices for an unknown PSP refund amount', async () => {
  const fixture = collectorFixture();
  fixture.refunds.push({ id: 'refund-1', paymentId: 'payment-1', status: 'succeeded', testMode: true, amount: { amount: '19.00', currency: 'USD' }, pspAmountDetails: { amount: '0.00', currency: 'USD' } });
  const result = await collectWaffoReconciliation(fixture.dependencies, scope);
  assert.equal(result.snapshot.successfulRefunds.records.length, 0); assert.equal(result.snapshot.successfulRefunds.complete, false);
  assert.ok(result.collectionIssues.some(issue => issue.code === 'refund_actual_amount_unconfirmed'));
});

test('Waffo collector rejects another environment before reading its intent or customer', async () => {
  const fixture = collectorFixture(); fixture.order.testMode = false;
  fixture.order.merchantProvidedBuyerIdentity = 'wrong-environment-user';
  const result = await collectWaffoReconciliation(fixture.dependencies, scope);
  assert.equal(result.report.status, 'issues');
  assert.ok(result.collectionIssues.some(issue => issue.code === 'provider_order_scope_mismatch'));
  assert.deepEqual(fixture.trace.docs, []);
  assert.equal(result.snapshot.orders.records.length, 0);
});

test('Waffo collector rejects payments and refunds from another environment', async () => {
  for (const wrong of ['payment', 'refund']) {
    const fixture = collectorFixture();
    if (wrong === 'payment') fixture.payments[0].testMode = false;
    else fixture.refunds.push({ id: 'refund-1', paymentId: 'payment-1', status: 'succeeded', testMode: false, pspAmountDetails: { amount: '19.00', currency: 'USD' } });
    const result = await collectWaffoReconciliation(fixture.dependencies, scope);
    assert.equal(result.report.status, 'issues');
    assert.ok(result.collectionIssues.some(issue => issue.code === `provider_${wrong}_scope_mismatch`));
  }
});

test('Waffo collector excludes failed and pending payments from successful-payment evidence', async () => {
  const fixture = collectorFixture();
  fixture.payments.push({ ...fixture.payments[0], id: 'failed-payment', status: 'failed' }, { ...fixture.payments[0], id: 'pending-payment', status: 'pending' });
  const result = await collectWaffoReconciliation(fixture.dependencies, scope, { pageSize: 1 });
  assert.equal(result.report.status, 'pass', JSON.stringify(result.report.issues));
  assert.deepEqual(result.snapshot.successfulPayments.records.map(payment => payment.paymentId), ['payment-1']);
  assert.ok(fixture.trace.queries.filter(query => query.field === 'refunds').every(query => query.variables.paymentId === 'payment-1'));
});

test('Waffo reconciliation CLI requires bounded scope and separate report and snapshot paths', async () => {
  const valid = ['--environment', 'test', '--store', 'store-fixture', '--order', 'order-1', '--out', '/tmp/offline-report.json'];
  assert.deepEqual(parseWaffoReconciliationArgs([...valid, '--order', 'order-1']).orderIds, ['order-1']);
  for (const args of [[], valid.slice(2), [...valid, '--environment', 'prod'], [...valid, '--snapshot-out', '/tmp/offline-report.json']]) assert.throws(() => parseWaffoReconciliationArgs(args));
  await assert.rejects(runWaffoReconciliationCli([]));
  const marker = 'SYNTHETIC_SECRET_MUST_NOT_APPEAR';
  const child = spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/reconcile-waffo.ts', '--unsupported', marker], { cwd: process.cwd(), env: { PATH: process.env.PATH }, encoding: 'utf8' });
  assert.equal(child.status, 2); assert.ok(!`${child.stdout}${child.stderr}`.includes(marker));
  assert.match(child.stderr, /Reconciliation could not start/);
});
