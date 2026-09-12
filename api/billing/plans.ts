import type { VercelRequest, VercelResponse } from '@vercel/node';

const plans = {
  free: { id: 'free', monthlyCredits: 10, dailyGenerationLimit: 3, maxConcurrentJobs: 1 },
  pro: { id: 'pro', monthlyCredits: 500, dailyGenerationLimit: 50, maxConcurrentJobs: 2 },
  team: { id: 'team', monthlyCredits: 2000, dailyGenerationLimit: 200, maxConcurrentJobs: 5 },
} as const;

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  return res.status(200).json({ version: 1, currency: 'USD', plans });
}
