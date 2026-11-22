import type { Firestore } from 'firebase-admin/firestore';
import type { VerifiedWaffoOrder } from './waffo-billing-store.js';
import {
  reconcileWaffoSnapshot, type WaffoReconciliationIssue, type WaffoReconciliationReport,
  type WaffoReconciliationScope, type WaffoReconciliationSnapshot, type WaffoSnapshotDocument,
} from './waffo-reconciliation.js';

export type WaffoReconciliationGraphQL = {
  query<T>(params: { query: string; variables?: Record<string, unknown> }): Promise<{ data: T | null; errors?: unknown[] }>;
};
export type WaffoCollectorDependencies = { graphql: WaffoReconciliationGraphQL; db: Pick<Firestore, 'doc' | 'collection'> };
export type WaffoCollectorOptions = { pageSize?: number; maxPages?: number; now?: () => number };
export type WaffoCollectedReconciliation = { snapshot: WaffoReconciliationSnapshot; report: WaffoReconciliationReport; collectionIssues: WaffoReconciliationIssue[] };
type ProviderMoney = { amount?: string; currency?: string; display?: string };
type ProviderPayment = { id?: string; orderId?: string; status?: string; testMode?: boolean; periodNumber?: number | null; amount?: ProviderMoney | null; pspAmountDetails?: ProviderMoney | null };
type ProviderRefund = { id?: string; paymentId?: string; status?: string; testMode?: boolean; amount?: ProviderMoney | null; pspAmountDetails?: ProviderMoney | null };

const ORDER_QUERY = 'query($id:String!) { subscriptionOrder(id:$id) { id storeId testMode status merchantProvidedBuyerIdentity orderMerchantExternalId subscriptionProduct { id } billingPeriod currentPeriodEnd currentPeriodNumber cancelEffectiveAt cancelEffectiveMode } }';
const PAYMENT_QUERY = 'query($storeId:String!,$id:String!,$limit:Int,$offset:Int) { payments(storeId:$storeId,filter:{orderId:{eq:$id}},limit:$limit,offset:$offset) { id orderId status testMode periodNumber amount { amount currency display } pspAmountDetails { amount currency } } }';
const REFUND_QUERY = 'query($paymentId:String!,$limit:Int,$offset:Int) { refunds(filter:{paymentId:{eq:$paymentId}},limit:$limit,offset:$offset) { id paymentId status testMode amount { amount currency display } pspAmountDetails { amount currency } } }';
const userFields = [
  'tier', 'credits', 'bonusCredits', 'subscriptionStatus', 'currentPeriodEnd',
  'waffoSubscriptionId', 'waffoSubscriptionStatus', 'waffoAllowanceKey', 'waffoLastPeriod',
  'stripeSubscriptionId', 'stripeSubscriptionStatus', 'paypalSubscriptionId', 'paypalSubscriptionStatus',
  'dodoSubscriptionId', 'dodoSubscriptionStatus',
] as const;
const string = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
/** Actual PSP decimal display amount to cents, without snapshot-price fallbacks or floating point. */
function actualCents(value: unknown): number | null {
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const amount = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0'));
  return amount > 0n && amount <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(amount) : null;
}

