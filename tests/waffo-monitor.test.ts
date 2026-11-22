import assert from 'node:assert/strict';
import type { Firestore } from 'firebase-admin/firestore';
import { discoverWaffoOrders, runBillingMonitor, type BillingMail, type MonitorInspection } from '../server/waffo-monitor';
import type { WaffoReconciliationGraphQL } from '../server/waffo-reconciliation-collector';
import { test } from './harness';
import monitorHandler, { monitorAuthorized } from '../api/billing/_handlers/waffo-monitor';
import mailWorker from '../workers/studio-mailer/src/index.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type Data = Record<string, any>;
class MonitorDatabase {
  records = new Map<string, Data>();
  writes: string[] = [];
  private queue: Promise<unknown> = Promise.resolve();
  private snapshot(path: string, source = this.records) { return { exists: source.has(path), id: path.split('/').at(-1), data: () => structuredClone(source.get(path)) }; }
  private allowed(path: string) { assert.match(path, /^billing_monitor_(?:state|incidents)\//, 'monitor cannot write customer accounts, receipts or ledgers'); }
  doc(path: string) {
    return { path, get: async () => this.snapshot(path), set: async (data: Data, options?: {merge?: boolean}) => {
      this.allowed(path); this.writes.push(path);
      this.records.set(path, options?.merge ? { ...this.records.get(path), ...structuredClone(data) } : structuredClone(data));
    } };
  }
  collection(collection: string) {
    const filters: Array<[string, unknown]> = [];
    let max = Infinity;
    const query = {
      where(field: string, comparison: string, value: unknown) { assert.equal(comparison, '=='); filters.push([field, value]); return query; },
      orderBy() { return query; }, offset() { return query; }, limit(value: number) { max = value; return query; },
      get: async () => {
        const docs = [...this.records].filter(([path, data]) => path.startsWith(`${collection}/`) && filters.every(([field, value]) => data[field] === value)).slice(0, max).map(([path, data]) => ({ id: path.split('/').at(-1), data: () => structuredClone(data) }));
        return { docs, size: docs.length, empty: !docs.length };
      },
    };
    return query;
  }
  runTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T> {
    const pending = this.queue.then(async () => {
      const staged = new Map([...this.records].map(([path, data]) => [path, structuredClone(data)]));
      const writes: string[] = [];
      const result = await operation({
        get: async (ref: {path: string}) => this.snapshot(ref.path, staged),
        set: (ref: {path: string}, data: Data, options?: {merge?: boolean}) => {
          this.allowed(ref.path); writes.push(ref.path);
          staged.set(ref.path, options?.merge ? { ...staged.get(ref.path), ...structuredClone(data) } : structuredClone(data));
        },
      });
      this.records = staged; this.writes.push(...writes); return result;
    });
    this.queue = pending.catch(() => undefined);
    return pending;
  }
}

const scope = { environment: 'test' as const, storeId: 'store-fixture' };
const failure = (code = 'missing_payment', refs = ['order-1']) => ({ code, severity: 'error' as const, message: 'Readable diagnosis', refs });
function monitorFixture() {
  const db = new MonitorDatabase(), mails: BillingMail[] = [];
  db.records.set('users/alice', { credits: 499 }); db.records.set('credit_ledger/existing', { units: -1 });
  const clock = { value: 1_800_000_000_000 };
  const inspection: MonitorInspection = { issues: [failure()], orderCount: 1, complete: true };
  const dependencies = {
    db: db as unknown as Firestore,
    graphql: { query: async () => { throw new Error('Injected inspection must not call the provider'); } } as WaffoReconciliationGraphQL,
    inspect: async () => structuredClone(inspection), now: () => clock.value,
    sendMail: async (mail: BillingMail) => { mails.push(structuredClone(mail)); },
  };
  return { db, mails, clock, inspection, dependencies };
}
function discoveryFixture(records: Data[]) {
  const offsets: number[] = [];
  const graphql = { async query({ query, variables }: { query: string; variables?: Data }) {
    assert.match(query, /subscriptionOrders/); assert.equal(variables?.storeId, scope.storeId);
    offsets.push(variables!.offset);
    return { data: { subscriptionOrders: structuredClone(records.slice(variables!.offset, variables!.offset + variables!.limit)) } };
  } } as unknown as WaffoReconciliationGraphQL;
  return { graphql, offsets };
}

test('Waffo monitor alerts once, suppresses equivalent reordered issues and never mutates money records', async () => {
  const fixture = monitorFixture();
  fixture.inspection.issues.push(failure('missing_ledger', ['period-1', 'order-1']));
  const first = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(first.status, 'issues'); assert.equal(first.notified, true); assert.equal(fixture.mails.length, 1);
  fixture.inspection.issues.reverse(); fixture.inspection.issues.forEach(issue => issue.refs.reverse());
  fixture.clock.value += 60_000;
  const repeated = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(repeated.notified, false); assert.equal(fixture.mails.length, 1);
  assert.deepEqual(fixture.db.records.get('users/alice'), { credits: 499 });
  assert.deepEqual(fixture.db.records.get('credit_ledger/existing'), { units: -1 });
  assert.ok(fixture.db.writes.length > 0); assert.ok(fixture.db.writes.every(path => /^billing_monitor_(state|incidents)\//.test(path)));
});

test('Waffo monitor repeats an unresolved alert at the daily boundary and alerts immediately for changed incidents', async () => {
  const fixture = monitorFixture();
  await runBillingMonitor(fixture.dependencies, scope);
  fixture.clock.value += 86_400_000 - 1;
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, false);
  fixture.clock.value += 1;
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, true);
  assert.equal(fixture.mails.length, 2);
  fixture.inspection.issues = [failure('renewal_past_due')];
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, true);
  assert.equal(fixture.mails.length, 3); assert.match(fixture.mails[2].text, /renewal_past_due/);
});

test('Waffo monitor mail failures are not marked sent and retry on the next sweep', async () => {
  const fixture = monitorFixture(); let calls = 0;
  fixture.dependencies.sendMail = async mail => { calls++; if (calls === 1) throw new Error('SECRET_MAIL_PROVIDER_DETAIL'); fixture.mails.push(mail); };
  await assert.rejects(runBillingMonitor(fixture.dependencies, scope), error => !String(error).includes('SECRET_MAIL_PROVIDER_DETAIL'));
  assert.equal(fixture.mails.length, 0);
  assert.equal(fixture.db.records.get('billing_monitor_state/test')?.lastNotifiedAt, undefined);
  const retried = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(retried.notified, true); assert.equal(calls, 2); assert.equal(fixture.mails.length, 1);
});

test('Waffo monitor sends one recovery after a notified incident and suppresses healthy repeats', async () => {
  const fixture = monitorFixture();
  fixture.inspection.issues = [];
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, false);
  fixture.inspection.issues = [failure()];
  await runBillingMonitor(fixture.dependencies, scope);
  fixture.inspection.issues = [];
  const recovered = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(recovered.status, 'pass'); assert.equal(recovered.notified, true);
  assert.match(fixture.mails.at(-1)!.subject, /RECOVERED/);
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, false);
  assert.equal(fixture.mails.length, 2);
});

