import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import type { WebhookEvent } from '@waffo/pancake-ts';
import { WaffoBillingStore, parseUsdCents, type VerifiedWaffoOrder } from '../server/waffo-billing-store';
import { verifyWaffoEvent, outstandingWaffoOrders } from '../api/_lib/waffo';
import stripeCheckout from '../api/billing/_handlers/checkout';
import paypalCheckout from '../api/billing/_handlers/paypal-checkout';
import dodoCheckout from '../api/billing/_handlers/dodo-checkout';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PLANS } from '../src/config/plans';
import { JobStore } from '../server/job-store';
import { test } from './harness';

type RecordData = Record<string, any>;
/** Writes are staged and committed together; a rejected transaction leaves no changes.
 * The queue models Firestore's serializable outcome for concurrent transactions. */
class MemoryFirestore {
  records = new Map<string, RecordData>();
  failWritePath = '';
  private queue: Promise<unknown> = Promise.resolve();
  seed(path: string, data: RecordData) { this.records.set(path, structuredClone(data)); }
  read(path: string) { return structuredClone(this.records.get(path)); }
  entries(collection: string) { return [...this.records.entries()].filter(([path]) => path.startsWith(`${collection}/`)); }
  doc(path: string) {
    return {
      path, id: path.split('/').at(-1),
      get: async () => this.snapshot(path, this.records),
      create: async (data: RecordData) => {
        if (this.records.has(path)) throw new Error('Already exists');
        this.records.set(path, structuredClone(data));
      },
    };
  }
  private snapshot(path: string, records: Map<string, RecordData>) {
    return { exists: records.has(path), id: path.split('/').at(-1), data: () => structuredClone(records.get(path)) };
  }
  runTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T> {
    const transaction = this.queue.then(async () => {
      const staged = new Map([...this.records].map(([key, data]) => [key, structuredClone(data)]));
      const write = (ref: {path: string}, data: RecordData, create: boolean) => {
        if (this.failWritePath && ref.path.startsWith(this.failWritePath)) throw new Error('Injected transaction failure');
        if (create && staged.has(ref.path)) throw new Error('Already exists');
        if (!create && !staged.has(ref.path)) throw new Error('Missing document');
        staged.set(ref.path, create ? structuredClone(data) : { ...staged.get(ref.path), ...structuredClone(data) });
      };
      const result = await operation({
        get: async (ref: {path: string}) => this.snapshot(ref.path, staged),
        create: (ref: {path: string}, data: RecordData) => write(ref, data, true),
        update: (ref: {path: string}, data: RecordData) => write(ref, data, false),
      });
      this.records = staged;
      return result;
    });
    this.queue = transaction.catch(() => undefined);
    return transaction;
  }
}

async function fixture() {
  const db = new MemoryFirestore();
  db.seed('users/alice', { tier: 'free', credits: 10, bonusCredits: 17 });
  db.seed('users/bob', { tier: 'free', credits: 8, bonusCredits: 3 });
  const store = new WaffoBillingStore(db as unknown as Firestore);
  const intent = await store.createIntent({ uid: 'alice', plan: 'pro', productId: 'product-pro', environment: 'prod' });
  const order: VerifiedWaffoOrder = {
    id: 'order-1', storeId: 'store-fixture', testMode: false, status: 'active',
    merchantProvidedBuyerIdentity: 'alice', orderMerchantExternalId: intent.id,
    subscriptionProduct: { id: 'product-pro' }, billingPeriod: 'monthly', currentPeriodNumber: 1,
    currentPeriodEnd: '2027-01-01T00:00:00.000Z',
  };
  const event = (changes: RecordData = {}, data: RecordData = {}): WebhookEvent => ({
    id: 'delivery-1', eventId: 'payment-1', eventType: 'subscription.payment_succeeded',
    timestamp: new Date().toISOString(), storeId: 'store-fixture', storeName: 'Offline fixture', mode: 'prod',
    ...changes,
    data: {
      orderId: order.id, merchantProvidedBuyerIdentity: 'alice', orderMerchantExternalId: intent.id,
      buyerEmail: 'alice@example.invalid', currency: 'USD', amount: '19.00', chargedAmount: '19.00',
      taxAmount: '0', productName: 'Pro', paymentId: 'payment-1', paymentStatus: 'succeeded', periodNumber: 1,
      ...data,
    },
  } as WebhookEvent);
  return { db, store, intent, order, event };
}

test('Waffo checkout intent persists the server-owned buyer, product and environment', async () => {
  const { store, intent } = await fixture();
  const stored = await store.readIntent(intent.id);
  assert.equal(stored?.uid, 'alice'); assert.equal(stored?.productId, 'product-pro');
  assert.equal(stored?.environment, 'prod'); assert.equal(stored?.plan, 'pro');
});

test('Waffo concurrent checkout retries reuse one pending intent per account', async () => {
  const { db, store, intent } = await fixture();
  const attempts = await Promise.all(Array.from({ length: 8 }, () => store.createIntent({ uid: 'alice', plan: 'pro', productId: 'product-pro', environment: 'prod' })));
  assert.ok(attempts.every(value => value.id === intent.id));
  assert.equal(db.entries('waffo_checkout_intents').length, 1);
});

test('Waffo concurrent different-plan checkout attempts permit only one pending checkout', async () => {
  const { db, store } = await fixture();
  const attempts = await Promise.allSettled((['pro', 'team'] as const).map(plan => store.createIntent({ uid: 'bob', plan, productId: `product-${plan}`, environment: 'prod' })));
  assert.equal(attempts.filter(value => value.status === 'fulfilled').length, 1);
  const refused = attempts.find(value => value.status === 'rejected');
  assert.equal(refused?.status === 'rejected' && refused.reason.status, 409);
  assert.equal(db.entries('waffo_checkout_intents').length, 2);
});

