import { ApiError } from './errors.js';

export const VIDEO_HIGHLIGHTS_MODEL = 'studio-video-highlights';
export type HighlightsPhase = 'analyze' | 'export';

const available = () => new ApiError(503, 'video_gateway_unavailable', 'Video gateway temporarily unavailable');
const taskIdPattern = /^task_[A-Za-z0-9_-]{8,100}$/;

export async function videoGatewayRequest(path: string, init?: { id: string; phase: HighlightsPhase }) {
  const key = process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY;
  if (!key) throw available();
  // Use the same AlphaNet gateway as the image client, with this beta's own project key.
  const base = process.env.ALPHANET_BASE_URL || 'https://dashboard.alphanetplus.com';
  try {
    const response = await fetch(base.replace(/\/$/, '') + path, {
      method: init ? 'POST' : 'GET',
      headers: {
        authorization: 'Bearer ' + key,
        ...(init ? {
          'content-type': 'application/json',
          'idempotency-key': 'video-highlights:' + init.id + ':' + init.phase,
        } : {}),
      },
      ...(init ? { body: JSON.stringify({ model: VIDEO_HIGHLIGHTS_MODEL, job_id: init.id, phase: init.phase }) } : {}),
      signal: AbortSignal.timeout(12000),
      redirect: 'error',
    });
    if (!response.ok) throw available();
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw available();
    return data as Record<string, unknown>;
  } catch {
    throw available();
  }
}

export async function submitVideoGateway(id: string, phase: HighlightsPhase) {
  const accepted = await videoGatewayRequest('/v1/tasks/' + VIDEO_HIGHLIGHTS_MODEL, { id, phase });
  const data = accepted.data as Record<string, unknown> | undefined;
  const taskId = accepted.task_id ?? data?.task_id;
  if (typeof taskId !== 'string' || !taskIdPattern.test(taskId)) throw available();
  return taskId;
}

export async function readVideoGateway(taskId: string) {
  if (!taskIdPattern.test(taskId)) throw available();
  const task = await videoGatewayRequest('/v1/tasks/' + taskId);
  if (task.task_id !== taskId || task.platform !== VIDEO_HIGHLIGHTS_MODEL) throw available();
  return task;
}

export async function readVideoGatewayResult(taskId: string) {
  if (!taskIdPattern.test(taskId)) throw available();
  return videoGatewayRequest('/v1/tasks/' + taskId + '/artifacts/result/content');
}
