import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { siteOrigin, stripe } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { waffo, waffoStoreId, waffoCheckoutEnabled } from '../../_lib/waffo.js';
import { BillingStore } from '../../../server/billing-store.js';

/** Opens the authenticated buyer’s own billing provider portal. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const store = new BillingStore(database());
    const bound = await store.account(user.uid);
    if (bound.provider === 'waffo' || (!bound.provider && waffoCheckoutEnabled())) {
      const { portalUrl } = await waffo().auth.createCustomerPortalLink({ storeId: waffoStoreId(), buyerIdentity: user.uid });
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ url: portalUrl });
    }
    const customer = await store.customer(user.uid);
    if (!customer) {
      // A PayPal buyer has no Stripe customer: send them to PayPal instead of a dead end.
      const account = await store.account(user.uid);
      if (account.provider === 'paypal') {
        return res.status(409).json({ error: 'This subscription is billed by PayPal — manage or cancel it in your PayPal account', code: 'paypal_subscription' });
      }
      return res.status(409).json({ error: 'No billing account yet — subscribe to a plan first', code: 'no_customer' });
    }
    const session = await stripe().billingPortal.sessions.create({ customer, return_url: `${siteOrigin(req)}/dashboard` });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    // The portal must be activated once in the Stripe dashboard; surface that instead of a stack trace.
    console.error('Billing portal failed', { type: (error as Error).name });
    return res.status(502).json({ error: 'The billing portal is not available right now. Please try again later.' });
  }
}
