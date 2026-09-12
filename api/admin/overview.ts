import type { VercelRequest, VercelResponse } from '@vercel/node';

const plans = {
  free: { monthlyCredits: 10, dailyGenerationLimit: 3, maxConcurrentJobs: 1 },
  pro: { monthlyCredits: 500, dailyGenerationLimit: 50, maxConcurrentJobs: 2 },
  team: { monthlyCredits: 2000, dailyGenerationLimit: 200, maxConcurrentJobs: 5 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = (req.headers.authorization || '').startsWith('Bearer ') ? req.headers.authorization!.slice(7) : '';
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (!token || !apiKey || !admins.length) return res.status(403).json({ error: 'Admin access required' });
  try {
    const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), signal: AbortSignal.timeout(10_000) });
    if (!auth.ok) return res.status(401).json({ error: 'Invalid authentication token' });
    const account = (await auth.json() as { users?: Array<{ email?: string }> }).users?.[0];
    if (!account?.email || !admins.includes(account.email.toLowerCase())) return res.status(403).json({ error: 'Admin access required' });
    return res.status(200).json({ plans, services: { fal: Boolean(process.env.FAL_API_KEY), firebase: Boolean(process.env.FIREBASE_PROJECT_ID), billing: false }, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Admin overview failed', error);
    return res.status(503).json({ error: 'Admin service unavailable' });
  }
}