test('Waffo monitor retries a failed recovery email instead of silently marking recovery delivered', async () => {
  const fixture = monitorFixture();
  await runBillingMonitor(fixture.dependencies, scope);
  fixture.inspection.issues = [];
  const successfulMail = fixture.dependencies.sendMail;
  fixture.dependencies.sendMail = async () => { throw new Error('Recovery delivery failed'); };
  await assert.rejects(runBillingMonitor(fixture.dependencies, scope));
  fixture.dependencies.sendMail = successfulMail;
  const retried = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(retried.notified, true); assert.match(fixture.mails.at(-1)!.subject, /RECOVERED/);
  assert.equal(fixture.mails.length, 2);
});

test('Waffo monitor concurrent sweeps inspect and notify only once while the lease is held', async () => {
  const fixture = monitorFixture(); let enter!: () => void, release!: () => void;
  const entered = new Promise<void>(resolve => { enter = resolve; });
  const blocked = new Promise<void>(resolve => { release = resolve; });
  let inspections = 0;
  fixture.dependencies.inspect = async () => { inspections++; enter(); await blocked; return fixture.inspection; };
  const first = runBillingMonitor(fixture.dependencies, scope);
  await entered;
  const second = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(second.status, 'busy'); assert.equal(second.notified, false);
  release(); assert.equal((await first).notified, true);
  assert.equal(inspections, 1); assert.equal(fixture.mails.length, 1);
});

