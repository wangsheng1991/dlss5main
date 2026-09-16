import { createHash, randomUUID } from 'node:crypto';
import type { Firestore } from 'firebase-admin/firestore';
import { ApiError } from './errors.js';
import { PLANS } from '../src/config/plans.js';
export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUBMISSION_UNCERTAIN' | 'SUCCEEDED' | 'FAILED';
export type Job = {
  uid: string; inputJson: string; fingerprint: string; providerKey: string;
  status: JobStatus; providerTaskId?: string; leaseUntil: number; leaseOwner: string;
  settled: boolean; refunded: boolean; createdAt: number; completedAt?: number;
  quotaDay: string; quotaMonth: string; errorCode?: string;
};
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const day = () => new Date().toISOString().slice(0, 10);
const month = () => day().slice(0, 7);
const limits = (tier: string) => PLANS[tier as keyof typeof PLANS] || PLANS.free;
const count = (n: unknown) => Number.isSafeInteger(n) && Number(n) >= 0 ? Number(n) : 0;

export class JobStore {
  constructor(readonly db: Firestore) {}
  async bootstrap(uid: string, email = '', name = '') {
    const ref = this.db.doc(`users/${uid}`);
    return this.db.runTransaction(async tx => {
      const user = await tx.get(ref);
      if (user.exists) return user.data()!;
      const data = { email, name, tier: 'free', credits: 10, quotaMonth: month(), quotaDay: day(), dayUsed: 0, activeJobs: 0, createdAt: new Date().toISOString() };
      tx.create(ref, data);
      tx.create(this.db.doc(`credit_ledger/${hash(uid + ':signup')}`), { uid, units: 10, kind: 'signup', createdAt: Date.now() });
      return data;
    });
  }
  async bindUpload(uid: string, fileId: string, metadata: { size: number; contentType: string }) {
    await this.db.doc(`image_uploads/${hash(fileId)}`).create({ uid, fileId, ...metadata, createdAt: Date.now() });
  }
  async uploadQuota(uid: string) {
    const ref = this.db.doc(`upload_limits/${hash(uid + day())}`);
    await this.db.runTransaction(async tx => {
      const [account, usage] = await Promise.all([tx.get(this.db.doc(`users/${uid}`)), tx.get(ref)]);
      if (!account.exists) throw new ApiError(403, 'account_missing', 'Account is not initialized');
      const n = count(usage.data()?.count);
      const allowance = limits(account.data()!.tier);
      if (count(account.data()!.credits) < 1) throw new ApiError(402, 'insufficient_credits', 'Insufficient credits');
      if (n >= allowance.dailyGenerationLimit * 3) throw new ApiError(429, 'upload_limit', 'Daily upload limit reached');
      tx.set(ref, { uid, count: n + 1 });
    });
  }
  async claim(uid: string, key: string, input: { image_ids: string[]; [key: string]: unknown }) {
    const id = hash(uid + ':' + key), ref = this.db.doc(`image_operations/${id}`);
    const inputJson = JSON.stringify(input), fingerprint = hash(inputJson), now = Date.now();
    return this.db.runTransaction(async tx => {
      const previous = await tx.get(ref);
      if (previous.exists) {
        const job = previous.data() as Job;
        if (job.uid !== uid || job.fingerprint !== fingerprint) throw new ApiError(409, 'idempotency_key_conflict', 'This operation key has different input');
        if (job.providerTaskId || job.settled || job.leaseUntil > now) return { id, job, submit: false };
        const updated = { ...job, leaseUntil: now + 60000, leaseOwner: randomUUID() };
        tx.update(ref, { leaseUntil: updated.leaseUntil, leaseOwner: updated.leaseOwner });
        return { id, job: updated, submit: true };
      }
      const userRef = this.db.doc(`users/${uid}`);
      const [user, ...uploads] = await Promise.all([tx.get(userRef), ...input.image_ids.map(fileId => tx.get(this.db.doc(`image_uploads/${hash(fileId)}`)))]);
      if (!user.exists) throw new ApiError(403, 'account_missing', 'Account is not initialized');
      if (uploads.some(u => !u.exists || u.data()!.uid !== uid)) throw new ApiError(403, 'file_not_owned', 'Input file does not belong to you');
      const account = user.data()!, plan = limits(account.tier);
      const credits = account.quotaMonth && account.quotaMonth !== month() ? plan.monthlyCredits : count(account.credits);
      const used = account.quotaDay === day() ? count(account.dayUsed) : 0;
      if (credits < 1) throw new ApiError(402, 'insufficient_credits', 'Insufficient credits');
      if (used >= plan.dailyGenerationLimit) throw new ApiError(429, 'daily_limit', 'Daily generation limit reached');
      if (count(account.activeJobs) >= plan.maxConcurrentJobs) throw new ApiError(429, 'concurrency_limit', 'Another job is still active');
      const job: Job = { uid, inputJson, fingerprint, providerKey: id, status: 'SUBMISSION_UNCERTAIN', leaseUntil: now + 60000, leaseOwner: randomUUID(), settled: false, refunded: false, createdAt: now, quotaDay: day(), quotaMonth: month() };
      tx.update(userRef, { credits: credits - 1, activeJobs: count(account.activeJobs) + 1, dayUsed: used + 1, quotaDay: day(), quotaMonth: month() });
      tx.create(ref, job);
      tx.create(this.db.doc(`credit_ledger/${id}_reserve`), { uid, jobId: id, kind: 'reserve', units: -1, createdAt: now });
      return { id, job, submit: true };
    });
  }
  async read(uid: string, id: string) {
    if (!/^[a-f0-9]{64}$/.test(id)) throw new ApiError(404, 'job_not_found', 'Job not found');
    const snapshot = await this.db.doc(`image_operations/${id}`).get();
    if (!snapshot.exists || snapshot.data()!.uid !== uid) throw new ApiError(404, 'job_not_found', 'Job not found');
    return snapshot.data() as Job;
  }
  async list(uid: string, limit = 20) {
    const snapshot = await this.db.collection('image_operations').where('uid', '==', uid).orderBy('createdAt', 'desc').limit(Math.min(Math.max(limit, 1), 50)).get();
    return snapshot.docs.map(doc => { const job = doc.data() as Job; let input: Record<string, unknown> = {}; try { input = JSON.parse(job.inputJson); } catch {} return { id: doc.id, status: job.status, createdAt: job.createdAt, completedAt: job.completedAt, errorCode: job.errorCode, prompt: typeof input.prompt === 'string' ? input.prompt : '' }; });
  }
  async accepted(id: string, leaseOwner: string, taskId?: string) {
    const ref = this.db.doc(`image_operations/${id}`);
    await this.db.runTransaction(async tx => {
      const current = (await tx.get(ref)).data() as Job;
      if (current.settled || current.leaseOwner !== leaseOwner || current.providerTaskId) return;
      tx.update(ref, taskId ? { providerTaskId: taskId, status: 'QUEUED', leaseUntil: 0 } : { status: 'SUBMISSION_UNCERTAIN', leaseUntil: 0 });
    });
  }
  async settle(uid: string, id: string, status: 'SUCCEEDED' | 'FAILED', errorCode = '') {
    const ref = this.db.doc(`image_operations/${id}`), userRef = this.db.doc(`users/${uid}`);
    await this.db.runTransaction(async tx => {
      const [snapshot, user] = await Promise.all([tx.get(ref), tx.get(userRef)]);
      const job = snapshot.data() as Job;
      if (!job || job.uid !== uid || !user.exists) throw new ApiError(404, 'job_not_found', 'Job not found');
      if (job.settled) return;
      const account = user.data()!, refund = status === 'FAILED';
      // Return an old-month reservation only if the account has not reset since.
      const balanceRefund = refund && account.quotaMonth === job.quotaMonth ? 1 : 0;
      tx.update(userRef, { credits: count(account.credits) + balanceRefund, activeJobs: Math.max(0, count(account.activeJobs) - 1), dayUsed: Math.max(0, count(account.dayUsed) - (refund && account.quotaDay === job.quotaDay ? 1 : 0)) });
      tx.update(ref, { status, settled: true, refunded: refund, completedAt: Date.now(), errorCode });
      tx.create(this.db.doc(`credit_ledger/${id}_${refund ? 'refund' : 'settle'}`), { uid, jobId: id, kind: refund ? 'refund' : 'settle', units: balanceRefund, expiredUnits: refund ? 1 - balanceRefund : 0, createdAt: Date.now() });
    });
  }
}
