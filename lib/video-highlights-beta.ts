export const HIGHLIGHTS_MAX_BYTES = 32 * 1024 * 1024;
export const HIGHLIGHTS_MAX_SECONDS = 30;
export const HIGHLIGHTS_EVENTS = ['vehicle', 'person', 'bus'] as const;
export type HighlightsEvent = typeof HIGHLIGHTS_EVENTS[number];
export type HighlightsSegment = { start: number; end: number };

export const HIGHLIGHTS_HEARTBEAT_MS = 120_000;
export const HIGHLIGHTS_MAX_QUEUE_MS = 15 * 60_000;

export function highlightsWorkerAvailable(worker: { heartbeat?: number; leaseUntil?: number } | undefined, now: number) {
  return (worker?.heartbeat ?? 0) > now - HIGHLIGHTS_HEARTBEAT_MS || (worker?.leaseUntil ?? 0) > now;
}

export function highlightsStallReason(
  job: { status?: string; queuedAt?: number },
  worker: { active?: string; heartbeat?: number; leaseUntil?: number } | undefined,
  id: string,
  now: number,
) {
  if (job.status === 'queued' && typeof job.queuedAt === 'number' && now - job.queuedAt >= HIGHLIGHTS_MAX_QUEUE_MS) {
    return 'queue_timeout';
  }
  if (job.status === 'running' && worker?.active === id && typeof worker.leaseUntil === 'number' &&
    now >= worker.leaseUntil + HIGHLIGHTS_HEARTBEAT_MS && !highlightsWorkerAvailable(worker, now)) {
    return 'worker_lost';
  }
  return null;
}
