import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { waffo, waffoCheckoutEnabled, waffoEnvironment, verifiedWaffoProduct, outstandingWaffoOrders } from '../../_lib/waffo.js';
import { BillingStore } from '../../../server/billing-store.js';
import { WaffoBillingStore } from '../../../server/waffo-billing-store.js';
import { database } from '../../../server/admin.js';
import { isPurchasablePlan } from '../../../src/config/plans.js';
import { resolveSiteUrl } from '../../../src/config/site-url.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const plan = req.body?.plan;
    if (!isPurchasablePlan(plan)) return res.status(400).json({ error: 'Choose pro or team' });
    if (!waffoCheckoutEnabled()) return res.status(503).json({ error: 'Checkout is not available yet', code: 'waffo_not_configured' });
    const account = await new BillingStore(database()).account(user.uid);
    if (account.subscriptionId && ['active', 'trialing', 'past_due', 'canceling'].includes(account.subscriptionStatus)) return res.status(409).json({ error: 'Manage your existing subscription before purchasing again', code: 'subscription_exists' });
    if ((await outstandingWaffoOrders(user.uid)).length) return res.status(409).json({ error: 'An earlier order still needs attention. Open Manage billing to finish or cancel it.', code: 'existing_provider_order' });
    const product = await verifiedWaffoProduct(plan);
    const intent = await new WaffoBillingStore(database()).createIntent({ uid: user.uid, plan, productId: product.id, environment: waffoEnvironment() });
    const session = await waffo().checkout.authenticated.create({ productId: product.id, currency: 'USD', buyerIdentity: user.uid, ...(user.email ? { buyerEmail: user.email } : {}), orderMerchantExternalId: intent.id, metadata: { plan, intent: intent.id }, withTrial: false, allowPromotionCodes: false, successUrl: `${resolveSiteUrl(process.env.VITE_SITE_URL)}/dashboard?waffo=success`, expiresInSeconds: 1800 }, { idempotencyKey: intent.id });
    const url = new URL(session.checkoutUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'pancake.waffo.ai') throw new Error('Unexpected checkout origin');
    return res.status(200).json({ url: session.checkoutUrl, id: session.sessionId, environment: waffoEnvironment() });
  } catch (e) {
    if (typeof (e as { status?: unknown }).status === 'number') return fail(res, e);
    console.error('Waffo checkout failed', { type: (e as Error).name });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