test('Waffo pending checkout expires after 31 minutes and paid subscriptions reject another checkout', async () => {
  const { db, store, intent, order, event } = await fixture();
  await assert.rejects(store.createIntent({ uid: 'alice', plan: 'team', productId: 'product-team', environment: 'prod' }));
  const originalNow = Date.now;
  try {
    Date.now = () => intent.createdAt + 31 * 60_000 + 1;
    const replacement = await store.createIntent({ uid: 'alice', plan: 'team', productId: 'product-team', environment: 'prod' });
    assert.notEqual(replacement.id, intent.id);
    assert.equal(db.entries('waffo_checkout_intents').length, 2);
  } finally { Date.now = originalNow; }
  await store.apply(event(), order);
  await assert.rejects(store.createIntent({ uid: 'alice', plan: 'pro', productId: 'product-pro', environment: 'prod' }));
});

test('Waffo underpaid Pro and Team payments cannot grant the advertised allowance', async () => {
  for (const plan of ['pro', 'team'] as const) {
    const { db, store, intent, order, event } = await fixture();
    db.seed(`waffo_checkout_intents/${intent.id}`, { ...intent, plan });
    const before = structuredClone([...db.records]);
    await assert.rejects(store.apply(event({}, { chargedAmount: ((PLANS[plan].priceUsd * 100 - 1) / 100).toFixed(2) }), order));
    assert.deepEqual([...db.records], before);
  }
});

test('Waffo parallel deliveries of one payment grant once and write one ledger entry', async () => {
  const { db, store, order, event } = await fixture();
  const results = await Promise.all(Array.from({ length: 8 }, () => store.apply(event(), order)));
  assert.equal(results.filter(result => result.granted).length, 1);
  assert.equal(db.read('users/alice').credits, PLANS.pro.monthlyCredits);
  assert.equal(db.entries('credit_ledger').length, 1); assert.equal(db.entries('billing_orders').length, 1);
  assert.equal(db.read('users/alice').bonusCredits, 17);
});

test('Waffo different delivery ids and payment aliases cannot refill a consumed period', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event(), order);
  db.seed('users/alice', { ...db.read('users/alice'), credits: 31 });
  await store.apply(event({ id: 'delivery-2' }), order);
  await store.apply(event({ id: 'delivery-3', eventId: 'payment-alias' }, { paymentId: 'payment-alias' }), order);
  assert.equal(db.read('users/alice').credits, 31);
  assert.equal(db.entries('credit_ledger').length, 1);
});

test('Waffo buyer, product and environment mismatches never mutate either account', async () => {
  for (const variant of ['buyer', 'product', 'order-environment', 'event-environment'] as const) {
    const { db, store, order, event } = await fixture();
    const before = structuredClone([...db.records]);
    const modified = { ...order,
      ...(variant === 'buyer' ? { merchantProvidedBuyerIdentity: 'bob' } : {}),
      ...(variant === 'product' ? { subscriptionProduct: { id: 'different-product' } } : {}),
      ...(variant === 'order-environment' ? { testMode: true } : {}),
    };
    await assert.rejects(store.apply(event(variant === 'event-environment' ? { mode: 'test' } : {}), modified), undefined, variant);
    assert.deepEqual([...db.records], before, variant);
  }
});

test('Waffo subscription activation and renewal lifecycle events never grant credits', async () => {
  const { db, store, order, event } = await fixture();
  for (const eventType of ['subscription.activated', 'subscription.renewed']) {
    await store.apply(event({ id: eventType, eventId: eventType, eventType }), order);
    assert.equal(db.read('users/alice').credits, 10);
  }
  assert.equal(db.entries('credit_ledger').length, 0);
});

test('Waffo shared entity ids do not collide across activation, payment and repeated cancel lifecycles', async () => {
  const { db, store, order, event } = await fixture();
  const steps = [
    ['subscription.activated', 'order-1-activated-100', 'active'],
    ['subscription.payment_succeeded', 'payment-1', 'active'],
    ['subscription.canceling', 'order-1-cancel-200', 'canceling'],
    ['subscription.uncanceled', 'order-1-uncanceled-300', 'active'],
    ['subscription.canceling', 'order-1-cancel-400', 'canceling'],
  ] as const;
  for (const [eventType, eventId, status] of steps) {
    const notification = event({ id: order.id, eventType, eventId });
    const result = await store.apply(notification, { ...order, status });
    assert.equal(result.status, 'processed', eventType); assert.equal(result.processed, true, eventId);
    assert.equal(db.read('users/alice').waffoSubscriptionStatus, status);
    const beforeReplay = structuredClone([...db.records]);
    assert.equal((await store.apply(notification, { ...order, status })).status, 'duplicate');
    assert.deepEqual([...db.records], beforeReplay);
  }
  assert.equal(db.entries('waffo_events').length, steps.length);
  assert.equal(db.entries('credit_ledger').length, 1);
  assert.equal(db.read('users/alice').credits, PLANS.pro.monthlyCredits);
});

