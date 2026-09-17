import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth.js';
import { JobStore } from '../../server/job-store.js';
import { database } from '../../server/admin.js';

/** Daily sign-in allowance. Credits are granted by the server only; retries for the same day are rejected. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    return res.status(200).json(await new JobStore(database()).checkIn(uid));
  } catch (error) { return fail(res, error); }
}
