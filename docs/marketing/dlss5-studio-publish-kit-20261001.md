# DLSS5 Studio publish kit mirror — 2026-10-01

The source pack is `/DLSS5-Studio/promo-20260930/` in the shared drive. This repository mirror keeps the text that can be reviewed in Git and the small, web-safe subset of the Reddit media. The full source package, original PNGs, 7 MB archive, raw video projects and large master videos stay in the drive.

## What is mirrored

- [Ten English articles](./dlss5-studio-articles/) — 600–900 words each, with a channel suggestion, image notes and the shared fact/red-line brief.
- [Reddit ready-to-post copy](./dlss5-studio-reddit/READY-TO-POST.md) and [source/credit table](./dlss5-studio-reddit/SOURCES.md).
- [Public Reddit kit page](../../public/marketing/reddit/dlss5-studio-kit.html) — nine upload-order JPGs, source links, captions, licence notes and the lightweight 15-second web reel.
- [Shared fact brief](./dlss5-studio-brief.md) — the measured runs and red lines used by every article and episode.
- [Podcast update pack](./podcast/dlss5-studio-20261001.md) — three 6–8 minute episodes, visual cues, show notes and an optional Claude editorial-pass prompt.

## Channels

| Asset | Primary use | CTA | Do not imply |
| --- | --- | --- | --- |
| Ten articles | Dev.to, site blog, technical community posts | Read the measured case or visit the request page | An NVIDIA partnership, a public build or a cloud workflow |
| Reddit kit | One discussion per community, 48+ hours apart | Ask for critique, then point to the kit or request page when allowed | A benchmark, a universal result or real-time video |
| 15-second reel | Site/social preview, with captions | Learn more at `/download` | That the reel itself is a product performance test |
| Podcast episodes | Audio feed, YouTube audio, Feishu show notes | Inspect the cases and request the internal build | “Instant”, “faster than”, “works on every GPU” |

## Fact and licensing gate

Use the measurements in `docs/marketing/dlss5-studio-brief.md` and the podcast pack only. The reference machine is Windows 11 Pro 26200, RTX 4090 24 GB, driver 591.86, Studio 0.1.0. The video run is 87.4 seconds for 36 frames, or 2.43 seconds per frame; the preset names H.265/NVENC but the older driver falls back to software H.264 MP4. Neural rendering is the same-resolution re-render stage; super resolution is separate.

The wool macro needs the exact Rosmarie Voegtli CC BY 2.0 credit. The other selected sources are CC0 or public domain. Keep the UI mosaic over local output paths. Do not upload the private build or the drive archive to this repository.

## Publish sequence

1. Post one Reddit discussion using one case group and the prepared caption. Read that community’s self-promotion rule first.
2. After 48 hours, reply to concrete questions with the matching crop or source link. Do not paste the same body across communities on the same day.
3. Publish the first podcast episode with the night and Difference-view visuals, then the video episode after listeners understand the speed limitation.
4. Publish articles 03, 05, 07 and 08 first; they answer the most useful technical questions. Hold the other articles for follow-up weeks.
5. Track `utm_source`, community, case, clicks and registrations. Stop repeating a topic if two weeks produce no useful discussion.
