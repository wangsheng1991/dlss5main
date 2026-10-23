# Asset provenance and inspection replay

License: own. Project authorization: /Users/wangsheng/code/shou/dlss5main/docs/HOMEPAGE-ASSETS-TASK-20261017.md, section 2, line 85; the current task authorizes reuse of site-owned samples. This is permission for this content batch, not a public-domain or third-party redistribution license.

input.jpg is the exact download from https://www.dlss5nvidia.com/examples/generated/game-cyber-1-before.jpg. output.webp is the response from https://www.dlss5nvidia.com/api/image-edit/samples?sample=characterStyle. run.json preserves the successful public sample POST response and cached: true. This is a stored sample retrieval, not a fresh inference. Site src/app/api/image-edit/samples/route.ts identifies the original synthetic character example. No commercial-game screenshot is used.

No third-party vendor sample or media/game official screenshot is included. Captions distinguish historical output, cached retrieval and any unfinished submission.

## Replay actually executed on 2026-10-23

The existing script was copied unchanged from ../2026-10-23-aiarty-review-reproducible-check/assets/reproduce-capture.mjs. audit.html embeds the exact selected images. From this assets directory we executed:

```sh
PLAYWRIGHT_MODULE=/Users/wangsheng/.penguin/data/default_project/agents/default_agent/shared_env/playwright/node_modules/playwright-core/index.mjs \
CHROME_PATH=/Users/wangsheng/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium \
node reproduce-capture.mjs
```

On another machine set these paths to existing Playwright and Chromium installations. The initial local attempt used the CommonJS index.js entry and failed before capture; using the package's index.mjs entry succeeded. capture-run.json is actual successful stdout, not a proposed setting. reproduced-reference.png is the inspection screenshot. reproduced-compressed.jpg is the unchanged script's additional JPEG capture, not evidence of a new model result or a focus of this core article. manifest.json preserves hashes. No video is claimed.

The cover og.png is an unchanged copy of the actual inspection screenshot; it is not a new render.
