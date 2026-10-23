# AGENTS.md — how to work in this repo

Applies to every agent session in `~/code/shou/dlss5main` (Codex included). Read it before the
first edit of a session, and re-read `docs/CORE-POSITIONING.md` before writing any copy, doc,
article or task brief.

## The one rule that overrides drift

**This project's core is DLSS 5 style conversion / neural-render redraw, delivered as DLSS 5
Studio.** Making a blurry image sharp (upscale, unblur, deblur, denoise, compression repair,
old-photo restoration) is an **entry point (附带)**, never the spine.

Wangsheng, 2026-10-23: 「我看你一直在搞什么模糊图像清晰，这个只是附带，核心不是这个呀，这个要写到规矩里面去」.
`docs/CORE-POSITIONING.md` is the single source of truth for the core, the tier table of routes,
and the five rules (R1–R5). If a task brief or an older doc contradicts it, the brief is wrong:
fix the brief, do not negotiate the core.

Concretely, when you write or review anything user-facing:

- Lead with the conversion story (a game frame / character / room / portrait becomes a
  DLSS 5-style visual reference, then the Studio app hands it over). Sharpness is a sub-topic.
- An upscaler/unblur page or article must say it is a limited entry point, must reach the core
  narrative in its opening section, and must not call upscaling the product or claim it *is* DLSS 5.
- Titles, descriptions, H1s and target keywords land on a core or product page. When a piece
  deliberately lands on an entry-point page, record `tier: entry-point` in its head block.
- Before/after assets, case cards, screen recordings and promo material lead with style
  conversion; sharpness comparisons stay on entry-point pages.

## Working rules in this repo

- The content gate at `~/code/shou/artifacts/content-library/check-articles.mjs` is Wangsheng's,
  not a draft-writing helper: a draft is done only when that gate passes with 0 failing. Rule 16
  there enforces the tier above.
- Never invent a URL, a number, a file name or the provenance of an asset. A cited source must
  answer 200 when fetched; a media file named in markdown must exist in the folder.
- Keep the acceptance gates green before pushing: `tenx-20261011/check-flagship-pages.mjs`,
  `tenx-20261011/check-unsourced-claims.mjs`, `additive-20261012/check-protection-list.mjs`.
- A push to `main` deploys the site. Do not push a doc-only change together with unreviewed
  copy, and do not push when a gate is red.
- Write task notes and findings into `docs/` with a date suffix, and start each one by naming
  which of the five rules it serves.
