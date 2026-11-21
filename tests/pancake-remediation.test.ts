import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jobs from '../api/image-edit/jobs';
import health from '../api/health';
import { screenGenerationText } from '../api/_lib/waffo-screening';
import { apiCatalogDocument, apiModelDocument, CATALOG } from '../src/config/apiCatalog';
import { test } from './harness';

function response() {
  const value = { status: 0, body: undefined as unknown, headers: {} as Record<string, string> };
  const res = { status(code: number) { value.status = code; return this; }, json(body: unknown) { value.body = body; return this; }, send(body: unknown) { value.body = body; return this; }, setHeader(k: string, v: string) { value.headers[k] = v; return this; } };
  return { value, res: res as unknown as VercelResponse };
}

test('retired fetching is refused before authentication, database, provider or credits', async () => {
  const originalFetch = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('No external call should occur'); };
  try {
    for (const mode of ['fetch', 'media-fetch', 'video-downloader', 'media-downloader']) {
      const { value, res } = response();
      await jobs({ method: 'POST', headers: {}, body: { mode, urls: ['https://example.com/video'] } } as unknown as VercelRequest, res);
      assert.equal(value.status, 410); assert.equal((value.body as { code: string }).code, 'MEDIA_FETCH_RETIRED');
    }
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test('retired public URL returns a real 410 with noindex and a local-file handoff', () => {
  const { value, res } = response();
  health({ query: { retired_media: '1' } } as unknown as VercelRequest, res);
  assert.equal(value.status, 410); assert.equal(value.headers['X-Robots-Tag'], 'noindex, nofollow');
  assert.match(String(value.body), /\/video-studio/); assert.doesNotMatch(String(value.body), /textarea|iframe|youtube\.com/);
});

test('public catalog retains all models without external signup, billing or a pretend public API', () => {
  const catalog = apiCatalogDocument();
  assert.equal(catalog.models.length, 9);
  for (const entry of [catalog, ...CATALOG.map(apiModelDocument)]) {
    const body = JSON.stringify(entry);
    assert.doesNotMatch(body, /dashboard\.alphanetplus\.com|\$0\.01|project API key|ALPHANET_KEY/);
    assert.ok(!('base_url' in entry)); assert.match(body, /website-model-reference/);
  }
});

// Ephemeral offline signing key only: never registered or written to disk.
const fixtureKey = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
for (const verdict of ['allow', 'review', 'block', 'degraded', 'invalid', 'network-error'] as const) {
  test(`Waffo gate: ${verdict} ${verdict === 'allow' ? 'permits' : 'stops'} a new generation`, async () => {
    const oldFetch = globalThis.fetch; const oldMerchant = process.env.WAFFO_MERCHANT_ID; const oldKey = process.env.WAFFO_PRIVATE_KEY;
    process.env.WAFFO_MERCHANT_ID = 'MER_' + 'a'.repeat(22); process.env.WAFFO_PRIVATE_KEY = fixtureKey;
    let calls = 0;
    globalThis.fetch = async (_url, init) => {
      calls++; const sent = JSON.parse(String(init?.body));
      assert.equal(sent.prompt, 'Safe test landscape'); assert.equal(sent.semantic, 'enforce');
      if (verdict === 'network-error') throw new Error('offline');
      return new Response(JSON.stringify({ data: { action: verdict === 'degraded' ? 'review' : verdict, reasonCode: verdict === 'degraded' ? 'service_degraded' : 'allowed', requestId: 'offline-fixture' } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
    try {
      if (verdict === 'allow') await screenGenerationText({ prompt: 'Safe test landscape' });
      else await assert.rejects(screenGenerationText({ prompt: 'Safe test landscape' }), (e: unknown) => [422, 503].includes((e as { status: number }).status));
      assert.equal(calls, 1);
    } finally {
      globalThis.fetch = oldFetch;
      if (oldMerchant === undefined) delete process.env.WAFFO_MERCHANT_ID; else process.env.WAFFO_MERCHANT_ID = oldMerchant;
      if (oldKey === undefined) delete process.env.WAFFO_PRIVATE_KEY; else process.env.WAFFO_PRIVATE_KEY = oldKey;
    }
  });
}

test('missing Waffo credentials never permits a text-driven generation', async () => {
  const oldMerchant = process.env.WAFFO_MERCHANT_ID; const oldKey = process.env.WAFFO_PRIVATE_KEY;
  delete process.env.WAFFO_MERCHANT_ID; delete process.env.WAFFO_PRIVATE_KEY;
  try { await assert.rejects(screenGenerationText({ prompt: 'Safe test landscape' }), (e: unknown) => (e as { status: number }).status === 503); }
  finally { if (oldMerchant !== undefined) process.env.WAFFO_MERCHANT_ID = oldMerchant; if (oldKey !== undefined) process.env.WAFFO_PRIVATE_KEY = oldKey; }
});
