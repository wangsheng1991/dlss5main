/**
 * A shot list: several marked windows of one clip, in playback order, exported as one handoff.
 *
 * The planner used to export a single range, which is fine for one highlight and useless for the
 * ten-clip edit most people actually cut. The rules live here rather than in the component because
 * they are the part worth testing: order, zero-length windows, windows that overlap, and the total
 * length an editor will end up with.
 */

export type ClipSegment = { start: number; end: number };

export type ShotListEntry = { index: number; start: number; end: number; length: number };

export type ShotList = {
  format: 'dlss5-shot-list/v1';
  file: string;
  duration: number;
  total: number;
  coverage: number;
  segments: ShotListEntry[];
  /** 1-based shot numbers whose windows intersect, so an editor can see what to fix. */
  overlaps: Array<[number, number]>;
};

/** Enough for a real edit, small enough that the list stays reviewable. */
export const MAX_SEGMENTS = 40;

const round = (value: number) => Number(value.toFixed(3));

/** Drops zero-length windows, rounds to milliseconds and orders by start time. */
export function normalizeSegments(segments: ClipSegment[]): ClipSegment[] {
  return segments
    .filter(segment => segment.end > segment.start)
    .map(segment => ({ start: round(Math.max(0, segment.start)), end: round(segment.end) }))
    .sort((a, b) => a.start - b.start || a.end - b.end);
}

/** 0-based index pairs whose windows intersect — a cut nobody can line up. */
export function overlapPairs(segments: ClipSegment[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let left = 0; left < segments.length; left += 1) {
    for (let right = left + 1; right < segments.length; right += 1) {
      if (segments[left].start < segments[right].end && segments[right].start < segments[left].end) pairs.push([left, right]);
    }
  }
  return pairs;
}

export function overlappingSegments(segments: ClipSegment[]): Set<number> {
  return new Set(overlapPairs(segments).flat());
}

export function totalLength(segments: ClipSegment[]): number {
  return round(segments.reduce((total, segment) => total + Math.max(0, segment.end - segment.start), 0));
}

/** The exported list is what an editor reads, so it states the length of each window and of all of them. */
export function shotList(file: string, duration: number, segments: ClipSegment[]): ShotList {
  const ordered = normalizeSegments(segments);
  const total = totalLength(ordered);
  return {
    format: 'dlss5-shot-list/v1',
    file,
    duration: round(duration),
    total,
    coverage: duration > 0 ? Number((total / duration).toFixed(4)) : 0,
    segments: ordered.map((segment, index) => ({
      index: index + 1,
      start: segment.start,
      end: segment.end,
      length: round(segment.end - segment.start),
    })),
    overlaps: overlapPairs(ordered).map(([left, right]) => [left + 1, right + 1]),
  };
}
