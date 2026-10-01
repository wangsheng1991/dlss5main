Title: Neural rendering is not upscaling: two stages that get conflated, and why the gallery crops look the way they do

Dek: In DLSS5 Studio, DLSS neural rendering re-renders at the same resolution, and the 2× or 4× in a preset name comes from a separate super resolution stage that runs after it.

## The shorthand problem

"AI upscaling" is the phrase everyone reaches for when describing this class of tool, and in a demo video it usually passes without complaint. In DLSS5 Studio it describes the wrong thing. The pipeline is listed in the interface as four stages: Denoising, DLSS Neural Rendering, DLSS / RTX Super Resolution, (colourise) Sharpening. Two of those four are easy to merge into one word, and merging them produces a description that is wrong about both.

## Same resolution in, same resolution out

DLSS Neural Rendering re-renders the frame at the resolution the frame already has. The stage does not change the pixel count. What it changes is the pixels themselves. Detail is reconstructed instead of enlarged, and the noise that survived the denoising stage is dealt with rather than carried forward.

The counted gain arrives later, in a different stage. DLSS / RTX Super Resolution is where dimensions change, and it is the only place they change. That is the stage where 1280×1707 becomes 2560×3416, where 1280×1803 becomes 5120×7216, and where a 1280×720 video becomes 2560×1440 at the same 12 fps. A sentence like "the neural rendering upscales 2×" is therefore wrong twice: it names the wrong stage, and it hides the fact that there are two.

## Why every crop in the gallery is the same size

Each comparison image in the pack shows both sides at the same pixel size. The left side is the source at native pixels; the right side is the engine output scaled back down to the same size. The choice is deliberate and it is a trade.

What it buys: the size difference is removed, so you cannot mistake "bigger" for "better", and what you are looking at is exactly what denoising and neural rendering changed. What it costs: the resolution gain of the 2× or 4× stage is not visible in a same-size crop at all. If you want to judge the super resolution result, the honest evidence is the pair of pixel counts and the output file itself - 3538×2318 to 7076×4636, 1280×1803 to 5120×7216 - not a downscaled thumbnail.

The Difference view in the interface follows the same logic in the other direction. It subtracts the source from the result pixel by pixel, so the areas that changed most are the brightest. It is not a flattering image; it is there to show that the frame was genuinely re-rendered rather than re-tinted.

## How to read a comparison, including these ones

Several crops in the pack are subtle by design, and a same-size comparison of a modest change will look like a modest change. That is what an honest pair of crops looks like, and it is worth saying before someone else does: if a comparison somewhere claims every pair is dramatic, ask how the two sides were sized. A crop that silently resizes one side is showing you scale, not rendering.

Two further caveats on the evidence here. The gallery holds a single video sample, so there is no second clip to corroborate the runtime behavior on video - one 36-frame run is one data point. And repeated runs on the same input vary by a few percent, which matters when you are comparing a 26.6 s result against a 28.9 s rerun.

None of this is measured on a machine you are likely to own in the same configuration: the runs were made on Windows 11 Pro 26200 with a GeForce RTX 4090 24 GB and driver 591.86, running Studio 0.1.0 on the `ve` engine. On anything else, treat the timings as a description of one machine rather than a promise about yours.

The build runs on Windows 10 (1909 or later, 64-bit) or Windows 11 and requires an NVIDIA RTX card; there is no macOS, AMD or Intel path, and there is no public download. The request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download) if you want to ask about it.

Suggested channel: r/Upscaling
Images: reddit/03-texture-detail-compare.jpg, reddit/ui/en-03-night-diff.jpg, reddit/05-text4x-compare.jpg
