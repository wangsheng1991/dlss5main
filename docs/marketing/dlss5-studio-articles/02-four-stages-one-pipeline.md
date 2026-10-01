Title: Four stages, one pipeline: what each stage does and how it shows up in the interface

Dek: Denoising, DLSS neural rendering, DLSS/RTX super resolution and sharpening are separate steps with separate jobs, and the interface lists them as the preset runs.

## A preset is a set of switches, not a look

The preset list on the right of the window reads like a menu of styles. It is closer to a panel of switches. Each of the seven presets - Auto (recommended), Detail keeping 2×, Photo restore 4×, Game screenshot enhance, Low-light denoise, Old photo restore, Anime / illustration 2× - is one combination of pipeline stages and parameters. The interface spells the pipeline out in order: Denoising, DLSS Neural Rendering, DLSS / RTX Super Resolution, (colourise) Sharpening. Knowing which stage a preset leans on is the difference between reading a result and guessing at it.

## Stage one: denoising

Denoising runs first, before anything else touches the frame. That ordering is not decorative: noise left in place when the later stages run would be carried along with everything else. A preset aimed at low-light material puts its weight here, and the difference view makes the effect easy to read - pixels that changed a lot show up brighter in the subtraction between source and result.

## Stage two: DLSS neural rendering

Neural rendering re-renders the frame at the resolution it already has. It does not change the pixel count. What it changes is the pixels: detail is reconstructed rather than merely enlarged. This is the stage most often mislabeled as upscaling, and it is not that.

## Stage three: DLSS / RTX super resolution

This is the stage that changes dimensions, and the only one that does. It is where 3538×2318 becomes 7076×4636, where 1280×1707 becomes 2560×3416, and where a 1280×720 clip becomes 2560×1440 at the same 12 fps. When a preset name carries a 2× or a 4×, this is the stage that earns it.

## Stage four: (colourise) sharpening

The last step. Colourise applies where a preset is restoring old material; sharpening closes the run, late enough that it does not undo the noise removal from stage one.

## What the stages actually cost

Eight measured runs, on Windows 11 Pro 26200, GeForce RTX 4090 24 GB, driver 591.86, Studio 0.1.0 on the `ve` engine. Every number is an engine job record, not an estimate.

| # | Material | Preset | Input | Output | Time | Output size |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hong Kong street, night (CC0, Wilfredor) | Low-light denoise | 3538×2318 | **7076×4636** | **26.6 s** (28.9 s on a second run) | 64.5 MiB PNG |
| 2 | Ukiyo-e woodblock print (PD) | Anime / illustration 2× | 1920×2799 | **3840×5600** | **16.5 s** (13.4 s) | 47.9 MiB PNG |
| 3 | Red wool, macro (CC BY 2.0, Rosmarie Voegtli) | Detail keeping 2× | 1280×1707 | **2560×3416** | **8.8 s** | 20.3 MiB PNG |
| 4 | Lavender field (CC0) | Detail keeping 2× | 1920×1280 | **3840×2560** | **9.0 s** | 21.2 MiB PNG |
| 5 | 1880 newspaper scan (PD) | Photo restore 4× | 1280×1803 | **5120×7216** | **32.4 s** (31.6 s) | 64.5 MiB PNG |
| 6 | NASA SLS Green Run test (PD, NASA) | Video to 4K | 1280×720, 12 fps, 36 frames (3.0 s) | **2560×1440**, 12 fps | **87.4 s** (98.5 s) | 2.27 MB H.264 MP4 |
| 7 | 1900 glass-plate self-portrait (PD) | Old photo restore | 900×1142 | **1800×2284** | **7.4 s** (8.0 s) | 6.7 MiB PNG |
| 8 | Photochrom portrait, Champéry (PD, Library of Congress) | Detail keeping 2× | 1920×1451 | **3840×2904** | **9.8 s** | 22.3 MiB PNG |

Repeated runs on the same input vary by a few percent, so no single figure should be read as a constant.

## Where the pipeline bites back

The stage list makes the costs legible, and they are real costs. The video run is the clearest one: 87.4 s for a three-second clip is 2.43 s per frame, and the queue does not shorten that - it only lets you walk away. That preset's own description promises H.265 with hardware NVENC inside an MKV container, but the test driver, 591.86, sits below the 610 needed for hardware NVENC, so the encoder fell back to software and the actual output is an H.264 MP4. That is a driver condition rather than a fault in the preset, and it is the sort of thing worth checking before you plan a long queue on an older machine.

The interface itself is served from a loopback address and the render happens on your own GPU, so none of these runs involve an upload. If you want to ask about the build, the request form is on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download).

Suggested channel: Dev.to
Images: reddit/ui/en-08-queue-running.jpg, reddit/ui/en-03-night-diff.jpg, reddit/06-video-compare.jpg
