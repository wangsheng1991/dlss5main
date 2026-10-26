# Download APK 与 enhancer 短答案 — 2026-10-26

服务 CORE-POSITIONING R1/R2/R3：维持独立 Studio 与游戏人物风格转换定位；图片增强作为有限入口，不冒充 NVIDIA 游戏运行时。

## 状态：本地完成，保护闸门冲突阻止部署

已先读 COMPETITOR-KEYWORD-ROI-20261026.md 和 PAGE-KEYWORD-ROI-20261026.md。按 A→B 顺序加内容。保护脚本实际不区分“旧文修改”和“获准新增”：`words` 对整页计数，`bodyHash` 对去标签文本前 90% 哈希。给首屏后加正文必然改变这两项。指定 2026-10-25 基线未改，脚本未改；真实结果为 changed=1/down=0/REVIEW。已通过会话提问请求明确本次是否允许登记后重拍基线，尚未收到答复。不能用线上旧页面的绿灯冒充本地候选通过，也不能悄悄改基线。

未 commit、push、部署、提交 IndexNow。未触碰 GSC、未提交或修改 sitemap。线上四条 URL 200 是部署前现状，不是新正文已上线的证据；具体 title 原文与 newBlockPresent=false 见 online-before.json。

## 改动文件

- src/components/DownloadApkAnswer.tsx：在既有 hero 后、DownloadIntent 前加显式答案。保留首屏面板、全部旧段落与顺序。
- src/pages/Download.tsx：仅导入与插入上述组件。
- src/content/enhancerShortAnswers.ts：五条中英短答案，来源边界见下。
- src/components/EnhancerShortAnswers.tsx：静态短答案块。
- src/pages/VisualEnhancer.tsx：插入短答案块；不动交互滑块与素材卡片。
- src/components/SearchEvidence.tsx、LocalizedEvidence.tsx：仅将新短答案纳入本页已有单一 FAQPage，不新建 schema 体系。
- scripts/prerender-seo.ts：用同一组件输出四页的新块。
- 本目录验收证据；外部 additive-20261012/CHANGE-LOG.md 追加“本地待验收”条目（未重拍基线）。

## 文案依据与有意收窄

A：按用户提供的 APK 事实，将否定限定为 DLSS 5 Android APK／独立运行时安装包，避免误写成 NVIDIA 不发行任何 Android 应用，或本站不交付自己的 Windows Studio。来源链接为 https://developer.nvidia.com/rtx/dlss 。手机指向现有免费示例，Windows 指向原申请流程。下载页既有第三方风险句逐字复用；DLL 稳定性、崩溃、更新覆盖等措辞直接复用已上线 dlss5Dll.ts 的 assertions[2]，未重写。中文 /zh/dlss-checker 不存在，因此使用真实 /dlss-checker 并注明英文，不造死链。

B：JPEG/PNG/WebP 与 10 MiB 来源 OwnImageEnhancer.tsx、config/tools.ts、api/image-edit/upload.ts；最长边 1536 和目标因子 2/4 来源 config/enhance.ts；免费仅为缓存示例，自有图片须登录和额度。耗时 15.869–16.357 秒来源既有 SearchEvidence.tsx 和 public/evidence/enhancer-runs-20261023.json，保留“三次、2026-10-23、模拟登录与额度、真实处理、小样本非保证”的限定。没有新跑任务、没有新造性能数字。

隐私：useGeneration.ts 的签名 PUT 与 upload.ts 证实上传到处理服务；留存与删除时间未经验证，因此明确不作期限、立即删除或仅本机处理的承诺。无需外推隐私政策。

## 验证口径

HEAD ae7e8d8 在无 tracked diff 时先完整构建并保存 head-snapshot.json。比较各页 main 原文的 SHA-256，只有四条目标路由改变，另外 134 个 main 不变。这里不是声称完整 dist HTML 字节不变：新增代码会改变共享 JS chunk 哈希及其引用。

