import assert from 'node:assert/strict';
import { test } from './harness';
import highlights, { gatewayPhaseStatus, useHighlightsGateway } from '../server/video-highlights';
import { readVideoGateway, readVideoGatewayResult, submitVideoGateway } from '../server/video-highlights-alphanet';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { HIGHLIGHTS_HEARTBEAT_MS, HIGHLIGHTS_MAX_QUEUE_MS, highlightsStallReason, highlightsWorkerAvailable } from '../lib/video-highlights-beta';

const now = 1_800_000_000_000;
test('highlights keep a worker available throughout a valid lease', () => {
  assert.equal(highlightsWorkerAvailable(undefined, now), false);
  assert.equal(highlightsWorkerAvailable({ heartbeat: now - HIGHLIGHTS_HEARTBEAT_MS + 1 }, now), true);
  assert.equal(highlightsWorkerAvailable({ heartbeat: now - HIGHLIGHTS_HEARTBEAT_MS }, now), false);
  assert.equal(highlightsWorkerAvailable({ leaseUntil: now + 1 }, now), true);
});
test('highlights expire a stalled queue from enqueue time', () => {
  assert.equal(highlightsStallReason({ status: 'queued', queuedAt: now - HIGHLIGHTS_MAX_QUEUE_MS }, undefined, 'a', now), 'queue_timeout');
  assert.equal(highlightsStallReason({ status: 'queued', queuedAt: now - HIGHLIGHTS_MAX_QUEUE_MS + 1 }, undefined, 'a', now), null);
  assert.equal(highlightsStallReason({ status: 'done', queuedAt: now - HIGHLIGHTS_MAX_QUEUE_MS }, undefined, 'a', now), null);
});
test('highlights allow a worker to reclaim its lease during the recovery grace period', () => {
  assert.equal(highlightsStallReason({ status: 'running' }, { active: 'a', leaseUntil: now - HIGHLIGHTS_HEARTBEAT_MS }, 'a', now), 'worker_lost');
  assert.equal(highlightsStallReason({ status: 'running' }, { active: 'a', leaseUntil: now - HIGHLIGHTS_HEARTBEAT_MS + 1 }, 'a', now), null);
  assert.equal(highlightsStallReason({ status: 'running' }, { active: 'b', leaseUntil: now - HIGHLIGHTS_HEARTBEAT_MS }, 'a', now), null);
});

test('analyze and export expose separate gateway task states', () => {
  assert.equal(gatewayPhaseStatus({ status: 'queued', phase: 'analyze' }, 'analyze'), 'QUEUED');
  assert.equal(gatewayPhaseStatus({ status: 'running', phase: 'analyze' }, 'analyze'), 'IN_PROGRESS');
  assert.equal(gatewayPhaseStatus({ status: 'ready', phase: 'analyze' }, 'analyze'), 'SUCCESS');
  assert.equal(gatewayPhaseStatus({ status: 'running', phase: 'export' }, 'analyze'), 'SUCCESS');
  assert.equal(gatewayPhaseStatus({ status: 'running', phase: 'export' }, 'export'), 'IN_PROGRESS');
  assert.equal(gatewayPhaseStatus({ status: 'done', phase: 'export' }, 'export'), 'SUCCESS');
  assert.equal(gatewayPhaseStatus({ status: 'failed', phase: 'export' }, 'export'), 'FAILURE');
  assert.equal(gatewayPhaseStatus({ status: 'discarded', phase: 'export' }, 'analyze'), 'FAILURE');
});

