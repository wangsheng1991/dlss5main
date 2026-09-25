import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet, alphaNetSuperRes, alphaNetTools } from '../_lib/alphanet.js';
import { fail, requireUser } from '../_lib/auth.js';
import { JobStore } from '../../server/job-store.js';
import { database } from '../../server/admin.js';
import { enhanceOutput, enhancePrompt, isEnhanceFactor, preserveOutput } from '../../src/config/enhance.js';
import { buildToolTask, isToolId, isVectorizePreset, pixelCheckNote, toolNeedsPrompt, toolOptionError, TOOL_EXTRA_MAX, TOOL_OPTIONS, TOOL_REFERENCES, type ToolId } from '../../src/config/tools.js';

type Body = Record<string, unknown>;

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/**
 * The named options a request actually carried, and nothing else — `toolOptionError` reports unknown
 * keys, so handing it the whole body would make every request look wrong.
 */
function toolOptionsFromBody(mode: ToolId, body: Body): Record<string, string> {
  const picked: Record<string, string> = {};
  for (const spec of TOOL_OPTIONS[mode] || []) {
    if (body[spec.key] !== undefined) picked[spec.key] = body[spec.key] as string;
  }
  return picked;
}

/**
 * The tool lines. Unlike the editing models these own their output geometry, so no size or format
 * field is sent — asking for one is refused upstream rather than ignored, which is exactly the
 * behaviour we want kept. The A-line tools (`tryon`, `interior`, `retouch`, `makeup`) go one step
 * further: their prompt is a server-side asset, so the browser sends named options and never text.
 */
