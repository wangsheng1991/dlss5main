# READY TO POST — r/Upscaling · copy, paste, done (2026-09-30)

Everything below is finished text: pick the block, paste it, upload the nine images in the order given.
Nothing here needs editing. The decisions are already made: **no download link**, nine-image gallery,
title #6 from `studio-promo-reddit.md`.

---

## 1. Where

Post to **r/Upscaling** first. Before you submit, open its sidebar / pinned post once — the sub has its
own self-promotion rules and this is the only step I cannot do for you.

Backups if Upscaling removes it: r/VideoEditing · r/postprocessing · r/DataHoarder · r/retrogaming ·
r/emulation. r/photography and r/pcmasterrace are the strictest about self-promo.

## 2. Title — copy this line

```
Question for people who upscale old scans: is this difference worth a 2.4 s/frame GPU pipeline? [before/after crops inside]
```

Two alternates, if you would rather not open with a question:

```
I built a local Windows tool that runs NVIDIA's Visual Enhancer pipeline on photos and videos — before/after crops, no cloud, no upload
```
```
I ran 8 kinds of material through the same GPU pipeline — night shots, a 1880 newspaper scan, a woodblock print, wool macro, and a 1900 glass plate. Here are the crops
```

## 3. Body — copy the whole block

```
Short version: it's a local Windows app that runs a four-stage pipeline on photos and videos —
denoise → DLSS neural rendering (re-renders at the *same* resolution) → DLSS/RTX super resolution → sharpen.
Seven built-in presets, batch queue, image and video. Nothing is uploaded; the UI is served from localhost
and the render happens on your own GPU.

Every crop in the gallery is a real run, not a mockup:

• Night street photo (CC0, 3538×2318) → 7076×4636 in ~27 s
• 1880 newspaper scan (public domain, 1280×1803) → 5120×7216 in ~32 s
• Woodblock print (public domain, 1920×2799) → 3840×5600 in ~15 s
• 1900 glass-plate self-portrait (public domain, 900×1142) → 1800×2284 in ~7.4 s
• 3 s of 720p video (public domain) → 2560×1440 in 87 s — that's ~2.4 s per frame on a 4090

Two things I want to be upfront about:

1) The gallery shows both sides at the SAME pixel size (source pixels vs. output scaled back down).
   That isolates what the denoise + neural re-render stages actually change. The resolution gain from
   the 2×/4× stage is not visible in a same-size crop — that's what the pixel numbers above are for.
2) It is not fast. 2.4 s per frame is a batch/quality workflow, not a real-time filter.

All source material is CC0 or public domain, and I'll link each file in the comments if anyone wants to re-run it.

Not claiming to beat anything — if you upscale scans for a living I'd genuinely like to know what you'd
change about the crops. Happy to post 100% crops of anything you want to see.

(No download link yet — it's not packaged for public distribution. If you want a ping when it is, say so.)
```

## 4. The nine images — upload from `upload-order/` in this exact order

In Reddit's gallery composer, add them in this order; each line below is the caption to put on that image.

| # | file in `upload-order/` | caption to paste |
| --- | --- | --- |
| 1 | `01-wool-macro-compare.jpg` | `Red wool, macro. Left: original. Right: after the pipeline. (Detail keeping 2×) — source: Rosmarie Voegtli, CC BY 2.0` |
| 2 | `02-wool-macro-detail.jpg` | `Same pair, 1:1 source pixels — individual fibres resolve.` |
| 3 | `03-night-compare.jpg` | `Hong Kong street at night, ISO noise everywhere. (Low-light denoise)` |
| 4 | `04-night-detail.jpg` | `1:1 crop: neon tube stripes and letter edges.` |
| 5 | `05-ukiyoe-compare.jpg` | `Ukiyo-e woodblock print. (Anime / illustration 2×)` |
| 6 | `06-newspaper-1880-compare.jpg` | `1880 newspaper scan, 4× restore — the paper mottling is gone, small type stays readable.` |
| 7 | `07-lavender-compare.jpg` | `Lavender field, foliage and flower detail. (Detail keeping 2×)` |
| 8 | `08-video-frame-compare.jpg` | `Video frame: 720p source vs. 1440p output, both shown at 1440p.` |
| 9 | `09-diff-view-ui.jpg` | `The app's Difference view — every pixel that changed, so you don't have to trust a side-by-side.` |

Notes: 1–8 are the same 2560×1450 before/after panels; 9 is a UI screenshot (its local output path is
mosaic'd — **do not remove the mosaic**). Image 1 is the only CC BY material in the pack; the attribution
is in its caption. The other eight are CC0 / public domain and need no credit.

## 5. First comment — paste right after submitting

```
Camera-side notes: every crop is the same crop box on both sides, no manual retouching, no colour grading.
Right side = engine output downscaled back to the source resolution, so both panels are the same size.
The only post-processing anywhere in this post is a mosaic over my local output path in the UI screenshots.
```

## 6. Before you hit submit

- [ ] No "real-time", no "NVIDIA official / partner / authorized", no "faster than X", no "works on any GPU".
- [ ] Numbers match §5 of `studio-promo-reddit.md` (26.6 s / 32.4 s / 16.5 s / 7.4 s / 87.4 s).
- [ ] "Neural rendering" is not called upscaling — NR re-renders at the same resolution.
- [ ] Gallery order is 1–9 as above; image 9 still has its mosaic.
- [ ] No download link anywhere in the post (the whole point of this version).

## 7. If the post does well

The same nine images are re-usable for a video post: `reddit/03-texture.mp4` (8 s seamless wipe,
H.264) or `reddit/01-night.mp4` — that is the "动图/视频" version of image 1 and 3. Reply to your own
thread with it rather than making a second post.
