# DLSS5 Studio — shared brief for the 10 promo articles (2026-09-30)

You are writing **English, publish-ready articles** about DLSS5 Studio. Everything you may assert is in
section 1. Everything you must not assert is in section 2. Read both before writing a word.

## 0. What the product is (one paragraph you may paraphrase, not copy)

DLSS5 Studio is a **local Windows desktop front-end** over NVIDIA's **Visual Enhancer** official runtime.
You drop photos or video into it, pick one of seven presets, and it reworks the material through a
four-stage pipeline — **Denoising → DLSS Neural Rendering → DLSS / RTX Super Resolution → (colourise) Sharpening**.
The interface (asset rail, comparison canvas, parameter inspector, job queue) is served from **localhost**;
the render happens on **your own GPU**. Nothing is uploaded and it does not need the internet to render.

## 1. Facts you may use (all measured, nothing invented)

**The interface**
- Left: asset rail (drag files in, add a folder). Centre: canvas with four views — Original / Compare (wipe line) / Result / **Difference** — plus 1:1 and a magnifier that follows the pointer. Right: the preset list and parameter inspector. Bottom: the job queue, per-item progress and elapsed time, cancellable and re-runnable.
- Seven presets, exactly as the UI names them: **Auto (recommended) · Detail keeping 2× · Photo restore 4× · Game screenshot enhance · Low-light denoise · Old photo restore · Anime / illustration 2×**.
- Four pipeline stages, listed in the UI: **Denoising → DLSS Neural Rendering → DLSS / RTX Super Resolution → (colourise) Sharpening**.

**Measured runs** — Windows 11 Pro 26200 · GeForce RTX 4090 24 GB · driver 591.86 · Studio 0.1.0 (engine `ve`).
Every number below is an engine job record, not an estimate; each source file is CC0 or public domain.

| # | Material | Preset | Input | Output | Time | Output size |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hong Kong street, night (CC0, Wilfredor) | Low-light denoise | 3538×2318 | **7076×4636** | **26.6 s** (28.9 s on a second run) | 64.5 MiB PNG |
| 2 | Ukiyo-e woodblock print (PD) | Anime / illustration 2× | 1920×2799 | **3840×5600** | **16.5 s** (13.4 s) | 47.9 MiB PNG |
| 3 | Red wool, macro (CC BY 2.0, Rosmarie Voegtli) | Detail keeping 2× | 1280×1707 | **2560×3416** | **8.8 s** | 20.3 MiB PNG |
| 4 | Lavender field (CC0) | Detail keeping 2× | 1920×1280 | **3840×2560** | **9.0 s** | 21.2 MiB PNG |
| 5 | 1880 newspaper scan (PD) | Photo restore 4× | 1280×1803 | **5120×7216** | **32.4 s** (31.6 s) | 64.5 MiB PNG |
| 6 | NASA SLS Green Run test (PD, NASA) | Video to 4K | 1280×720 · 12 fps · 36 frames (3.0 s) | **2560×1440** · 12 fps | **87.4 s** (98.5 s) | 2.27 MB H.264 MP4 |
| 7 | 1900 glass-plate self-portrait (PD) | Old photo restore | 900×1142 | **1800×2284** | **7.4 s** (8.0 s) | 6.7 MiB PNG |
| 8 | Photochrom portrait, Champéry (PD, Library of Congress) | Detail keeping 2× | 1920×1451 | **3840×2904** | **9.8 s** | 22.3 MiB PNG |

- Repeated runs on the same input vary by a few percent — say so if you quote a single run.
- The video preset's own description says H.265 / NVENC / MKV, but on the test machine (driver 591.86, i.e. below the 610 needed for hardware NVENC) the encoder **falls back to software and the actual output is H.264 MP4**. That is a driver condition, not an error in the preset.
- The comparison images show **both sides at the same pixel size**: left is the source at native pixels, right is the engine output scaled back down to the same size. That isolates what denoise + neural rendering change; the resolution gain of the 2×/4× stage is *not* visible in a same-size crop — the input/output pixel counts are what show it.

**Requirements** — Windows 10 (1909+ x64) or Windows 11 · an NVIDIA RTX card · driver 610+ if you want hardware NVENC (older drivers encode in software) · 8 GB RAM minimum, 16 GB recommended for 1080p and 4K video · ~3 GB free disk (the portable folder is ~1.1 GB unzipped) · a current Edge or Chrome.

**Distribution** — there is no public download. The build is handed out on request through the product page,
**https://www.dlss5nvidia.com/download**, and the bundled runtime contains parts that are not in the public
SDK, so the author treats it as an internal/technical preview rather than a product.
It is an **independent third-party project, not affiliated with NVIDIA**. If you need a call to action, use:
"the request form is on https://www.dlss5nvidia.com/download" or "no public build yet — ask and I'll say when there is".

## 2. Red lines (breaking one of these invalidates the article)

- **Never** "real-time", "realtime", "instant", "fast enough to preview live" — video is 2.43 s per frame.
- **Never** "NVIDIA official / partner / authorized / endorsed / licensed by NVIDIA", and never imply either.
- **Never** call neural rendering "upscaling" or an "upscaler". NR re-renders at the **same** resolution; super resolution is a separate, later stage. (`AI upscaler` as a category label in a title is fine only if the body draws the distinction explicitly — prefer avoiding it.)
- **Never** "works on any GPU", "runs on any PC", "no GPU needed".
- **Never** "faster than X", or any speed comparison with another tool.
- **Never** invent a number, a benchmark, a user count, a review, or a quote.
- **Never** promise "online trial / upload and process / free cloud".
- Never claim the difference is always obvious; several of the crops are subtle by design.

## 3. House style

- English, US spelling, plain and specific. Short sentences. No hype adjectives ("revolutionary", "game-changing", "stunning").
- Concrete over abstract: "3538×2318 → 7076×4636 in 26.6 s" beats "much larger, fast".
- Show the limit next to the win. Each article must contain at least one honest drawback from §4.
- No emoji. No ALL-CAPS headings. Markdown headings are `##`. Code fences only for real commands or numbers.
- Link the product page **once**, near the end, as a plain markdown link.
- Reference images by their **drive pack** relative names so the publisher can attach them:
  `reddit/01-night-compare.jpg`, `reddit/03-texture-detail-compare.jpg`, `reddit/ui/en-03-night-diff.jpg`, …
  (full inventory: `<mirror>/DLSS5-Studio/promo-20260930/reddit/reddit/`).
- 600–900 words each. A `Title:` line, a one-sentence `Dek:`, then the body, then a `Suggested channel:` line
  (one of: Dev.to / the site blog / r/Upscaling / r/VideoEditing / r/postprocessing) and an `Images:` line.

## 4. Honest drawbacks you may draw on

- Speed: 2.4 s per frame for video; a 3-second 720p clip takes 87 s. It is a batch/quality workflow.
- One video sample only; no second video to corroborate the runtime behaviour.
- NVENC depends on the driver (591.86 fell back to software encoding).
- Windows + NVIDIA RTX only; no macOS, no AMD/Intel.
- No public build, no installer, no code signing (SmartScreen will warn if it ever ships publicly).
- The UI still shows a few untranslated strings in the English build.
- The photochrom portrait set is the weakest of the eight — say so if you use it.

## 5. Output

Write files into `<mirror>/DLSS5-Studio/promo-20260930/articles/` as
`NN-slug.md` (two-digit number, lowercase slug), where NN is the topic number you were given.
Writing an article twice under two names is not acceptable; every article must have its own angle,
its own opening and its own example material.
