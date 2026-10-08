# DLSS5NVIDIA 外部发布素材包与目标平台清单

**版本：** 2026-10-08  
**目的：** 准备可人工发布的外链素材。这里整理的是目标平台、落点、素材和文案，不自动登录、不自动发帖、不批量创建账号。

## 发布原则

外部平台的目标是获得相关读者、真实评论和可追踪的引荐访问；链接只是内容的一部分。每次发布只解决一个明确问题，先给案例、方法和限制，最后再给一个相关入口。

- 同一正文不要在同一天复制到多个社区；换平台至少间隔 48 小时。
- 一个帖子只放一个主要落点，正文通常只放一次链接，版规不允许时只发图片和来源。
- 不写“官方 DLSS 5”“NVIDIA 合作”“最佳”“革命性”“保证收录”或实时速度承诺。
- 官方公开参考图、独立浏览器案例、Studio 本地实测必须分开标注。
- 记录帖子 URL、发布时间、UTM、引荐会话、sample run、注册和评论问题；不以外链数量作为唯一 KPI。

## 目标平台分层

| 优先级 | 平台/社区 | 目标读者 | 首发主题 | 首选落点 | 素材 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| A | Reddit `r/Upscaling` | 图像增强、扫描修复、视频处理用户 | 9 组 Studio 实测和 Difference view | `/marketing/reddit/dlss5-studio-kit.html` | 9 张 JPG 或 15 秒 MP4/GIF | READY，需人工核对版规 |
| A | Reddit `r/SideProject` / `r/IMadeThis` | 独立开发者、工具用户 | 免费浏览器转换/增强流程 | `/comparisons` | 产品图或人物前后图 | READY，需人工核对版规 |
| A | Hacker News | 开发者、图形程序员 | renderer-grounded neural rendering 检查清单 | `/comparisons` | 20 组来源图板 | READY，需人工发布 |
| A | dev.to | Web/AI 开发者 | 如何用来源、结构和失败案例比较图像工具 | `/comparisons` | 16:9 首图 + 2 张裁剪图 | READY，需账号 |
| B | Hashnode | 开发者、技术 SEO 读者 | AI image workflow 的可复现实验方法 | `/comparisons` 或技术博客 | 首图 + 表格 | READY，需账号 |
| B | Substack | 独立开发者、出海创作者 | “DLSS 5 download” 术语澄清和 Studio 实测 | `/download` | 15 秒视频 + 3 张图 | READY，需账号 |
| B | Medium | AI 工具和设计读者 | 失败模式：脸、文字、直线、重复结构 | `/image-quality-enhancer` | 前后图 + Difference view | READY，需账号 |
| B | GitHub README | 开源项目用户 | 相邻视觉工作流和来源图板 | 具体相关案例页 | 一段 Markdown + 一张图 | 可直接改自有仓库 |
| B | Bluesky / X / LinkedIn | 产品、AI、视觉创作者 | 单案例短帖 + 一个检查问题 | 对应案例页 | 竖版 GIF 或短视频 | READY，需人工发布 |
| B | V2EX / linux.do / w2solo | 中文开发者、独立开发者 | 独立工具、真实限制、免费样例 | `/comparisons` | 中文前后图 | 需人工确认版规 |
| C | 知乎 / CSDN / 简书 | 中文搜索用户 | DLSS 5 download 解释、图像工具对比 | `/download` 或 `/comparisons` | 长文首图 + 对比图 | 先做原创改写 |
| C | Qiita / Zenn / note | 日文开发者和创作者 | 图像转换审查方法、独立工具说明 | `/comparisons` | 日文重写版 | 等日文校对后发布 |

## 素材目录

### 转换与游戏人物

- `/examples/generated/game-cyber-1-before.jpg` + `game-cyber-1-after.jpg`：人物风格转换主图。
- `/examples/generated/game-fantasy-1-before.jpg` + `game-fantasy-1-after.jpg`：奇幻方向。
- `/examples/generated/game-anime-4-before.jpg` + `game-anime-4-after.jpg`：动画方向。
- `/game-character-style`：20 组游戏人物前后案例和提示词。
- `/dashboard?tool=game-character-style&sample=characterStyle`：游客可运行的缓存样例。

