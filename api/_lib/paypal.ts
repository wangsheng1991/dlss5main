import { ApiError } from '../../server/errors.js';
import type { BillingStore } from '../../server/billing-store.js';
import { PLANS, type PurchasablePlanId } from '../../src/config/plans.js';

/**
 * PayPal REST access, mirroring `_lib/stripe.ts`: one lazily configured client, one environment
 * switch and one place that knows the API shapes. Sandbox is the default, so a deployment that gets
 * live keys but forgets `PAYPAL_ENV=live` keeps charging nobody.
 */
export type PaypalEnvironment = 'sandbox' | 'live';

export const paypalEnvironment = (): PaypalEnvironment =>
  (String(process.env.PAYPAL_ENV || '').trim().toLowerCase() === 'live' ? 'live' : 'sandbox');

export const paypalBase = (env: PaypalEnvironment = paypalEnvironment()) =>
  (env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');

export const paypalConfigured = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);

/** Webhook signature checks need the id PayPal assigned to the endpoint when it was registered. */
export const paypalWebhookId = () => String(process.env.PAYPAL_WEBHOOK_ID || '').trim();

/** The OAuth token outlives a single invocation, so it is memoised per warm function instance. */
let token: { value: string; expiresAt: number; environment: PaypalEnvironment } | null = null;

async function paypalToken(environment: PaypalEnvironment) {
  if (token && token.environment === environment && token.expiresAt > Date.now() + 30_000) return token.value;
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new ApiError(503, 'paypal_not_configured', 'PayPal is not configured yet');
  const credentials = Buffer.from(`${id}:${secret}`).toString('base64');
  const response = await fetch(`${paypalBase(environment)}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
  if (!response.ok || !data.access_token) {
    // The body of a failed token call names the error only, never the credentials.
    console.error('PayPal token request failed', { status: response.status, body: JSON.stringify(data).slice(0, 300) });
    throw new ApiError(502, 'paypal_unavailable', 'PayPal is unavailable right now');
  }
  token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3000) * 1000, environment };
  return token.value;
}

type CallOptions = { method?: string; body?: unknown; requestId?: string };

/** One JSON call against the Payments API; failures stay private and surface as a 502. */
export async function paypalApi<T>(path: string, options: CallOptions = {}): Promise<T> {
  const environment = paypalEnvironment();
  const access = await paypalToken(environment);
  const response = await fetch(`${paypalBase(environment)}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'application/json',
      ...(options.requestId ? { 'PayPal-Request-Id': options.requestId } : {}),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    const detail = (data as { message?: string; name?: string }) || {};
    console.error('PayPal call failed', { path, status: response.status, name: detail.name, message: detail.message });
    throw new ApiError(502, 'paypal_unavailable', 'PayPal is unavailable right now');
  }
  return data as T;
}

export type PaypalSubscription = {
  id: string;
  status: string;
  plan_id?: string;
  custom_id?: string;
  start_time?: string;
  subscriber?: { payer_id?: string; email_address?: string };
  billing_info?: {
    last_payment?: { time?: string; amount?: { value?: string; currency_code?: string } };
    next_billing_time?: string;
    failed_payments_count?: number;
  };
};

export const paypalSubscription = (id: string) =>
  paypalApi<PaypalSubscription>(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);

/**
 * Credits are granted once per paid period. Both the return redirect and the payment webhook read the
 * period from the subscription itself, and the marker is rounded to the UTC day so the two events
 * PayPal sends for one payment (activation plus sale) can never grant the same period twice.
 */
export function periodOf(subscription: PaypalSubscription, eventTime?: string) {
  const payment = Date.parse(subscription.billing_info?.last_payment?.time || subscription.start_time || '');
  const event = Date.parse(eventTime || '');
  const marker = Math.max(Number.isFinite(payment) ? payment : 0, Number.isFinite(event) ? event : 0);
  const next = Date.parse(subscription.billing_info?.next_billing_time || '');
  return {
    key: `paypal:${subscription.id}:${marker ? new Date(marker).toISOString().slice(0, 10) : 'unknown'}`,
    end: Number.isFinite(next) ? next : undefined,
  };
}

/** What PayPal reports was charged for the period, in cents. */
export const amountOf = (subscription: PaypalSubscription, fallbackUsd: number) => {
  const value = Number.parseFloat(String(subscription.billing_info?.last_payment?.amount?.value || ''));
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : Math.round(fallbackUsd * 100);
};

export const currencyOf = (subscription: PaypalSubscription) =>
  String(subscription.billing_info?.last_payment?.amount?.currency_code || 'USD').toLowerCase();

/**
 * Products and billing plans are created on first use and remembered, because PayPal charges from
 * the plan object rather than from price data sent at checkout time.
 */
export async function ensurePlan(store: BillingStore, plan: PurchasablePlanId) {
  const environment = paypalEnvironment();
  const known = await store.paypalPlanId(environment, plan);
  if (known) return known;
  let product = await store.paypalProductId(environment);
  if (!product) {
    const created = await paypalApi<{ id?: string }>('/v1/catalogs/products', {
      method: 'POST',
      body: { name: 'DLSS 5', description: 'AI image upscaling credits', type: 'SERVICE', category: 'SOFTWARE' },
    });
    if (!created?.id) throw new ApiError(502, 'paypal_unavailable', 'PayPal is unavailable right now');
    product = created.id;
    await store.setPaypalProductId(environment, product);
  }
  const created = await paypalApi<{ id?: string }>('/v1/billing/plans', {
    method: 'POST',
    body: {
      product_id: product,
      name: `DLSS 5 ${PLANS[plan].name}`,
      description: `${PLANS[plan].monthlyCredits} credits per month`,
      status: 'ACTIVE',
      billing_cycles: [{
        frequency: { interval_unit: 'MONTH', interval_count: 1 },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: { fixed_price: { value: PLANS[plan].priceUsd.toFixed(2), currency_code: 'USD' } },
      }],
      payment_preferences: { auto_bill_outstanding: true, setup_fee_failure_action: 'CONTINUE', payment_failure_threshold: 3 },
    },
  });
  if (!created?.id) throw new ApiError(502, 'paypal_unavailable', 'PayPal is unavailable right now');
  await store.setPaypalPlanId(environment, plan, created.id);
  return created.id;
}

/** Reverse lookup of the plan a PayPal billing plan id belongs to. */
export async function planOfPaypalId(store: BillingStore, planId: string): Promise<PurchasablePlanId | ''> {
  if (!planId) return '';
  const environment = paypalEnvironment();
  for (const plan of ['pro', 'team'] as PurchasablePlanId[]) {
    if ((await store.paypalPlanId(environment, plan)) === planId) return plan;
  }
  return '';
}
