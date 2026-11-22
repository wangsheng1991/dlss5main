import assert from 'node:assert/strict';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { legacyPaymentsAllowed, disabledProductionBillingRoute, legacyBindingBlocksWaffo } from '../server/payment-policy';
import { waffoCheckoutEnabled } from '../api/_lib/waffo';
import billingRouter from '../api/billing/[route]';
import { test } from './harness';

const disabledRoutes = ['checkout', 'change', 'webhook', 'paypal-checkout', 'paypal-confirm', 'paypal-webhook', 'dodo-checkout', 'dodo-webhook'];
const sharedRoutes = ['plans', 'orders', 'usage', 'portal', 'waffo-checkout', 'waffo-webhook', 'waffo-monitor'];

test('Production legacy payment policy cannot be enabled by credentials or legacy override flags', () => {
  for (const configuration of [
    {},
    { STRIPE_SECRET_KEY: 'sk_test_offline', PAYPAL_ENV: 'sandbox' },
    { STRIPE_SECRET_KEY: 'sk_live_offline', PAYPAL_ENV: 'live', DODO_PAYMENTS_ENVIRONMENT: 'live_mode' },
    { LEGACY_STRIPE_ENABLED: 'true', LEGACY_PAYPAL_ENABLED: 'true', LEGACY_PAYMENTS_ENABLED: 'true' },
    { STRIPE_SECRET_KEY: 'rk_live_offline', PAYPAL_ENV: 'live', LEGACY_STRIPE_ENABLED: 'true', LEGACY_PAYPAL_ENABLED: 'true', LEGACY_PAYMENTS_ENABLED: 'true' },
  ]) {
    const environment = { ...configuration, VERCEL_ENV: 'production' };
    assert.equal(legacyPaymentsAllowed(environment), false);
    for (const route of disabledRoutes) assert.equal(disabledProductionBillingRoute(route, environment), true, route);
  }
});

test('Preview, development and local environments retain their existing legacy testing routes', () => {
  for (const VERCEL_ENV of ['preview', 'development', undefined]) {
    const environment = { VERCEL_ENV, STRIPE_SECRET_KEY: 'sk_test_offline', PAYPAL_ENV: 'sandbox' };
    assert.equal(legacyPaymentsAllowed(environment), true);
    for (const route of [...disabledRoutes, ...sharedRoutes]) assert.equal(disabledProductionBillingRoute(route, environment), false, route);
  }
});

test('Production policy closes every legacy route without disabling history, shared portals or Waffo', () => {
  const environment = { VERCEL_ENV: 'production' };
  for (const route of disabledRoutes) assert.equal(disabledProductionBillingRoute(route, environment), true, route);
  for (const route of [...sharedRoutes, 'unknown-route']) assert.equal(disabledProductionBillingRoute(route, environment), false, route);
});

test('Only an explicit own PayPal approval-pending sandbox binding permits production Waffo migration', () => {
  const environment = { VERCEL_ENV: 'production', PAYPAL_ENV: 'sandbox' };
  const pending = { paypalSubscriptionId: 'sandbox-pending', paypalSubscriptionStatus: 'APPROVAL_PENDING' };
  assert.equal(legacyBindingBlocksWaffo(pending, 'prod', environment), false);
  for (const status of ['ACTIVE', 'APPROVED', 'TRIALING', 'PAST_DUE', 'unknown', '']) {
    assert.equal(legacyBindingBlocksWaffo({ ...pending, paypalSubscriptionStatus: status }, 'prod', environment), true, status);
  }
  assert.equal(legacyBindingBlocksWaffo({ paypalSubscriptionId: 'sandbox-pending', subscriptionStatus: 'APPROVAL_PENDING' }, 'prod', environment), true, 'generic status cannot prove the own PayPal binding is unapproved');
  for (const config of [{ VERCEL_ENV: 'production' }, { VERCEL_ENV: 'production', PAYPAL_ENV: 'live' }, { VERCEL_ENV: 'preview', PAYPAL_ENV: 'sandbox' }]) assert.equal(legacyBindingBlocksWaffo(pending, 'prod', config), true);
  assert.equal(legacyBindingBlocksWaffo(pending, 'test', environment), true);
  assert.equal(legacyBindingBlocksWaffo({ ...pending, stripeSubscriptionId: 'stripe-active', stripeSubscriptionStatus: 'active' }, 'prod', environment), true);
  assert.equal(legacyBindingBlocksWaffo({ ...pending, dodoSubscriptionId: 'dodo-active', dodoSubscriptionStatus: 'active' }, 'prod', environment), true);
});

test('Terminal legacy bindings are normalized and remain nonblocking without deleting history', () => {
  for (const provider of ['stripe', 'paypal', 'dodo']) {
    for (const status of ['CANCELED', 'cancelled', 'EXPIRED', 'incomplete_expired']) {
      const account = { [`${provider}SubscriptionId`]: 'retained-history', [`${provider}SubscriptionStatus`]: status }, before = structuredClone(account);
      assert.equal(legacyBindingBlocksWaffo(account, 'prod', { VERCEL_ENV: 'production' }), false);
      assert.deepEqual(account, before);
    }
  }
});

