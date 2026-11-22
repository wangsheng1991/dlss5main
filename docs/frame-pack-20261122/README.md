# Frame pack export — `/video-studio/frame-extractor`

2026-11-22. Deepens an existing browser tool instead of adding a new route: the frame extractor
could already save one PNG at a chosen moment, which left the second half of the job — collecting
several moments of one clip and keeping track of which still came from where — to the user's
file manager and memory.

## What changed

- `src/lib/framePack.ts` — a STORE-only (uncompressed) zip writer (`zipStore`) plus a
  `dlss5-frame-pack/v1` manifest builder (`framePackManifest`), `frameFileName` and `timeCode`.
  No dependency added; the entry timestamp is fixed so the same picks produce the same bytes.
- `src/components/VideoToolWorkspace.tsx` — in `frame-extractor` mode: **Add frame to pack**
  (captures the paused frame as PNG bytes in memory, deduplicated by timestamp, capped at 24),
  a chip row of picked timestamps that seek back and can be removed, and **Export frame pack
  (.zip)**. The pack resets when a different clip is opened. Its own error message appears if
  `canvas.toBlob` or the archive build fails, so the video-read message is not used for it.
- `src/content/videoTools.ts` — the tool's description and walkthrough now name the .zip and
  `manifest.json` in both languages (`/video-studio/frame-extractor`, `/zh/…`).
- `tests/frame-pack.test.ts` — registered in `tests/run.ts`; 5 cases.

## Why the manifest matters

A folder of `frame-001.png` is unverifiable a week later. `manifest.json` records the source
file name, the tool, the export time, and for each frame its file name, timestamp, width and
height, plus the note that the bytes are what the browser decoded — nothing was generated,
sharpened or re-encoded. That keeps the export consistent with the positioning rules: it is a
reference-still tool, not an upscaler and not a generator.

## Verification (all run on this machine, 2026-11-22)

- `npm run lint` — clean.
- `npm test` — 252/252 passed (247 before this change).
- `npm run build` — clean; prerender and article checks pass.
- Playwright (system Chrome) against the built `dist/` on `127.0.0.1:4319`, both locales:
  sample loaded, frames picked at 1.5 s / 4.25 s / 7 s, chips read `00-01.500 · 00-04.250 ·
  00-07.000`, counter read `3/24`, export downloaded `frame-pack.zip`, removing a chip left 2,
  zero console errors.
- The downloaded archive, checked with `unzip -t` (no errors) and `file`:

```
  1113390  11-22-2026 00:00   frame-001.png
  1076356  11-22-2026 00:00   frame-002.png
  1080040  11-22-2026 00:00   frame-003.png
      668  11-22-2026 00:00   manifest.json
frame-001.png: PNG image data, 960 x 540, 8-bit/color RGBA, non-interlaced
```

## Boundaries kept

- Nothing billable, no backend, no quota: decoding happens in the page and the archive is built
  in the page.
- No file under `api/billing/**`, `server/waffo-*`, `server/payment-policy.ts` or `/pricing`
  was touched; the checkout and reconciliation work stays with its own lane.
- The tool still does not claim upscaling or interpolation. It writes the decoded frame.
