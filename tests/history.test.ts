import assert from 'node:assert/strict';
import { historyChanged } from '../src/features/generation/history';
import type { SavedOperation } from '../src/features/generation/operation';
import { test } from './harness';

const operation = (status: SavedOperation['status'], key = 'operation-1'): SavedOperation => ({
  version: 1,
  userId: 'user-1',
  key,
  body: { mode: 'edit', image_ids: [] },
  createdAt: '2026-09-30T00:00:00.000Z',
  status,
});

test('history refreshes only when this account finishes the same operation', () => {
  assert.equal(historyChanged(operation('QUEUED'), operation('SUCCEEDED'), 'user-1'), true);
  assert.equal(historyChanged(operation('QUEUED'), operation('FAILED'), 'user-1'), true);
  assert.equal(historyChanged(operation('SUCCEEDED'), operation('SUCCEEDED'), 'user-1'), false);
  assert.equal(historyChanged(operation('QUEUED'), operation('SUCCEEDED', 'other-operation'), 'user-1'), false);
  assert.equal(historyChanged(operation('QUEUED'), operation('SUCCEEDED'), 'another-user'), false);
});
