# Asset provenance and reproduction

Source input: https://www.dlss5nvidia.com/examples/sample2.jpg
Source cached output: https://www.dlss5nvidia.com/api/image-edit/samples?sample=sample2
Retrieved: 2026-10-23
License: own; project-designated site samples, authorized by the content task. No general third-party reuse license is asserted.
Permission evidence: docs/HOMEPAGE-ASSETS-TASK-20261017.md line 85 in dlss5main designates public/examples as own.

The input is an interior render, not a camera original. The output is a cached style redraw, not historical ground truth. run.json records cached: true. Our local audit.html embeds both files and was rendered in Chromium; these are actual captures of that local page, not screenshots of a vendor application or of a game.

comparison.png: complete actual browser inspection capture.
detail.png: second browser capture with center crops; same trial, not a new run.

input.jpg and result.webp are the exact retrieved pair. manifest.json preserves checksums. audit.html is the actual page used for the initial capture. The closer view uses object-fit: cover and center placement; the full view uses contain. Neither view is a new inference trial.

No media press image, official game screenshot, third-party portrait, music or video is included. No asset was published. The public URL in social.md points to an existing site-owned sample, not a newly deployed article cover.

Capture replay: run reproduce-capture.mjs from this assets directory. It requires playwright-core and a Chromium executable; set PLAYWRIGHT_MODULE to the module path and CHROME_PATH to the executable. It writes new reproduced files instead of overwriting evidence. Encoder/browser versions may change bytes.
