export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUBMISSION_UNCERTAIN' | 'SUCCEEDED' | 'FAILED';
/** The studio's modes: two editing presets plus the C-line tools, which size their own output. */
export type GenerationMode = 'edit' | 'enhance' | 'cutout' | 'vectorize' | 'erase';
export interface GenerationBody {
  image_ids: string[];
  /** Editing modes send a prompt and explicit geometry; the tools send neither size nor format. */
  prompt?: string; width?: number; height?: number; output_format?: string;
  mode?: GenerationMode;
  factor?: number; source_width?: number; source_height?: number;
  /** Optional for the eraser only: how many re-rendering steps to spend (4–20). */
  num_inference_steps?: number;
  /** Optional for the vectorizer only: which preset to trace with, and the traced long edge. */
  preset?: string; max_edge?: number;
}
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
