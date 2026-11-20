export const HIGHLIGHTS_MAX_BYTES = 32 * 1024 * 1024;
export const HIGHLIGHTS_MAX_SECONDS = 30;
export const HIGHLIGHTS_EVENTS = ['vehicle', 'person', 'bus'] as const;
export type HighlightsEvent = typeof HIGHLIGHTS_EVENTS[number];
export type HighlightsSegment = { start: number; end: number };
