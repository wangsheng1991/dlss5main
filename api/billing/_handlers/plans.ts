import type { VercelRequest, VercelResponse } from '@vercel/node';
import { planPricing } from '../../_lib/stripe.js';
import { paypalConfigured, paypalEnvironment } from '../../_lib/paypal.js';
import { PAID_PLANS, PLANS } from '../../../src/config/plans.js';
import { waffoCheckoutEnabled, waffoEnvironment } from '../../_lib/waffo.js';
import { dodoConfigured, dodoEnvironment } from '../../_lib/dodo.js';
import { legacyPaymentsAllowed } from '../../../server/payment-policy.js';
import { resolveSupportEmail } from '../../../src/config/site-url.js';

/** Isolated legacy previews read Stripe prices; production uses the Waffo-backed catalog. */
async function catalog() {
  const priced = await Promise.all(PAID_PLANS.map(async (plan) => [plan, await planPricing(plan, PLANS[plan].priceUsd)] as const));
  return Object.fromEntries(Object.entries(PLANS).map(([id, plan]) => {
    const stripe = priced.find(([paid]) => paid === id)?.[1];
    return [id, stripe ? { ...plan, priceUsd: stripe.amount / 100, currency: stripe.currency.toUpperCase(), priceConfigured: Boolean(stripe.priceId) } : plan];
  }));
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const legacyEnabled = legacyPaymentsAllowed();
  const configured = legacyEnabled && Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
  const plans = waffoCheckoutEnabled() ? PLANS : configured ? await catalog().catch(() => PLANS) : PLANS;
  return res.status(200).json({
    version: 5,
    legacyPaymentsEnabled: legacyEnabled,
    waffo: { enabled: waffoCheckoutEnabled(), environment: waffoEnvironment() },
    currency: 'USD',
    membershipContact: process.env.MEMBERSHIP_CONTACT_EMAIL || resolveSupportEmail(process.env.VITE_SUPPORT_EMAIL),
    // This flag is the legacy Stripe lane, not the independent Waffo availability.
    billingEnabled: configured,
    // Legacy testing remains isolated to local/preview environments.
    paypal: { enabled: legacyEnabled && paypalConfigured(), environment: paypalEnvironment() },
    dodo: { enabled: legacyEnabled && dodoConfigured() && Boolean(process.env.DODO_PRODUCT_PRO && process.env.DODO_PRODUCT_TEAM), environment: dodoEnvironment() },
    plans,
  });
}
