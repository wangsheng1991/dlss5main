/** Display-only plan limits. Enforcement belongs to the server API. */
export const PLANS = {
  free: { monthlyCredits: 10, dailyGenerationLimit: 3, maxConcurrentJobs: 1 },
  pro: { monthlyCredits: 500, dailyGenerationLimit: 50, maxConcurrentJobs: 2 },
  team: { monthlyCredits: 2000, dailyGenerationLimit: 200, maxConcurrentJobs: 5 },
} as const;

export type PlanId = keyof typeof PLANS;
