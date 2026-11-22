import { WaffoPancake, verifyWebhook, type WebhookEvent, type WebhookEventData } from '@waffo/pancake-ts';
import { ApiError } from '../../server/errors.js';
import type { VerifiedWaffoOrder } from '../../server/waffo-billing-store.js';
import { PLANS, type PurchasablePlanId } from '../../src/config/plans.js';

export const waffoEnvironment = (): 'prod' | 'test' => process.env.WAFFO_ENVIRONMENT === 'prod' ? 'prod' : 'test';
export const waffoStoreId = () => String(process.env.WAFFO_STORE_ID || '').trim();
export const waffoProductId = (plan: PurchasablePlanId) => String(process.env[`WAFFO_PRODUCT_${plan.toUpperCase()}`] || '').trim();
export const waffoConfigured = () => Boolean(process.env.WAFFO_MERCHANT_ID && process.env.WAFFO_PRIVATE_KEY && waffoStoreId());
export const waffoCheckoutEnabled = () => (process.env.VERCEL_ENV !== 'production' || waffoEnvironment() === 'prod') && waffoConfigured() && process.env.WAFFO_CHECKOUT_ENABLED === 'true' && Boolean(waffoProductId('pro') && waffoProductId('team'));
export function waffo() {
  if (!waffoConfigured()) throw new ApiError(503, 'waffo_not_configured', 'Checkout is not configured yet');
  return new WaffoPancake({ merchantId: process.env.WAFFO_MERCHANT_ID!.trim(), privateKey: process.env.WAFFO_PRIVATE_KEY!.trim(), fetch: async (url, init) => {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(15000), redirect: 'error' });
    // The API key, not the SDK configuration, chooses the payment environment.
    if (response.ok && /\/actions\/(checkout\/create-session|auth\/issue-session-token)/.test(String(url)) && response.headers.get('x-waffo-environment') !== waffoEnvironment()) {
      throw new ApiError(503, 'waffo_environment_mismatch', 'Payment environment could not be verified');
    }
    return response;
  } });
}
export function verifyWaffoEvent(raw: string, signature: string | undefined) {
  const event = verifyWebhook<WebhookEventData>(raw, signature, { environment: waffoEnvironment() });
  if (!waffoStoreId() || event.storeId !== waffoStoreId() || event.mode !== waffoEnvironment()) throw new ApiError(401, 'waffo_event_scope', 'Webhook store or environment mismatch');
  return event;
}
export async function verifiedWaffoProduct(plan: PurchasablePlanId) {
  const id = waffoProductId(plan);
  const result = await waffo().graphql.query<{ subscriptionProduct: { id: string; storeId: string; status: string; billingPeriod: string; hasProdVersion: boolean; prices: Array<{ currency: string; priceInfo: { amount: string } }> } }>({ query: 'query($id:String!) { subscriptionProduct(id:$id) { id storeId status billingPeriod hasProdVersion prices { currency priceInfo { amount } } } }', variables: { id } });
  const product = result.data?.subscriptionProduct;
  const amount = product?.prices?.find(p => p.currency === 'USD')?.priceInfo.amount;
  if (!product || product.storeId !== waffoStoreId() || product.status !== 'active' || product.billingPeriod !== 'monthly' || (waffoEnvironment() === 'prod' && !product.hasProdVersion) || amount !== PLANS[plan].priceUsd.toFixed(2)) throw new ApiError(503, 'waffo_catalog_mismatch', 'Checkout product does not match the advertised plan');
  return product;
}
export async function readWaffoOrder(event: WebhookEvent<WebhookEventData>) {
  const result = await waffo().graphql.query<{ subscriptionOrder: VerifiedWaffoOrder | null }>({ query: 'query($id:String!) { subscriptionOrder(id:$id) { id storeId testMode status merchantProvidedBuyerIdentity orderMerchantExternalId subscriptionProduct { id } billingPeriod currentPeriodEnd currentPeriodNumber cancelEffectiveAt cancelEffectiveMode } }', variables: { id: event.data.orderId } });
  const order = result.data?.subscriptionOrder;
  if (!order || order.id !== event.data.orderId || order.storeId !== waffoStoreId() || order.testMode !== (waffoEnvironment() === 'test')) throw new ApiError(409, 'waffo_order_scope', 'Payment order could not be verified');
  return order;
}
/** Authoritative provider check also covers payments whose webhook is still delayed. */
export async function outstandingWaffoOrders(uid: string) {
  const result = await waffo().graphql.query<{ subscriptionOrders: Array<{ id: string; status: string }> }>({ query: 'query($storeId:String!,$uid:String!) { subscriptionOrders(storeId:$storeId,filter:{merchantProvidedBuyerIdentity:{eq:$uid},status:{in:["active","pending","trialing","canceling","past_due"]}},limit:20) { id status } }', variables: { storeId: waffoStoreId(), uid } });
  if (!Array.isArray(result.data?.subscriptionOrders) || result.errors?.length) throw new ApiError(503, 'waffo_order_lookup_failed', 'Existing orders could not be verified');
  return result.data.subscriptionOrders;
}
