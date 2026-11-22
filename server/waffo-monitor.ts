import { createHash, randomUUID } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import { collectWaffoReconciliation, type WaffoReconciliationGraphQL } from './waffo-reconciliation-collector.js';
import type { WaffoReconciliationIssue } from './waffo-reconciliation.js';

type Scope = { storeId: string; environment: 'prod' | 'test'; reminderMs?: number };
export type MonitorInspection = { issues: WaffoReconciliationIssue[]; orderCount: number; complete: boolean };
export type BillingMail = { subject: string; text: string; incidentId: string };
type Dependencies = {
  db: Firestore; graphql: WaffoReconciliationGraphQL;
  sendMail: (mail: BillingMail) => Promise<void>; now?: () => number;
  inspect?: () => Promise<MonitorInspection>;
};
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const listQuery = 'query($storeId:String!,$limit:Int,$offset:Int) { subscriptionOrders(storeId:$storeId,limit:$limit,offset:$offset) { id storeId testMode status } }';
const issue = (code: string, ref: string, severity: 'error' | 'incomplete' = 'incomplete'): WaffoReconciliationIssue => ({ code, refs: [ref], severity, message: code });

/** Provider discovery is essential: a wholly missed webhook leaves no local order to scan. */
export async function discoverWaffoOrders(graphql: WaffoReconciliationGraphQL, scope: Scope, options: { pageSize?: number; maxPages?: number } = {}) {
  const pageSize = options.pageSize ?? 25, maxPages = options.maxPages ?? 20;
  if (!scope.storeId || !['prod', 'test'].includes(scope.environment) || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || !Number.isInteger(maxPages) || maxPages < 1 || maxPages > 100) throw new Error('Invalid monitor scope/pagination');
  const orders: Array<{ id: string; status: string }> = [], issues: WaffoReconciliationIssue[] = [];
  const seen = new Set<string>();
  for (let page = 0; page < maxPages; page++) {
    try {
      const response = await graphql.query<{ subscriptionOrders: Array<{ id: string; storeId: string; testMode: boolean; status: string }> }>({ query: listQuery, variables: { storeId: scope.storeId, limit: pageSize, offset: page * pageSize } });
      const batch = response.data?.subscriptionOrders;
      if (response.errors?.length || !Array.isArray(batch) || batch.length > pageSize) throw new Error('Incomplete provider response');
      for (const order of batch) {
        if (typeof order.id !== 'string' || !order.id || order.id.includes('/') || order.storeId !== scope.storeId || order.testMode !== (scope.environment === 'test') || typeof order.status !== 'string') {
          issues.push(issue('monitor_order_scope_mismatch', 'provider/orders', 'error')); continue;
        }
        if (seen.has(order.id)) { issues.push(issue('monitor_duplicate_discovery', order.id)); continue; }
        seen.add(order.id); orders.push({ id: order.id, status: order.status });
      }
      if (batch.length < pageSize) return { orders, orderIds: orders.map(o => o.id), issues, complete: issues.length === 0 };
    } catch {
      issues.push(issue('monitor_discovery_failed', 'provider/orders'));
      return { orders, orderIds: orders.map(o => o.id), issues, complete: false };
    }
  }
  issues.push(issue('monitor_discovery_page_limit', 'provider/orders'));
  return { orders, orderIds: orders.map(o => o.id), issues, complete: false };
}

export async function inspectWaffoBilling(deps: Pick<Dependencies, 'db' | 'graphql'>, scope: Scope, now = Date.now()): Promise<MonitorInspection> {
  const found = await discoverWaffoOrders(deps.graphql, scope);
  const issues = [...found.issues];
  let complete = found.complete;
  // Bound duration; hitting this cap is an alert, never a false healthy result.
  const ids = found.orderIds.slice(0, 50);
  if (found.orderIds.length > ids.length) { complete = false; issues.push(issue('monitor_order_capacity_exceeded', 'provider/orders')); }
  for (const id of ids) {
    const result = await collectWaffoReconciliation(deps, { ...scope, orderIds: [id] }, { maxPages: 10, now: () => now });
    issues.push(...result.report.issues); complete &&= result.report.complete;
  }
  for (const order of found.orders) if (order.status === 'past_due') issues.push(issue('renewal_past_due', order.id, 'error'));
  // Preserve processing failures even when payment discovery is temporarily behind.
  const failures = await deps.db.collection('waffo_webhook_failures').where('environment', '==', scope.environment).where('resolved', '==', false).limit(101).get();
  if (failures.size > 100) { complete = false; issues.push(issue('webhook_failure_capacity_exceeded', 'webhooks')); }
  for (const doc of failures.docs.slice(0, 100)) {
    const data = doc.data();
    if (data.storeId === scope.storeId && data.resolved !== true) issues.push(issue('webhook_processing_failed', String(data.orderId || doc.id), 'error'));
  }
  return { issues, orderCount: found.orderIds.length, complete };
}

