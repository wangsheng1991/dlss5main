import type { VercelRequest, VercelResponse } from '@vercel/node';
import { alphaNet } from '../../_lib/alphanet';
import { fail, requireUser } from '../../_lib/auth';
import { getOperation } from '../../_lib/firestore';

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
    return res.status(200).json({ jobId: taskId, status, progress: task.progress, result: task.result });
  } catch (error) { return fail(res, error); }
}
