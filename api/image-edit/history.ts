import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../../_lib/auth.js';
import { JobStore } from '../../server/job-store.js';
import { database } from '../../server/admin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const jobs = await new JobStore(database()).list(uid, Number(req.query.limit) || 20);
    return res.status(200).json({ jobs });
  } catch (error) { return fail(res, error); }
}
