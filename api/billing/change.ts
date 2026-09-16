import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth.js';
import { requirePriceId, stripe } from '../_lib/stripe.js';
import { database } from '../../server/admin.js';
import { BillingStore } from '../../server/billing-store.js';
import { isPurchasablePlan } from '../../src/config/plans.js';

/**
 * Switches an existing subscription between plans with Stripe proration, then grants the new plan's
 * allowance for the period that just started. The grant uses the same period key as the webhook, so
 * the `invoice.paid` that follows cannot grant twice.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const plan = (req.body || {}).plan;
    if (!isPurchasablePlan(plan)) return res.status(400).json({ error: 'Choose a paid plan: pro or team' });
    const store = new BillingStore(database());
    const account = await store.account(user.uid);
    if (!account.subscriptionId) return res.status(409).json({ error: 'You do not have a subscription yet', code: 'no_subscription' });
    if (account.tier === plan) return res.status(409).json({ error: `You are already on the ${plan} plan`, code: 'already_on_plan' });
    const price = requirePriceId(plan);
    const client = stripe();
    const current = await client.subscriptions.retrieve(account.subscriptionId);
    if (current.status !== 'active' && current.status !== 'trialing') {
      return res.status(409).json({ error: `This subscription is ${current.status} and cannot be changed`, code: 'subscription_inactive' });
    }
    const item = current.items.data[0];
    if (!item) return res.status(409).json({ error: 'This subscription has no billable item', code: 'subscription_empty' });
    await client.subscriptions.update(account.subscriptionId, {
      items: [{ id: item.id, price }],
      proration_behavior: 'always_invoice',
      metadata: { uid: user.uid, plan },
    });
    const updated = await client.subscriptions.retrieve(account.subscriptionId);
    const updatedItem = updated.items.data[0];
    if (!updatedItem) throw new Error('Subscription update returned no item');
    const granted = await store.grantPayment({
      uid: user.uid,
      plan,
      periodKey: `sub:${updated.id}:${updatedItem.current_period_start}`,
      kind: 'change',
      amountTotal: Math.max(0, updatedItem.price.unit_amount || 0),
      currency: updatedItem.price.currency || 'usd',
      customerId: account.customerId,
      subscriptionId: updated.id,
      periodEnd: updatedItem.current_period_end,
    });
    return res.status(200).json({ status: 'active', tier: granted.tier, credits: granted.credits, applied: granted.granted, prorated: true });
  } catch (error) {
    if (typeof (error as { status?: unknown }).status === 'number') return fail(res, error);
    console.error('Billing plan change failed', { type: (error as { type?: string }).type, message: (error as Error).message });
    return res.status(502).json({ error: 'Payment provider unavailable' });
  }
}
