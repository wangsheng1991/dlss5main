import type { Firestore } from 'firebase-admin/firestore';
import { PLANS, planOf, type PurchasablePlanId } from '../src/config/plans.js';
import { ApiError } from './errors.js';

const month = () => new Date().toISOString().slice(0, 7);
const day = () => new Date().toISOString().slice(0, 10);
const count = (value: unknown) => (Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0);
/** Firestore document ids cannot contain a slash and must stay well below 1500 bytes. */
export const orderId = (key: string) => key.replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 900);

export type SubscriptionPayment = {
  uid: string;
  plan: PurchasablePlanId;
  /**
   * Identifies exactly one subscription period (`sub:<subscription id>:<period start>`).
   * Both the checkout confirmation and the `invoice.paid` webhook derive the same key,
   * so a retried or duplicated delivery can never grant the same period twice.
   */
  periodKey: string;
  kind: 'subscription' | 'renewal';
  amountTotal: number;
  currency: string;
  customerId?: string;
  subscriptionId?: string;
  periodEnd?: number;
};

export type BillingOrder = {
  uid: string; plan: string; kind: 'subscription' | 'renewal' | 'cancellation';
  periodKey: string; credits: number; amountTotal: number; currency: string;
  customerId?: string; subscriptionId?: string; createdAt: number;
};

export class BillingStore {
  constructor(readonly db: Firestore) {}

  /** Billing view of one account, safe to return to its owner. */
  async account(uid: string) {
    const data = (await this.db.doc(`users/${uid}`).get()).data() || {};
    return {
      tier: planOf(data.tier),
      credits: count(data.credits),
      subscriptionStatus: typeof data.subscriptionStatus === 'string' ? data.subscriptionStatus : '',
      currentPeriodEnd: Number.isSafeInteger(data.currentPeriodEnd) ? Number(data.currentPeriodEnd) : 0,
    };
  }

  /** Stripe customer already bound to this account, so repeat purchases reuse one customer. */
  async customer(uid: string) {
    const snapshot = await this.db.doc(`users/${uid}`).get();
    const value = snapshot.data()?.stripeCustomerId;
    return typeof value === 'string' && value ? value : '';
  }

  async grantPayment(input: SubscriptionPayment) {
    const orderRef = this.db.doc(`billing_orders/${orderId(input.periodKey)}`);
    const userRef = this.db.doc(`users/${input.uid}`);
    const credits = PLANS[input.plan].monthlyCredits;
    return this.db.runTransaction(async (tx) => {
      const [previous, user] = await Promise.all([tx.get(orderRef), tx.get(userRef)]);
      if (previous.exists) {
        const account = user.data() || {};
        return { granted: false, tier: planOf(account.tier), credits: count(account.credits) };
      }
      if (!user.exists) throw new ApiError(404, 'account_missing', 'Account is not initialized');
      const account = user.data()!;
      const order: BillingOrder & { periodEnd?: number } = {
        uid: input.uid, plan: input.plan, kind: input.kind, periodKey: input.periodKey, credits,
        amountTotal: input.amountTotal, currency: input.currency, createdAt: Date.now(),
        ...(input.customerId ? { customerId: input.customerId } : {}),
        ...(input.subscriptionId ? { subscriptionId: input.subscriptionId } : {}),
        ...(input.periodEnd ? { periodEnd: input.periodEnd } : {}),
      };
      tx.set(orderRef, order);
      tx.update(userRef, {
        tier: input.plan,
        credits,
        quotaMonth: month(),
        quotaDay: day(),
        dayUsed: 0,
        subscriptionStatus: 'active',
        ...(input.customerId ? { stripeCustomerId: input.customerId } : {}),
        ...(input.subscriptionId ? { stripeSubscriptionId: input.subscriptionId } : {}),
        ...(input.periodEnd ? { currentPeriodEnd: input.periodEnd } : {}),
        updatedAt: new Date().toISOString(),
      });
      tx.create(this.db.doc(`credit_ledger/billing_${orderId(input.periodKey)}`), {
        uid: input.uid, kind: 'purchase', units: credits, previousTier: planOf(account.tier), createdAt: Date.now(),
      });
      return { granted: true, tier: input.plan, credits };
    });
  }

  /** Subscription renewal, cancellation or status change pushed by Stripe. */
  async syncSubscription(subscriptionId: string, status: string, periodEnd?: number) {
    const snapshot = await this.db.collection('users').where('stripeSubscriptionId', '==', subscriptionId).limit(1).get();
    const user = snapshot.docs[0];
    if (!user) return { updated: false, uid: '' };
    const account = user.data();
    const canceled = status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired';
    if (canceled) {
      await this.db.doc(`billing_orders/${orderId(`cancel:${subscriptionId}`)}`).set({
        uid: user.id, plan: planOf(account.tier), kind: 'cancellation', periodKey: `cancel:${subscriptionId}`,
        credits: 0, amountTotal: 0, currency: 'usd', subscriptionId, createdAt: Date.now(),
      });
      await user.ref.update({ tier: 'free', subscriptionStatus: status, ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}), updatedAt: new Date().toISOString() });
      return { updated: true, uid: user.id };
    }
    await user.ref.update({ subscriptionStatus: status, ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}), updatedAt: new Date().toISOString() });
    return { updated: true, uid: user.id };
  }

  async listOrders(uid: string, limit = 20) {
    const snapshot = await this.db.collection('billing_orders').where('uid', '==', uid).orderBy('createdAt', 'desc').limit(Math.min(Math.max(limit, 1), 50)).get();
    return snapshot.docs.map((doc) => {
      const order = doc.data() as BillingOrder;
      return { id: doc.id, plan: order.plan, kind: order.kind, credits: order.credits, amountTotal: order.amountTotal, currency: order.currency, createdAt: order.createdAt };
    });
  }
}