四页静态 title/H1/canonical/hreflang/robots 与 HEAD 完全一致；去掉新增块及 schema script 后，旧 main 文本完全一致。JS 测试按 URL 设 en-US/zh-CN 浏览器 locale；下载页既有 JS H1 的 request 大小写／中文破折号与静态 H1 不一致，验证时分别对 HEAD 的原始 STUDIO_COPY 与原始静态值，未顺手修此历史差异。客户端保留既有交互表单，所以不要求整页 JS 文本等于静态文本；新增块与 FAQ 内容单独核对。

检查脚本：check.mjs。所有 API POST 被阻断，未产生生成／提交副作用。保护验证指向本地 clean-URL server，沿用此前只处理部署固定 301 与 Cloudflare 首页邮箱转换的 adapter；没有过滤新增文字。

## 实测结果与字数

英文按空白分词，中文按汉字数计；含块标题、问句和链接文案。

| 页面 | JS | HTTP | H1/main | 新增块字数 | 每条答案英文词数 |
|---|---|---|---|---|---|
| /download | False | 200 | 1/1 | 160 | [] |
| /zh/download | False | 200 | 1/1 | 232 | [] |
| /visual-enhancer | False | 200 | 1/1 | 232 | [36, 44, 52, 40, 30] |
| /zh/visual-enhancer | False | 200 | 1/1 | 346 | [8, 4, 10, 1, 6] |
| /download | True | 200 | 1/1 | 160 | [] |
| /zh/download | True | 200 | 1/1 | 232 | [] |
| /visual-enhancer | True | 200 | 1/1 | 232 | [36, 44, 52, 40, 30] |
| /zh/visual-enhancer | True | 200 | 1/1 | 346 | [8, 4, 10, 1, 6] |

### lint 原始输出尾部

```text

> react-example@0.0.0 lint
> tsc --noEmit

```

### test 原始输出尾部

```text
✓ feature picker: both editions keep a source-linked static table without interactive controls

113/113 passed
```

### build 原始输出尾部

```text
dist/assets/Blog-_aKNuauc.js                470.47 kB │ gzip: 156.15 kB
✓ built in 7.54s
Exported /api-catalog.json and 9 per-model files (flux-klein, pixrestore-s, cutout-fast, erase-quality, vectorize-fast, tryon-quality, interior-quality, retouch-quality, makeup-quality).
Pre-rendered 25 articles in 3 locales plus 6 podcast routes, 14 SEO tools, 3 workflow guides and 3 micro tool routes, blog indexes and dashboard noindex.
ARTICLE-MARKDOWN: PASS — 32 pages, 16 assetBase articles, no raw table separators or image Markdown
```

### flagship 原始输出尾部

```text
   OK   已在 sitemap 中

FLAGSHIP-PAGES: fails=0 verdict=PASS
```

### unsourced 原始输出尾部

```text

== /Users/wangsheng/code/shou/dlss5app —— 0 个文件命中（共扫 37 个文件）

== /Users/wangsheng/code/shou/dlss5main —— 0 个文件命中（共扫 357 个文件）

判定: PASS — 没有无来源的数字/引语/技术名
```

### protection 原始输出尾部

```text
== 与基线比对：protection-baseline-2026-10-25.json
   CHANGED /download → words, bodyHash
      words: 基线「2219」 → 现在「2388」
      bodyHash: 基线「"c8b7bd996e79e93f"」 → 现在「"91811d456e41d27b"」
   OK(301) /en/blog/dlss-5-online-image-upscaler-guide → /blog/dlss-5-online-image-upscaler-guide
   OK(301) /en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026 → /blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026

PROTECTION: changed=1 down=0 verdict=REVIEW
```

```text
MAIN-SHA256 {"changed":["/download","/visual-enhancer","/zh/download","/zh/visual-enhancer"],"unchanged":134}
```
