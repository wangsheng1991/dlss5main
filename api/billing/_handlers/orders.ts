import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';

/** Billing state and purchased orders of the signed-in account only. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const store = new BillingStore(database());
    const [account, orders] = await Promise.all([store.account(user.uid), store.listOrders(user.uid)]);
    return res.status(200).json({ ...account, billingConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET), orders });
  } catch (error) { return fail(res, error); }
}