### 视觉增强与独立案例

- `/public/marketing/reddit/dlss5-portrait-before-after.png`：人像。
- `/public/marketing/reddit/dlss5-architecture-before-after.png`：建筑效果图。
- `/public/marketing/reddit/dlss5-product-before-after.png`：产品摄影。
- `/examples/case-product-low.jpg` + `case-product.jpg`：浏览器增强案例。
- `/public/marketing/reddit/dlss5-reddit-comparisons.html`：20 组来源图和 3 组独立案例。
- `/image-quality-enhancer`：免费视觉增强入口。

### Studio 实测与视频

- `/public/marketing/reddit/dlss5-studio-kit/01-wool-macro-compare.jpg` 至 `09-diff-view-ui.jpg`：9 张上传顺序固定的案例图。
- `/public/marketing/reddit/dlss5-studio-kit/reel-1920x1080-15s-web.mp4`：1280×720、约 15 秒横版 MP4。
- `/public/marketing/reddit/dlss5-studio-kit/vertical-480x854-15s.gif`：480×853 竖版 GIF。
- `/marketing/reddit/dlss5-studio-kit.html`：来源、许可、输入输出尺寸和限制。
- `/download#showcase`：Studio 产品页和请求流程。

## 四组可发布主题

### A. 20 组来源图讨论帖

**适合：** Hacker News、r/GraphicsProgramming、r/gamedev、dev.to。  
**落点：** `https://www.dlss5nvidia.com/comparisons` 或来源图板。

```text
I organized 20 published DLSS 5 reference pairs and three independent browser examples into one review board.

The question is not simply “does it look sharper?” I check structure, identity, texture and workflow separately: faces and hair, thin geometry, repeated windows, materials, text and shadows. Every public reference keeps its source link, and the independent examples are clearly separated from NVIDIA-published material.

Gallery: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html

Which crop or failure case would you add before trusting a visual comparison? This is an independent project and not an NVIDIA endorsement.
```

**配图：** `dlss5-official-contact-sheet.jpg`；评论区只补 1–2 张最有争议的 composite，不一次上传 20 张。

### B. 免费浏览器转换/增强帖

**适合：** r/SideProject、r/IMadeThis、Bluesky、X、LinkedIn。  
**落点：** `https://www.dlss5nvidia.com/comparisons`。

```text
I built a small browser workflow for a practical question: can a visual conversion or enhancement keep the source structure visible?

The free example runs before sign-in. Compare the base frame and result, then check faces, hands, text, logos, straight edges and repeated patterns. The page also separates public NVIDIA reference pairs from independent examples, so the source and the generated result are not mixed together.

Try the cached example and the review checklist: https://www.dlss5nvidia.com/comparisons

What is the hardest detail for your workflow: faces, small text, architecture lines or product labels?
```

**配图：** 人物前后图或产品前后图；短帖只用一张主图。

### C. Studio 本地实测帖

**适合：** r/Upscaling、r/VideoEditing、Substack、Medium。  
**落点：** `https://www.dlss5nvidia.com/marketing/reddit/dlss5-studio-kit.html`。

```text
I ran a small local Windows workflow across photos, scans and a short video clip. The point was to inspect the changed pixels, not to promise real-time enhancement.

One recorded video run processed 36 frames from a 3-second 720p public-domain clip in 87.4 seconds on an RTX 4090 reference machine — about 2.43 seconds per frame. That is a batch-workflow observation, not a universal speed claim.

The kit keeps the source, output size, captions and Difference view together: https://www.dlss5nvidia.com/marketing/reddit/dlss5-studio-kit.html

Which difficult case should be added next: handwriting, faces, foliage, thin geometry or small UI text?
```

**配图：** `08-video-frame-compare.jpg` 或 `09-diff-view-ui.jpg`；不要在标题写“real-time”。

### D. 中文独立工具帖

**适合：** V2EX、linux.do、w2solo、知乎。  
**落点：** `https://www.dlss5nvidia.com/comparisons`。

