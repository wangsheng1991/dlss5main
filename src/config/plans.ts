/**
 * Single plan catalog for display, enforcement and billing.
 * Server-side code (job-store, billing) imports this file too, so keep it dependency-free.
 * `priceUsd` is charged monthly by the billing API; enforcement always belongs to the server API.
 */
export const PLANS = {
  free: { name: 'Free', monthlyCredits: 10, dailyGenerationLimit: 3, maxConcurrentJobs: 1, priceUsd: 0, purchasable: false },
  pro: { name: 'Pro', monthlyCredits: 500, dailyGenerationLimit: 50, maxConcurrentJobs: 2, priceUsd: 19, purchasable: true },
  team: { name: 'Team', monthlyCredits: 2000, dailyGenerationLimit: 200, maxConcurrentJobs: 5, priceUsd: 79, purchasable: true },
} as const;

export type PlanId = keyof typeof PLANS;
export type PurchasablePlanId = 'pro' | 'team';

export const PAID_PLANS = (Object.keys(PLANS) as PlanId[]).filter((id) => PLANS[id].purchasable) as PurchasablePlanId[];
export const isPurchasablePlan = (value: unknown): value is PurchasablePlanId => typeof value === 'string' && (PAID_PLANS as string[]).includes(value);
export const planOf = (tier: unknown): PlanId => (typeof tier === 'string' && tier in PLANS ? (tier as PlanId) : 'free');
