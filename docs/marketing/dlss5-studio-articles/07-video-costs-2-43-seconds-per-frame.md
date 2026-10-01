Title: Video at 2.43 seconds a frame: three seconds of 720p took 87.4 seconds

Dek: The measured cost of running a short clip through neural rendering and super resolution, including the encoder fallback nobody advertises.

The clip is short on purpose. It is 3.0 seconds trimmed from NASA's Green Run hot fire test of the Space Launch System core stage — public domain footage — at 1280×720, 12 fps, 36 frames. That is a small, well-lit, moving subject with smoke, structure and fine detail in the frame, which makes it a reasonable stand-in for real footage rather than a synthetic test pattern.

Preset: Video to 4K. The interface describes it as the whole video going through neural rendering plus RTX super resolution at 2×, with H.265 NVENC into MKV and the frame rate untouched. Note the separation: neural rendering re-renders each frame at its own resolution, and the super resolution stage does the enlargement, which is why the output is 2560×1440 and not something invented in between.

## The measured result

1280×720 in, 2560×1440 out, still 12 fps and still 3.0 seconds of playback. The output file is 2.27 MB. Elapsed time for the job: 87.4 seconds.

Divide that by 36 frames and you get 2.43 seconds per frame. That single ratio is the most useful number in this write-up, because it tells you what kind of tool this is: a batch renderer, not something you scrub through. A second run of the same clip took 98.5 seconds, so even the per-frame figure carries a few percent of variance. Do the arithmetic for your own timeline before you queue anything, and expect the answer in minutes, not seconds.

## The encoder caveat

The preset says H.265, NVENC, MKV. The file that actually came out is H.264 MP4.

That is not the preset describing itself wrongly, and it is not a crash. Hardware NVENC on this machine needs driver 610 or newer, and the test machine runs 591.86. Below that version the encoder falls back to software, and the container and codec follow the fallback. So the caveat for anyone reproducing this: check your driver first, and if it is older than 610, expect the software path and the output that comes with it. The preset's stated behavior is the hardware one; what you get is a function of the driver you have.

## The queue is the interface

The video job ran while the still-image jobs sat in the same list. Mid-render the queue read 0 waiting, 1 running, 4 done, 0 failed, with the video item at 7 percent and a cancel control showing roughly 34 seconds left on that item. When it finished, the queue held five entries with their individual elapsed times — 8.0 s for a portrait, 13.4 s and 31.6 s for two document scans, 28.9 s for the night frame, 98.5 s for the video.

Two things follow from that. First, per-item timing is how you plan a batch: the stills are trivial next to the clip, so you queue the clip and let it absorb the machine while the small stuff clears. Second, every item can be rerun or cancelled individually, which matters when a long render is going down the wrong road twenty seconds in.

The comparison itself happens in the app: after the job finishes you play the result in the canvas and drag a wipe line across it, source on one side and the rendered version on the other, timeline running. It is a useful way to judge motion rather than a single frame — and it is playback of a finished file, not a live preview of a render in progress. There is no version of this where you scrub a timeline and watch the render keep up.

## What this sample does and does not prove

It proves one clip's runtime on one machine: 36 frames of 720p to 1440p in 87.4 seconds, with a software encode because of the driver. It does not prove how other footage behaves. This is the only video in the test set, and no second clip was rendered, so treat the per-frame cost and the encoder fallback as one measured data point each. A 24 fps clip with heavy grain is a different job, and nobody has measured it here.

The other limits are structural rather than incidental. Windows 10 (1909+, 64-bit) or Windows 11 and an NVIDIA RTX card — no macOS build, no AMD or Intel path. And there is no public download: the build is handed out on request, with the request form on [https://www.dlss5nvidia.com/download](https://www.dlss5nvidia.com/download). DLSS5 Studio is an independent third-party project and is not affiliated with NVIDIA.

Suggested channel: r/VideoEditing

Images: reddit/06-video-compare.jpg, reddit/06-video.gif, reddit/ui/en-07-video-compare.jpg, reddit/ui/en-08-queue-running.jpg
