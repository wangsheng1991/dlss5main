import type { Firestore } from 'firebase-admin/firestore';
import { PLANS, planOf, type PurchasablePlanId } from '../src/config/plans.js';
import { ApiError } from './errors.js';

const month = () => new Date().toISOString().slice(0, 7);
const day = () => new Date().toISOString().slice(0, 10);
const count = (value: unknown) => (Number.isSafeInteger(value) && Number(value) >= 0 ? Number(value) : 0);
/** Firestore document ids cannot contain a slash and must stay well below 1500 bytes. */
export const orderId = (key: string) => key.replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 900);

/** Which provider charges the subscription; each one stores its own binding fields. */
export type PaymentProvider = 'stripe' | 'paypal' | 'dodo';

export type SubscriptionPayment = {
  uid: string;
  plan: PurchasablePlanId;
  /** Defaults to Stripe so existing call sites stay unchanged. */
  provider?: PaymentProvider;
  /**
   * Identifies exactly one subscription period (`sub:<subscription id>:<period start>`).
   * Both the checkout confirmation and the `invoice.paid` webhook derive the same key,
   * so a retried or duplicated delivery can never grant the same period twice.
   */
  periodKey: string;
  kind: 'subscription' | 'renewal' | 'change';
  amountTotal: number;
  currency: string;
  customerId?: string;
  subscriptionId?: string;
  periodEnd?: number;
};

export type BillingOrderKind = 'subscription' | 'renewal' | 'change' | 'cancellation' | 'refund' | 'dispute' | 'payment_failed';

export type BillingOrder = {
  uid: string; plan: string; kind: BillingOrderKind;
  periodKey: string; credits: number; amountTotal: number; currency: string;
  customerId?: string; subscriptionId?: string; createdAt: number;
};

export class BillingStore {
  constructor(readonly db: Firestore) {}

  /** Billing view of one account, safe to return to its owner. */
  async account(uid: string) {
    const data = (await this.db.doc(`users/${uid}`).get()).data() || {};
    const stripeSubscriptionId = typeof data.stripeSubscriptionId === 'string' ? data.stripeSubscriptionId : '';
    const paypalSubscriptionId = typeof data.paypalSubscriptionId === 'string' ? data.paypalSubscriptionId : '';
    const dodoSubscriptionId = typeof data.dodoSubscriptionId === 'string' ? data.dodoSubscriptionId : '';
    return {
      tier: planOf(data.tier),
      credits: count(data.credits),
      // `subscriptionId` is the id of whichever provider charges this account, so callers that only
      // need "is this account subscribed" do not have to care which one it is.
      subscriptionId: stripeSubscriptionId || paypalSubscriptionId || dodoSubscriptionId,
      provider: (stripeSubscriptionId ? 'stripe' : paypalSubscriptionId ? 'paypal' : dodoSubscriptionId ? 'dodo' : '') as PaymentProvider | '',
      customerId: typeof data.stripeCustomerId === 'string' ? data.stripeCustomerId : '',
      paypalPayerId: typeof data.paypalPayerId === 'string' ? data.paypalPayerId : '',
      subscriptionStatus: typeof data.subscriptionStatus === 'string' ? data.subscriptionStatus : '',
      currentPeriodEnd: Number.isSafeInteger(data.currentPeriodEnd) ? Number(data.currentPeriodEnd) : 0,
    };
  }

  /** Account bound to a provider customer or subscription, used by events that carry no metadata. */
  async byField(field: 'stripeCustomerId' | 'stripeSubscriptionId' | 'paypalSubscriptionId' | 'dodoSubscriptionId' | 'email', value: string) {
    if (!value) return '';
    const snapshot = await this.db.collection('users').where(field, '==', value).limit(1).get();
    return snapshot.docs[0]?.id || '';
  }

  /**
   * Binds a PayPal subscription to its account before PayPal reports it as paid, because approval
   * happens on PayPal's site and the webhook that follows only carries the subscription id.
   */
  async bindPaypalSubscription(uid: string, subscriptionId: string, status: string) {
    await this.db.doc(`users/${uid}`).set(
      { paypalSubscriptionId: subscriptionId, paypalSubscriptionStatus: status, updatedAt: new Date().toISOString() },
      { merge: true },
    );
  }

  /**
   * PayPal charges from a billing plan object created once per environment, so the ids of the
   * product and of each plan are remembered instead of being recreated on every checkout.
   */
  async paypalProductId(environment: string) {
    const data = (await this.db.doc('billing_config/paypal').get()).data();
    const value = data?.environments?.[environment]?.productId;
    return typeof value === 'string' ? value : '';
  }

  async setPaypalProductId(environment: string, productId: string) {
    await this.db.doc('billing_config/paypal').set({ environments: { [environment]: { productId } } }, { merge: true });
  }

  async paypalPlanId(environment: string, plan: PurchasablePlanId) {
    const data = (await this.db.doc('billing_config/paypal').get()).data();
    const value = data?.environments?.[environment]?.plans?.[plan];
    return typeof value === 'string' ? value : '';
  }

  async setPaypalPlanId(environment: string, plan: PurchasablePlanId, planId: string) {
    await this.db.doc('billing_config/paypal').set({ environments: { [environment]: { plans: { [plan]: planId } } } }, { merge: true });
  }

