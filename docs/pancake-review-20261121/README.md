# Waffo re-review preparation — 2026-11-21

## Confirmed cause boundary

The SDK forwards prompt, locale and semantic=enforce to /v1/actions/verification/scan-prompt. Live HTTP traces confirm the provider returns allow/allowed/scored with no matched category for both the English generic adult test and its Chinese counterpart. The non-consensual undress control returns block. This rules out a missing client request, wrong response-envelope handling, or semantic=off as the cause of the observed allow. Waffo does not expose its score or threshold in this API: the internal scoring/policy cause remains a question for Waffo, not a fact we can invent.

Primary references, checked 2026-11-21:
- https://docs.waffo.ai/zh/api-reference/endpoints/content-safety/scan-prompt
- https://docs.waffo.ai/zh/mor/account-reviews/aigc-compliance

The latter describes Prompt Sift as primarily addressing child-related risk and says it does not replace merchant protection. The current page also requires output review and per-generation audit records; this change must not be described as a complete implementation of that broader system.

## Scoped protection added

The site's Terms section 4 already prohibits explicit sexual/NSFW requests. Added a narrow local text rule after the Waffo verdict, before allowing any new generation. It covers the reproduced English/Chinese explicit-content requests, plus a few clear sexual-content terms; NFKC and zero-width normalization prevent the tested trivial variants. It is not a universal classifier or image review and is not advertised as one. Ordinary adult portraits and nude-colour makeup remain allowed by the local rule. Existing Waffo review/block/degraded/error behavior remains fail-closed.

Real API + actual gate: ordinary landscape passes; adult English, adult Chinese and undress controls return 422/PROMPT_NOT_APPROVED; no generation API is called by these audit tests. Offline regressions and lint/build pass, 137/137 tests. Diagnostic and gate receipts are separate JSON files here.

## Re-review communication discipline

Report the three items from the returned email as individually verified, not a claim that all AIGC compliance requirements are fulfilled. Quote requestIds and ask Waffo to explain the adult allow verdicts. Never say its raw API blocked those two requests: the added site rule does that. No payment activation or new merchant credentials is part of this change. Re-review submission and sent-email receipts must be recorded only after the UI/provider confirms them.
