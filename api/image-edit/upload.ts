import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../_lib/alphanet';
import { fail, requireUser } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    await requireUser(req);
    const { fileName, contentType, size } = req.body || {};
    if (typeof fileName !== 'string' || !/^[\w .-]{1,180}$/.test(fileName)) return res.status(400).json({ error: 'Invalid file name' });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType) || !Number.isSafeInteger(size) || size < 1 || size > 20 * 1024 * 1024) return res.status(400).json({ error: 'Unsupported image or size' });
    const ticket = await alphaNet.createUpload({ fileName, contentType, size });
    return res.status(200).json(ticket);
  } catch (error) { return fail(res, error); }
}
