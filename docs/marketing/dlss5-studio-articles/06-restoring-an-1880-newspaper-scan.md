Title: Restoring an 1880 newspaper scan: 1280×1803 to 5120×7216 in 32.4 seconds

Dek: What the Photo restore 4× preset does to a public-domain news page, plus a second restoration pass on a glass-plate portrait.

A scanner gives you one pass at a page. If the mottling, the foxing and the gray wash of aged paper end up in the file, they are in the record too, and every later reader inherits them. That is the case this test works on: a page of the Bridgeport Chronicle-Union from 1880, public domain, scanned at 1280×1803 — small type, a woodcut illustration, and a background that has not been white for a century.

## The run

Preset: Photo restore 4×. Input 1280×1803, output 5120×7216, a 64.5 MiB PNG. Elapsed time in the job queue: 32.4 seconds, and 31.6 seconds on a second run of the same file. As with every measurement here, quote the run you did; identical inputs come back a few percent apart.

Test machine: Windows 11 Pro 26200, GeForce RTX 4090 24 GB, driver 591.86, Studio 0.1.0. The numbers are engine job records — the elapsed time and output size the queue reports for that job, not an estimate made while watching the progress bar.

## What the 1:1 crop actually shows

Both halves of the comparison are displayed at the same pixel size, so this is not a demonstration of the 4× output. It shows what the denoising and neural rendering stages changed on a page that was already legible but dirty.

The mottled paper settles. The uneven staining that reads as gray noise across the sheet is largely gone, and the background becomes a consistent tone instead of a field of patches. Type that was competing with that texture — the small classified setting, the narrow rules between columns — comes back with clean edges and reads at normal viewing distance. The woodcut illustration keeps its line work and its hatching rather than being smoothed into a gray silhouette.

The honest part: much of the improvement is contrast and cleanup of texture, not new information. The type was always in the file; it was buried under the paper. And the change is not dramatic everywhere. The sheet still looks like an 1880 newspaper after processing, still slightly uneven, still showing the marks the press left. This preset cleans the page, it does not restore the paper.

## A second document, a different preset

The pack's other restoration case is a glass-plate self-portrait from roughly 1900, a scan of the original negative at 900×1142, public domain. That one went through Old photo restore rather than Photo restore 4× — the same family of work, a different preset on the list. Result: 1800×2284, a 6.7 MiB PNG, in 7.4 seconds, 8.0 seconds on the repeat run.

The material is different in kind. A glass plate brings scratches, pitting in the emulsion, and a haze over the whole frame; the scan above is a paper artefact with print on it. The preset keeps a little grain on purpose so the result does not turn plastic, and in the 1:1 crop the pitting around the figure drops away while the quilted fabric and the wallpaper pattern stay readable. That is the point of having several presets instead of one "enhance" button: a document scan and a damaged negative are not the same problem.

Where the treated detail is subtle, it stays subtle. Several of the crops in this set are deliberately gentle, and a reader who expects every pair to be night and day will be disappointed by at least a few of them. That is the material, not the pipeline.

## Numbers worth keeping

Small documents are quick: 7.4 seconds for the portrait, 32.4 for the newspaper. That is quick enough to run a shelf of scans as one queue job and come back to it, and the queue reports each item's elapsed time so you can see which page in a batch went wrong. It is not quick enough to sit and watch: this is a queue you start and leave.

Two practical costs. The newspaper output is a 64.5 MiB PNG for a single page, so a hundred pages is a serious amount of disk; and the engine works on the pixels in the file, so a corner the scanner missed is still a corner you do not have.

The requirements are also narrow. Windows 10 (1909+, 64-bit) or Windows 11 and an NVIDIA RTX card — no macOS, and no AMD or Intel path. Archive work often happens on Linux boxes and old hardware, and today this is not that tool. The build itself is not publicly downloadable either; it is handed out on request, and the request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download). DLSS5 Studio is an independent third-party project and is not affiliated with NVIDIA.

Suggested channel: r/DataHoarder

Images: reddit/05-text4x-compare.jpg, reddit/05-text4x-detail-compare.jpg, reddit/ui/en-06-text4x-compare.jpg, reddit/07-oldphoto-detail-compare.jpg