test('Waffo monitor a slow sweep superseded after lease expiry cannot send a duplicate alert', async () => {
  const fixture = monitorFixture(); let entered!: () => void, release!: () => void;
  const started = new Promise<void>(resolve => { entered = resolve; });
  const block = new Promise<void>(resolve => { release = resolve; });
  const staleRun = runBillingMonitor({ ...fixture.dependencies, inspect: async () => { entered(); await block; return fixture.inspection; } }, scope).catch(() => undefined);
  await started;
  fixture.clock.value = Number(fixture.db.records.get('billing_monitor_state/test')!.leaseUntil) + 1;
  assert.equal((await runBillingMonitor(fixture.dependencies, scope)).notified, true);
  release(); await staleRun;
  assert.equal(fixture.mails.length, 1, 'a superseded worker must check ownership before sending');
});

test('Waffo monitor an expired lease permits a later sweep and inspection failures become sanitized alerts', async () => {
  const fixture = monitorFixture();
  fixture.db.records.set('billing_monitor_state/test', { leaseOwner: 'abandoned', leaseUntil: fixture.clock.value - 1 });
  fixture.dependencies.inspect = async () => { throw new Error('SYNTHETIC_SECRET_API_ERROR'); };
  const result = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(result.status, 'incomplete'); assert.equal(result.notified, true);
  assert.match(fixture.mails[0].text, /monitor_execution_failed/);
  assert.ok(!JSON.stringify([...fixture.db.records]).includes('SYNTHETIC_SECRET_API_ERROR'));
  assert.ok(!fixture.mails[0].text.includes('SYNTHETIC_SECRET_API_ERROR'));
});

test('Waffo monitor incomplete coverage cannot report pass even when no issue rows are available', async () => {
  const fixture = monitorFixture(); fixture.inspection.issues = []; fixture.inspection.complete = false;
  const result = await runBillingMonitor(fixture.dependencies, scope);
  assert.equal(result.status, 'incomplete'); assert.equal(result.notified, true);
  assert.match(fixture.mails[0].text, /Coverage complete: false/);
});

test('Waffo monitor discovers every provider page including orders absent from Firestore', async () => {
  const fixture = discoveryFixture([
    { id: 'order-1', storeId: scope.storeId, testMode: true, status: 'active' },
    { id: 'missed-webhook-order', storeId: scope.storeId, testMode: true, status: 'past_due' },
  ]);
  const result = await discoverWaffoOrders(fixture.graphql, scope, { pageSize: 1 });
  assert.equal(result.complete, true); assert.deepEqual(result.issues, []);
  assert.deepEqual(result.orderIds, ['order-1', 'missed-webhook-order']); assert.deepEqual(fixture.offsets, [0, 1, 2]);
});

test('Waffo monitor discovery rejects foreign stores, environments and unsafe order ids', async () => {
  for (const change of [{ storeId: 'foreign' }, { testMode: false }, { id: 'unsafe/order' }]) {
    const fixture = discoveryFixture([{ id: 'order-1', storeId: scope.storeId, testMode: true, status: 'active', ...change }]);
    const result = await discoverWaffoOrders(fixture.graphql, scope);
    assert.equal(result.complete, false); assert.deepEqual(result.orderIds, []);
    assert.ok(result.issues.some(issue => issue.code === 'monitor_order_scope_mismatch' && issue.severity === 'error'));
  }
});

test('Waffo monitor discovery caps and duplicated provider pages remain incomplete', async () => {
  const row = { id: 'order-1', storeId: scope.storeId, testMode: true, status: 'active' };
  const capped = await discoverWaffoOrders(discoveryFixture([row]).graphql, scope, { pageSize: 1, maxPages: 1 });
  assert.equal(capped.complete, false); assert.ok(capped.issues.some(issue => issue.code === 'monitor_discovery_page_limit'));
  const repeated = await discoverWaffoOrders(discoveryFixture([row, row]).graphql, scope, { pageSize: 1 });
  assert.equal(repeated.complete, false); assert.deepEqual(repeated.orderIds, ['order-1']);
  assert.ok(repeated.issues.some(issue => issue.code === 'monitor_duplicate_discovery'));
});

