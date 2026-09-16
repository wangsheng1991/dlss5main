import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../../_lib/alphanet.js';
import { fail, requireUser } from '../../_lib/auth.js';
import { JobStore } from '../../../server/job-store.js';
import { database } from '../../../server/admin.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { uid } = await requireUser(req);
    const operationId = String(req.query.id || '');
    const store = new JobStore(database());
    const operation = await store.read(uid, operationId);
    if (!operation.providerTaskId) return res.status(200).json({ jobId: operationId, status: operation.status });
    const task = await alphaNet.poll(operation.providerTaskId);
    const status = task.status === 'SUCCESS' ? 'SUCCEEDED' : task.status === 'FAILURE' ? 'FAILED' : 'RUNNING';
    if (status === 'SUCCEEDED' || status === 'FAILED') await store.settle(uid, operationId, status, task.error || '');
    return res.status(200).json({ jobId: operationId, status, progress: task.progress, result: task.result, error: task.error });
  } catch (error) { return fail(res, error); }
}
