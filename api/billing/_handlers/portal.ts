import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { siteOrigin, stripe } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';

/** Opens the Stripe customer portal so the buyer can cancel, switch plans or update the card. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const customer = await new BillingStore(database()).customer(user.uid);
    if (!customer) return res.status(409).json({ error: 'No billing account yet — subscribe to a plan first', code: 'no_customer' });
    const session = await stripe().billingPortal.sessions.create({ customer, return_url: `${siteOrigin(req)}/dashboard` });
    return res.status(200).json({ url: session.url });
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    // The portal must be activated once in the Stripe dashboard; surface that instead of a stack trace.
    console.error('Billing portal failed', { type: (error as { type?: string }).type, message: (error as Error).message });
    return res.status(502).json({ error: 'The billing portal is not available yet. Activate it in the Stripe dashboard, then try again.' });
  }
}
