import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet, alphaNetTools } from '../../_lib/alphanet.js';
import { fail, requireUser } from '../../_lib/auth.js';
import { JobStore } from '../../../server/job-store.js';
import { ResultStore } from '../../../server/result-store.js';
import { database } from '../../../server/admin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const operationId = String(req.query.id || '');
    const store = new JobStore(database());
    const operation = await store.read(uid, operationId);
    if (!operation.providerTaskId) return res.status(200).json({ jobId: operationId, status: operation.status });
    // The C-line tools can be provisioned under their own key, and a task is only visible to the
    // project that submitted it — so read back whichever client accepted the job.
    let stored: Record<string, unknown> = {};
    try { stored = JSON.parse(operation.inputJson); } catch { /* an unreadable input still has a task id */ }
    const task = await (stored.tool ? alphaNetTools : alphaNet).poll(operation.providerTaskId);
    const status = task.status === 'SUCCESS' ? 'SUCCEEDED' : task.status === 'FAILURE' ? 'FAILED' : 'RUNNING';
    if (status === 'SUCCEEDED' || status === 'FAILED') await store.settle(uid, operationId, status, task.error || '');
    // History must outlive the provider's signed link, so the result is copied once it survives settling.
    const image = task.result?.images?.[0];
    if (status === 'SUCCEEDED' && image?.url && !operation.result) {
      try {
        const meta = await new ResultStore(database()).save(uid, operationId, image);
        await store.attachResult(operationId, meta);
      } catch { /* the live provider link still serves this response */ }
    }
    return res.status(200).json({ jobId: operationId, status, progress: task.progress, result: task.result, error: task.error });
  } catch (error) { return fail(res, error); }
}
