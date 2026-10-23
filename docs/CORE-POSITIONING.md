# Core positioning — the one place this is decided

**Status:** binding as of 2026-10-23. Every task doc, content brief, SEO work order,
Codex prompt and gate in this project defers to this file. If a dated doc disagrees,
the dated doc is wrong and gets edited, not this file.

**Why this file exists:** on 2026-10-23 Wangsheng corrected a drift in both directions —
Penguin and Codex had been treating "make a blurry image sharp" as the project's center.
His words: 「我看你一直在搞什么模糊图像清晰，这个只是附带，核心不是这个呀，这个要写到规矩里面去」.
It is now written into the rules, for both agents.

---

## 1. The core

**DLSS 5 风格转换 / 神经渲染重绘 —— 把一张游戏帧或人物图按目标风格重绘成 DLSS 5 风格的视觉参考，
交付物是 Studio 桌面版。**

Two halves, one product:

| Half | What it is | Where it lives |
| --- | --- | --- |
| Capability | style conversion / neural-render redraw of a game frame, character, room or portrait, guided by a prompt or a second reference image | the dashboard editor, `game-character-style`, `interior-design`, `virtual-try-on`, `virtual-makeup`, `portrait-retouch`, `ai-headshot` |
| Product | DLSS 5 Studio, the desktop app the site exists to hand over | `/download`, `/studio-beta`, `/pricing`, `/enterprise` |

### The evidence, so nobody has to re-derive it

- Homepage H1 comes from `src/i18n/locales/en-US.json` → `home.title` = **"DLSS 5 Style Converter Online"**;
  `zh-CN.json` → **"DLSS 5 风格转换器在线版"**.
- `home.subtitle`: "convert **a game frame or character image** into a DLSS 5-inspired visual reference".
- The hero's primary button goes to `/dashboard?tool=game-character-style&sample=characterStyle`;
  the second goes to the same tool with an upload.
- The site's own download page is the Studio desktop app, not an image utility.

## 2. What is explicitly *not* the core

Anything whose promise is "this picture is technically bad, make it technically better":
sharpening, upscaling, unblur, deblur, denoise, compression-artifact repair, old-photo
restoration, background removal, object erase, raster→vector, video download.

These are **entry points (附带入口)** — real pages with real traffic, kept and maintained, but
never the identity of the product and never the spine of the narrative.

| Tier | Routes |
| --- | --- |
| Core | `/`, `/dashboard`, `/game-character-style`, `/interior-design`, `/virtual-try-on`, `/virtual-makeup`, `/portrait-retouch`, `/ai-headshot`, `/before-after`, `/comparisons`, `/what-is-dlss-5`, `/vs/*` |
| Product / handover | `/download`, `/studio-beta`, `/pricing`, `/enterprise` |
| Entry points (附带) | `/image-upscaler`, `/image-quality-enhancer`, `/visual-enhancer`, `/unblur-image`, `/old-photo-restoration`, `/image-to-svg`, `/remove-background`, `/erase-object`, `/use-cases/*`, `/tools/passport-photo` |
| Side lane | `/video-upscaler`, `/video-downloader` (video / real-time), `/dlss-checker`, `/games` (compatibility, not creation) |

## 3. The rules

**R1 — the narrative spine.** Every page, article and post answers "what does DLSS 5 style
conversion do for me" before it answers anything else. An entry-point piece must reach the
core narrative within its opening section, not at the end as an afterthought.

**R2 — entry points are labelled as entry points.** An 附带 page may be about sharpening, but
it must say so as a limited capability ("只看已有图片清晰度的入口"), never present upscaling
as the product's purpose, and never claim the upscaler *is* DLSS 5.

**R3 — titles and landings follow the tier.** Title, description, H1 and `target_keyword` must
land on a core or product page. If a piece legitimately lands on an 附带 page, the head block
says `tier: entry-point` so a reviewer sees it was a decision, not a slip.

**R4 — assets follow the same order.** Case studies, before/after cards, screen recordings and
promo material lead with style conversion. Sharpness comparisons belong on 附带 pages only.

**R5 — violation means unshipped.** A draft whose spine is "模糊变清晰" is not publishable: it
fails the content gate, does not enter the site, and is not posted to any channel until it is
re-anchored to the core. This applies equally to work produced by Penguin and by Codex.

## 4. Enforcement (who checks this)

| Gate | What it enforces | Owner |
| --- | --- | --- |
| `~/code/shou/artifacts/content-library/check-articles.mjs` | rule 16: an entry-point article must carry the core narrative and must not position upscaling as the product | Penguin |
| `tenx-20261011/check-flagship-pages.mjs`, `check-unsourced-claims.mjs` | flagship pages still say what they claim, no unsourced numbers | Penguin |
| `additive-20261012/check-protection-list.mjs` | no frozen page regressed | Penguin |
| this file | the definition everything else is measured against | Wangsheng (he changes it) |

## 5. How to change the core

Only Wangsheng changes this file, and only by saying so in one line (e.g. "核心是 B"). Everything
downstream is then re-derived: home copy, `AGENTS.md`, the content gate's tier table, and the
in-flight drafts. Do not soften, split or re-interpret the core inside a task doc.
