import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { dodo, dodoConfigured, dodoProductId, dodoEnvironment } from '../../_lib/dodo.js';
import { siteOrigin } from '../../_lib/stripe.js';
import { isPurchasablePlan } from '../../../src/config/plans.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const plan = (req.body || {}).plan;
    if (!isPurchasablePlan(plan)) return res.status(400).json({ error: 'Choose a paid plan: pro or team' });
    if (!dodoConfigured()) return res.status(503).json({ error: 'Dodo Payments is not configured yet', code: 'dodo_not_configured' });
    const product = dodoProductId(plan);
    if (!product) return res.status(503).json({ error: `Set DODO_PRODUCT_${String(plan).toUpperCase()} before checkout`, code: 'dodo_product_not_configured' });
    const account = await new BillingStore(database()).account(user.uid);
    if (account.subscriptionId && ['active', 'trialing', 'past_due'].includes(account.subscriptionStatus)) return res.status(409).json({ error: 'You already have a subscription — change your plan instead', code: 'subscription_exists' });
    const session = await dodo().checkoutSessions.create({
      product_cart: [{ product_id: product, quantity: 1 }],
      customer: { email: user.email || undefined, name: user.displayName || undefined },
      metadata: { uid: user.uid, plan },
      return_url: `${siteOrigin(req)}/dashboard?dodo=success`,
      cancel_url: `${siteOrigin(req)}/pricing?dodo=cancelled`,
    });
    if (!session.checkout_url) throw new Error('Dodo did not return a checkout URL');
    return res.status(200).json({ url: session.checkout_url, id: session.session_id, environment: dodoEnvironment() });
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    console.error('Dodo checkout failed', { message: (error as Error).message });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
