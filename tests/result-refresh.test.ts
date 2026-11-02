import assert from 'node:assert/strict';
import type { Firestore } from 'firebase-admin/firestore';
import { refresh } from '../api/image-edit/results/[id]';
import { alphaNet } from '../api/_lib/alphanet';
import type { Job, JobStore } from '../server/job-store';
import { MAX_STORED_BYTES, ResultStore } from '../server/result-store';
import { test } from './harness';

for (const scenario of ['small', 'oversized', 'storage-failure'] as const) {
  test(`history refresh downloads ${scenario} results once and serves the original bytes`, async () => {
    const bytes = Buffer.alloc(scenario === 'oversized' ? MAX_STORED_BYTES + 1 : 100, 42);
    const originalFetch = globalThis.fetch;
    const originalResult = alphaNet.result;
    let downloads = 0, writes = 0, attachments = 0;
    try {
      globalThis.fetch = async (url) => {
        assert.equal(String(url), 'https://provider.example/result.png');
        downloads++;
        return new Response(bytes, { headers: { 'content-type': 'image/png' } });
      };
      alphaNet.result = async () => ({ images: [{ url: 'https://provider.example/result.png', width: 32, height: 32 }] });
      const db = { doc: () => ({
        set: async (data: { uid: string; data: string }) => {
          writes++;
          assert.equal(data.uid, 'owner');
          assert.deepEqual(Buffer.from(data.data, 'base64'), bytes);
          if (scenario === 'storage-failure') throw new Error('Storage unavailable');
        },
        get: () => { throw new Error('Do not read back the bytes already downloaded'); },
      }) } as unknown as Firestore;
      const store = { attachResult: async () => { attachments++; } } as unknown as JobStore;
      const job = { providerTaskId: 'task', status: 'SUCCEEDED', inputJson: '{}' } as Job;
      const result = await refresh('owner', 'job', job, store, new ResultStore(db));
      assert.deepEqual(result?.buffer, bytes);
      assert.equal(result?.contentType, 'image/png');
      assert.equal(downloads, 1);
      assert.equal(writes, scenario === 'oversized' ? 0 : 1);
      assert.equal(attachments, scenario === 'storage-failure' ? 0 : 1);
    } finally {
      globalThis.fetch = originalFetch;
      alphaNet.result = originalResult;
    }
  });
}