/** Writes operational state only, never customer accounts/payment receipts/credit ledger. */
export async function runBillingMonitor(deps: Dependencies, scope: Scope) {
  const now = (deps.now ?? Date.now)();
  const state = deps.db.doc(`billing_monitor_state/${scope.environment}`), owner = randomUUID();
  const previous = await deps.db.runTransaction(async tx => {
    const data = (await tx.get(state)).data() ?? {};
    if (Number(data.leaseUntil) > now) return null;
    tx.set(state, { leaseOwner: owner, leaseUntil: now + 360_000, startedAt: now, storeId: scope.storeId }, { merge: true });
    return data;
  });
  if (previous === null) return { status: 'busy' as const, issueCount: 0, orderCount: 0, notified: false };
  let inspection: MonitorInspection;
  try { inspection = await (deps.inspect ? deps.inspect() : inspectWaffoBilling(deps, scope, now)); }
  catch { inspection = { issues: [issue('monitor_execution_failed', 'monitor')], orderCount: 0, complete: false }; }
  const { issues, orderCount, complete } = inspection;
  const status = issues.some(i => i.severity === 'error') ? 'issues' : complete && !issues.length ? 'pass' : 'incomplete';
  const fingerprint = hash(JSON.stringify(issues.map(i => ({ code: i.code, severity: i.severity, refs: [...i.refs].sort() })).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))));
  const incidentId = `${scope.environment}-${fingerprint}`;
  const recovery = status === 'pass' && previous.lastNotifiedStatus && previous.lastNotifiedStatus !== 'pass';
  const shouldNotify = recovery || (status !== 'pass' && (previous.lastNotifiedFingerprint !== fingerprint || now - Number(previous.lastNotifiedAt || 0) >= (scope.reminderMs ?? 86_400_000)));
  const lines = issues.slice(0, 50).map(i => `${i.severity}: ${i.code} — ${i.refs.join(', ')}`);
  let notified = false;
  try {
    if (shouldNotify) {
      const ownsLease = await deps.db.runTransaction(async tx => {
        const current = (await tx.get(state)).data() ?? {};
        return current.leaseOwner === owner && Number(current.leaseUntil) > (deps.now ?? Date.now)();
      });
      if (!ownsLease) return { status: 'busy' as const, issueCount: issues.length, orderCount, notified: false };
      await deps.sendMail({ incidentId, subject: recovery ? '[DLSS5 billing] RECOVERED' : `[DLSS5 billing] ${status.toUpperCase()}: ${issues.length} issue(s)`, text: [
        `Environment: ${scope.environment}`, `Store: ${scope.storeId}`, `Checked: ${new Date(now).toISOString()}`, `Orders: ${orderCount}`, `Coverage complete: ${complete}`, `Incident: ${incidentId}`, ...lines,
        'No automatic balance correction was performed. Follow docs/WAFFO-BILLING-OPERATIONS-20261122.md; verify the actual payment and replay its original signed webhook. Never grant from a checkout redirect or screenshot.',
      ].join('\n') });
      notified = true;
    }
    await deps.db.runTransaction(async tx => {
      const current = (await tx.get(state)).data() ?? {};
      if (current.leaseOwner !== owner) throw new Error('Monitor lease lost');
      tx.set(state, { leaseUntil: 0, completedAt: now, lastStatus: status, issueCount: issues.length, orderCount, complete, fingerprint,
        ...(notified ? { lastNotifiedAt: now, lastNotifiedFingerprint: fingerprint, lastNotifiedStatus: status, mailError: false } : {}),
      }, { merge: true });
      tx.set(deps.db.doc(`billing_monitor_incidents/${incidentId}`), { environment: scope.environment, storeId: scope.storeId, status, issues, orderCount, complete, checkedAt: now, ...(notified ? { notifiedAt: now } : {}) }, { merge: true });
    });
  } catch {
    // Failed mail is NOT marked sent. The next sweep retries it, while the external
    // scheduled Worker can independently mail an endpoint/infrastructure failure.
    await deps.db.runTransaction(async tx => {
      const current = (await tx.get(state)).data() ?? {};
      if (current.leaseOwner === owner) tx.set(state, { leaseUntil: 0, completedAt: now, lastStatus: status, mailError: true }, { merge: true });
    });
    throw new Error('Billing monitor notification or persistence failed');
  }
  return { status, issueCount: issues.length, orderCount, complete, notified };
}
