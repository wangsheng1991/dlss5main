import assert from 'node:assert/strict';
import { MAX_SEGMENTS, normalizeSegments, overlapPairs, overlappingSegments, shotList, totalLength } from '../src/lib/clipSegments';
import { test } from './harness';

test('a shot list is ordered, rounded to milliseconds and drops empty windows', () => {
  const ordered = normalizeSegments([{ start: 8, end: 9.00049 }, { start: 1.23456, end: 1.23456 }, { start: 2.5, end: 4 }, { start: -1, end: 0.5 }]);
  assert.deepEqual(ordered, [{ start: 0, end: 0.5 }, { start: 2.5, end: 4 }, { start: 8, end: 9 }]);
  assert.equal(totalLength(ordered), 3);
  assert.equal(MAX_SEGMENTS, 40);
});

test('overlapping windows are reported by the shot numbers an editor sees', () => {
  const segments = [{ start: 0, end: 4 }, { start: 3, end: 6 }, { start: 6, end: 8 }];
  assert.deepEqual(overlapPairs(segments), [[0, 1]]);
  assert.deepEqual([...overlappingSegments(segments)].sort((a, b) => a - b), [0, 1]);
  const list = shotList('street-source.mp4', 12, segments);
  assert.deepEqual(list.overlaps, [[1, 2]], 'the exported pair is 1-based');
  assert.equal(list.segments[1].length, 3);
  assert.equal(list.total, 9);
  assert.equal(list.duration, 12);
  assert.equal(list.coverage, 0.75);
});

test('touching windows do not count as an overlap', () => {
  assert.deepEqual(overlapPairs([{ start: 1, end: 2 }, { start: 2, end: 3 }]), []);
});

test('an empty or degenerate list exports zeros rather than nonsense', () => {
  const empty = shotList('clip.mp4', 0, []);
  assert.equal(empty.total, 0);
  assert.equal(empty.coverage, 0);
  assert.deepEqual(empty.segments, []);
  assert.deepEqual(empty.overlaps, []);
  assert.equal(empty.format, 'dlss5-shot-list/v1');
  assert.equal(JSON.stringify(empty).includes('null'), false);
});

test('the shot list numbers shots in playback order after sorting', () => {
  const list = shotList('clip.mp4', 30, [{ start: 20, end: 22 }, { start: 2, end: 5 }]);
  assert.deepEqual(list.segments.map(entry => entry.index), [1, 2]);
  assert.deepEqual(list.segments.map(entry => entry.start), [2, 20]);
  assert.equal(list.total, 5);
});
