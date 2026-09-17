import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../../_lib/alphanet.js';
import { fail, requireUser } from '../../_lib/auth.js';
import { JobStore, type Job } from '../../../server/job-store.js';
import { ResultStore, type StoredResult } from '../../../server/result-store.js';
import { database } from '../../../server/admin.js';

type ProviderImage = { url: string; content_type?: string; width?: number; height?: number; sha256?: string };

/** Asks the provider for a fresh signature and stores the copy on the way through. */
async function refresh(uid: string, jobId: string, job: Job, store: JobStore, results: ResultStore): Promise<StoredResult | null> {
  if (!job.providerTaskId || job.status !== 'SUCCEEDED') return null;
  const task = await alphaNet.result(job.providerTaskId).catch(() => null) as { result?: { images?: ProviderImage[] }; images?: ProviderImage[] } | null;
  const source = task?.result?.images?.[0] || task?.images?.[0];
  if (!source?.url) return null;
  const meta = await results.save(uid, jobId, source).catch(() => null);
  if (meta) await store.attachResult(jobId, meta);
  const stored = await results.read(uid, jobId);
  if (stored) return stored;
  const downloaded = await results.download(source.url);
  return downloaded ? { ...downloaded, width: 0, height: 0, sha256: '' } : null;
}

/**
 * Serves one generation result to its owner so history keeps working after the provider's signed
 * link expires. A stored copy is used when present; otherwise the provider is asked to re-sign the
 * result (the provider keeps objects for about seven days) and the copy is stored on the way out.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const jobId = String(req.query.id || '');
    const store = new JobStore(database());
    const job = await store.read(uid, jobId);
    const results = new ResultStore(database());
    const image = await results.read(uid, jobId) || await refresh(uid, jobId, job, store, results);
    if (!image?.buffer.length) return res.status(404).json({ error: 'The result for this generation is no longer available.' });
    res.setHeader('Content-Type', image.contentType);
    res.setHeader('Cache-Control', 'private, max-age=3600');
    return res.status(200).send(image.buffer);
  } catch (error) { return fail(res, error); }
}
