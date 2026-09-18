import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet, alphaNetSuperRes } from '../_lib/alphanet.js';
import { fail, requireUser } from '../_lib/auth.js';
import { JobStore } from '../../server/job-store.js';
import { database } from '../../server/admin.js';
import { enhanceOutput, enhancePrompt, isEnhanceFactor, preserveOutput } from '../../src/config/enhance.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const { prompt, image_ids, width = 1024, height = 1024, seed = 42, num_inference_steps = 4, output_format = 'webp', mode = 'edit', factor, source_width, source_height } = req.body || {};
    if (mode !== 'edit' && mode !== 'enhance') return res.status(400).json({ error: 'Unknown mode' });
    // AlphaNet accepts 1–4 input images per task; the prototype only ever sends one.
    if (!Array.isArray(image_ids) || image_ids.length < 1 || image_ids.length > 4 || image_ids.some((id) => typeof id !== 'string')) return res.status(400).json({ error: 'image_ids are required' });

    // Both modes size the output from the source, capped by the provider's 1536 px edge. This keeps
    // a landscape or portrait edit from silently becoming a square result.
    let finalPrompt = '';
    let targetWidth = width;
    let targetHeight = height;
    if (mode === 'enhance') {
      if (!isEnhanceFactor(factor)) return res.status(400).json({ error: 'factor must be 2 or 4' });
      if (!Number.isSafeInteger(source_width) || !Number.isSafeInteger(source_height) || source_width < 16 || source_height < 16 || source_width > 8192 || source_height > 8192) {
        return res.status(400).json({ error: 'source_width and source_height are required' });
      }
      const output = enhanceOutput(source_width, source_height, factor);
      targetWidth = output.width;
      targetHeight = output.height;
      finalPrompt = enhancePrompt(targetWidth, targetHeight);
    } else {
      if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) return res.status(400).json({ error: 'prompt is required' });
      // Replays created before geometry metadata existed can still complete with their saved size.
      const sourceWidth = source_width ?? width;
      const sourceHeight = source_height ?? height;
      if (!Number.isSafeInteger(sourceWidth) || !Number.isSafeInteger(sourceHeight) || sourceWidth < 16 || sourceHeight < 16 || sourceWidth > 8192 || sourceHeight > 8192) {
        return res.status(400).json({ error: 'source_width and source_height are required' });
      }
      const output = source_width && source_height ? preserveOutput(sourceWidth, sourceHeight) : { width: width as number, height: height as number };
      targetWidth = output.width;
      targetHeight = output.height;
      finalPrompt = `${prompt.trim()} Preserve the original aspect ratio, framing, camera angle, composition and object placement. Apply only the requested edit; do not add, remove or crop content.`;
    }

    const idempotencyKey = req.headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || !idempotencyKey || idempotencyKey.length > 128) return res.status(400).json({ error: 'Idempotency-Key is required' });
    const store = new JobStore(database());
    const claim = await store.claim(uid, idempotencyKey, { prompt: finalPrompt, image_ids, width: targetWidth, height: targetHeight, seed, num_inference_steps, output_format });
    if (!claim.submit) return res.status(202).json({ jobId: claim.id, status: claim.job.status, replayed: true });
    // Enhancement prefers the expansion cluster and falls back to the original project while its key
    // is not provisioned; both answer the same contract.
    const client = mode === 'enhance' && process.env.ALPHANET_SUPERRES_API_KEY ? alphaNetSuperRes : alphaNet;
    try {
      const accepted = await client.submit({ prompt: finalPrompt, image_ids, width: targetWidth, height: targetHeight, seed, num_inference_steps, output_format }, idempotencyKey);
      await store.accepted(claim.id, claim.job.leaseOwner, accepted.task_id);
      return res.status(202).json({ jobId: claim.id, status: 'QUEUED', width: targetWidth, height: targetHeight });
    } catch (error) {
      await store.accepted(claim.id, claim.job.leaseOwner);
      throw error;
    }
  } catch (error) { return fail(res, error); }
}
