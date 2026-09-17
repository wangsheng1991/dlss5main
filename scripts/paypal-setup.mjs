/**
 * Registers the PayPal webhook that keeps this deployment's credits in sync, and prints the
 * `PAYPAL_WEBHOOK_ID` to store next to the other secrets. Running it twice is safe: an endpoint that
 * already points at the same URL is reused instead of duplicated.
 *
 * Usage: PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... [PAYPAL_ENV=sandbox] node scripts/paypal-setup.mjs [url]
 */
const environment = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox';
const base = environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
const origin = (process.argv[2] || process.env.PUBLIC_SITE_URL || 'https://www.dlss5nvidia.com').replace(/\/$/, '');
const url = `${origin}/api/billing/paypal-webhook`;

const EVENT_TYPES = [
  'BILLING.SUBSCRIPTION.ACTIVATED',
  'BILLING.SUBSCRIPTION.CANCELLED',
  'BILLING.SUBSCRIPTION.EXPIRED',
  'BILLING.SUBSCRIPTION.SUSPENDED',
  'PAYMENT.SALE.COMPLETED',
  'PAYMENT.SALE.REFUNDED',
  'PAYMENT.SALE.REVERSED',
];

const id = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
if (!id || !secret) {
  console.error('Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET first (sandbox keys by default).');
  process.exit(1);
}

const call = async (path, init = {}) => {
  const token = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  }).then(async (response) => {
    if (!response.ok) throw new Error(`token request failed with ${response.status}`);
    return (await response.json()).access_token;
  });
  const response = await fetch(`${base}${path}`, {
    method: init.method || 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(init.body ? { body: JSON.stringify(init.body) } : {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${path} failed with ${response.status}: ${text.slice(0, 300)}`);
  return data;
};

console.log(`PayPal environment: ${environment}`);
const existing = (await call('/v1/notifications/webhooks')).webhooks || [];
const match = existing.find((webhook) => webhook.url === url);
if (match) {
  console.log(`Webhook already registered: ${url}`);
  console.log(`PAYPAL_WEBHOOK_ID=${match.id}`);
} else {
  const created = await call('/v1/notifications/webhooks', {
    method: 'POST',
    body: { url, event_types: EVENT_TYPES.map((name) => ({ name })) },
  });
  console.log(`Registered webhook: ${created.url}`);
  console.log(`PAYPAL_WEBHOOK_ID=${created.id}`);
}
