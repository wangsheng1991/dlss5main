export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUBMISSION_UNCERTAIN' | 'SUCCEEDED' | 'FAILED';
/** The studio's modes: two editing presets, the tool lines, and the one tool that takes a link. */
export type GenerationMode = 'edit' | 'enhance' | 'cutout' | 'vectorize' | 'erase' | 'tryon' | 'interior' | 'retouch' | 'makeup' | 'fetch';
export interface GenerationBody {
  /** One or two uploaded file ids: the order is the contract of the tool they belong to. Absent for
   *  the media downloader, which has no upload at all and sends `urls` instead. */
  image_ids?: string[];
  /** Editing modes send a prompt and explicit geometry; the tools send neither size nor format. */
  prompt?: string; width?: number; height?: number; output_format?: string;
  mode?: GenerationMode;
  factor?: number; source_width?: number; source_height?: number;
  /** Optional for the eraser only: how many re-rendering steps to spend (4–20). */
  num_inference_steps?: number;
  /** Optional for the vectorizer only: which preset to trace with, and the traced long edge. */
  preset?: string; max_edge?: number;
  /** A-line tools only: the chosen value of each named option (the provider owns the prompt itself). */
  garment_type?: string; style?: string; room_type?: string; level?: string; look?: string; intensity?: string;
  /** Interior only: the short free-text brief folded into the server-side prompt. */
  extra?: string;
  /** Media downloader only: the links to fetch, and the quality to fetch them at. No image is sent. */
  urls?: string[]; quality?: string;
}
export interface SavedOperation { version: 1; userId: string; key: string; body: GenerationBody; jobId?: string; createdAt: string; status?: JobStatus; outputUrl?: string }
const storageKey = (uid: string) => `dlss:operation:${uid}`;
export function readOperation(uid: string): SavedOperation | null {
  const raw = localStorage.getItem(storageKey(uid));
  if (!raw) return null;
  const value = JSON.parse(raw);
  // The downloader is the one operation whose body carries no file ids, so the shape check has to
  // follow the mode: requiring `image_ids` everywhere would throw its saved operation away on reload.
  const referencesExpected = value?.body?.mode !== 'fetch';
  if (value.version !== 1 || value.userId !== uid || typeof value.key !== 'string' || !value.body
    || (referencesExpected && !Array.isArray(value.body.image_ids))) throw new Error('Saved operation is unreadable. Contact support before starting another generation.');
  return value;
}
export function saveOperation(value: SavedOperation) { localStorage.setItem(storageKey(value.userId), JSON.stringify(value)); }
export function clearOperation(uid: string) { localStorage.removeItem(storageKey(uid)); }
export const terminal = (status?: JobStatus) => status === 'SUCCEEDED' || status === 'FAILED';
