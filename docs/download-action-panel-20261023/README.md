# Download action panel — 2026-10-23

Serves R1/R3: three visible paths into the existing character-style workflow, our recipe kit and Studio request.

Initial HEAD: b6ab3baba03137c390493a4893b188beca7456a6. Initial workspace was not clean; pre-existing docs and unrelated reports were preserved and excluded from this commit.

Position: after hero.sub, before the existing At a glance grid. First local measurement passed in both languages, so no relocation was necessary.

390×844 viewport, DPR 2, mobile Safari UA, actual system Chrome via Playwright. Same measure.mjs runs against local built output (5173) and production. It retains the supplied script's measurements and adds panel/button/H1/main counts. PNGs are DPR-2 screenshots of this viewport.

Local EN: panel 529–789; browser 557–605, kit 613–661, Studio 669–717. Local ZH: panel 417–677; browser 445–493, kit 501–549, Studio 557–605. All six controls: height 48, bottom below 800; each page has 3 links in fold, no horizontal overflow, one H1 and one main.

Screenshots: /tmp/download-action-panel-20261023/local-en.png, local-zh.png and local-desktop.png. Visual review: no clipping, overlaps or horizontal scrolling; primary browser action distinguished by the requested green fill; desktop has three columns.

Only new panel keys added to STUDIO_COPY. DownloadIntent changes are an analytics import and the one requested onClick. Analytics/auth/retention logic unchanged. Prerender receives the same panel only for the two download routes; no build configuration changes. No existing copy, ordering, SEO fields or other pages changed (132 HTML comparisons recorded in frozen.txt).

Event verification intercepts gtag only in the test browser and prevents navigation/download during the four clicks. It exercises the real onClick handlers and analytics bridge; it does not claim GA4 reporting ingestion. No attribution or route-event logic changed.

Pre-deployment gates use the local static build through local-fetch (production host mapped to 5173, existing Cloudflare home email transform retained); CHANGE-LOG was written first, then capture and comparison. lint/test/build exited 0. Full raw outputs are the adjacent .txt files. Scope: additive action panel and specified click events only.