test('Waffo legacy entity-id receipts deduplicate only matching event type and business event id', async () => {
  for (const variant of ['same-event', 'different-type', 'different-business-id'] as const) {
    const { db, store, order, event } = await fixture();
    const eventId = 'order-1-cancel-200', eventType = 'subscription.canceling';
    const legacyPath = `waffo_events/${createHash('sha256').update(order.id).digest('hex')}`;
    db.seed(legacyPath, {
      eventId: order.id, type: variant === 'different-type' ? 'subscription.activated' : eventType,
      businessEventId: variant === 'different-business-id' ? 'order-1-cancel-100' : eventId,
      orderId: order.id, status: 'processed', processedAt: Date.now(),
    });
    const before = structuredClone([...db.records]);
    const result = await store.apply(event({ id: order.id, eventType, eventId }), { ...order, status: 'canceling' });
    if (variant === 'same-event') {
      assert.equal(result.status, 'duplicate'); assert.deepEqual([...db.records], before);
    } else {
      assert.equal(result.status, 'processed', variant);
      assert.equal(db.read('users/alice').waffoSubscriptionStatus, 'canceling');
      assert.equal(db.entries('waffo_events').length, 2);
    }
  }
});

test('Waffo missing business event identity is rejected without any receipt or account mutation', async () => {
  const { db, store, order, event } = await fixture();
  const before = structuredClone([...db.records]);
  await assert.rejects(store.apply(event({ eventId: '' }), order), (error: unknown) => (error as { code?: string }).code === 'waffo_invalid_event');
  assert.deepEqual([...db.records], before);
});

test('Waffo full refund claws back the paid period remainder and preserves bonus credits', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event(), order);
  db.seed('users/alice', { ...db.read('users/alice'), credits: 42 });
  const refund = event({ id: 'refund-delivery', eventId: 'refund-1', eventType: 'refund.succeeded' }, {
    refundId: 'refund-1', refundedAmount: '19.00', originalChargedAmount: '19.00', refundStatus: 'succeeded',
  });
  await store.apply(refund, order);
  assert.equal(db.read('users/alice').credits, 0); assert.equal(db.read('users/alice').bonusCredits, 17);
  const count = db.entries('credit_ledger').length;
  await store.apply({ ...refund, id: 'refund-redelivery' }, order);
  assert.equal(db.entries('credit_ledger').length, count);
});

test('Waffo refund of an unknown payment never guesses the latest paid order', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event(), order);
  const before = db.read('users/alice');
  await assert.rejects(store.apply(event({ id: 'unmatched-refund', eventId: 'refund-unknown', eventType: 'refund.succeeded' }, {
    paymentId: 'unknown-payment', refundId: 'refund-unknown', refundedAmount: '19.00', originalChargedAmount: '19.00',
  }), order), (error: unknown) => (error as { code?: string }).code === 'waffo_payment_missing');
  assert.deepEqual(db.read('users/alice'), before);
  assert.equal(db.entries('credit_ledger').length, 1);
});

test('Waffo USD amount parsing rejects rounding, exponent, signs and unsafe integers', () => {
  assert.equal(parseUsdCents('19.00'), 1900); assert.equal(parseUsdCents('0.1'), 10);
  for (const value of ['19.001', '1e2', '-1.00', '+19', ' 19.00', '01.00', 'NaN', '90071992547410', 19, undefined]) {
    assert.throws(() => parseUsdCents(value));
  }
});

test('Waffo partial refunds accumulate exactly once and excess refunds roll back', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event(), order);
  db.seed('users/alice', { ...db.read('users/alice'), credits: 25 });
  const refund = (id: string, amount: string) => event({ id, eventId: id, eventType: 'refund.succeeded' }, { refundedAmount: amount });
  await store.apply(refund('partial-1', '9.00'), order);
  assert.equal(db.read('users/alice').credits, 25);
  await store.apply({ ...refund('partial-1', '9.00'), id: 'partial-redelivery' }, order);
  const beforeExcess = structuredClone([...db.records]);
  await assert.rejects(store.apply(refund('excess', '11.00'), order));
  assert.deepEqual([...db.records], beforeExcess);
  await store.apply(refund('partial-2', '10.00'), order);
  assert.equal(db.read('users/alice').credits, 0); assert.equal(db.read('users/alice').bonusCredits, 17);
});

test('Waffo cancellation preserves paid access until the verified paid period ends', async () => {
  const originalNow = Date.now;
  try {
    for (const expired of [false, true]) {
      const cancellationTime = originalNow(), paidEnd = cancellationTime + (expired ? -60_000 : 86_400_000);
      const currentPeriodEnd = new Date(paidEnd).toISOString();
      Date.now = () => paidEnd - 60_000;
      const { db, store, order, event } = await fixture();
      await store.apply(event(), { ...order, currentPeriodEnd });
      Date.now = () => cancellationTime;
      await store.apply(event({ id: 'canceled', eventId: 'canceled', eventType: 'subscription.canceled' }, { currentPeriodEnd }), { ...order, status: 'canceled', currentPeriodEnd });
      assert.equal(db.read('users/alice').tier, expired ? 'free' : 'pro');
      assert.equal(db.read('users/alice').credits, PLANS.pro.monthlyCredits);
      assert.equal(db.read('users/alice').bonusCredits, 17);
    }
  } finally { Date.now = originalNow; }
});

