# DLSS5 Studio podcast update pack — 2026-10-01

Three short episodes are ready for an English-language feed, YouTube audio, or Feishu show notes. Each is written for a six-to-eight-minute read at a calm pace. The scripts use only the measured facts in `docs/marketing/dlss5-studio-brief.md`; the visual cues point to the curated Reddit kit at `/marketing/reddit/dlss5-studio-kit.html`.

The local Claude Code executable is installed (`2.1.284`), but its OAuth session was expired on 2026-10-01, so the `fable` alias could not be called. This pack is a human-reviewed factual baseline, not a claim that Claude generated it. The optional prompt at the end is ready for a later Claude editorial pass after authentication. Anthropic’s current model documentation lists Claude Fable 5 and Claude Sonnet 5 as active model families; keep the model alias configurable rather than hard-coding a retired model.

## Episode 1 — A DLSS download is not an installer

**Hook:** Search for “DLSS download” and you can easily download the wrong thing. This episode separates the game-delivered library from an independent local front-end.

**Audience:** PC gamers, image-tool users and developers who want the terminology straight before trying a workflow.

**Rundown:** 0:00 the search problem · 0:45 what official DLSS delivery means · 2:00 what Studio actually is · 3:35 the four stages · 5:15 what local-only changes · 6:20 limits and request-only distribution · 7:10 close.

### Host script

If you have ever searched for “DLSS download”, you have probably seen pages that make the technology sound like a normal desktop program. That is the first thing to clear up.

NVIDIA’s DLSS is delivered inside supported games. It is not a standalone installer that you download, double-click and install into Windows. The game or its updater brings the relevant library with it. A page that hands you an unrelated installer is talking about a different product.

DLSS5 Studio is a separate project. It is an independent Windows desktop front-end over the Visual Enhancer runtime. The interface is served from localhost. You drop in an image or a video, choose a preset, watch the queue and inspect the result. The rendering work happens on your own NVIDIA RTX GPU. Nothing is uploaded to a cloud renderer.

That distinction matters because the interface can make the workflow feel like a web app even though the render is local. The left side is an asset rail. The centre has Original, Compare, Result and Difference views, plus a magnifier. The right side contains presets and parameters. The bottom is a batch queue with progress, elapsed time, cancel and retry.

The pipeline has four stages. First comes denoising. Then DLSS neural rendering, which re-renders at the same resolution. Then DLSS or RTX Super Resolution, which is the stage that changes the pixel count. Finally there can be colourising or sharpening. Calling every stage “upscaling” hides that difference. When you look at a same-size crop, most of what you notice may be denoise and neural re-rendering; the resolution change is represented by the input and output dimensions.

The project is deliberately transparent about its boundaries. It is Windows and NVIDIA RTX only. It does not promise every GPU. There is no public build to download at the moment. The request page is at dlss5nvidia.com/download, and the request flow is separate from the local render itself.

The examples in the accompanying gallery are useful because the source is visible. A Hong Kong night frame goes from 3538 by 2318 to 7076 by 4636 in 26.6 seconds on the reference machine. A 1900 glass-plate portrait goes from 900 by 1142 to 1800 by 2284 in 7.4 seconds. Those are recorded runs, not a promise for every computer.

The short version is simple: official DLSS is something games ship; DLSS5 Studio is a local interface for a separate Visual Enhancer workflow. Keeping those names separate makes the rest of the discussion more honest.

If you want to inspect the cases, open the Reddit kit page and start with the source, the output dimensions and the Difference view. If you want to ask about the internal build, use the request form. There is no public installer link to pretend otherwise.

**Visual/audio cues:** Open with the `03-night-compare.jpg` case; show the four-stage diagram as text; end on the `/download` request page. Use `reel-1920x1080-15s-web.mp4` only as a silent visual bed, not as a benchmark.

**Show notes:**