/** Reads provider/Firestore snapshots only. No transaction, set, update, delete or repair API. */
export async function collectWaffoReconciliation(
  dependencies: WaffoCollectorDependencies, scope: WaffoReconciliationScope, options: WaffoCollectorOptions = {},
): Promise<WaffoCollectedReconciliation> {
  const pageSize = options.pageSize ?? 100;
  const maxPages = options.maxPages ?? 100;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100 || !Number.isSafeInteger(maxPages) || maxPages < 1 || maxPages > 1000) throw new Error('Invalid reconciliation pagination options');
  if (!['test', 'prod'].includes(scope.environment) || !string(scope.storeId) || !scope.orderIds.length || scope.orderIds.some(id => !string(id) || id.includes('/'))) throw new Error('Invalid reconciliation scope');
  const collectionIssues: WaffoReconciliationIssue[] = [];
  const issue = (code: string, message: string, ref: string, severity: 'error' | 'incomplete' = 'incomplete') => collectionIssues.push({ code, message, refs: [ref], severity });
  const snapshot: WaffoReconciliationSnapshot = {
    scope: { ...scope, orderIds: [...new Set(scope.orderIds)] }, capturedAt: (options.now ?? Date.now)(),
    orders: { complete: true, records: [] }, successfulPayments: { complete: true, records: [] }, successfulRefunds: { complete: true, records: [] },
    firestore: Object.fromEntries(['waffo_checkout_intents', 'waffo_payments', 'waffo_periods', 'waffo_refunds', 'billing_orders', 'credit_ledger', 'users'].map(name => [name, { complete: true, records: [] }])),
  };
  const graphqlPages = async <T>(query: string, variables: Record<string, unknown>, field: 'payments' | 'refunds', ref: string): Promise<{ complete: boolean; records: T[] }> => {
    const records: T[] = [];
    for (let page = 0; page < maxPages; page++) {
      try {
        const response = await dependencies.graphql.query<Record<string, T[]>>({ query, variables: { ...variables, limit: pageSize, offset: page * pageSize } });
        if (response.errors?.length || !Array.isArray(response.data?.[field])) throw new Error('Provider query incomplete');
        const batch = response.data[field];
        if (batch.length > pageSize) throw new Error('Provider ignored pagination limit');
        records.push(...batch);
        if (batch.length < pageSize) return { complete: true, records };
      } catch {
        issue('provider_collection_failed', 'Provider query failed or returned incomplete data; no API error details are included', ref);
        return { complete: false, records };
      }
    }
    issue('provider_page_limit', 'Provider pagination cap reached before scope coverage was complete', ref);
    return { complete: false, records };
  };
  const seenDocuments = new Map<string, Set<string>>();
  const append = (collection: keyof WaffoReconciliationSnapshot['firestore'], doc: WaffoSnapshotDocument) => {
    const seen = seenDocuments.get(collection) ?? new Set<string>();
    if (!seen.has(doc.id)) snapshot.firestore[collection]!.records.push(doc);
    seen.add(doc.id); seenDocuments.set(collection, seen);
  };
  const exactDocument = async (collection: 'users' | 'waffo_checkout_intents', id: string) => {
    if (!string(id) || id.includes('/')) {
      snapshot.firestore[collection]!.complete = false;
      issue('invalid_document_binding', 'Canonical document binding is missing or unsafe', collection);
      return;
    }
    try {
      const result = await dependencies.db.doc(`${collection}/${id}`).get();
      if (!result.exists) return; // Complete absence is diagnosed by the pure checker.
      const raw = result.data();
      if (!raw) throw new Error('Missing document data');
      const data = collection === 'users' ? Object.fromEntries(userFields.filter(field => raw[field] !== undefined).map(field => [field, raw[field]])) : raw;
      append(collection, { id, data });
    } catch {
      snapshot.firestore[collection]!.complete = false;
      issue('firestore_document_failed', 'Firestore document could not be read', `${collection}/${id}`);
    }
  };
  for (const orderId of snapshot.scope.orderIds) {
    let order: VerifiedWaffoOrder | null = null;
    try {
      const response = await dependencies.graphql.query<{ subscriptionOrder: VerifiedWaffoOrder | null }>({ query: ORDER_QUERY, variables: { id: orderId } });
      if (response.errors?.length || !response.data?.subscriptionOrder) throw new Error('Order missing');
      const candidate = response.data.subscriptionOrder;
      if (candidate.id !== orderId || candidate.storeId !== scope.storeId || typeof candidate.testMode !== 'boolean' || candidate.testMode !== (scope.environment === 'test')) {
        issue('provider_order_scope_mismatch', 'Canonical provider order does not match requested scope', `orders/${orderId}`, 'error');
        snapshot.orders.complete = false;
      } else {
        order = candidate;
        snapshot.orders.records.push(candidate);
        await exactDocument('waffo_checkout_intents', candidate.orderMerchantExternalId);
        await exactDocument('users', candidate.merchantProvidedBuyerIdentity);
      }
    } catch {
      snapshot.orders.complete = false;
      issue('provider_order_failed', 'Canonical provider order could not be read', `orders/${orderId}`);
    }
    const payments = await graphqlPages<ProviderPayment>(PAYMENT_QUERY, { storeId: scope.storeId, id: orderId }, 'payments', `payments/${orderId}`);
    snapshot.successfulPayments.complete &&= payments.complete && order !== null;
    for (const payment of payments.records) {
      // Failed, pending and authorized transactions are never evidence of paid allowances.
      if (payment.status !== 'succeeded') continue;
      if (!order || !string(payment.id) || payment.orderId !== orderId || typeof payment.testMode !== 'boolean' || payment.testMode !== (scope.environment === 'test')) {
        snapshot.successfulPayments.complete = false;
        snapshot.successfulRefunds.complete = false;
        issue('provider_payment_scope_mismatch', 'Successful payment identity/environment/order could not be verified', `payments/${orderId}`, 'error');
        continue;
      }
      const amount = actualCents(payment.pspAmountDetails?.amount);
      const currency = payment.pspAmountDetails?.currency;
      if (amount === null || !string(currency)) {
        snapshot.successfulPayments.complete = false;
        issue('payment_actual_amount_unconfirmed', 'Successful payment lacks a positive safe actual PSP amount/currency; snapshot price is not substituted', `payments/${payment.id}`);
      } else {
        snapshot.successfulPayments.records.push({ paymentId: payment.id, orderId, periodNumber: payment.periodNumber, amountCents: amount, currency, environment: scope.environment, storeId: scope.storeId });
      }
      // Refund pagination is required even when a successful charge amount is not yet known.
      const refunds = await graphqlPages<ProviderRefund>(REFUND_QUERY, { paymentId: payment.id }, 'refunds', `refunds/${payment.id}`);
      snapshot.successfulRefunds.complete &&= refunds.complete;
      for (const refund of refunds.records) {
        if (refund.status !== 'succeeded') continue;
        if (!string(refund.id) || refund.paymentId !== payment.id || typeof refund.testMode !== 'boolean' || refund.testMode !== (scope.environment === 'test')) {
          snapshot.successfulRefunds.complete = false;
          issue('provider_refund_scope_mismatch', 'Successful refund identity/environment/payment could not be verified', `refunds/${payment.id}`, 'error');
          continue;
        }
        const refundAmount = actualCents(refund.pspAmountDetails?.amount);
        const refundCurrency = refund.pspAmountDetails?.currency;
        if (refundAmount === null || !string(refundCurrency)) {
          snapshot.successfulRefunds.complete = false;
          issue('refund_actual_amount_unconfirmed', 'Successful refund lacks a positive safe actual PSP amount/currency; snapshot price is not substituted', `refunds/${refund.id}`);
          continue;
        }
        snapshot.successfulRefunds.records.push({ refundId: refund.id, paymentId: payment.id, orderId, amountCents: refundAmount, currency: refundCurrency, environment: scope.environment, storeId: scope.storeId });
      }
    }
    if (!payments.complete || !order) snapshot.successfulRefunds.complete = false;
    for (const collection of ['waffo_payments', 'waffo_periods', 'waffo_refunds', 'billing_orders', 'credit_ledger'] as const) {
      let exhausted = false;
      try {
        for (let page = 0; page < maxPages; page++) {
          const result = await dependencies.db.collection(collection).where('subscriptionId', '==', orderId).orderBy('__name__').limit(pageSize).offset(page * pageSize).get();
          for (const doc of result.docs) append(collection, { id: doc.id, data: doc.data() });
          if (result.docs.length < pageSize) { exhausted = true; break; }
        }
        if (!exhausted) {
          snapshot.firestore[collection]!.complete = false;
          issue('firestore_page_limit', 'Firestore pagination cap reached before scope coverage was complete', `${collection}/${orderId}`);
        }
      } catch {
        snapshot.firestore[collection]!.complete = false;
        issue('firestore_collection_failed', 'Firestore scoped collection could not be read completely', `${collection}/${orderId}`);
      }
    }
  }
  const report = reconcileWaffoSnapshot(snapshot);
  report.issues.push(...collectionIssues);
  report.complete = report.complete && !collectionIssues.some(item => item.severity === 'incomplete');
  report.status = report.issues.some(item => item.severity === 'error') ? 'issues' : report.complete ? 'pass' : 'incomplete';
  return { snapshot, report, collectionIssues };
}
