# ROI 前三项落实与验收（2026-10-22）

依据：[ROI复盘](GSC-ROI-ANALYSIS-20261022.md)。王胜本轮明确批准下载页与对比文章摘要修改。代码提交 `2468af1`。

## 范围

- 下载：仅改 en/zh description，说明登录申请、Windows RTX 与安卓浏览器示例的边界；增加免费示例的相关链接，不增加 APK、公开安装包或支持范围承诺。
- 对比文章：仅改 en/zh description，在原文前加任务区分答案；原文、标题、H1、canonical、hreflang均保留。没有新增帧率或硬件支持事实。
- enhancer：修改 en/zh description，明确免费示例无需登录、自己的图片需登录；现有下载页、在线指南与三个工具页的相关模块指向 /visual-enhancer（中文指南与中文下载页指向 /zh/visual-enhancer）。不新增同义页，不改首页。

## 摘要改前改后（静态 HTML）

### `/download`

改前：DLSS 5 download guide: use the free online converter on mobile or desktop, or request the independent Windows RTX Studio build. No official Android APK or standalone installer.

改后：DLSS 5 download: request independent Windows RTX Studio access after signing in, or try a free browser example on Android. No Android APK or public installer.

### `/zh/download`

改前：DLSS 5 下载指南：手机或桌面端可直接使用免费在线转换器，也可申请独立的 Windows RTX Studio。没有官方 Android APK 或独立安装包。

改后：DLSS 5 下载：登录后申请独立 Windows RTX Studio，通过邮件获取访问；安卓用户可先免费运行浏览器示例。本站不提供 Android APK 或公开安装包。

### `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`

改前：DLSS 5 vs DLSS 4 vs FSR 4 in 2026: compare neural rendering, upscaling, frame generation and hardware support using current NVIDIA and AMD sources, with clear caveats instead of a synthetic winner.

改后：DLSS 5 vs DLSS 4 vs FSR 4: compare lighting and materials, upscaling, frame generation and GPU requirements. Source-linked table; no invented FPS winner.

### `/zh/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`

改前：DLSS 5、DLSS 4 与 FSR 4 的 2026 对比：按 NVIDIA 与 AMD 当前资料区分神经渲染、超分、帧生成和硬件支持，避免把不同用途混成一个“画质排名”。

改后：DLSS 5 vs DLSS 4 vs FSR 4：用附来源的对照表区分光照与材质、超分、帧生成和显卡要求。按游戏与硬件核对选择，不虚构帧率或通用画质赢家。

### `/visual-enhancer`

改前：Try a free, no-login DLSS 5-style visual enhancer example online, then improve your own blurry or compressed image in the browser after signing in. Independent and no install.

改后：DLSS 5 visual enhancer: run a free example without login, compare lighting and material changes, then sign in for your own image. Independent; not NVIDIA DLSS.

### `/zh/visual-enhancer`

改前：免费、无需登录试用独立的 DLSS 5 风格视觉增强器示例。先运行缓存案例查看前后结果，再登录后在浏览器中处理自己的模糊或压缩图片。

改后：DLSS 5 视觉增强器：免登录运行免费示例，先对比光照、材质与细节变化，再登录处理自己的图片。独立图像工作流，不是 NVIDIA DLSS 游戏运行时。

## 答案入口与内链

对比文章新增英文开头：

> **DLSS 5 vs DLSS 4 vs FSR 4 — start with the task:** compare neural lighting and materials separately from upscaling and frame generation. Use the source-linked comparison table below to check the game and GPU requirements; browser image enhancement is a separate workflow.

中文：

> **DLSS 5、DLSS 4、FSR 4 怎么选？** 先把光照与材质的神经渲染、超分和帧生成分开比较，再用下方附来源的对照表核对游戏与显卡条件。浏览器图片增强属于另一条工作流，不能用它代替游戏内测试。

- /download、/zh/download：新增“Try the free browser visual enhancer example — no login / 免登录试用浏览器视觉增强示例”。
- 英文与中文在线图片指南：新增“Run the free visual enhancer example — no login / 免登录运行免费视觉增强示例”。
- /image-quality-enhancer、/image-upscaler、/unblur-image：原“Dedicated visual enhancer page”锚文本明确为“Run the free visual enhancer example before uploading / 上传前先免费运行视觉增强示例”；未删除其它相关链接。
- 四份共享内容文件由客户端和预渲染同时使用，没有维护两套摘要。文章的其它语言 fallback 使用更新后的英文事实口径，不另造译文。

## 验收

- `npm run lint`：退出码0。
- `npm test`：`106/106 passed`（当前仓库测试数）。
- `npm run build`：退出码0。
- 两站原有 `check-unsourced-claims.mjs`：0个命中文件，`判定: PASS — 没有无来源的数字/引语/技术名`。
- 本地按构建文件逐页检查：`ROI-LOCAL: routes=13 stableSEO=13/13 relatedLinks=7/7 JSON-LD=PASS homepageHead=UNCHANGED verdict=PASS`。其中 stableSEO 核对 title/H1/canonical/hreflang/robots，首页 en/zh 全部 meta 原样保留。
- 注意：Vite preview 对无尾斜线的目录路径会返回首页兜底，直接用它跑旗舰页脚本拿到的是首页，不能作为目标页失败或通过的证据；本地验收读取 dist 真实目标文件，线上另用真实路由验收。
- 浏览器真实操作（Codex 内置浏览器，未登录）：在 /visual-enhancer 点击 `Run this example · free`，返回 `Visual enhancement comparison` 滑块、`Download the result` 链接 `/api/image-edit/samples?sample=sample1` 和 `served from cache`。这是缓存示例返回成功，不是一次新的模型生成，也不代表所有上传无需登录。

线上验收（代码提交 `2468af1` 的 Vercel 主站部署状态 `success / Deployment has completed`）：

```text
ROI-ONLINE: routes=13 stableSEO=13/13 relatedLinks=7/7 JSON-LD=PASS homepageHead=UNCHANGED verdict=PASS
/download + /zh/download: FLAGSHIP-PAGES: fails=0 verdict=PASS
/visual-enhancer: FLAGSHIP-PAGES: fails=0 verdict=PASS
/zh/visual-enhancer: FLAGSHIP-PAGES: fails=0 verdict=PASS
PROTECTION: changed=0 down=0 verdict=FROZEN-OK
```

13条URL均200；6条新description逐字匹配本地产物；7条相关入口存在于服务端HTML。对比文章新增开头同时存在于中英静态正文。上线后浏览器重新加载并再次运行示例，仍出现对比滑块、下载链接及 `served from cache`。首次并发抓取遇到一次 `IncompleteRead`，重抓完整13页后上述检查通过，未用半截响应下结论。

本次不提交 sitemap、IndexNow 或手动索引请求：没有新增URL，等待Google正常重抓。报告中的“摘要已上线”指本站meta description生效，不代表Google搜索结果已采用它。

## 追踪与限制

推断：上线即日只能证明代码、静态摘要、内链和示例流程生效，不能证明 Google 已更新搜索摘要或 CTR 已增长。Google 可重写摘要；+132/+19/+21是上轮固定展示量下的条件情景，不是承诺，不能加总或换算收入。保留改前原始 HTML 与旧保护基线，记录从部署后第一个完整日开始的28天结果；首页没改，不以本次变更为由重写首页。

证据目录：`/Users/wangsheng/code/shou/artifacts/roi-implementation-20261022/`（before/after HTML、逐页验证JSON、源码diff、运行结果截图）。逐页改动及前后摘要已写入 `additive-20261012/CHANGE-LOG.md`；旧保护名单基线原样存档。
