Title: Eight materials, eight runs: what each one produced, and where the samples came from

Dek: A night street, a woodblock print, macro wool, a lavender field, a newspaper scan, a rocket test clip, a glass-plate self-portrait and a photochrom portrait, each with its source, its license and its measured result.

All eight runs were made on one machine: Windows 11 Pro 26200, GeForce RTX 4090 24 GB, driver 591.86, Studio 0.1.0 on the `ve` engine. Every figure below is an engine job record, not an estimate. Each source file is CC0 or public domain, apart from one CC BY 2.0 image, where attribution is required because the processed file is a derivative of it.

## 1. Hong Kong street at night - CC0, by Wilfredor

The file is 3538×2318 and the preset was Low-light denoise. Output: 7076×4636 in 26.6 s, written as a 64.5 MiB PNG; a second run of the same input took 28.9 s. CC0 means no attribution is required, though naming the source is worth doing on a public post.

## 2. Ukiyo-e woodblock print - public domain

1920×2799 through Anime / illustration 2×, out at 3840×5600 in 16.5 s (13.4 s on a rerun), 47.9 MiB PNG. Flat color fields and hard printed line edges are the material this preset is named for, and at 100% they are easy to inspect.

## 3. Red wool, macro - CC BY 2.0, by Rosmarie Voegtli

This is the one set in the gallery that needs attribution, and the requirement carries over to the processed images because they are derivatives. The credit line to use:

> Source: "Wool" by Rosmarie Voegtli, licensed CC BY 2.0, via Wikimedia Commons. (Processed with DLSS5 Studio.)

1280×1707 through Detail keeping 2×, out at 2560×3416 in 8.8 s, 20.3 MiB PNG. Fibre is a good subject for a detail-keeping pass because the question is whether individual strands survive.

## 4. Lavender field - CC0

1920×1280 through the same Detail keeping 2× preset, out at 3840×2560 in 9.0 s, 21.2 MiB PNG. Compare it with the wool above: a larger output area in about the same time. The preset is the same; the material is not.

## 5. 1880 newspaper scan - public domain

1280×1803 through Photo restore 4×, out at 5120×7216 in 32.4 s (31.6 s on a rerun), 64.5 MiB PNG. This is the largest output of the eight and the second-longest photo run. Dense small type is unforgiving: at 4× the paper texture is resolved along with the letterforms, which is exactly why this preset is aimed at scans and photographed documents.

## 6. NASA SLS Green Run hot fire test - public domain, NASA

The video run. Input 1280×720 at 12 fps, 36 frames, three seconds of material; output 2560×1440 at the same 12 fps, a 2.27 MB H.264 MP4, in 87.4 s (98.5 s on a rerun). That is 2.43 s per frame. The preset's own description promises H.265 encoded with hardware NVENC inside an MKV, but the test driver, 591.86, is below the 610 needed for hardware NVENC, so the encoder fell back to software and produced H.264 MP4 instead. A driver condition, not a broken preset, but worth knowing before you queue a long clip.

## 7. 1900 glass-plate self-portrait - public domain

The original is a 4×5 glass negative scan in the region of 1900. 900×1142 through Old photo restore, out at 1800×2284 in 7.4 s (8.0 s on a rerun), a 6.7 MiB PNG. The smallest output of the eight and one of the fastest runs - small scanned material is the comfortable case here.

## 8. Photochrom portrait, Champéry - public domain, Library of Congress

1920×1451 through Detail keeping 2×, out at 3840×2904 in 9.8 s, 22.3 MiB PNG. This is the weakest set of the eight and it deserves saying plainly: the photochrom process builds its color from layered ink, so the source carries little of the fine, high-frequency grain that a detail-keeping pass works on. In a same-size crop the change is modest, and anyone presenting this pair as a headline result would be overselling it.

## Reading the table honestly

Repeated runs on the same input vary by a few percent, so quote a single figure as one run rather than a constant. Every comparison image in the pack shows both sides at the same pixel size, which means the resolution gain is invisible in the crops by design - the input and output pixel counts are the evidence for that, not the images. And eight runs is eight runs; they describe one RTX 4090 machine, not a range of hardware.

The build is Windows and NVIDIA RTX only, and there is no public download. The request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download).

Suggested channel: r/postprocessing
Images: reddit/01-night-compare.jpg, reddit/03-texture-detail-compare.jpg, reddit/07-oldphoto-compare.jpg, reddit/08-portrait-compare.jpg