- [DLSS5 Studio request page](https://www.dlss5nvidia.com/download)
- [Reddit kit and nine measured cases](https://www.dlss5nvidia.com/marketing/reddit/dlss5-studio-kit.html)
- [NVIDIA DLSS 5 technical reference](https://developer.nvidia.com/blog/whats-new-for-game-developers-dlss-5-with-3d-guided-neural-rendering-nvidia-ace-updates-new-rtx-kit-capabilities/)

**CTA:** “Open the cases first. If the local workflow fits your use, send a request; there is no public build to download yet.”

## Episode 2 — What 2.43 seconds per frame tells you

**Hook:** A three-second 720p clip took 87.4 seconds on an RTX 4090. That is not a failure; it tells you what kind of tool this is.

**Audience:** Editors, archivists and developers deciding whether a neural video workflow belongs in a batch queue.

**Rundown:** 0:00 the measured run · 1:15 the arithmetic · 2:15 why the encoder fell back · 3:30 what batch work changes · 5:00 what the number does not prove · 6:20 practical workflow · 7:20 close.

### Host script

Here is the number to keep in your head: 2.43 seconds per frame.

That comes from one recorded run in DLSS5 Studio. The source was a public-domain NASA SLS test clip, 1280 by 720, 12 frames per second and three seconds long. That is 36 frames. The output was 2560 by 1440 H.264 MP4. The complete job took 87.4 seconds, which is 2.43 seconds per frame on the reference machine: Windows 11 Pro 26200, RTX 4090 24 GB, driver 591.86.

This is a batch and quality workflow. It is not a real-time filter, and the number should not be turned into a speed claim against another product. It is simply a measured cost for one clip, one preset and one machine. A second run in the brief is 98.5 seconds, which is another reason to report the machine and the run instead of promising a universal duration.

There is a small but important encoding detail. The video preset description names H.265, NVENC and MKV. The test driver is below the 610 requirement for hardware NVENC, so the encoder correctly fell back to software and the actual file was H.264 MP4. That is a driver condition, not a mysterious quality problem.

What does the number mean in practice? It means you plan the queue. You can process a short clip while doing something else. You can render selected shots overnight. You can compare a few representative frames before committing to a long batch. The app’s queue exposes progress and elapsed time so you can make that decision with evidence.

It also means you keep the quality conversation separate from the playback conversation. The gallery’s video comparison lets you inspect a frame, but the clip is not pretending to be a live enhancement. A frame that looks good in a still may still reveal a temporal problem once you examine several moments. The current pack has one measured video sample, so it cannot prove how every source behaves.

The workflow is especially easy to misunderstand when a label says “4K”. In this case the input and output numbers tell the truth: 1280 by 720 becomes 2560 by 1440. The later super-resolution stage changes the pixel count. The neural-rendering stage is a separate, same-resolution re-render. The two stages can be in one preset, but they are not the same operation.

If you are an editor, start with a short excerpt. Record the source frame rate, duration, output format and driver. Run it once. Inspect a few frames and the queue time. Then decide whether the result earns a longer batch. That is a more useful test than a looping hero video.

For the current reference run, the honest summary is: 36 frames, 87.4 seconds, 2.43 seconds per frame, software H.264 fallback because of the driver. The practical conclusion is equally honest: schedule it like batch work.

**Visual/audio cues:** Put the `08-video-frame-compare.jpg` on screen while reading the measurements. Show the queue section of the reel, then the amber “not real-time” slate if present. Do not add a ticking countdown or “instant” wording.

**Show notes:**

- [Video case and request page](https://www.dlss5nvidia.com/download#showcase)
- [Reddit kit](https://www.dlss5nvidia.com/marketing/reddit/dlss5-studio-kit.html)
- [NASA SLS source page](https://commons.wikimedia.org/wiki/File:NASA%E2%80%99s_Green_Run_Hot_Fire_Test_of_the_Space_Launch_System_Core_Stage.webm)

**CTA:** “Use a short clip, record the same four numbers, and share the failure case if the result is not useful.”

## Episode 3 — How to audit an enhanced image

**Hook:** “Looks sharper” is not a test. A source-aligned crop and a Difference view make the changed pixels visible.

**Audience:** Archivists, artists, technical reviewers and anyone worried about faces, text or geometry changing during enhancement.

**Rundown:** 0:00 why side-by-side can mislead · 1:10 same-size crops · 2:20 Difference view · 3:30 three hard cases · 5:30 reading the numbers · 6:40 the publication checklist · 7:30 close.

### Host script

A before-and-after image can be persuasive without being informative. If the after image is larger, sharper and presented alone, your eye has already been asked to accept the conclusion. The better question is: which pixels changed, and what did they change into?

DLSS5 Studio’s comparison workflow gives you a practical audit. First, keep the source at its native pixels. Then scale the output back down to the same display size for the comparison crop. That makes the denoise and neural-rendering changes easier to isolate. The resolution gain still matters, but you report it separately as input and output dimensions.

The second tool is the Difference view. It subtracts the source and result pixel by pixel. Brighter areas mean larger changes. You can switch the gain to make subtle changes visible. The point is not that a Difference view proves an output is true. It shows where to look and stops a single polished side-by-side from doing all the talking.

Take a face. Check the eyes, jawline, expression and hair edges. If the face identity moves, the output is a visual draft, not historical evidence. Take handwriting or a newspaper. Compare every character with the source. Reconstructed text may be easier to read while still being wrong. Take architecture or a product label. Look at repeated windows, straight rails, logos and serial numbers. Those structures are excellent at exposing plausible but invented detail.

The material pack makes the same point across different cases. The Hong Kong night frame is useful for noise and neon edges. The wool macro gives you repeated fibres at one-to-one scale. The ukiyo-e print tests line weight. The 1880 newspaper scan tests small type. The NASA frame shows that a video workflow adds a time dimension to the inspection.

The measurements provide a second layer of honesty. The night frame is 3538 by 2318 to 7076 by 4636 in 26.6 seconds. The newspaper is a 1280 by 1803 source to a 5120 by 7216 output in 32.4 seconds. The photo and video runs have their own recorded times. None of those numbers says that the output is historically correct or that the same result will appear on every GPU.

If you publish a comparison, keep the original file. Label the enhanced copy. Include the preset, input size, output size, machine and driver when the number matters. Put the source licence beside the image. For the wool macro, keep the Rosmarie Voegtli CC BY 2.0 credit. For the other selected cases, the pack records CC0 or public-domain sources.

A good audit is slower than a hero image, but it is much more useful. You get a view of the gain, a view of the changed pixels and a list of failure modes. That is enough to decide whether the output is fit for a print draft, a presentation image or only a visual experiment.

Start with the Difference view. Then zoom into the hard case. If the original and enhanced copies disagree on something that matters, the original wins.

**Visual/audio cues:** Begin with `09-diff-view-ui.jpg`, cut to `02-wool-macro-detail.jpg`, then `06-newspaper-1880-compare.jpg`. Leave the source-link and licence cards on screen while reading the checklist.

**Show notes:**

- [Difference-view case](https://www.dlss5nvidia.com/marketing/reddit/dlss5-studio-kit.html)
- [DLSS5 Studio request page](https://www.dlss5nvidia.com/download)
- [Wool source and CC BY 2.0 credit](https://commons.wikimedia.org/wiki/File:Wool_-_Flickr_-_Rosmarie_Voegtli.jpg)

**CTA:** “Bring one difficult crop, keep the original beside it, and tell us which changed pixels you would reject.”

## Production checklist

- Read the script against the shared fact table before recording.
- Put “independent project” and “not real-time” in the description where the video case appears.
- Keep the wool macro credit on screen or in the show notes.
- Do not use the private build, raw PNGs, or drive paths in the edit.
- Use captions for dimensions and seconds; do not add speed comparisons.
- Link the request page once, after the useful explanation.

## Claims the host must not make

- “Real-time”, “instant”, “live filter”, or “fast enough to preview live”.
- “NVIDIA official”, “partner”, “authorized”, “endorsed”, “licensed” or any implied relationship.
- “Neural rendering is an upscaler.” Explain the same-resolution stage and the later super-resolution stage.
- “Works on every GPU”, “works on any PC”, “no GPU needed”, or an unmeasured speed comparison.
- “The enhanced detail is historical truth.” Keep the source scan and label the generated copy.

## Optional Claude editorial-pass prompt

Use this only after the local Claude session is authenticated. The current Anthropic docs list active Claude Fable 5 and Claude Sonnet 5 families; prefer the current `fable` alias and record the exact model returned by the CLI.

> Review this podcast pack against `docs/marketing/podcast/dlss5-studio-20261001.md` and `docs/marketing/dlss5-studio-brief.md`. Return a table of every numerical claim, its source line, and whether the wording stays within the red lines. Then suggest at most five spoken-language edits. Do not invent facts, comparisons, endorsements, quotes or new claims. Preserve the distinction between same-resolution neural rendering and later super resolution. Do not rewrite the whole script.
