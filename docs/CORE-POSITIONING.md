# Core positioning — the one place this is decided

**Status:** binding as of 2026-10-23. Every task doc, content brief, SEO work order,
Codex prompt and gate in this project defers to this file. If a dated doc disagrees,
the dated doc is wrong and gets edited, not this file. **The core itself was confirmed
by Wangsheng on 2026-10-23: A and B both count ("a 和 b 都可以").**

**Why this file exists:** on 2026-10-23 Wangsheng corrected a drift in both directions —
Penguin and Codex had been treating "make a blurry image sharp" as the project's center.
His words: 「我看你一直在搞什么模糊图像清晰，这个只是附带，核心不是这个呀，这个要写到规矩里面去」.
It is now written into the rules, for both agents.

---

## 1. The core

**核心 = A + B，两条都算主线：A 是能力线（DLSS 5 风格转换 / 神经渲染重绘 —— 把一张游戏帧、人物、
房间或人像按目标风格重绘成 DLSS 5 风格的视觉参考），B 是交付线（Studio 桌面版这个产品的实际能力、
工作流与交付方式）。** 王胜 2026-10-23 先回「a」，随后明确「a 和 b 都可以」—— 所以讲 A 或讲 B 都是
在讲主线，两者都不许被"修糊"顶掉。

| | | 结论 |
| --- | --- | --- |
| A | 风格转换 / 神经渲染重绘（能力） | **主线（已确认）** |
| B | Studio 桌面版（交付、工作流、能力边界） | **主线（已确认）**：A 的落地方式，可以单独成篇 |
| C | 视频 / 实时线 | 支线，跟着 A 走 |
| D | 以上都不是 | 已排除 |

| | What it is | Where it lives |
| --- | --- | --- |
| Core, line A | style conversion / neural-render redraw of a game frame, character, room or portrait, guided by a prompt or a second reference image | the dashboard editor, `game-character-style`, `interior-design`, `virtual-try-on`, `virtual-makeup`, `portrait-retouch`, `ai-headshot` |
| Core, line B | DLSS 5 Studio as the product: what the desktop app does, how a job moves through it, where its limits are | `/download`, `/studio-beta`, `/pricing`, `/enterprise` |

### 1.1 叙事锚点：DLSS 5 这项技术，落在游戏人物上

王胜 2026-10-23 追问「核心的主题应该是跟 DLSS5 这个技术相关的游戏人物关系比较大，你的相关主题应该都是围绕着」——这
是提醒我们把锚点收窄：**主线的默认叙事对象是"DLSS 5 这项技术"与"游戏人物/游戏画面"**，这是搜索意图最集中、也是
我们素材最扎实的地方。

- 游戏人物、游戏帧、角色一致性、风格转换在游戏画面上的表现 → **主线默认对象**。
- 室内、人像、商品、证件照等同能力场景 → **能力延伸**，可以做、可以排名，但不是默认选题方向；写它们必须在 head
  block 声明 `anchor: dlss5-extended`，并在正文链回游戏人物主线。
- 放大/修糊/去压缩 → 仍是**入口线**（见第 2 节），与"延伸场景"不是一回事。

判断一个选题值不值得做，先问一句：它离"DLSS 5 + 游戏人物"有多远？远的先不做。

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

**R1 — the narrative spine.** Every page, article and post answers the core question first —
either "what does DLSS 5 style conversion do for me" (line A) or "what does DLSS 5 Studio actually
do, and how does a job move through it" (line B). An entry-point piece must reach one of those two
lines within its opening section, not at the end as an afterthought.

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

The two dated gate folders are **not** in this repository — they live in the agent's session
workspace: `~/.penguin/data/default_project/agents/default_agent/workspaces/<tmp>/tenx-20261011/`
and `.../additive-20261012/`. Run them from there, and only for a change that touches the site.

## 5. How to change the core

Only Wangsheng changes this file, and only by saying so in one line (e.g. "核心是 B"). Everything
downstream is then re-derived: home copy, `AGENTS.md`, the content gate's tier table, and the
in-flight drafts. Do not soften, split or re-interpret the core inside a task doc.