```text
我整理了一页可复核的 AI 图像工具对比，不把“看起来更锐”直接当成结论。

页面里有 20 组带来源的公开 DLSS 5 参考图、独立浏览器案例，以及四项检查：结构是否稳定、脸和身份是否改变、纹理是否出现伪造、流程是否真的能运行。人物风格转换和视觉增强都有免登录缓存示例，可以先看前后效果再决定是否上传自己的图片。

对比页：https://www.dlss5nvidia.com/comparisons

你在实际项目里最怕哪类错误：脸、文字、建筑直线，还是商品标签？
```

**配图：** 建筑或产品前后对比，正文只放一个链接；中文平台发布前按各自版规重写标题和首段。

## 平台专用说明

### Hacker News

只使用技术问题和可复核方法的版本。标题建议：

```text
A visual checklist for renderer-grounded neural rendering
```

首段直接说明 20 组来源图、四项检查和独立案例；不要写“免费”“注册”“积分”作为标题卖点。评论里再回答数据来源和限制。

### dev.to / Hashnode

发布原创长文，不直接复制 Reddit 正文。建议结构：

1. 一个具体失败问题：为什么“更锐”不等于“更真实”。
2. 固定输入、目标方向和四项检查。
3. 20 组来源图和 3 组独立案例。
4. 一个本地 Studio 实测快照，注明机器、输入和输出。
5. 最后给 `/comparisons` 一个上下文链接。

如果平台支持 canonical/import，转载版本指回自己的原文；不要让多个平台出现完全相同的全文。

### GitHub

仅在图像、渲染、设计或开发工作流相关仓库添加一个入口，使用自然锚文本：

```md
### Related visual workflow

See the [source-led AI image comparison guide](https://www.dlss5nvidia.com/comparisons) for runnable samples, public references and a repeatable review checklist.
```

不要把同一个 exact-match 锚文本批量写进无关仓库。

### Bluesky / X / LinkedIn

优先发一张图或一段 9:16 GIF，文案只回答一个问题，链接放最后。建议首帖后观察评论，再补第二张裁剪图，不要连续发四个落点。

## UTM 规范

- Reddit：`utm_source=reddit&utm_medium=community&utm_campaign=external_links_20261008`
- Hacker News：`utm_source=hackernews&utm_medium=discussion&utm_campaign=external_links_20261008`
- dev.to：`utm_source=devto&utm_medium=article&utm_campaign=external_links_20261008`
- Substack：`utm_source=substack&utm_medium=article&utm_campaign=external_links_20261008`
- Bluesky：`utm_source=bluesky&utm_medium=social&utm_campaign=external_links_20261008`
- 中文社区：`utm_source=cn_community&utm_medium=community&utm_campaign=external_links_20261008`

同一渠道的案例可以在 `utm_content` 中写 `portrait`、`architecture`、`product` 或 `character`，不用创建新的 campaign 名称。

## 14 天人工执行表

| 日程 | 平台 | 主题 | 素材 | 链接 | 状态 |
| --- | --- | --- | --- | --- | --- |
| Day 1 | r/Upscaling | Studio Difference view | 9 张或 15 秒视频 | Studio kit | 等版规确认 |
| Day 3 | r/SideProject | 免费浏览器转换 | 人物前后图 | comparisons | 等版规确认 |
| Day 5 | Hacker News | 技术审查清单 | 20 组 contact sheet | comparisons | 等账号与标题确认 |
| Day 7 | dev.to | 原创方法文 | 首图 + 2 裁剪图 | comparisons | 文章已可写 |
| Day 9 | Bluesky/X | 单案例短帖 | 竖版 GIF | 对应案例页 | 等账号发布 |
| Day 11 | Substack | download 术语澄清 | 15 秒 MP4 + 3 张图 | download | 等账号发布 |
| Day 14 | 中文社区 | 中文案例讨论 | 建筑/产品对比图 | comparisons | 等版规确认 |

## 本人需要完成的步骤

- [ ] 登录目标平台，逐个确认当前版规、自荐和外链限制。
- [ ] 选择第一篇要发的主题；建议先从 `r/Upscaling` 或 `r/SideProject` 二选一。
- [ ] 发帖前确认图片来源、许可说明和“独立项目/非 NVIDIA 官方”文案保留。
- [ ] 发布后把帖子 URL、时间、UTM 和评论问题回填到本表。
- [ ] 暂不做多账号、付费推广、自动评论或批量同步。