  /** Only the fields the public billing view exposes are ever written here. */
  async setStatus(uid: string, status: string) {
    await this.db.doc(`users/${uid}`).set({ subscriptionStatus: status, updatedAt: new Date().toISOString() }, { merge: true });
  }

  /** Plan change without a charge (Stripe created no proration invoice): keep the credits as they are. */
  async setPlan(uid: string, plan: PurchasablePlanId) {
    await this.db.doc(`users/${uid}`).set({ tier: plan, quotaMonth: month(), updatedAt: new Date().toISOString() }, { merge: true });
  }

  /**
   * Records a refund, dispute or failed payment once per Stripe object. Credits are clawed back
   * only when the caller passes a positive `credits` (a full refund of the granted period).
   */
  async recordAdjustment(input: { uid: string; kind: BillingOrderKind; key: string; credits?: number; amountTotal: number; currency: string; customerId?: string; subscriptionId?: string }) {
    const ref = this.db.doc(`billing_orders/${orderId(input.key)}`);
    const userRef = this.db.doc(`users/${input.uid}`);
    return this.db.runTransaction(async (tx) => {
      const [previous, user] = await Promise.all([tx.get(ref), tx.get(userRef)]);
      if (previous.exists) return { recorded: false, credits: count(user.data()?.credits) };
      if (!user.exists) throw new ApiError(404, 'account_missing', 'Account is not initialized');
      const account = user.data()!;
      const deduction = Math.min(count(account.credits), Math.max(0, Math.floor(input.credits || 0)));
      const after = count(account.credits) - deduction;
      tx.set(ref, {
        uid: input.uid, plan: planOf(account.tier), kind: input.kind, periodKey: input.key,
        credits: -deduction, amountTotal: input.amountTotal, currency: input.currency, createdAt: Date.now(),
        ...(input.customerId ? { customerId: input.customerId } : {}),
        ...(input.subscriptionId ? { subscriptionId: input.subscriptionId } : {}),
      });
      tx.create(this.db.doc(`credit_ledger/billing_${orderId(input.key)}`), { uid: input.uid, kind: input.kind, units: -deduction, createdAt: Date.now() });
      if (deduction) tx.update(userRef, { credits: after, updatedAt: new Date().toISOString() });
      return { recorded: true, credits: after };
    });
  }

  /** Most recent paid period, so a refund claws back the credits that period actually granted. */
  async latestGrant(uid: string) {
    const snapshot = await this.db.collection('billing_orders').where('uid', '==', uid).orderBy('createdAt', 'desc').limit(10).get();
    return snapshot.docs.map((doc) => doc.data() as BillingOrder).find((order) => order.kind === 'subscription' || order.kind === 'renewal' || order.kind === 'change') || null;
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
      const provider = input.provider || 'stripe';
      tx.update(userRef, {
        tier: input.plan,
        credits,
        quotaMonth: month(),
        quotaDay: day(),
        dayUsed: 0,
        subscriptionStatus: 'active',
        // Each provider keeps its own binding, so a PayPal purchase can never be mistaken for a
        // Stripe customer (and the Stripe portal keeps working for Stripe buyers).
        ...(input.customerId ? (provider === 'paypal' ? { paypalPayerId: input.customerId } : { stripeCustomerId: input.customerId }) : {}),
        ...(input.subscriptionId ? (provider === 'paypal'
          ? { paypalSubscriptionId: input.subscriptionId, paypalSubscriptionStatus: 'active' }
          : { stripeSubscriptionId: input.subscriptionId }) : {}),
        ...(input.periodEnd ? { currentPeriodEnd: input.periodEnd } : {}),
        updatedAt: new Date().toISOString(),
      });
      tx.create(this.db.doc(`credit_ledger/billing_${orderId(input.periodKey)}`), {
        uid: input.uid, kind: 'purchase', units: credits, previousTier: planOf(account.tier), createdAt: Date.now(),
      });
      return { granted: true, tier: input.plan, credits };
    });
  }

  /** Subscription renewal, cancellation or status change pushed by a payment provider. */
  async syncSubscription(subscriptionId: string, status: string, periodEnd?: number, provider: PaymentProvider = 'stripe') {
    const field = provider === 'paypal' ? 'paypalSubscriptionId' : provider === 'dodo' ? 'dodoSubscriptionId' : 'stripeSubscriptionId';
    const snapshot = await this.db.collection('users').where(field, '==', subscriptionId).limit(1).get();
    const user = snapshot.docs[0];
    if (!user) return { updated: false, uid: '' };
    const account = user.data();
    const canceled = status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired';
    const providerStatus = provider === 'paypal' ? { paypalSubscriptionStatus: status } : provider === 'dodo' ? { dodoSubscriptionStatus: status } : {};
    if (canceled) {
      await this.db.doc(`billing_orders/${orderId(`cancel:${subscriptionId}`)}`).set({
        uid: user.id, plan: planOf(account.tier), kind: 'cancellation', periodKey: `cancel:${subscriptionId}`,
        credits: 0, amountTotal: 0, currency: 'usd', subscriptionId, createdAt: Date.now(),
      });
      await user.ref.update({ tier: 'free', subscriptionStatus: status, ...providerStatus, ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}), updatedAt: new Date().toISOString() });
      return { updated: true, uid: user.id };
    }
    await user.ref.update({ subscriptionStatus: status, ...providerStatus, ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}), updatedAt: new Date().toISOString() });
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
