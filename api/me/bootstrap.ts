import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth';
import { database } from '../../server/admin';
import { JobStore } from '../../server/job-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const user = await requireUser(req);
    const profile = await new JobStore(database()).bootstrap(user.uid, user.email, user.displayName);
    return res.status(200).json({ tier: profile.tier, credits: profile.credits });
  } catch (error) { return fail(res, error); }
}
