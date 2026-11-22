# Shot list export — `/video-studio/clip-range-planner`

2026-11-22. Second deepening of the video tool suite in the same pass as the frame pack
(`docs/frame-pack-20261122/README.md`). The planner could mark one start and one end; a real edit
is several windows out of one clip, so the export was always going to be retyped by hand.

## What changed

- `src/lib/clipSegments.ts` — pure rules for a shot list: `normalizeSegments` (drops zero-length
  windows, rounds to milliseconds, orders by start), `overlapPairs` / `overlappingSegments` (which
  windows intersect, including windows that merely touch), `totalLength`, and `shotList` which
  emits a `dlss5-shot-list/v1` document with per-shot length, total, coverage of the source and
  1-based overlap pairs.
- `src/components/VideoToolWorkspace.tsx` — in `clip-range-planner` mode: **Add to shot list**
  (marks stay as they were; the list takes the current pair and clears the marks, capped at 40),
  a numbered list with each window's length and an "overlaps another clip" flag, a remove button
  per window, and **Save shot list (JSON)**. The single-range export stays as *Save this range*.
  The list resets when a different clip is opened.
- `src/content/videoTools.ts` — the planner's description and walkthrough now describe the
  multi-window handoff, in both languages.
- `tests/clip-segments.test.ts` — registered in `tests/run.ts`; 5 cases.

## Verification (2026-11-22, this machine)

- `npm run lint` clean, `npm test` 257/257 passed (252 before this change), `npm run build` clean.
- Playwright against the built `dist/` and again against `www.dlss5nvidia.com`, both locales:
  three windows marked (1–3 s, 2.5–4 s, 5–6.5 s), counter `3/40`, two overlap flags, removed
  shot 2 and the flags went to zero, zero console errors. Exported JSON:

```json
{ "format": "dlss5-shot-list/v1", "file": "street-source.mp4", "duration": 19.8,
  "total": 5, "coverage": 0.2525,
  "segments": [ {"index":1,"start":1,"end":3,"length":2},
                {"index":2,"start":2.5,"end":4,"length":1.5},
                {"index":3,"start":5,"end":6.5,"length":1.5} ],
  "overlaps": [[1,2]] }
```

## Boundaries kept

- Timestamps only: the tool does not cut, re-encode or write media. The source file is untouched.
- Browser-only, no quota, no backend; nothing under `api/billing/**`, `server/waffo-*`,
  `server/payment-policy.ts` or `/pricing` was touched.
