import type { VercelRequest, VercelResponse } from '@vercel/node';
import { planPricing } from '../../_lib/stripe.js';
import { PAID_PLANS, PLANS } from '../../../src/config/plans.js';

/** Advertised price always comes from the Stripe price that checkout actually charges. */
async function catalog() {
  const priced = await Promise.all(PAID_PLANS.map(async (plan) => [plan, await planPricing(plan, PLANS[plan].priceUsd)] as const));
  return Object.fromEntries(Object.entries(PLANS).map(([id, plan]) => {
    const stripe = priced.find(([paid]) => paid === id)?.[1];
    return [id, stripe ? { ...plan, priceUsd: stripe.amount / 100, currency: stripe.currency.toUpperCase(), priceConfigured: Boolean(stripe.priceId) } : plan];
  }));
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  const configured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
  const plans = configured ? await catalog().catch(() => PLANS) : PLANS;
  return res.status(200).json({
    version: 3,
    currency: 'USD',
    membershipContact: process.env.MEMBERSHIP_CONTACT_EMAIL || 'support@dlss5nvidia.com',
    // Sandbox and production both report whether checkout is live, so the UI never offers a dead button.
    billingEnabled: configured,
    plans,
  });
}
