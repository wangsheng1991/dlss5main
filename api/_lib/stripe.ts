import type { VercelRequest } from '@vercel/node';
import Stripe from 'stripe';
import { ApiError } from '../../server/errors.js';
import { resolveSiteUrl, siteHost } from '../../src/config/site-url.js';
import type { PurchasablePlanId } from '../../src/config/plans.js';

/** Lazily built so a missing key only breaks billing routes, never the whole deployment. */
export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new ApiError(503, 'billing_not_configured', 'Billing is not configured yet');
  return new Stripe(key, { timeout: 15_000, maxNetworkRetries: 2 });
}

/** Optional pre-created sandbox/live price; without it checkout uses an inline monthly price. */
export const priceIdFor = (plan: PurchasablePlanId) => process.env[`STRIPE_PRICE_${plan.toUpperCase()}`] || '';

/** Switching an existing subscription between plans needs a real price, not inline price data. */
export function requirePriceId(plan: PurchasablePlanId) {
  const id = priceIdFor(plan);
  if (!id) throw new ApiError(503, 'billing_not_configured', `Set STRIPE_PRICE_${plan.toUpperCase()} before changing plans`);
  return id;
}

/** What Stripe actually charges for a plan, so the site never advertises a price it does not charge. */
export async function planPricing(plan: PurchasablePlanId, fallbackUsd: number) {
  const id = priceIdFor(plan);
  if (!id) return { priceId: '', amount: fallbackUsd * 100, currency: 'usd' };
  try {
    const price = await stripe().prices.retrieve(id);
    return { priceId: id, amount: price.unit_amount ?? fallbackUsd * 100, currency: price.currency || 'usd' };
  } catch (error) {
    console.warn('Falling back to the catalog price', { plan, message: (error as Error).message });
    return { priceId: id, amount: fallbackUsd * 100, currency: 'usd' };
  }
}

/** Public origin used for Stripe redirects, so previews and production never cross hosts. */
export function siteOrigin(req: VercelRequest) {
  const configured = (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/$/, '');
  if (configured) return configured;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || siteHost(resolveSiteUrl(process.env.VITE_SITE_URL))).split(',')[0];
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  return `${proto}://${host}`;
}

export const webhookEndpoint = (req: VercelRequest) => `${siteOrigin(req)}/api/billing/webhook`;

/**
 * Read the body straight off the request stream (event style, as Vercel's runtime replays it).
 * Returns null when the stream no longer yields the bytes.
 */
function readStream(req: VercelRequest, limit: number): Promise<Buffer | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let size = 0;
    const finish = (value: Buffer | null) => resolve(value);
    req.on('data', (chunk: Buffer | string) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > limit) finish(null);
      else chunks.push(buffer);
    });
    req.on('end', () => finish(Buffer.concat(chunks)));
    req.on('error', () => finish(null));
  });
}

/**
 * Raw request body for Stripe signature verification.
 * The Vercel Node runtime parses `req.body` lazily and replays the request stream, so read the
 * stream first and only fall back to the parsed body when the bytes are no longer available.
 */
export async function rawBody(req: VercelRequest, limit = 1_048_576): Promise<Buffer> {
  const streamed = await Promise.race([readStream(req, limit), new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))]);
  if (streamed && streamed.length) return streamed;
  const parsed = (req as unknown as { body?: unknown }).body;
  if (Buffer.isBuffer(parsed)) return parsed;
  if (typeof parsed === 'string') return Buffer.from(parsed);
  if (parsed === undefined || parsed === null) return Buffer.alloc(0);
  return Buffer.from(JSON.stringify(parsed));
}