test('Production Waffo checkout rejects test mode while preview retains isolated test checkout', async () => {
  const settings = { VERCEL_ENV: 'production', WAFFO_ENVIRONMENT: 'test', WAFFO_MERCHANT_ID: 'offline-merchant', WAFFO_PRIVATE_KEY: 'offline-unused', WAFFO_STORE_ID: 'offline-store', WAFFO_CHECKOUT_ENABLED: 'true', WAFFO_PRODUCT_PRO: 'offline-pro', WAFFO_PRODUCT_TEAM: 'offline-team' };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  Object.assign(process.env, settings);
  try {
    assert.equal(waffoCheckoutEnabled(), false);
    process.env.WAFFO_ENVIRONMENT = 'prod'; assert.equal(waffoCheckoutEnabled(), true);
    process.env.VERCEL_ENV = 'preview'; process.env.WAFFO_ENVIRONMENT = 'test'; assert.equal(waffoCheckoutEnabled(), true);
  } finally { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
});

async function withProduction<T>(operation: () => Promise<T>) {
  const settings = {
    VERCEL_ENV: 'production', STRIPE_SECRET_KEY: 'sk_test_offline', STRIPE_WEBHOOK_SECRET: 'whsec_offline',
    STRIPE_PRICE_PRO: '', STRIPE_PRICE_TEAM: '', PAYPAL_CLIENT_ID: 'offline-client', PAYPAL_CLIENT_SECRET: 'offline-secret', PAYPAL_ENV: 'sandbox',
    DODO_PAYMENTS_API_KEY: 'offline-dodo', DODO_PAYMENTS_WEBHOOK_KEY: 'offline-dodo-webhook', DODO_PRODUCT_PRO: 'offline-pro', DODO_PRODUCT_TEAM: 'offline-team',
    WAFFO_CHECKOUT_ENABLED: 'false',
  };
  const previous = Object.fromEntries(Object.keys(settings).map(key => [key, process.env[key]]));
  Object.assign(process.env, settings);
  try { return await operation(); }
  finally { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
}

async function callRoute(route: string | string[], method = 'POST', guarded = false) {
  const answer = { status: 0, body: undefined as unknown, headers: {} as Record<string, string> };
  const req: Record<string, unknown> = { query: { route, session_id: 'offline-session' }, method };
  if (guarded) {
    Object.defineProperty(req, 'headers', { get() { throw new Error('Disabled legacy routes must not authenticate or verify provider signatures'); } });
    Object.defineProperty(req, 'body', { get() { throw new Error('Disabled legacy routes must not read financial input'); } });
    Object.defineProperty(req, 'on', { get() { throw new Error('Disabled legacy routes must not consume webhook bodies'); } });
  } else req.headers = {};
  const res = { status(value: number) { answer.status = value; return this; }, json(value: unknown) { answer.body = value; return this; }, setHeader(name: string, value: string) { answer.headers[name] = value; } };
  await billingRouter(req as unknown as VercelRequest, res as unknown as VercelResponse);
  return answer;
}

test('Production legacy checkout, change and confirmation requests fail closed before authentication or provider access', async () => {
  const oldFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('No external call allowed'); };
  try {
    await withProduction(async () => {
      for (const [route, method] of [
        ['checkout', 'POST'], ['checkout', 'GET'], ['change', 'POST'], ['paypal-checkout', 'POST'], ['paypal-confirm', 'GET'], ['dodo-checkout', 'POST'],
      ] as const) assert.equal((await callRoute(route, method, true)).status, 410, `${method} ${route}`);
      assert.equal((await callRoute(['checkout/'], 'GET', true)).status, 410, 'router array/trailing-slash normalization must preserve closure');
    });
    assert.equal(calls, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('Production disabled legacy webhooks acknowledge without reading bodies or touching financial state', async () => {
  await withProduction(async () => {
    for (const route of ['webhook', 'paypal-webhook', 'dodo-webhook']) {
      const answer = await callRoute(route, 'POST', true);
      assert.equal(answer.status, 200, route); assert.equal((answer.body as {handled?: boolean}).handled, false);
    }
  });
});

test('Production shared history and Waffo routes retain their own authentication and method handling', async () => {
  await withProduction(async () => {
    for (const [route, method, status] of [
      ['orders', 'GET', 401], ['usage', 'GET', 401], ['portal', 'GET', 405],
      ['waffo-checkout', 'GET', 405], ['waffo-webhook', 'GET', 405], ['waffo-monitor', 'GET', 401],
      ['unknown-route', 'GET', 404],
    ] as const) assert.equal((await callRoute(route, method)).status, status, route);
  });
});

test('Production plans never advertise Stripe, PayPal or Dodo purchase paths even with configured sandbox keys', async () => {
  await withProduction(async () => {
    const answer = await callRoute('plans', 'GET');
    assert.equal(answer.status, 200);
    const body = answer.body as {version: number; legacyPaymentsEnabled: boolean; billingEnabled: boolean; paypal: {enabled: boolean}; dodo: {enabled: boolean}};
    assert.ok(body.version >= 5); assert.equal(body.legacyPaymentsEnabled, false);
    assert.equal(body.billingEnabled, false); assert.equal(body.paypal.enabled, false); assert.equal(body.dodo.enabled, false);
  });
});