test('Waffo cancellation effective one hour earlier never shortens the canonical paid period', async () => {
  const originalNow = Date.now;
  const paidEnd = Date.parse('2026-12-22T04:06:23Z');
  const cancelEffective = Date.parse('2026-12-22T03:06:23Z');
  try {
    Date.now = () => cancelEffective - 60_000;
    const { db, store, order, event } = await fixture();
    const canonical = { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() };
    await store.apply(event(), canonical);
    await store.apply(event({ id: order.id, eventId: 'order-1-cancel-hour-difference', eventType: 'subscription.canceling' }, {
      currentPeriodEnd: new Date(cancelEffective).toISOString(), cancelEffectiveAt: new Date(cancelEffective).toISOString(),
    }), { ...canonical, status: 'canceling' });
    assert.equal(db.read('users/alice').currentPeriodEnd, paidEnd / 1000);
    assert.equal(db.read('users/alice').tier, 'pro');
    const jobs = new JobStore(db as unknown as Firestore);
    for (const [index, instant] of [cancelEffective, cancelEffective + 30 * 60_000, paidEnd - 1].entries()) {
      Date.now = () => instant;
      db.seed('users/alice', { ...db.read('users/alice'), credits: 4, bonusCredits: 0, activeJobs: 0, dayUsed: 0 });
      const claimed = await jobs.claim('alice', `paid-hour-window-${index}`, { image_ids: [] });
      assert.equal(claimed.job.paidWithBonus, false); assert.equal(db.read('users/alice').credits, 3);
    }
  } finally { Date.now = originalNow; }
});

test('Waffo paid access works one second before expiry and stops exactly at the canonical UTC boundary', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    const db = new MemoryFirestore();
    const jobs = generationAccount(db, { currentPeriodEnd: paidEnd / 1000 });
    Date.now = () => paidEnd - 1000;
    await jobs.claim('alice', 'one-second-before-expiry', { image_ids: [] });
    assert.equal(db.read('users/alice').credits, 11);
    db.seed('users/alice', { ...db.read('users/alice'), activeJobs: 0 });
    const before = structuredClone([...db.records]);
    Date.now = () => paidEnd;
    await assert.rejects(jobs.claim('alice', 'exact-expiry', { image_ids: [] }), (error: unknown) => (error as { status?: number }).status === 402);
    assert.deepEqual([...db.records], before);
  } finally { Date.now = originalNow; }
});

test('Waffo renewal lifecycle without payment cannot extend paid access and the later payment grants once', async () => {
  const originalNow = Date.now, oldEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    Date.now = () => oldEnd - 1000;
    const { db, store, order, event } = await fixture();
    await store.apply(event(), { ...order, currentPeriodEnd: new Date(oldEnd).toISOString() });
    db.seed('users/alice', { ...db.read('users/alice'), credits: 41 });
    Date.now = () => oldEnd + 1000;
    const nextOrder = { ...order, currentPeriodNumber: 2, currentPeriodEnd: '2027-01-22T04:06:23Z' };
    await store.apply(event({ id: order.id, eventId: 'order-1-renewed-period-2', eventType: 'subscription.renewed' }, { periodNumber: 2 }), nextOrder);
    assert.equal(db.read('users/alice').credits, 41);
    assert.equal(db.read('users/alice').currentPeriodEnd, oldEnd / 1000);
    const jobs = new JobStore(db as unknown as Firestore);
    db.seed('users/alice', { ...db.read('users/alice'), bonusCredits: 0, activeJobs: 0 });
    await assert.rejects(jobs.claim('alice', 'renewal-not-yet-paid', { image_ids: [] }), (error: unknown) => (error as { status?: number }).status === 402);
    const paid = event({ id: 'payment-2', eventId: 'payment-2' }, { paymentId: 'payment-2', periodNumber: 2 });
    await store.apply(paid, nextOrder);
    assert.equal(db.read('users/alice').credits, 500);
    assert.equal(db.read('users/alice').currentPeriodEnd, Date.parse(nextOrder.currentPeriodEnd) / 1000);
    db.seed('users/alice', { ...db.read('users/alice'), credits: 499 });
    assert.equal((await store.apply(paid, nextOrder)).status, 'duplicate');
    assert.equal(db.read('users/alice').credits, 499);
  } finally { Date.now = originalNow; }
});

test('Waffo a paid next-period event with a lagging expired canonical period remains retryable', async () => {
  const originalNow = Date.now, oldEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    Date.now = () => oldEnd - 1000;
    const { db, store, order, event } = await fixture();
    const oldOrder = { ...order, currentPeriodEnd: new Date(oldEnd).toISOString(), currentPeriodNumber: 1 };
    await store.apply(event(), oldOrder);
    db.seed('users/alice', { ...db.read('users/alice'), credits: 0 });
    Date.now = () => oldEnd + 1000;
    const nextPayment = event({ id: 'payment-2', eventId: 'payment-2' }, { paymentId: 'payment-2', periodNumber: 2 });
    const before = structuredClone([...db.records]);
    await assert.rejects(store.apply(nextPayment, oldOrder));
    assert.deepEqual([...db.records], before, 'a lagging order snapshot must not consume the paid-event receipt');
    const result = await store.apply(nextPayment, { ...oldOrder, currentPeriodNumber: 2, currentPeriodEnd: '2027-01-22T04:06:23Z' });
    assert.equal(result.granted, true); assert.equal(db.read('users/alice').credits, 500);
    db.seed('users/alice', { ...db.read('users/alice'), credits: 499 });
    assert.equal((await store.apply(nextPayment, { ...oldOrder, currentPeriodNumber: 2, currentPeriodEnd: '2027-01-22T04:06:23Z' })).status, 'duplicate');
    assert.equal(db.read('users/alice').credits, 499);
  } finally { Date.now = originalNow; }
});