test('Waffo monitor discovery provider errors produce generic incomplete evidence without leaking secrets', async () => {
  for (const reply of ['throw', 'errors', 'missing']) {
    const graphql = { query: async () => {
      if (reply === 'throw') throw new Error('SECRET_DISCOVERY_DETAIL');
      return reply === 'errors' ? { data: null, errors: [{ message: 'SECRET_DISCOVERY_DETAIL' }] } : { data: {} };
    } } as unknown as WaffoReconciliationGraphQL;
    const result = await discoverWaffoOrders(graphql, scope);
    assert.equal(result.complete, false); assert.ok(result.issues.some(issue => issue.code === 'monitor_discovery_failed'));
    assert.ok(!JSON.stringify(result).includes('SECRET_DISCOVERY_DETAIL'));
  }
});

test('Waffo monitor default inspection alerts on a provider renewal past due', async () => {
  const fixture = monitorFixture();
  const order = { id: 'past-due-order', storeId: scope.storeId, testMode: true, status: 'past_due', merchantProvidedBuyerIdentity: 'alice', orderMerchantExternalId: `wpi_${'a'.repeat(32)}`, subscriptionProduct: { id: 'product-pro' }, billingPeriod: 'monthly', currentPeriodNumber: 1, currentPeriodEnd: new Date(fixture.clock.value + 86_400_000).toISOString() };
  const graphql = { query: async ({ query }: {query: string}) => {
    if (query.includes('subscriptionOrders(')) return { data: { subscriptionOrders: [order] } };
    if (query.includes('subscriptionOrder(')) return { data: { subscriptionOrder: order } };
    return { data: { payments: [] } };
  } } as unknown as WaffoReconciliationGraphQL;
  const { inspect: _inspection, ...dependencies } = fixture.dependencies;
  const result = await runBillingMonitor({ ...dependencies, graphql }, scope);
  assert.equal(result.status, 'issues'); assert.equal(result.notified, true);
  assert.match(fixture.mails[0].text, /renewal_past_due/);
});

test('Waffo monitor HTTP authorization rejects absent, wrong, short and malformed credentials before any service access', async () => {
  const secret = 'offline-monitor-' + 's'.repeat(40);
  assert.equal(monitorAuthorized(`Bearer ${secret}`, secret), true);
  for (const value of ['', 'Bearer wrong', secret, `bearer ${secret}`, `Bearer ${secret} `]) assert.equal(monitorAuthorized(value, secret), false);
  assert.equal(monitorAuthorized('Bearer short', 'short'), false); assert.equal(monitorAuthorized('Bearer ', ''), false);
  const previous = process.env.BILLING_MONITOR_SECRET, oldFetch = globalThis.fetch;
  process.env.BILLING_MONITOR_SECRET = secret;
  let externalCalls = 0;
  globalThis.fetch = async () => { externalCalls++; throw new Error('No external access permitted'); };
  try {
    for (const [method, authorization, status] of [['GET', '', 401], ['POST', 'Bearer wrong', 401], ['DELETE', `Bearer ${secret}`, 405]] as const) {
      const reply = { status: 0, headers: {} as Record<string, string> };
      const res = { status(code: number) { reply.status = code; return this; }, json() { return this; }, setHeader(name: string, value: string) { reply.headers[name] = value; } };
      await monitorHandler({ method, headers: { authorization } } as VercelRequest, res as unknown as VercelResponse);
      assert.equal(reply.status, status); assert.equal(reply.headers['Cache-Control'], 'no-store');
    }
    assert.equal(externalCalls, 0);
  } finally {
    globalThis.fetch = oldFetch;
    if (previous === undefined) delete process.env.BILLING_MONITOR_SECRET; else process.env.BILLING_MONITOR_SECRET = previous;
  }
});

