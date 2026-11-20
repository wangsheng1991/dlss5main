import assert from 'node:assert/strict';
import { test } from './harness';
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
