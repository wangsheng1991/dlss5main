#!/usr/bin/env node
/**
 * Sandbox billing setup: verifies the Stripe secret key and registers the webhook endpoint
 * that /api/billing/webhook needs, printing the env values without ever writing them to git.
 *
 *   node scripts/stripe-setup.mjs [webhook-url]
 *
 * Reads STRIPE_SECRET_KEY from the environment or .env.local (never printed).
 */
import { readFileSync } from 'node:fs';

const EVENTS = ['checkout.session.completed', 'invoice.paid', 'customer.subscription.updated', 'customer.subscription.deleted'];

function fromEnvFile(path, name) {
  try {
    const line = readFileSync(path, 'utf8').split('\n').find((entry) => entry.startsWith(`${name}=`));
    return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}

const key = process.env.STRIPE_SECRET_KEY || fromEnvFile(new URL('../.env.local', import.meta.url), 'STRIPE_SECRET_KEY');
if (!key) {
  console.error('STRIPE_SECRET_KEY is missing. Add the test-mode secret key (sk_test_...) to .env.local first.');
  process.exit(1);
}
const site = (process.argv[2] || process.env.PUBLIC_SITE_URL || 'https://www.dlss5nvidia.com').replace(/\/$/, '');
const url = site.endsWith('/api/billing/webhook') ? site : `${site}/api/billing/webhook`;
const mode = key.startsWith('sk_test_') ? 'test (sandbox)' : key.startsWith('sk_live_') ? 'LIVE' : 'unknown';
const api = async (path, init = {}) => {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded', ...(init.headers || {}) },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`${path} failed: ${body?.error?.message || response.status}`);
  return body;
};

console.log(`Stripe key mode: ${mode}`);

const account = await api('account');
console.log(`Account: ${account.id} (${account.settings?.dashboard?.display_name || account.email || 'no name'})`);

const existing = await api('webhook_endpoints?limit=100');
const match = (existing.data || []).find((endpoint) => endpoint.url === url);
if (match) {
  console.log(`Webhook endpoint already registered: ${match.id}`);
  console.log('Its signing secret is only shown once at creation. Roll it in the dashboard');
  console.log('(Developers → Webhooks → your endpoint → Roll secret) if you need STRIPE_WEBHOOK_SECRET again.');
} else {
  const payload = new URLSearchParams();
  payload.set('url', url);
  payload.set('description', 'DLSS 5 billing (auto-created by scripts/stripe-setup.mjs)');
  for (const event of EVENTS) payload.append('enabled_events[]', event);
  const endpoint = await api('webhook_endpoints', { method: 'POST', body: payload });
  console.log(`Created webhook endpoint ${endpoint.id} for ${url}`);
  console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
}

console.log('\nRequired environment (local .env.local and Vercel production):');
console.log(`STRIPE_SECRET_KEY=<the ${mode} secret key you used>`);
console.log('STRIPE_WEBHOOK_SECRET=<the whsec_... value above, or the existing endpoint secret>');
console.log('\nThen check the deployment: curl -s https://<host>/api/health   → "billing": true');
