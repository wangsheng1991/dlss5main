# Pancake remediation — 2026-11-21

Serves CORE-POSITIONING R1/R3: preserve character-style/Studio workflows and legitimate local-file video review while retiring the platform-link fetching side lane.

## Before / after

| Area | Before | After |
|---|---|---|
| Video handoff | Functional browser tools existed but the public site still promoted platform video fetching | Added a bilingual local-file entry on /video-studio and /zh/video-studio: frame extraction, contact sheets and metadata; existing tool content retained |
| Platform fetching | Public landing page, sitemap/navigation/footer/home list, dashboard aliases and task creation | Public page returns real HTTP 410 + noindex, source landing/case promotions removed, sitemap entry removed; legacy dashboard alias shows retirement notice; new tasks rejected with 410 before auth/database/credits/provider; task builder also refuses fetch |
| Broad provider proxies | Unused public /api/gpu/* and /api/oss/* rewrites forwarded arbitrary provider paths | These public passthroughs return 410 instead of bypassing site task validation. The website's actual server-side provider clients are retained; no frontend/API source referenced those proxy paths |
| /docs | External gateway address, external project key onboarding and $0.01/call instructions | Same route/title and all nine model facts, parameters, limits, cases and recorded request/result data retained. Website account/credit workflow replaces external signup/billing; reference JSON explicitly not a standalone public API; no fake same-domain /v1 endpoint |
| Prompt gate | SDK call already present; production credentials were initially unverified | Explicit semantic=enforce; allow-only policy and fail-closed behavior tested. **Live SDK scan: benign allow / undress-transform block; real site gate: benign passes / restricted 422** |

The deleted downloader case and external onboarding text are intentionally removed as required by the review. Other model facts, recorded examples and product capabilities are not replaced or invented. Existing completed-job history is not deleted. Uploading your own videos to browser tools does not trigger AI generation or platform downloading; no whole-clip transcoding/AI enhancement claim is introduced.

## Actual runnable-video evidence

- Before retirement: production /video-studio/frame-extractor opened its licensed street sample, decoded 960×540 / 19.8 seconds and actually exported PNG.
- Local candidate: selected public/examples/video-highlights/street-source.mp4 through the file picker; media source was a local blob, 960×540 / 19.8 seconds, no error, exported video-frame PNG.
- Local candidate: selected the same local file in contact-sheet, built the sheet, exported a real 960×615 PNG.
- These are real browser operations, not a mock result or a promise of video generation. Model-powered video features keep their previous beta scope.

## Prompt-audit evidence and open requirement

Production environment listing confirms WAFFO_MERCHANT_ID and WAFFO_PRIVATE_KEY were already configured (created two days earlier). The earlier `vercel env run` probe did not receive these values: its local BLOCKED_MISSING_CREDENTIALS result was **not evidence that production lacked them**. No environment variable was overwritten; an add attempt was refused because the variable already existed. No key was created, rotated or deleted.

The owner directed us to Codex history. That history identified a saved mode-0600 credential file outside the repository; the merchant matches the currently logged-in Pancake account. The existing values were loaded only into child-process memory, never printed or copied into a report or repository.

Live scan (semantic=enforce): a benign watercolor request returned allow/allowed/scored, requestId 911b1ca75e654ad1bb895b2b24faed4b; a real-person undress-transform request returned block/restricted_content/skipped_rules_block, requestId 3bbde3091fe546748223c8a99ec85f41. The actual screenGenerationText implementation also passed the benign request (2395 ms) and rejected the restricted one with 422/PROMPT_NOT_APPROVED (1463 ms). No model-generation API was called by these audit tests.

Important boundary: the first, generic adult-content test sentence returned allow, as did its benign control. That receipt is retained in the external evidence directory. A successful block test is not a claim that the provider blocks every unsafe prompt; this gate acts on Waffo's actual verdict, fails closed on error/degraded responses, and is not an image-safety scan. The preset-only, no-text path retains its existing behavior.

Offline regression tests additionally cover allow/review/block/degraded/invalid/network failures and missing credentials, using a transient signing fixture and mocked transport. These are separate from the live receipts. New-task handling calls the gate before database/idempotency/credits and provider submission; sample warming calls it before provider upload/submission. Cached sample delivery is not a new generation and is not claimed as a live scan.

No business-review resubmission was performed. Live deployed UI and HTTP acceptance receipts follow in the external evidence directory.

## Validation

npm run lint PASS; npm test 135/135 PASS; npm run build PASS. Both repositories' unsourced-claims gate reports 0 matching files. PANCAKE-SSR check: nine model records retained; no external signup/per-call billing in docs/public JSON/llms; retired landing and links absent; local-file handoff present in bilingual static HTML. Live evidence will be stored in /Users/wangsheng/code/shou/artifacts/pancake-remediation-20261121/.

No GSC requests, paid service activation, payment settings changes or business-review submission. No new video or image assets generated for this task.

## Deployment acceptance correction

The first deployment exposed a native-ESM resolution error in the new shared retirement import: the API task function returned 500 even though the frontend build and tsx tests passed. Changed that shared import to an explicit .js suffix, consistent with existing server-consumed config imports. Native Node import of emitted tools/mediaRetirement now passes and rejects fetch with 410. lint, 135 tests and the full build were rerun successfully; production must be checked again after the corrective deployment.
