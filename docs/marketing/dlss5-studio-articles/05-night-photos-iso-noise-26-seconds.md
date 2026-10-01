Title: A high-ISO night frame, denoised at 3538×2318, in 26.6 seconds

Dek: One underlit street photo, the Low-light denoise preset, and what the job queue reported when it finished.

The file is the test. The Hong Kong night street frame used here was uploaded to Wikimedia Commons by its author in its noisy version (CC0, Wilfredor): 3538×2318, roughly 8.2 megapixels, grain across the frame and not only in the shadows. Working on it is the same job as working on a night shot off a phone — chroma blotches around every light source, color noise in the dark areas, and fine bright detail that dissolves the moment you push a denoiser hard.

## What the preset is asked to do

Low-light denoise, described in the interface as: denoising maxed, temporal denoising engaged, sharpening kept low so noise is not amplified, then a 2× scale. Worth being precise about that last item, because the pipeline is listed as four stages — Denoising → DLSS Neural Rendering → DLSS / RTX Super Resolution → Sharpening. Neural rendering re-renders the frame at its own resolution; it does not enlarge anything. The resolution gain comes from the super resolution stage that runs after it, which is why the input and output pixel counts are the honest way to talk about size, and a same-size crop is the honest way to talk about everything else.

## The run

Input 3538×2318, output 7076×4636, a 64.5 MiB PNG, 26.6 seconds. Test machine: Windows 11 Pro 26200, GeForce RTX 4090 24 GB, driver 591.86, Studio 0.1.0.

Treat that number as a sample rather than a rating. A second run of the same file on the same machine took 28.9 seconds. Repeated runs vary by a few percent, so if you see a time quoted without that caveat, someone is quoting one measurement as if it were a specification.

## The 1:1 crop

At 1:1 the crop lands on the signage, which is where a night frame is decided. Both halves are shown at the same pixel size, so this is not a resolution comparison — it isolates denoising and neural rendering.

What changes: the dot-matrix signboard reads as a grid of lamps instead of a field of colored noise. The neon tube outlines stay continuous rather than breaking into flecks along their length. The small type on the yellow menu board keeps its edges instead of bleeding into the glow behind it. What does not change is the structure of the frame: the same signs are readable as the same signs, and the dark gaps between buildings stay dark instead of acquiring texture that was not there. The resolution gain of the later stage shows up in the pixel counts, not in this view.

## The second opinion

The Difference view subtracts source and result pixel by pixel. Brighter means a bigger change, and the gain control runs 1×, 3× and 8× so that small changes are visible at all rather than being a nearly black rectangle. On this frame the largest changes sit where they should: the lit signage, the tube outlines, the painted road markings. Large flat areas stay dark, which is the useful negative result. A denoiser that invents texture in an empty night sky is a denoiser you cannot use twice.

That view is the reason this write-up spends its space on measurements rather than adjectives. A side-by-side asks you to trust the caption. A subtraction shows you which pixels moved.

## Where this fits in a workflow

It is not a preview tool, and 26 seconds for one still makes that obvious. The shape of the work is a batch: drop the night frames in, queue them, walk away, come back to finished files. The queue lists every item with its elapsed time and lets you rerun or cancel an individual job, which matters when one frame in a set of forty comes back wrong.

The requirements are narrow on purpose. Windows 10 (1909+, 64-bit) or Windows 11, and an NVIDIA RTX card; there is no macOS build and no AMD or Intel path. Everything renders locally on that GPU, so the material never leaves the machine, but it also means the machine is the ceiling.

The build is not publicly downloadable yet. It is handed out on request, and the request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download). DLSS5 Studio is an independent third-party project and is not affiliated with NVIDIA.

Suggested channel: r/postprocessing

Images: reddit/01-night-compare.jpg, reddit/01-night-detail-compare.jpg, reddit/ui/en-03-night-diff.jpg, reddit/01-night.gif
