import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser, fail } from '../../_lib/auth.js';
import { parseFunnelEvent } from '../../../lib/conversion-events.js';
import { recordConversion } from '../../../server/conversion-log.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const account = await requireUser(req);
    if (!parseFunnelEvent(req.body)) return res.status(400).json({ error: 'Invalid event' });
    const result = await recordConversion(account.uid, req.body);
    if (result === 'limited') return res.status(429).json({ error: 'Event limit reached' });
    return res.status(200).json({ accepted: true });
  } catch (cause) { return fail(res, cause); }
}
