import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'node:crypto';
import { alphaNet } from '../_lib/alphanet';
import { fail, requireUser } from '../_lib/auth';
import { createOperation, reserveCredit, refundCredit } from '../_lib/firestore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid, idToken } = await requireUser(req);
    const { prompt, image_ids, width = 1024, height = 1024, seed = 42, num_inference_steps = 4, output_format = 'webp' } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) return res.status(400).json({ error: 'prompt is required' });
    if (!Array.isArray(image_ids) || image_ids.length < 1 || image_ids.length > 16 || image_ids.some((id) => typeof id !== 'string')) return res.status(400).json({ error: 'image_ids are required' });
    const idempotencyKey = req.headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || !idempotencyKey || idempotencyKey.length > 128) return res.status(400).json({ error: 'Idempotency-Key is required' });
    await reserveCredit(uid, idToken);
    let accepted;
    try { accepted = await alphaNet.submit({ prompt: prompt.trim(), image_ids, width, height, seed, num_inference_steps, output_format }, idempotencyKey); } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 409) { try { await refundCredit(uid, idToken); } catch (refundError) { console.error('Credit refund reconciliation required', refundError); } }
      throw error;
    }
    try { await createOperation(accepted.task_id, idToken, { uid, idempotencyKey, status: 'QUEUED', imageId: image_ids[0], createdAt: new Date().toISOString() }); } catch (error) { if ((error as { status?: number }).status !== 409) throw error; }
    return res.status(202).json({ jobId: accepted.task_id, status: 'QUEUED' });
  } catch (error) { return fail(res, error); }
}
