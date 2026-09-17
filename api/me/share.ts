import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, requireUser } from '../_lib/auth.js';
import { database } from '../../server/admin.js';
import { JobStore } from '../../server/job-store.js';
import { SHARE_REWARD } from '../../src/config/promos.js';

/**
 * Share reward: the account sends a screenshot of its post and gets the credits straight away —
 * there is no human review, so the only guard is that each claim must reference a screenshot this
 * account uploaded itself, and each account can be paid once (the grant itself is idempotent).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const fileId = (req.body || {}).image_id;
    if (typeof fileId !== 'string' || !fileId || fileId.length > 200) return res.status(400).json({ error: 'A screenshot of your post is required' });
    const store = new JobStore(database());
    if (!(await store.ownedUpload(uid, fileId))) return res.status(400).json({ error: 'A screenshot of your post is required', code: 'screenshot_not_uploaded' });
    const result = await store.grantBonus(uid, SHARE_REWARD.id, SHARE_REWARD.credits, { screenshot: fileId });
    if (result.granted) await store.recordShare(uid, SHARE_REWARD.id, fileId);
    return res.status(200).json({ granted: result.granted, awarded: result.granted ? SHARE_REWARD.credits : 0, credits: result.credits, bonusCredits: result.bonusCredits });
  } catch (error) { return fail(res, error); }
}
