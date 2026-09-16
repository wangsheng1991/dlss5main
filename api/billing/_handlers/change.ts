import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { requirePriceId, stripe } from '../../_lib/stripe.js';
import { database } from '../../../server/admin.js';
import { BillingStore } from '../../../server/billing-store.js';
import { isPurchasablePlan } from '../../../src/config/plans.js';

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
    const before = typeof current.latest_invoice === 'string' ? current.latest_invoice : current.latest_invoice?.id || '';
    const updated = await client.subscriptions.update(account.subscriptionId, {
      items: [{ id: item.id, price }],
      proration_behavior: 'always_invoice',
      metadata: { uid: user.uid, plan },
      expand: ['latest_invoice'],
    });
    const updatedItem = updated.items.data[0];
    if (!updatedItem) throw new Error('Subscription update returned no item');
    let invoice = typeof updated.latest_invoice === 'object' ? updated.latest_invoice : updated.latest_invoice ? await client.invoices.retrieve(updated.latest_invoice) : null;
    // Stripe charges the proration asynchronously, so give it a moment before answering.
    for (let attempt = 0; invoice && invoice.status !== 'paid' && attempt < 4; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      invoice = await client.invoices.retrieve(invoice.id);
    }
    // Only the invoice this change created may grant, and it is keyed by its own id, so a second
    // switch in the same period grants again while a retried webhook cannot.
    if (!invoice || invoice.id === before || invoice.billing_reason !== 'subscription_update') {
      await store.setPlan(user.uid, plan);
      return res.status(200).json({ status: 'active', tier: plan, credits: account.credits, applied: false, prorated: true });
    }
    if (invoice.status !== 'paid') {
      // Not settled yet: `invoice.paid` grants the new allowance once Stripe collects it.
      return res.status(202).json({ status: invoice.status, tier: plan, credits: account.credits, applied: false });
    }
    const granted = await store.grantPayment({
      uid: user.uid,
      plan,
      periodKey: `invoice:${invoice.id}`,
      kind: 'change',
      amountTotal: invoice.total ?? 0,
      currency: invoice.currency || 'usd',
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
