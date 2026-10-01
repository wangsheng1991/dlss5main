Title: Stop trusting the side-by-side: a difference view that subtracts, pixel by pixel

Dek: How a comparison tool can show you where the pixels moved instead of asking you to believe the caption, and what else in the UI counts as evidence.

Every enhancement post is the same artifact: two images and a scrubber. The reader is asked to accept that both halves came from the same source, were shown at the same scale, and were not quietly re-graded on one side. Sometimes that is true, and there is no way to check it from the outside.

The interesting thing about DLSS5 Studio, from a verification standpoint, is that its canvas has four views rather than two: Original, Compare with a wipe line, Result, and Difference.

## What the difference view is

Difference subtracts the source image and the result image pixel by pixel, then displays the magnitude. Brighter means a bigger change. That is the whole idea, and it is stated on the canvas in the interface itself — the hint line reads "Pixel-by-pixel subtraction · brighter means a bigger change · gain 3×".

The gain control offers 1×, 3× and 8×. That is a display magnifier, not a data filter: it exists because a lot of honest changes are small enough that at 1× the difference image would be a nearly black rectangle with a few faint smudges. At 8× you can see structure in changes that are real but modest. The floor is still black: nothing is added to make the picture more interesting.

## What it shows on a real frame

Take the night street frame in this set, 3538×2318 through the Low-light denoise preset, output 7076×4636. At gain 3× the bright regions are not spread evenly across the picture. They cluster on the lit signage, the tube outlines of the neon, and the painted road markings. Large flat areas of sky and unlit wall stay dark.

That distribution is the evidence. It says the pipeline changed specific structures rather than applying a global contrast move — a global grade would light up the whole frame, including the regions that should not change. It also says the processing is not fabricating texture in empty areas, the failure mode that makes a denoised image unusable for a second pass.

A caveat worth stating plainly: several of the crops in this set are subtle by design, and the difference view is how you find that out. If you want a dramatic before-and-after on every pair, some of this material will disappoint you.

## The comparison convention matters

In the comparison images, both halves are shown at the same pixel size: the left side is the source at native pixels, the right side is the engine output scaled back down to the same size. That is a deliberate choice and it changes what you are looking at. A same-size crop isolates what denoising and neural rendering changed; it deliberately does not show the resolution gain of the super resolution stage, because that gain cannot be visible when both sides are rendered at the same display size.

So read the two kinds of claim separately. The crop is evidence about texture and noise. The pixel counts — 3538×2318 in, 7076×4636 out — are the evidence about resolution. A post that tries to demonstrate a 4× output with a side-by-side has shown you neither.

## The second piece of evidence: the job queue

The bottom panel of the interface lists every job with its own elapsed time. In this test the entries read 8.0 s for a 900×1142 portrait, 13.4 s for an illustration, 31.6 s for a document scan, 28.9 s for the night frame, and 98.5 s for the 3-second 720p video. Jobs can be rerun or cancelled individually, and the queue reports its own counters while it works — waiting, running, done, failed.

Self-reported timing is not a benchmark suite, and should not be read as one. But it is the same kind of record a build log gives you: a number attached to a specific unit of work, produced by the thing that did the work. Compare that with a marketing page claiming a speed tier.

One more detail that argues for the numbers being real: repeated runs on identical input come back a few percent apart — 26.6 seconds and 28.9 seconds for the same night frame. A fabricated benchmark tends to produce suspiciously stable figures. Real ones wobble.

## Where the evidence stops

The interface is served from localhost and the render happens on the machine's own GPU, so nothing is uploaded. That is a privacy property, not a quality claim, and it is worth keeping separate.

Two honest gaps. The English build still shows a few untranslated strings — the badge over a finished render carries the Chinese preset label rather than "Low-light denoise", and the header next to the version number reads 精简版. The UI is version 0.1.0 and it looks like it. Also, there is no public build to verify any of this yourself: it is handed out on request, and the request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download), with the bundled runtime treated as an internal, technical preview rather than a shipping product. DLSS5 Studio is an independent third-party project and is not affiliated with NVIDIA.

Suggested channel: Dev.to

Images: reddit/ui/en-03-night-diff.jpg, reddit/ui/en-07-video-compare.jpg, reddit/ui/en-08-queue-running.jpg, reddit/01-night-detail-compare.jpg