async function submitTool(uid: string, mode: ToolId, body: Body, idempotencyKey: string, store: JobStore) {
  const imageIds = body.image_ids;
  const references = TOOL_REFERENCES[mode];
  // The order of the references is their meaning (person then garment, room then style), so the count
  // is checked here and nothing is reordered.
  if (!Array.isArray(imageIds) || imageIds.length < references.min || imageIds.length > references.max || imageIds.some((id) => typeof id !== 'string')) {
    return { error: `image_ids must contain ${references.min === references.max ? `exactly ${references.min}` : `${references.min} to ${references.max}`} uploaded file id${references.max > 1 ? 's' : ''} (${references.slots.join(', then ')})` };
  }
  const prompt = text(body.prompt);
  if (toolNeedsPrompt(mode)) {
    if (!prompt) return { error: mode === 'erase' ? 'Describe what should be removed' : 'prompt is required' };
    if (prompt.length > 4000) return { error: 'prompt is too long' };
  }
  // The preset is a name, not a parameter set: an unknown value is a client bug and must not be
  // forwarded for the provider to guess at.
  if (mode === 'vectorize' && body.preset !== undefined && !isVectorizePreset(body.preset)) {
    return { error: 'preset must be logo, illustration or photo' };
  }
  // Same rule for the A-line option names — and the same list the studio offered, so a caller that
  // posts a value the page never showed is told which values exist.
  const options = toolOptionsFromBody(mode, body);
  const optionError = toolOptionError(mode, options);
  if (optionError) return { error: optionError };
  const extra = text(body.extra);
  if (extra.length > TOOL_EXTRA_MAX) return { error: `extra must be at most ${TOOL_EXTRA_MAX} characters` };
  const task = buildToolTask(mode, {
    imageIds: imageIds as string[], prompt,
    steps: body.num_inference_steps as number | undefined,
    seed: body.seed as number | undefined,
    preset: mode === 'vectorize' && isVectorizePreset(body.preset) ? body.preset : undefined,
    maxEdge: mode === 'vectorize' ? (body.max_edge as number | undefined) : undefined,
    options: toolOptionsFromBody(mode, body),
    extra: mode === 'interior' ? extra : undefined,
  });
  // The stored input doubles as the history record, so the tool name is kept next to the task.
  const claim = await store.claim(uid, idempotencyKey, { ...task, tool: mode });
  if (!claim.submit) return { jobId: claim.id, status: claim.job.status, replayed: true };
  try {
    const accepted = await alphaNetTools.submit(task, idempotencyKey);
    await store.accepted(claim.id, claim.job.leaseOwner, accepted.task_id);
    return { jobId: claim.id, status: 'QUEUED', tool: mode, model: task.model };
  } catch (error) {
    await store.accepted(claim.id, claim.job.leaseOwner);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const body = (req.body || {}) as Body;
    const mode = text(body.mode) || 'edit';
    const idempotencyKey = req.headers['idempotency-key'];
    if (typeof idempotencyKey !== 'string' || !idempotencyKey || idempotencyKey.length > 128) return res.status(400).json({ error: 'Idempotency-Key is required' });
    const store = new JobStore(database());

    if (isToolId(mode)) {
      const outcome = await submitTool(uid, mode, body, idempotencyKey, store);
      if ('error' in outcome) return res.status(400).json({ error: outcome.error });
      return res.status(202).json(outcome);
    }

    const { prompt, image_ids, width = 1024, height = 1024, seed = 42, num_inference_steps = 4, output_format = 'webp', factor, source_width, source_height } = body;
    if (mode !== 'edit' && mode !== 'enhance') return res.status(400).json({ error: 'Unknown mode' });
    // AlphaNet accepts 1–4 input images per task; the prototype only ever sends one.
    if (!Array.isArray(image_ids) || image_ids.length < 1 || image_ids.length > 4 || image_ids.some((id) => typeof id !== 'string')) return res.status(400).json({ error: 'image_ids are required' });

    // Both modes size the output from the source, capped by the provider's 1536 px edge. This keeps
    // a landscape or portrait edit from silently becoming a square result.
    let finalPrompt = '';
    let targetWidth = width as number;
    let targetHeight = height as number;
    // Both branches already insist on the source geometry; keeping it in one pair of variables lets
    // the pixel ceiling be checked once, whichever mode asked.
    let sourceWidth = 0;
    let sourceHeight = 0;
    if (mode === 'enhance') {
      if (!isEnhanceFactor(factor)) return res.status(400).json({ error: 'factor must be 2 or 4' });
      if (!Number.isSafeInteger(source_width) || !Number.isSafeInteger(source_height) || (source_width as number) < 16 || (source_height as number) < 16 || (source_width as number) > 8192 || (source_height as number) > 8192) {
        return res.status(400).json({ error: 'source_width and source_height are required' });
      }
      sourceWidth = source_width as number;
      sourceHeight = source_height as number;
      const output = enhanceOutput(sourceWidth, sourceHeight, factor);
      targetWidth = output.width;
      targetHeight = output.height;
      finalPrompt = enhancePrompt(targetWidth, targetHeight);
    } else {
      if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) return res.status(400).json({ error: 'prompt is required' });
      // Replays created before geometry metadata existed can still complete with their saved size.
      sourceWidth = (source_width ?? width) as number;
      sourceHeight = (source_height ?? height) as number;
      if (!Number.isSafeInteger(sourceWidth) || !Number.isSafeInteger(sourceHeight) || sourceWidth < 16 || sourceHeight < 16 || sourceWidth > 8192 || sourceHeight > 8192) {
        return res.status(400).json({ error: 'source_width and source_height are required' });
      }
      const output = source_width && source_height ? preserveOutput(sourceWidth, sourceHeight) : { width: width as number, height: height as number };
      targetWidth = output.width;
      targetHeight = output.height;
      finalPrompt = `${prompt.trim()} Preserve the original aspect ratio, framing, camera angle, composition and object placement. Apply only the requested edit; do not add, remove or crop content.`;
    }

    // Second gate on the same ceiling as the upload: a client that skipped the studio still gets the
    // reason now, before a credit is reserved or the task takes a place in the provider's queue.
    const oversize = pixelCheckNote(sourceWidth, sourceHeight, mode);
    if (oversize) return res.status(400).json({ error: oversize });

    const claim = await store.claim(uid, idempotencyKey, { prompt: finalPrompt, image_ids: image_ids as string[], width: targetWidth, height: targetHeight, seed: seed as number, num_inference_steps: num_inference_steps as number, output_format: output_format as string });
    if (!claim.submit) return res.status(202).json({ jobId: claim.id, status: claim.job.status, replayed: true });
    // Enhancement prefers the expansion cluster and falls back to the original project while its key
    // is not provisioned; both answer the same contract.
    const client = mode === 'enhance' && process.env.ALPHANET_SUPERRES_API_KEY ? alphaNetSuperRes : alphaNet;
    try {
      const accepted = await client.submit({ prompt: finalPrompt, image_ids: image_ids as string[], width: targetWidth, height: targetHeight, seed: seed as number, num_inference_steps: num_inference_steps as number, output_format: output_format as string }, idempotencyKey);
      await store.accepted(claim.id, claim.job.leaseOwner, accepted.task_id);
      return res.status(202).json({ jobId: claim.id, status: 'QUEUED', width: targetWidth, height: targetHeight });
    } catch (error) {
      await store.accepted(claim.id, claim.job.leaseOwner);
      throw error;
    }
  } catch (error) { return fail(res, error); }
}
