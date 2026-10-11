# 主打页方案：DLSS 5 前后效果页 + 下载页（2026-10-11 定稿）

**决策**：王胜 2026-10-11「你们讨论之后定一个方案，按照讨论的方案推行」——即本文件即执行令，不再逐条确认。
**执行**：Codex（改代码、构建、部署、提交索引）；**复核**：agent（站外实测，不看自报）。
**预算**：这是当前第一优先级的页面工作，先于第 2 批其它内页。

---

## 0. 已定的三个选择（不开放讨论，除非你握有反证的事实）

1. **前后效果页放主站** `dlss5nvidia.com`。理由：外部搜索流量在主站（Cloudflare 18 天窗口：1,910 来客、Google 来源 1,030 页面浏览），`.app` 收录还在爬。`.app` **不重复建页**，只在 `/en|zh-CN|zh-TW/studio` 与首页加一条互链指过来。
2. **路由 `/before-after`（en）+ `/zh/before-after`（zh）**。标题不带年份，页面内写「内容复审 2026-10-11」。不用 `/dlss-5-before-after`：太长，且会与 `/what-is-dlss-5` 抢同一批词。
3. **下载页沿用现有 `/download` 加厚**，并补 `/zh/download`（同结构），不另开 `/studio/download`。理由：`/download` 已有排名与流量（18 天约 360 页面浏览，是涨得最快的内页之一，+120），换路由等于丢掉。

---

## 1. 前后效果页（第一版就按这个结构做）

阅读顺序即结构，逐条都要有：

1. **H1 + 首屏一句可被引用的话**，例如：「下面每一组对比都是同一张输入在我们自己的增强管线上的输出，模型、参数与生成日期逐图标注，没有第三方截图。」
2. **三组代表对比先行**：`case-portrait-low`(320×400)↔`case-portrait`(1200×1500)、`case-product-low`(320×213)↔`case-product`(1200×800)、`portrait-source`(600×900)↔`retouch-after`(600×900)。前两组是放大 3.75×，第三组是同尺寸修复（要写清它**不是**放大）。
3. **完整 6–8 组对比（可拖动滑块）**：补 `case-architecture-low`↔`case-architecture`、`cutout-teapot`↔`cutout-teapot-after`、`erase-spoon`↔`erase-spoon-after`、`makeup-ref-source`→`makeup-after`、`tryon-person`+`tryon-garment`→`tryon-after`。
4. **两段视频**（各 6.0 秒：`dlss5-upscale-before-after-demo.mp4`、`dlss5-game-style-transition.mp4`）：`loop muted playsinline preload="metadata"` + 真实 poster；**每段视频下面必须有一句文字版结论**——AI 爬虫不执行 JS、也不下载视频，没有文字这段就白做。
5. **诚实边界段**：什么输入会崩（极低分辨率、画面内文字/小字、多人脸、重压缩噪声）、放大倍数上限、我们不承诺什么。
6. **FAQ 6–8 条**，用真实问句（`dlss 5 before and after`、`does upscaling change faces`、`can I do this without an RTX` 等），答案 2–4 句、可被整段引用。
7. **内链**：`/image-quality-enhancer`、`/image-upscaler`、`/download`、`/guides`；同时让 `/download` 与首页反向链到本页。
8. **结构化数据**：`WebPage` + `ImageObject`（不编 EXIF/拍摄参数）+ `FAQPage` + `VideoObject`（duration 6 秒、真实 poster）+ `BreadcrumbList`。

**每组图片必须标注**：输入尺寸与来源、输出尺寸、所用模型与参数、生成日期、由我们生成。

**红线**（违反即不合格）：
- 不出现「官方 / Official」措辞；不用 NVIDIA 截图冒充我们自己的输出；不写我们没测过的倍数。
- 对比图只能来自我们自己管线的真实输入/输出，标注不全的不上。

**素材坑（已实测）**：`interior-room.jpg` 1100×735 与 `interior-after.jpg` 1100×733 **差 2 像素**，直接叠滑块会错位 —— 这一组先不出，或重出等尺寸版本再上。需要更长（15–30 秒、带参数叠加）的视频，告诉 agent 要哪几组，由 agent 出。

---

## 2. 下载页加厚（`/download`，并新增 `/zh/download`）

现状：正文 **458 词 / 6 图 / 0 视频**（title 现为 `DLSS 5 Download (2026) — Free Online Converter, Mobile & Windows Studio`）。

要加：
- **真实界面录屏**（6–10 秒 GIF 或 mp4，`preload="metadata"`）+ 三张真实界面截图（工作区已有线上截图 `dlss5-download-live-hero.png` / `-shots.png` / `-showcase.png`，以线上实际界面为准）。
- 三步开始（三步以内，每步一句话）。
- 系统要求（真数据，标注来源与日期；我们没测过的不写）。
- 免费额度与价格口径（与 `/pricing` 一字不差）。
- 索取下载的入口（沿用现有 Cloudflare Worker 邮件流程，**不新增后端**）。
- FAQ + CTA 去 `/before-after`。

**红线不变**：软件未上线只能写「正在开发 / 可预约」，不能写「已可下载 / 已支持」；schema 不标 `InStock`。

---

## 3. 内页数量与上量节奏（受 Google 每日编入索引配额限制）

- 现状：主站 sitemap **74 条**、`dlss5.app` **145 条**；GSC 每日「请求编入索引」已撞上限（Codex 2026-10-11 实测，第三个页面触发超限）。
- **规则**：每天请求编入索引的条数 = 实测安全值，在这个上限内排第 2 批；每批上线后看 **7 天**收录再决定下一批；**不一次铺**。
- **第 2 批顺序**：`/games`（追踪 hub）→ 一个 NBA 2K27 页 → RTX 系列页 → 发布日期 → 下载安装 → Unreal。
- 每条新页必须有**独有数据体**（跑 `measure-gpu-page-similarity.mjs`，沿用现有阈值）；做不到独有数据体的页型宁可不做。

---

## 4. 验收（每页，改完由 agent 从站外复测）

页面 200；独立 title / description / canonical（自指）；`index,follow`；已进 sitemap；图片有 alt；全页无「官方」类措辞；SSR 与客户端口径一致；`npm run lint` / `npm test` / `npm run build` 全过；线上浏览器实测：无 console 报错、视频可播（含 poster）、滑块可拖动、两段视频的文字结论都在正文里。

---

## 5. 顺序与回报

1. 先做 `/before-after` + `/zh/before-after`（现成素材够，不阻塞）。
2. 再做 `/download` 加厚 + `/zh/download`，最后两页互链与首页入口。
3. 之后才回到第 2 批内页（按第 3 节的配额节奏）。
4. 每步完成回报：改了哪些文件、提交号、线上 URL、`npm run lint/test/build` 结果；**发现本方案与事实冲突（比如素材不对、配额算错）就先说，不要闷着改**。