test('Waffo a lagging canonical cancellation remains retryable until its paid renewal snapshot catches up', async () => {
  const originalNow = Date.now, oldEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    Date.now = () => oldEnd - 1000;
    const { db, store, order, event } = await fixture();
    const oldOrder = { ...order, currentPeriodEnd: new Date(oldEnd).toISOString(), currentPeriodNumber: 1 };
    await store.apply(event(), oldOrder);
    Date.now = () => oldEnd + 1000;
    const nextOrder = { ...order, currentPeriodNumber: 2, currentPeriodEnd: '2027-01-22T04:06:23Z' };
    await store.apply(event({ id: 'payment-2', eventId: 'payment-2' }, { paymentId: 'payment-2', periodNumber: 2 }), nextOrder);
    const before = structuredClone([...db.records]);
    const cancellation = event({ id: order.id, eventId: 'cancel-request-overlapping-renewal', eventType: 'subscription.canceled' }, { periodNumber: undefined });
    await assert.rejects(store.apply(cancellation, { ...oldOrder, status: 'canceled' }), (error: unknown) => (error as { status?: number }).status === 409);
    assert.deepEqual([...db.records], before, 'a lagging canonical snapshot must not consume the cancellation event');
    assert.equal((await store.apply(cancellation, { ...nextOrder, status: 'canceled' })).status, 'processed');
    const account = db.read('users/alice');
    assert.equal(account.tier, 'pro'); assert.equal(account.credits, 500);
    assert.equal(account.currentPeriodEnd, Date.parse(nextOrder.currentPeriodEnd) / 1000);
    assert.equal(account.waffoSubscriptionStatus, 'canceled');
    assert.equal((await store.apply(cancellation, { ...nextOrder, status: 'canceled' })).status, 'duplicate');
  } finally { Date.now = originalNow; }
});

test('Waffo early canceled or missing canonical dates cannot shorten a verified paid-through boundary', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z'), earlyEnd = Date.parse('2026-12-22T03:06:23Z');
  try {
    for (const canonicalEnd of [new Date(earlyEnd).toISOString(), null]) {
      Date.now = () => earlyEnd - 1000;
      const { db, store, order, event } = await fixture();
      await store.apply(event(), { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() });
      Date.now = () => earlyEnd + 1000;
      await store.apply(event({ id: order.id, eventId: 'early-canceled-before-paid-through', eventType: 'subscription.canceled' }, { currentPeriodEnd: new Date(earlyEnd).toISOString() }), { ...order, status: 'canceled', currentPeriodEnd: canonicalEnd });
      assert.equal(db.read('users/alice').currentPeriodEnd, paidEnd / 1000);
      assert.equal(db.read('users/alice').tier, 'pro');
      db.seed('users/alice', { ...db.read('users/alice'), activeJobs: 0, dayUsed: 0 });
      const jobs = new JobStore(db as unknown as Firestore);
      Date.now = () => paidEnd - 1;
      const result = await jobs.claim('alice', 'early-canceled-paid-access', { image_ids: [] });
      assert.equal(result.job.paidWithBonus, false);
    }
  } finally { Date.now = originalNow; }
});

test('Waffo confirmed immediate cancellation truncates service at its effective instant without extending paid time', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    for (const effective of [paidEnd - 3_600_000, paidEnd + 3_600_000]) {
      Date.now = () => paidEnd - 7_200_000;
      const { db, store, order, event } = await fixture();
      await store.apply(event(), { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() });
      Date.now = () => effective;
      await store.apply(event({ id: order.id, eventId: 'confirmed-immediate-cancel', eventType: 'subscription.canceled' }), {
        ...order, status: 'canceled', currentPeriodEnd: new Date(paidEnd).toISOString(),
        cancelEffectiveMode: 'now', cancelEffectiveAt: new Date(effective).toISOString(),
      });
      const account = db.read('users/alice');
      assert.equal(account.currentPeriodEnd, Math.min(paidEnd, effective) / 1000);
      assert.equal(account.tier, 'free'); assert.equal(account.credits, 500);
      db.seed('users/alice', { ...account, bonusCredits: 0, activeJobs: 0 });
      await assert.rejects(new JobStore(db as unknown as Firestore).claim('alice', 'after-confirmed-now', { image_ids: [] }), (error: unknown) => (error as { status?: number }).status === 402);
    }
  } finally { Date.now = originalNow; }
});

test('Waffo canceling with immediate mode cannot stop service before canonical cancellation confirms', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z'), effective = paidEnd - 3_600_000;
  try {
    Date.now = () => effective - 1000;
    const { db, store, order, event } = await fixture();
    await store.apply(event(), { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() });
    Date.now = () => effective + 1000;
    await store.apply(event({ id: order.id, eventId: 'unconfirmed-immediate-cancel', eventType: 'subscription.canceling' }), {
      ...order, status: 'canceling', currentPeriodEnd: new Date(effective).toISOString(),
      cancelEffectiveMode: 'now', cancelEffectiveAt: new Date(effective).toISOString(),
    });
    assert.equal(db.read('users/alice').currentPeriodEnd, paidEnd / 1000);
    assert.equal(db.read('users/alice').tier, 'pro');
    db.seed('users/alice', { ...db.read('users/alice'), activeJobs: 0, dayUsed: 0 });
    assert.equal((await new JobStore(db as unknown as Firestore).claim('alice', 'unconfirmed-now-access', { image_ids: [] })).job.paidWithBonus, false);
  } finally { Date.now = originalNow; }
});