test('channel ingress and result reads use the video channel credential', async () => {
  const previous = process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY;
  process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY = 'fake-channel';
  try {
    for (const [method, query, body] of [
      ['POST', {}, { action: 'alpha_submit' }],
      ['POST', {}, { action: 'alpha_status' }],
      ['GET', { kind: 'video-highlights-result' }, {}],
      ['HEAD', { kind: 'video-highlights-result' }, {}],
    ] as const) {
      let status: number | undefined;
      let cache: string | undefined;
      const fakeResponse = {
        setHeader(name: string, value: string) { if (name === 'Cache-Control') cache = value; },
        status(code: number) { status = code; return this; },
        json(data: { code: string }) { return data; },
      } as unknown as VercelResponse;
      const result = await highlights({ method, query, body, headers: { authorization: 'Bearer fake-other' } } as unknown as VercelRequest, fakeResponse);
      assert.deepEqual(result, { error: 'Authentication required', code: 'gateway_auth' });
      assert.equal(status, 401);
      assert.equal(cache, 'private, no-store');
    }
  } finally {
    if (previous === undefined) delete process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY;
    else process.env.VIDEO_HIGHLIGHTS_ALPHANET_CHANNEL_KEY = previous;
  }
});

test('video gateway submissions use independent stable keys and private artifact reads', async () => {
  const previousFetch = globalThis.fetch;
  const previousKey = process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY;
  const previousBase = process.env.ALPHANET_BASE_URL;
  const id = '12345678-1234-1234-1234-123456789abc';
  const taskId = 'task_offline_video_test';
  let simulatedFailure = false;
  const captured: Array<{ url: string; key: string | null; body: BodyInit | null | undefined }> = [];
  process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY = 'fake-project';
  process.env.ALPHANET_BASE_URL = 'https://gateway.example';
  globalThis.fetch = async (url, init) => {
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('authorization'), 'Bearer fake-project');
    assert.equal(init?.redirect, 'error');
    captured.push({ url: String(url), key: headers.get('idempotency-key'), body: init?.body });
    if (simulatedFailure) return Response.json({ error: 'pending' }, { status: 409 });
    if (init?.method === 'POST') return Response.json({ task_id: taskId });
    if (String(url).endsWith('/artifacts/result/content')) return Response.json({ id, status: 'ready' });
    return Response.json({ task_id: taskId, platform: 'studio-video-highlights', status: 'SUCCESS' });
  };
  try {
    simulatedFailure = true;
    await assert.rejects(submitVideoGateway(id, 'analyze'), { code: 'video_gateway_unavailable' });
    simulatedFailure = false;
    assert.equal(await submitVideoGateway(id, 'analyze'), taskId);
    assert.deepEqual(captured[0], captured[1]);
    assert.equal(JSON.parse(String(captured[0].body)).model, 'studio-video-highlights');
    assert.equal(await submitVideoGateway(id, 'export'), taskId);
    assert.notEqual(captured[1].key, captured[2].key);
    assert.equal((await readVideoGateway(taskId)).status, 'SUCCESS');
    assert.deepEqual(await readVideoGatewayResult(taskId), { id, status: 'ready' });
    assert.equal(captured.at(-1)?.url, 'https://gateway.example/v1/tasks/' + taskId + '/artifacts/result/content');
    await assert.rejects(readVideoGateway('../other'), { code: 'video_gateway_unavailable' });
    assert.equal(captured.length, 5);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY;
    else process.env.VIDEO_HIGHLIGHTS_ALPHANET_API_KEY = previousKey;
    if (previousBase === undefined) delete process.env.ALPHANET_BASE_URL;
    else process.env.ALPHANET_BASE_URL = previousBase;
  }
});


test('video gateway requires an explicitly selected canary', () => {
  assert.equal(useHighlightsGateway('invited', '1'), false);
  assert.equal(useHighlightsGateway('invited', '1', ' '), false);
  assert.equal(useHighlightsGateway('elsewhere', '1', 'invited'), false);
  assert.equal(useHighlightsGateway('invited', '0', 'invited'), false);
  assert.equal(useHighlightsGateway('invited', '1', ' invited '), true);
});

test('public trial sends verified accounts to the enabled video gateway without a canary UID', () => {
  assert.equal(useHighlightsGateway('regular-account', '1', 'invited', true), true);
  assert.equal(useHighlightsGateway('regular-account', '0', 'invited', true), false);
  assert.equal(useHighlightsGateway('', '1', 'invited', true), false);
});