function workerFixture() {
  const sent: Data[] = [];
  const env = { STUDIO_SHARED_SECRET: 'offline-studio-secret', STUDIO_NOTIFY_TO: 'fixed@example.invalid', STUDIO_FROM: 'alerts@example.invalid', BILLING_MONITOR_SECRET: 'offline-monitor-secret', BILLING_MONITOR_URL: 'https://example.invalid/api/billing/waffo-monitor', STUDIO_EMAIL: { send: async (mail: Data) => { sent.push(structuredClone(mail)); } } };
  const request = (payload: Data, secret = env.STUDIO_SHARED_SECRET) => new Request('https://worker.example.invalid', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-studio-secret': secret }, body: JSON.stringify(payload) });
  return { sent, env, request };
}

test('Waffo billing mail Worker requires its shared secret and only sends to the configured inbox', async () => {
  const fixture = workerFixture();
  const payload = { kind: 'billing-alert', incidentId: 'offline-incident', subject: '[DLSS5 billing] TEST\r\nBcc: attacker@example.invalid', text: 'x'.repeat(20_000), to: 'attacker@example.invalid', from: 'spoof@example.invalid', replyTo: 'attacker@example.invalid' };
  for (const wrong of ['', 'wrong']) assert.equal((await mailWorker.fetch(fixture.request(payload, wrong), fixture.env)).status, 403);
  assert.equal(fixture.sent.length, 0);
  const response = await mailWorker.fetch(fixture.request(payload), fixture.env);
  assert.equal(response.status, 200); assert.equal((await response.json() as {ok: boolean}).ok, true);
  assert.equal(fixture.sent.length, 1); assert.equal(fixture.sent[0].to, fixture.env.STUDIO_NOTIFY_TO);
  assert.equal(fixture.sent[0].replyTo, fixture.env.STUDIO_NOTIFY_TO); assert.equal(fixture.sent[0].from.email, fixture.env.STUDIO_FROM);
  assert.ok(!/[\r\n]/.test(fixture.sent[0].subject)); assert.equal(fixture.sent[0].text.length, 16_000);
});

test('Waffo billing mail Worker rejects malformed alerts and reports email-service rejection without provider details', async () => {
  const fixture = workerFixture();
  for (const payload of [{ kind: 'billing-alert', subject: 'wrong-prefix', text: 'body', incidentId: 'id' }, { kind: 'billing-alert', subject: '[DLSS5 billing] Test', text: 'body' }]) assert.equal((await mailWorker.fetch(fixture.request(payload), fixture.env)).status, 400);
  fixture.env.STUDIO_EMAIL.send = async () => { throw new Error('SYNTHETIC_MAIL_SECRET'); };
  const response = await mailWorker.fetch(fixture.request({ kind: 'billing-alert', subject: '[DLSS5 billing] Test', text: 'body', incidentId: 'id' }), fixture.env);
  assert.equal(response.status, 502); assert.ok(!(await response.text()).includes('SYNTHETIC_MAIL_SECRET'));
});

test('Waffo independent scheduled watchdog emails on endpoint failure and stays quiet after a healthy check', async () => {
  const oldFetch = globalThis.fetch;
  try {
    for (const outcome of ['healthy', 'http-failure', 'invalid-json', 'network-failure', 'missing-config']) {
      const fixture = workerFixture(), tasks: Promise<unknown>[] = [];
      const environment = { ...fixture.env, ...(outcome === 'missing-config' ? { BILLING_MONITOR_SECRET: '' } : {}) };
      globalThis.fetch = async (input, init) => {
        assert.equal(input, fixture.env.BILLING_MONITOR_URL);
        assert.equal((init?.headers as Record<string, string>).authorization, `Bearer ${fixture.env.BILLING_MONITOR_SECRET}`);
        assert.match((init?.headers as Record<string, string>)['user-agent'], /DLSS5BillingMonitor\/1\.0/);
        assert.equal(init?.redirect, 'manual');
        if (outcome === 'network-failure') throw new Error('SECRET_WATCHDOG_PROVIDER_DETAIL');
        if (outcome === 'invalid-json') return new Response('invalid-json', { status: 200 });
        return Response.json({ ok: outcome === 'healthy' }, { status: outcome === 'http-failure' ? 503 : 200 });
      };
      await mailWorker.scheduled({}, environment, { waitUntil(task: Promise<unknown>) { tasks.push(task); } });
      await Promise.all(tasks);
      assert.equal(fixture.sent.length, outcome === 'healthy' ? 0 : 1, outcome);
      if (outcome !== 'healthy') {
        assert.equal(fixture.sent[0].to, fixture.env.STUDIO_NOTIFY_TO);
        assert.match(fixture.sent[0].subject, /MONITOR UNAVAILABLE/);
        assert.ok(!fixture.sent[0].text.includes('SECRET_WATCHDOG_PROVIDER_DETAIL'));
      }
    }
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo monitor probe rejects unauthenticated and non-GET requests without calling any backend', async () => {
  const oldFetch = globalThis.fetch, fixture = workerFixture(); let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Unauthorized probe must never fetch'); };
  try {
    for (const [method, authorization] of [['GET', ''], ['GET', 'Bearer wrong'], ['POST', `Bearer ${fixture.env.BILLING_MONITOR_SECRET}`], ['DELETE', `Bearer ${fixture.env.BILLING_MONITOR_SECRET}`]]) {
      const response = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe', { method, headers: { authorization } }), fixture.env);
      assert.equal(response.status, 403);
    }
    const unconfigured = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe', { headers: { authorization: 'Bearer ' } }), { ...fixture.env, BILLING_MONITOR_SECRET: '' });
    assert.equal(unconfigured.status, 403); assert.equal(calls, 0); assert.equal(fixture.sent.length, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo authenticated probe uses the fixed monitor target and explicit bot user agent without sending email', async () => {
  const oldFetch = globalThis.fetch, fixture = workerFixture(); let calls = 0;
  globalThis.fetch = async (input, init) => {
    calls++; assert.equal(input, fixture.env.BILLING_MONITOR_URL);
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('authorization'), `Bearer ${fixture.env.BILLING_MONITOR_SECRET}`);
    assert.match(headers.get('user-agent') || '', /DLSS5BillingMonitor\/1\.0/);
    assert.equal(init?.redirect, 'manual');
    return Response.json({ ok: true, status: 'pass', privateDetail: 'MUST_NOT_FORWARD_BACKEND_JSON' });
  };
  try {
    const response = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe?url=https%3A%2F%2Fattacker.example.invalid', { headers: { authorization: `Bearer ${fixture.env.BILLING_MONITOR_SECRET}` } }), fixture.env);
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true, status: 200 });
    assert.equal(calls, 1); assert.equal(fixture.sent.length, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo probe returns safe HTTP and edge diagnostics without forwarding blocked response bodies', async () => {
  const oldFetch = globalThis.fetch, fixture = workerFixture();
  const marker = 'SYNTHETIC_PRIVATE_EDGE_BODY';
  globalThis.fetch = async () => new Response(`<html>error code: 1010 ${marker}</html>`, { status: 403 });
  try {
    const response = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe', { headers: { authorization: `Bearer ${fixture.env.BILLING_MONITOR_SECRET}` } }), fixture.env);
    assert.equal(response.status, 502);
    const result = await response.json();
    assert.deepEqual(result, { ok: false, reason: 'endpoint_http_error', status: 403, edgeCode: '1010' });
    assert.ok(!JSON.stringify(result).includes(marker)); assert.ok(!JSON.stringify(result).includes(fixture.env.BILLING_MONITOR_SECRET));
    assert.equal(fixture.sent.length, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo scheduled watchdog includes the same safe edge diagnostics while withholding raw response bodies', async () => {
  const oldFetch = globalThis.fetch, fixture = workerFixture(), tasks: Promise<unknown>[] = [];
  globalThis.fetch = async (_input, init) => {
    assert.match(new Headers(init?.headers).get('user-agent') || '', /DLSS5BillingMonitor\/1\.0/);
    return new Response('Error code: 1010 SYNTHETIC_SECRET_EDGE_RESPONSE', { status: 403 });
  };
  try {
    await mailWorker.scheduled({}, fixture.env, { waitUntil(task: Promise<unknown>) { tasks.push(task); } });
    await Promise.all(tasks);
    assert.equal(fixture.sent.length, 1); assert.equal(fixture.sent[0].to, fixture.env.STUDIO_NOTIFY_TO);
    assert.match(fixture.sent[0].text, /"status":403/); assert.match(fixture.sent[0].text, /"edgeCode":"1010"/);
    assert.ok(!fixture.sent[0].text.includes('SYNTHETIC_SECRET_EDGE_RESPONSE'));
    assert.ok(!fixture.sent[0].text.includes(fixture.env.BILLING_MONITOR_SECRET));
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo Worker manually rejects monitor redirects without forwarding its authorization or following Location', async () => {
  const oldFetch = globalThis.fetch;
  try {
    for (const mode of ['probe', 'cron']) {
      const fixture = workerFixture(), tasks: Promise<unknown>[] = []; let calls = 0;
      globalThis.fetch = async (input, init) => {
        calls++; assert.equal(input, fixture.env.BILLING_MONITOR_URL);
        assert.equal(init?.redirect, 'manual', 'Cloudflare Workers cannot use redirect:error');
        return new Response('SYNTHETIC_PRIVATE_REDIRECT_BODY', { status: 302, headers: { Location: 'https://foreign.example.invalid/SYNTHETIC_PRIVATE_REDIRECT_LOCATION' } });
      };
      if (mode === 'probe') {
        const response = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe', { headers: { authorization: `Bearer ${fixture.env.BILLING_MONITOR_SECRET}` } }), fixture.env);
        assert.equal(response.status, 502);
        const diagnostic = await response.json() as {ok: boolean; status: number};
        assert.equal(diagnostic.ok, false); assert.equal(diagnostic.status, 302);
        assert.ok(!JSON.stringify(diagnostic).includes('SYNTHETIC_PRIVATE_REDIRECT'));
        assert.equal(fixture.sent.length, 0);
      } else {
        await mailWorker.scheduled({}, fixture.env, { waitUntil(task: Promise<unknown>) { tasks.push(task); } });
        await Promise.all(tasks);
        assert.equal(fixture.sent.length, 1); assert.match(fixture.sent[0].text, /"status":302/);
        assert.ok(!fixture.sent[0].text.includes('SYNTHETIC_PRIVATE_REDIRECT'));
      }
      assert.equal(calls, 1, 'never follow an authenticated backend redirect');
    }
  } finally { globalThis.fetch = oldFetch; }
});

test('Waffo Worker reports safe failure stage and category without exposing exception details', async () => {
  const oldFetch = globalThis.fetch;
  try {
    for (const category of ['redirect', 'signal', 'timeout', 'parse']) {
      const fixture = workerFixture();
      globalThis.fetch = async (_input, init) => {
        assert.equal(init?.redirect, 'manual');
        if (category === 'parse') return new Response('SYNTHETIC_PRIVATE_INVALID_JSON', { status: 200 });
        throw new TypeError(`${category} SYNTHETIC_PRIVATE_FETCH_ERROR`);
      };
      const response = await mailWorker.fetch(new Request('https://worker.example.invalid/billing-monitor-probe', { headers: { authorization: `Bearer ${fixture.env.BILLING_MONITOR_SECRET}` } }), fixture.env);
      assert.equal(response.status, 502);
      const diagnostic = await response.json() as {ok: boolean; stage: string; category: string; errorType: string};
      assert.equal(diagnostic.ok, false); assert.equal(diagnostic.stage, category === 'parse' ? 'parse' : 'fetch');
      assert.equal(diagnostic.category, category === 'parse' ? 'other' : category);
      assert.equal(diagnostic.errorType, category === 'parse' ? 'SyntaxError' : 'TypeError');
      assert.ok(!JSON.stringify(diagnostic).includes('SYNTHETIC_PRIVATE'));
    }
  } finally { globalThis.fetch = oldFetch; }
});

test('Existing Studio and runtime mail paths retain the fixed recipient and customer reply address', async () => {
  for (const kind of ['studio', 'runtime']) {
    const fixture = workerFixture();
    const response = await mailWorker.fetch(fixture.request({ kind, uid: 'offline-user', email: 'customer@example.invalid', machine: 'Offline machine', note: 'Offline request' }), fixture.env);
    assert.equal(response.status, 200); assert.equal(fixture.sent[0].to, fixture.env.STUDIO_NOTIFY_TO);
    assert.equal(fixture.sent[0].replyTo, 'customer@example.invalid');
    assert.match(fixture.sent[0].subject, kind === 'runtime' ? /DLSS runtime files request/ : /Studio request/);
    assert.match(fixture.sent[0].text, /Offline request/);
  }
});
