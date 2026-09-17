import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Provider result links are short-lived signed URLs and the provider keeps the objects for about
 * seven days, so a user history needs its own copy. Results small enough for a Firestore document
 * are stored inline; larger ones stay metadata-only and are re-signed from the provider on demand.
 */
export const MAX_STORED_BYTES = 400 * 1024;

export type ResultMeta = { contentType: string; size: number; width: number; height: number; sha256: string; stored: boolean };
export type StoredResult = { contentType: string; buffer: Buffer; width: number; height: number; sha256: string };

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export const resultId = (jobId: string) => hash(`result:${jobId}`);

export class ResultStore {
  constructor(readonly db: Firestore) {}

  async read(uid: string, jobId: string): Promise<StoredResult | null> {
    const snapshot = await this.db.doc(`image_results/${resultId(jobId)}`).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data()!;
    if (data.uid !== uid || typeof data.data !== 'string') return null;
    return {
      contentType: typeof data.contentType === 'string' ? data.contentType : 'image/webp',
      buffer: Buffer.from(data.data, 'base64'),
      width: Number(data.width) || 0,
      height: Number(data.height) || 0,
      sha256: typeof data.sha256 === 'string' ? data.sha256 : '',
    };
  }

  /** Downloads the provider result once and keeps a durable copy when it fits a document. */
  async save(uid: string, jobId: string, image: { url: string; content_type?: string; width?: number; height?: number; sha256?: string }): Promise<ResultMeta> {
    const response = await fetch(image.url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Result download failed (${response.status})`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = image.content_type || response.headers.get('content-type') || 'image/webp';
    const meta: ResultMeta = {
      contentType,
      size: buffer.length,
      width: Number(image.width) || 0,
      height: Number(image.height) || 0,
      sha256: image.sha256 || createHash('sha256').update(buffer).digest('hex'),
      stored: buffer.length <= MAX_STORED_BYTES,
    };
    if (meta.stored) {
      await this.db.doc(`image_results/${resultId(jobId)}`).set({ uid, jobId, ...meta, data: buffer.toString('base64'), createdAt: Date.now() });
    }
    return meta;
  }

  /** Fetches bytes from a freshly signed provider URL when no stored copy exists. */
  async download(url: string) {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || 'image/webp';
    return { buffer: Buffer.from(await response.arrayBuffer()), contentType };
  }
}