test('Waffo confirmed immediate cancellation without a valid effective timestamp remains retryable', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z'), effective = paidEnd - 3_600_000;
  try {
    for (const invalid of [undefined, null, 'not-a-date', '2026-12-22T03:06:23', '2026-02-31T03:06:23Z']) {
      Date.now = () => effective - 1000;
      const { db, store, order, event } = await fixture();
      await store.apply(event(), { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() });
      Date.now = () => effective;
      const cancel = event({ id: order.id, eventId: 'immediate-cancel-needs-effective-time', eventType: 'subscription.canceled' });
      const before = structuredClone([...db.records]);
      await assert.rejects(store.apply(cancel, {
        ...order, status: 'canceled', currentPeriodEnd: new Date(paidEnd).toISOString(), cancelEffectiveMode: 'now', cancelEffectiveAt: invalid,
      }), (error: unknown) => (error as { status?: number }).status === 409);
      assert.deepEqual([...db.records], before);
      const correctedOrder = { ...order, status: 'canceled', currentPeriodEnd: new Date(paidEnd).toISOString(), cancelEffectiveMode: 'now' as const, cancelEffectiveAt: new Date(effective).toISOString() };
      assert.equal((await store.apply(cancel, correctedOrder)).status, 'processed');
      assert.equal(db.read('users/alice').currentPeriodEnd, effective / 1000);
      assert.equal((await store.apply(cancel, correctedOrder)).status, 'duplicate');
    }
  } finally { Date.now = originalNow; }
});

test('Waffo canonical period-end mode preserves the one-hour paid window despite immediate-mode event metadata', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z'), effective = paidEnd - 3_600_000;
  try {
    Date.now = () => effective - 1000;
    const { db, store, order, event } = await fixture();
    await store.apply(event(), { ...order, currentPeriodEnd: new Date(paidEnd).toISOString() });
    Date.now = () => effective;
    await store.apply(event({ id: order.id, eventId: 'canonical-period-end-cancel', eventType: 'subscription.canceled' }, {
      cancelEffectiveMode: 'now', cancelEffectiveAt: new Date(effective).toISOString(),
    }), { ...order, status: 'canceled', currentPeriodEnd: new Date(paidEnd).toISOString(), cancelEffectiveMode: 'period_end', cancelEffectiveAt: new Date(effective).toISOString() });
    assert.equal(db.read('users/alice').currentPeriodEnd, paidEnd / 1000);
    assert.equal(db.read('users/alice').tier, 'pro');
  } finally { Date.now = originalNow; }
});

test('Waffo explicit old-period cancellation is ignored without changing a newer paid allowance', async () => {
  const originalNow = Date.now, now = Date.parse('2026-12-22T04:06:24Z');
  try {
    Date.now = () => now;
    const { db, store, order, event } = await fixture();
    const nextOrder = { ...order, currentPeriodNumber: 2, currentPeriodEnd: '2027-01-22T04:06:23Z' };
    await store.apply(event({ id: 'payment-2', eventId: 'payment-2' }, { paymentId: 'payment-2', periodNumber: 2 }), nextOrder);
    const before = db.read('users/alice');
    const result = await store.apply(event({ id: order.id, eventId: 'explicit-old-cancellation', eventType: 'subscription.canceled' }, { periodNumber: 1 }), { ...order, status: 'canceled', currentPeriodNumber: 1, currentPeriodEnd: '2026-12-22T04:06:23Z' });
    assert.equal(result.granted, false); assert.deepEqual(db.read('users/alice'), before);
  } finally { Date.now = originalNow; }
});

test('Waffo UTC and UTC plus eight paid-through timestamps represent the same exact expiry instant', async () => {
  const originalNow = Date.now, paidEnd = Date.parse('2026-12-22T04:06:23Z');
  try {
    for (const currentPeriodEnd of ['2026-12-22T04:06:23Z', '2026-12-22T12:06:23+08:00']) {
      Date.now = () => paidEnd - 1000;
      const { db, store, order, event } = await fixture();
      await store.apply(event(), { ...order, currentPeriodEnd });
      assert.equal(db.read('users/alice').currentPeriodEnd, paidEnd / 1000);
      db.seed('users/alice', { ...db.read('users/alice'), bonusCredits: 0, activeJobs: 0 });
      const jobs = new JobStore(db as unknown as Firestore);
      await jobs.claim('alice', 'offset-before-expiry', { image_ids: [] });
      Date.now = () => paidEnd;
      await assert.rejects(jobs.claim('alice', 'offset-exact-expiry', { image_ids: [] }), (error: unknown) => (error as { status?: number }).status === 402);
    }
  } finally { Date.now = originalNow; }
});

test('Waffo failed transaction leaves no partial order, event, ledger or balance update', async () => {
  const { db, store, order, event } = await fixture();
  const before = structuredClone([...db.records]);
  db.failWritePath = 'credit_ledger/';
  await assert.rejects(store.apply(event(), order), /Injected transaction failure/);
  assert.deepEqual([...db.records], before);
  db.failWritePath = '';
  await store.apply(event(), order);
  assert.equal(db.read('users/alice').credits, PLANS.pro.monthlyCredits);
  assert.equal(db.entries('credit_ledger').length, 1);
});

test('Waffo a late old-period payment or refund cannot overwrite the newer allowance', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event({ id: 'period-2', eventId: 'payment-2' }, { paymentId: 'payment-2', periodNumber: 2 }), { ...order, currentPeriodNumber: 2 });
  db.seed('users/alice', { ...db.read('users/alice'), credits: 77 });
  await store.apply(event(), order);
  assert.equal(db.read('users/alice').credits, 77);
  await store.apply(event({ id: 'old-refund', eventId: 'old-refund', eventType: 'refund.succeeded' }, {
    refundId: 'old-refund', refundedAmount: '19.00', originalChargedAmount: '19.00',
  }), order);
  assert.equal(db.read('users/alice').credits, 77); assert.equal(db.read('users/alice').bonusCredits, 17);
});

