import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../../_lib/alphanet';
import { fail, requireUser } from '../../_lib/auth';
import { getOperation, refundCredit, updateOperation } from '../../_lib/firestore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { uid, idToken } = await requireUser(req);
    const taskId = String(req.query.id || '');
    if (!taskId || taskId.length > 200) return res.status(400).json({ error: 'Invalid task id' });
    const operation = await getOperation(taskId, idToken);
    if (!operation || operation.uid !== uid) return res.status(404).json({ error: 'Job not found' });
    const task = await alphaNet.poll(taskId);
    const status = task.status === 'SUCCESS' ? 'SUCCEEDED' : task.status === 'FAILURE' ? 'FAILED' : 'RUNNING';
    if (status === 'SUCCEEDED') await updateOperation(taskId, idToken, { status, settled: true, completedAt: new Date().toISOString() });
    if (status === 'FAILED' && operation.settled !== true && operation.refunded !== true) {
      try { await refundCredit(uid, idToken); await updateOperation(taskId, idToken, { status, refunded: true, settled: true, completedAt: new Date().toISOString() }); }
      catch (refundError) { console.error('Credit refund reconciliation required', refundError); return res.status(502).json({ error: 'Generation failed; refund is pending reconciliation' }); }
    }
    return res.status(200).json({ jobId: taskId, status, progress: task.progress, result: task.result });
  } catch (error) { return fail(res, error); }
}
