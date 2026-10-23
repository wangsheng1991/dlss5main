# Real browser recordings

R1/R4/R5: style conversion and honest inspection of existing examples.

Origin: site-recording
Recorded: 2026-10-23

Original-speed Chrome/Playwright CDP recordings. No narration, compositing or acceleration. Chrome timestamps determine elapsed time. The character recording is explicitly trimmed with ffmpeg -t 19 to remove its frozen tail; the old 31.96-second public asset and metadata are removed. Room and review recordings stop after the actual interactions. First-frame thumbnails are decoded from each final MP4.

These are stored historical examples, not new model inference. Room geometry may change; zooming does not prove text or edge fidelity. The room recording views the existing source/reference/result cards in the anonymous dashboard, then drags the historical reference/result comparison. The review recording uses actual browser viewport zoom and slider dragging on /before-after#game-cyber-1.

Run `python3 scripts/check-video-held-tail.py public/videos/*.mp4` before publishing each recording. It samples once per second and tolerates tiny codec noise when detecting held frames. The old asset fails with 12.96 seconds held; no replacement exceeds two seconds.


## game-character-style-example

Page: https://www.dlss5nvidia.com/game-character-style
Duration: 19 seconds (ffprobe)
File: game-character-style-example-19s-1280x900-475f.mp4
Dimensions: 1280 × 900
Frames: 475
Size: 862180 bytes
Held tail: 2.0 seconds; limit 3.8 seconds; PASS
Thumbnail: game-character-style-example-19s-1280x900-475f-first-frame.jpg
Probe and action log: matching -ffprobe.json and -recording.json files.


## interior-reference-example

Page: https://www.dlss5nvidia.com/dashboard?tool=interior → https://www.dlss5nvidia.com/before-after#interior-style
Duration: 18.32 seconds (ffprobe)
File: interior-reference-example-18.32s-1440x1000-458f.mp4
Dimensions: 1440 × 1000
Frames: 458
Size: 1868598 bytes
Held tail: 0.32 seconds; limit 3.664 seconds; PASS
Thumbnail: interior-reference-example-18.32s-1440x1000-458f-first-frame.jpg
Probe and action log: matching -ffprobe.json and -recording.json files.


## redraw-review-example

Page: https://www.dlss5nvidia.com/before-after#game-cyber-1
Duration: 20.12 seconds (ffprobe)
File: redraw-review-example-20.12s-1440x1000-503f.mp4
Dimensions: 1440 × 1000
Frames: 503
Size: 1189784 bytes
Held tail: 0.12 seconds; limit 4.024 seconds; PASS
Thumbnail: redraw-review-example-20.12s-1440x1000-503f-first-frame.jpg
Probe and action log: matching -ffprobe.json and -recording.json files.