test('Waffo replacement subscription survives retired subscription payments, lifecycle and refunds', async () => {
  const originalNow = Date.now;
  try {
  const { db, store, intent, order, event } = await fixture();
  const expiredEnd = new Date(Date.now() + 60_000).toISOString();
  await store.apply(event(), { ...order, currentPeriodEnd: expiredEnd });
  Date.now = () => intent.createdAt + 31 * 60_000 + 1;
  await store.apply(event({ id: 'old-cancel', eventId: 'old-cancel', eventType: 'subscription.canceled' }, { currentPeriodEnd: expiredEnd }), { ...order, status: 'canceled', currentPeriodEnd: expiredEnd });
  const newIntent = await store.createIntent({ uid: 'alice', plan: 'team', productId: 'product-team', environment: 'prod' });
  const newOrder = { ...order, id: 'order-replacement', orderMerchantExternalId: newIntent.id, subscriptionProduct: { id: 'product-team' } };
  await store.apply(event({ id: 'new-payment', eventId: 'new-payment' }, {
    orderId: newOrder.id, orderMerchantExternalId: newIntent.id, paymentId: 'new-payment', chargedAmount: '79.00',
  }), newOrder);
  db.seed('users/alice', { ...db.read('users/alice'), credits: 123 });
  for (const eventType of ['subscription.activated', 'subscription.renewed', 'subscription.canceled']) {
    await store.apply(event({ id: `retired-${eventType}`, eventId: eventType, eventType }), order);
  }
  await store.apply(event({ id: 'retired-payment', eventId: 'retired-payment' }, { paymentId: 'retired-payment', periodNumber: 2 }), { ...order, currentPeriodNumber: 2 });
  await store.apply(event({ id: 'retired-refund', eventId: 'retired-refund', eventType: 'refund.succeeded' }, { refundedAmount: '19.00' }), order);
  const account = db.read('users/alice');
  assert.equal(account.credits, 123); assert.equal(account.tier, 'team');
  assert.equal(account.waffoSubscriptionId, newOrder.id); assert.equal(account.bonusCredits, 17);
  } finally { Date.now = originalNow; }
});

test('Waffo stale canceled notification cannot downgrade a canonical active subscription', async () => {
  const { db, store, order, event } = await fixture();
  await store.apply(event(), order);
  const before = db.read('users/alice');
  await store.apply(event({ id: 'late-canceled', eventId: 'late-canceled', eventType: 'subscription.canceled' }, {
    currentPeriodEnd: new Date(Date.now() - 60_000).toISOString(),
  }), order);
  assert.deepEqual(db.read('users/alice'), before);
});

test('Waffo successful payment requires a verified paid period end and never revives an expired period', async () => {
  const { db, store, order, event } = await fixture();
  const before = structuredClone([...db.records]);
  await assert.rejects(store.apply(event(), { ...order, currentPeriodEnd: undefined }), (error: unknown) => (error as { code?: string }).code === 'waffo_period_end_missing');
  assert.deepEqual([...db.records], before);
  const result = await store.apply(event(), { ...order, currentPeriodEnd: new Date(Date.now() - 60_000).toISOString() });
  assert.equal(result.granted, false); assert.equal(db.read('users/alice').credits, 10);
});

function generationAccount(db: MemoryFirestore, fields: RecordData = {}) {
  const now = new Date();
  const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
  db.seed('users/alice', {
    tier: 'pro', credits: 12, bonusCredits: 0, activeJobs: 0, dayUsed: 0,
    quotaMonth: previousMonth, quotaDay: now.toISOString().slice(0, 10),
    waffoSubscriptionId: 'order-generation', subscriptionStatus: 'active',
    currentPeriodEnd: Math.floor(Date.now() / 1000) + 86_400, ...fields,
  });
  return new JobStore(db as unknown as Firestore);
}

test('Waffo generation across a calendar month consumes the paid balance without refilling it', async () => {
  const db = new MemoryFirestore(), jobs = generationAccount(db);
  await jobs.claim('alice', 'new-calendar-month', { image_ids: [] });
  assert.equal(db.read('users/alice').credits, 11);
  assert.equal(db.entries('credit_ledger').length, 1);
  assert.equal(db.entries('credit_ledger')[0][1].bucket, 'monthly');
  assert.equal(db.entries('credit_ledger')[0][1].units, -1);
});

test('Waffo expired paid credits without bonus refuse generation without any writes', async () => {
  const db = new MemoryFirestore();
  const jobs = generationAccount(db, { currentPeriodEnd: Math.floor(Date.now() / 1000) - 60 });
  const before = structuredClone([...db.records]);
  await assert.rejects(jobs.claim('alice', 'expired-paid', { image_ids: [] }), (error: unknown) => (error as { status?: number }).status === 402);
  assert.deepEqual([...db.records], before);
  assert.equal(db.entries('credit_ledger').length, 0);
});

test('Waffo expired subscriptions spend only bonus credits under free daily and concurrency limits', async () => {
  const db = new MemoryFirestore();
  const expired = { currentPeriodEnd: Math.floor(Date.now() / 1000) - 60, bonusCredits: 5 };
  const jobs = generationAccount(db, expired);
  const result = await jobs.claim('alice', 'expired-bonus', { image_ids: [] });
  assert.equal(result.job.paidWithBonus, true);
  assert.equal(db.read('users/alice').credits, 12); assert.equal(db.read('users/alice').bonusCredits, 4);
  assert.equal(db.entries('credit_ledger')[0][1].bucket, 'bonus');
  for (const [fields, code] of [[{ dayUsed: PLANS.free.dailyGenerationLimit }, 'daily_limit'], [{ activeJobs: PLANS.free.maxConcurrentJobs }, 'concurrency_limit']] as const) {
    generationAccount(db, { ...expired, ...fields });
    const before = structuredClone([...db.records]);
    await assert.rejects(jobs.claim('alice', code, { image_ids: [] }), (error: unknown) => (error as { code?: string }).code === code);
    assert.deepEqual([...db.records], before);
  }
});

