import { createHash } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import { ApiError } from './errors.js';
import { MAX_STORED_BYTES, type StoredResult } from './result-store.js';

/** Guests may run the examples for free, so the result of each example is computed once and cached. */
export const GUEST_DAILY_LIMIT = 20;
const WARM_LEASE_MS = 90 * 1000;

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const day = () => new Date().toISOString().slice(0, 10);

export class SampleStore {
  constructor(readonly db: Firestore) {}

  /** The cached example result, or null when the example still has to be generated. */
  async read(sampleId: string, cacheVersion?: string): Promise<(StoredResult & { prompt: string; cachedAt: number }) | null> {
    const snapshot = await this.db.doc(`sample_results/${sampleId}`).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data()!;
    if (typeof data.data !== 'string') return null;
    if (cacheVersion && data.cacheVersion !== cacheVersion) return null;
    return {
      contentType: typeof data.contentType === 'string' ? data.contentType : 'image/webp',
      buffer: Buffer.from(data.data, 'base64'),
      width: Number(data.width) || 0,
      height: Number(data.height) || 0,
      sha256: typeof data.sha256 === 'string' ? data.sha256 : '',
      prompt: typeof data.prompt === 'string' ? data.prompt : '',
      cachedAt: Number(data.createdAt) || 0,
    };
  }

  async save(sampleId: string, prompt: string, image: { url: string; content_type?: string; width?: number; height?: number; sha256?: string }, cacheVersion?: string) {
    const response = await fetch(image.url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Example download failed (${response.status})`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_STORED_BYTES) throw new Error('Example result is too large to cache');
    const document = {
      sampleId,
      cacheVersion,
      prompt,
      contentType: image.content_type || response.headers.get('content-type') || 'image/webp',
      size: buffer.length,
      width: Number(image.width) || 0,
      height: Number(image.height) || 0,
      sha256: image.sha256 || createHash('sha256').update(buffer).digest('hex'),
      data: buffer.toString('base64'),
      createdAt: Date.now(),
      warmingUntil: 0,
    };
    await this.db.doc(`sample_results/${sampleId}`).set(document, { merge: true });
    return document;
  }

  /** Exactly one caller warms an example; everyone else waits for the cached copy. */
  async claimWarm(sampleId: string, cacheVersion?: string) {
    const ref = this.db.doc(`sample_results/${sampleId}`), now = Date.now();
    return this.db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const data = snapshot.data();
      if (typeof data?.data === 'string' && (!cacheVersion || data.cacheVersion === cacheVersion)) return false;
      if (Number(data?.warmingUntil) > now) return false;
      tx.set(ref, { sampleId, warmingUntil: now + WARM_LEASE_MS }, { merge: true });
      return true;
    });
  }

  async releaseWarm(sampleId: string) {
    await this.db.doc(`sample_results/${sampleId}`).set({ warmingUntil: 0 }, { merge: true });
  }

  /** Counts a guest request against its address for the day and refuses the ones over the limit. */
  async countGuest(ip: string) {
    if (!ip) return;
    const ref = this.db.doc(`guest_usage/${hash(`${ip}:${day()}`)}`);
    await this.db.runTransaction(async (tx) => {
      const snapshot = await tx.get(ref);
      const used = Number(snapshot.data()?.count) || 0;
      if (used >= GUEST_DAILY_LIMIT) throw new ApiError(429, 'guest_limit', 'You have reached today\'s free example limit. Sign in to keep generating.');
      tx.set(ref, { ip, day: day(), count: used + 1 }, { merge: true });
    });
  }
}
