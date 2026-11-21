# APK title / description update — 2026-11-21

Serves CORE-POSITIONING R1/R3: the phone entry describes the actual character-style workflow, not an Android game runtime.

Authorized scope: /dlss-5-apk and /zh/dlss-5-apk title/description only. before-after.json contains exact old/new strings and artifact comparisons. No source changes to /download, no sitemap or GSC submissions.

The former description also rendered as visible introduction. An optional intro field now retains those exact original sentences; React and prerender use intro ?? description for visible copy. The head and existing WebPage/Article description fields use the new description. Open Graph/Twitter metadata follow the existing shared head generator. No new support, access or download promise.

Validation: npm run lint passed; npm test 125/125 passed; npm run build passed. APK-HEAD: PASS — 4/4 bodies unchanged; download en/zh title/all meta unchanged; canonical/hreflang/robots unchanged. Bundle/chunk filenames change during the build and are not SEO copy.

The historical protection gate, run before deployment, reports changed=2 down=0 REVIEW (/download and the comparison article versus its November 20 baseline). Those differences already exist in the deployed parent, not this patch. We did not overwrite its baseline. Exact parent/current build comparison confirms no download body or metadata changes in this patch.

An initial local flagship invocation against Vite preview returned its root fallback HTML; its failures were not a deployed APK-page result. Static route artifacts were compared directly instead, and production flagship checks must pass after deployment. Search snippet changes depend on Google's subsequent processing; publishing metadata does not establish a CTR or ranking gain.