test('Existing provider generation retains the existing calendar-month allowance behavior', async () => {
  const db = new MemoryFirestore();
  const jobs = generationAccount(db, { waffoSubscriptionId: '', stripeSubscriptionId: 'stripe-existing' });
  await jobs.claim('alice', 'existing-provider-month', { image_ids: [] });
  assert.equal(db.read('users/alice').credits, PLANS.pro.monthlyCredits - 1);
});

test('Waffo enabled checkout blocks all legacy new-purchase lanes before database or provider access', async () => {
  const settings = { WAFFO_MERCHANT_ID: 'offline-merchant', WAFFO_PRIVATE_KEY: 'offline-unused', WAFFO_STORE_ID: 'store-fixture', WAFFO_CHECKOUT_ENABLED: 'true', WAFFO_PRODUCT_PRO: 'pro-fixture', WAFFO_PRODUCT_TEAM: 'team-fixture', FIREBASE_WEB_API_KEY: 'offline-auth' };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  const oldFetch = globalThis.fetch;
  Object.assign(process.env, settings);
  let authCalls = 0;
  globalThis.fetch = async input => {
    assert.ok(String(input).startsWith('https://identitytoolkit.googleapis.com/v1/accounts:lookup?'), 'only authentication may make a request');
    authCalls++;
    return new Response(JSON.stringify({ users: [{ localId: 'alice' }] }), { status: 200 });
  };
  try {
    for (const handler of [stripeCheckout, paypalCheckout, dodoCheckout]) {
      const answer = { status: 0, body: undefined as unknown };
      const res = { status(code: number) { answer.status = code; return this; }, json(body: unknown) { answer.body = body; return this; } };
      await handler({ method: 'POST', headers: { authorization: 'Bearer offline-token' }, body: { plan: 'pro' } } as VercelRequest, res as unknown as VercelResponse);
      assert.equal(answer.status, 409); assert.equal((answer.body as { code: string }).code, 'use_waffo_checkout');
    }
    assert.equal(authCalls, 3);
  } finally {
    globalThis.fetch = oldFetch;
    for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});

test('Waffo authoritative outstanding-order lookup scopes the buyer and fails closed on GraphQL errors', async () => {
  const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const settings = { WAFFO_MERCHANT_ID: `MER_${'a'.repeat(22)}`, WAFFO_PRIVATE_KEY: keys.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(), WAFFO_STORE_ID: 'store-fixture' };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  const oldFetch = globalThis.fetch;
  Object.assign(process.env, settings);
  let reply: unknown = { data: { subscriptionOrders: [{ id: 'late-webhook-order', status: 'active' }] } };
  globalThis.fetch = async (_url, init) => {
    const sent = JSON.parse(String(init?.body));
    assert.deepEqual(sent.variables, { storeId: 'store-fixture', uid: 'alice' });
    for (const state of ['active', 'pending', 'trialing', 'canceling', 'past_due']) assert.ok(sent.query.includes(`"${state}"`));
    return new Response(JSON.stringify(reply), { status: 200 });
  };
  try {
    assert.equal((await outstandingWaffoOrders('alice'))[0].id, 'late-webhook-order');
    reply = { data: { subscriptionOrders: [] } };
    assert.deepEqual(await outstandingWaffoOrders('alice'), []);
    for (const invalid of [{ data: null }, { data: { subscriptionOrders: [] }, errors: [{ message: 'offline GraphQL failure' }] }]) {
      reply = invalid;
      await assert.rejects(outstandingWaffoOrders('alice'), (error: unknown) => (error as { code?: string }).code === 'waffo_order_lookup_failed');
    }
  } finally {
    globalThis.fetch = oldFetch;
    for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});

test('Waffo RSA webhook verification rejects tampering, missing signature and wrong store or environment', async () => {
  const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const settings = {
    WAFFO_ENVIRONMENT: 'prod', WAFFO_STORE_ID: 'store-fixture',
    WAFFO_WEBHOOK_PROD_PUBLIC_KEY: keys.publicKey.export({ type: 'spki', format: 'pem' }).toString(),
  };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  Object.assign(process.env, settings);
  const { event } = await fixture();
  const signed = (value: WebhookEvent, offsetMs = 0) => {
    const raw = JSON.stringify(value), timestamp = String(Date.now() + offsetMs);
    const signature = sign('RSA-SHA256', Buffer.from(`${timestamp}.${raw}`), keys.privateKey).toString('base64');
    return { raw, header: `t=${timestamp},v1=${signature}` };
  };
  try {
    const valid = signed(event());
    assert.equal((await verifyWaffoEvent(valid.raw, valid.header)).id, 'delivery-1');
    await assert.rejects(async () => verifyWaffoEvent(valid.raw + ' ', valid.header));
    await assert.rejects(async () => verifyWaffoEvent(valid.raw, ''));
    for (const offset of [-46 * 60_000, 2 * 60_000]) {
      const staleOrFuture = signed(event(), offset);
      await assert.rejects(async () => verifyWaffoEvent(staleOrFuture.raw, staleOrFuture.header));
    }
    for (const changes of [{ mode: 'test' }, { storeId: 'another-store' }]) {
      const invalid = signed(event(changes));
      await assert.rejects(async () => verifyWaffoEvent(invalid.raw, invalid.header));
    }
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
