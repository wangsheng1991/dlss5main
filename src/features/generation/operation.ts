export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUBMISSION_UNCERTAIN' | 'SUCCEEDED' | 'FAILED';
export interface GenerationBody { prompt: string; image_ids: string[]; width: number; height: number; output_format: string }
export interface SavedOperation { version: 1; userId: string; key: string; body: GenerationBody; jobId?: string; createdAt: string; status?: JobStatus; outputUrl?: string }
const storageKey = (uid: string) => `dlss:operation:${uid}`;
export function readOperation(uid: string): SavedOperation | null {
  const raw = localStorage.getItem(storageKey(uid));
  if (!raw) return null;
  const value = JSON.parse(raw);
  if (value.version !== 1 || value.userId !== uid || typeof value.key !== 'string' || !value.body || !Array.isArray(value.body.image_ids)) throw new Error('Saved operation is unreadable. Contact support before starting another generation.');
  return value;
}
export function saveOperation(value: SavedOperation) { localStorage.setItem(storageKey(value.userId), JSON.stringify(value)); }
export function clearOperation(uid: string) { localStorage.removeItem(storageKey(uid)); }
export const terminal = (status?: JobStatus) => status === 'SUCCEEDED' || status === 'FAILED';
