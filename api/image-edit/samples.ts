import { existsSync, readFileSync } from 'node:fs';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../_lib/alphanet.js';
import { fail } from '../_lib/auth.js';
import { SAMPLES, isSampleId } from '../../src/config/samples.js';
import { SampleStore } from '../../server/sample-store.js';
import { database } from '../../server/admin.js';

/**
 * Free example generation for signed-out visitors.
 *
 * GET  /api/image-edit/samples?sample=sample1           the cached result bytes (public)
 * POST /api/image-edit/samples { sample: "sample1" }    runs the example once, then serves the cache
 *
 * Only the catalog in src/config/samples.ts can be requested, the prompt is fixed there, and the
 * result is cached in Firestore, so repeated visits cost neither provider compute nor credits.
 * Uploading a visitor's own image keeps requiring an account.
 */

const POLL_INTERVAL_MS = 1500;
const POLL_BUDGET_MS = 45000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clientIp = (req: VercelRequest) => String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim();

async function serve(req: VercelRequest, res: VercelResponse, sampleId: string, store: SampleStore) {
  const cached = await store.read(sampleId);
  if (!cached) return res.status(404).json({ error: 'This example is not ready yet.' });
  res.setHeader('Content-Type', cached.contentType);
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  return res.status(200).send(cached.buffer);
}

/** True when the bytes really are an image, so a rewrite that serves HTML cannot be mistaken for one. */
function isImage(contentType: string | null, buffer: Buffer) {
  const head = buffer.subarray(0, 12);
  const magic = (head[0] === 0xff && head[1] === 0xd8) || (head[0] === 0x89 && head[1] === 0x50) || head.subarray(0, 4).toString('latin1') === 'RIFF';
  return magic && (contentType || '').startsWith('image/');
}

/** The catalog image lives in public/: read it locally when present, otherwise from our own origin. */
async function readInput(req: VercelRequest, src: string) {
  const local = `${process.cwd()}/public${src}`;
  if (existsSync(local)) {
    const bytes = readFileSync(local);
    if (isImage(src.endsWith('.png') ? 'image/png' : 'image/jpeg', bytes)) return bytes;
  }
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  for (const origin of [`${proto}://${req.headers.host}`, 'https://www.dlss5nvidia.com']) {
    const response = await fetch(`${origin}${src}`, { signal: AbortSignal.timeout(20000) }).catch(() => null);
    if (!response?.ok) continue;
    const bytes = Buffer.from(await response.arrayBuffer());
    if (isImage(response.headers.get('content-type'), bytes)) return bytes;
  }
  throw new Error('Example image is unavailable');
}

/** Generates the example with the fixed catalog prompt and stores the copy guests will receive. */
async function warm(req: VercelRequest, sampleId: string, store: SampleStore) {
  const sample = SAMPLES[sampleId];
  const bytes = await readInput(req, sample.src);
  const ticket = await alphaNet.createUpload({ fileName: sample.fileName, contentType: sample.contentType, size: bytes.length });
  const upload = await fetch(ticket.upload_url, { method: 'PUT', headers: ticket.headers, body: bytes, signal: AbortSignal.timeout(120000) });
  if (!upload.ok) throw new Error(`Example upload failed (${upload.status})`);
  const key = `sample-warm:${sampleId}:${Date.now()}`;
  const accepted = await alphaNet.submit({ prompt: sample.prompt, image_ids: [ticket.file_id], width: 1024, height: 1024, seed: 42, num_inference_steps: 4, output_format: 'webp' }, key);
  const deadline = Date.now() + POLL_BUDGET_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const task = await alphaNet.poll(accepted.task_id) as { status?: string; result?: { images?: Array<{ url: string; content_type?: string; width?: number; height?: number; sha256?: string }> }; error?: string };
    if (task.status === 'FAILURE') throw new Error(task.error || 'Example generation failed');
    const image = task.result?.images?.[0];
    if (task.status === 'SUCCESS' && image?.url) return store.save(sampleId, sample.prompt, image);
  }
  throw new Error('Example generation is still running. Try again in a moment.');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const store = new SampleStore(database());
  try {
    const sampleId = String((req.method === 'GET' ? req.query.sample : req.body?.sample) || '');
    if (!isSampleId(sampleId)) return res.status(400).json({ error: 'Unknown example.' });
    if (req.method === 'GET') return await serve(req, res, sampleId, store);
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    await store.countGuest(clientIp(req));
    const sample = SAMPLES[sampleId];
    const payload = { status: 'SUCCEEDED', sample: sampleId, prompt: sample.prompt, input: sample.src, result: `/api/image-edit/samples?sample=${sampleId}` };
    if (await store.read(sampleId)) return res.status(200).json({ ...payload, cached: true });

    if (!(await store.claimWarm(sampleId))) return res.status(202).json({ status: 'WARMING', sample: sampleId });
    try {
      const saved = await warm(req, sampleId, store);
      return res.status(200).json({ ...payload, cached: false, width: saved.width, height: saved.height });
    } catch (error) {
      await store.releaseWarm(sampleId).catch(() => {});
      throw error;
    }
  } catch (error) { return fail(res, error); }
}
