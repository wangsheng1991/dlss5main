# 两条线的分工、进度与开放问题 — 2026-09-25

这份文档是给 Codex 的交接件。写它的原因是：今晚 `docs/` 这条路已经验证是通的 —— 19:45 我在这里放了
`SEO_IMAGE_CONVERT_COMPETITORS_2026-09-25.md`，19:53 它就被收走并执行了。所以进度、证据、待办都写在这里，
不再另开通道。

## 0. 当前状态（都是实测，不是计划）

| 项 | 值 |
|---|---|
| `main` / `origin/main` | `e391369`，一致，工作区干净，本地没有独有提交 |
| 线上 | 首页与所有工具页 200；sitemap 59 条 |
| 本地分支 | 多出一支 `backup/local-parallel-20260925`（今晚 19:45 之前那批提交的备份，确认过没有独有内容，可删） |

## 1. git push 的正确姿势（先看这条，能省一晚上的功夫）

`git config` 里 `http.proxy` / `https.proxy` 被设成了 `socks5h://127.0.0.1:1234`，那个代理当前是坏的，
于是 `git push` / `git fetch` 一律 `Recv failure: Connection reset by peer`；直连 GitHub 是通的。绕过它：

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
  git -c http.proxy= -c https.proxy= push origin main
```

**不要再用 GitHub API 手工造提交推代码**。那样造出来的提交内容相同而 SHA 不同，本地和远端会分叉 —— 今晚
`7c07feb` 就是这么来的，处理这个分叉花掉的功夫比写代码还多，而且分叉期间任何一次本地提交都会变成孤儿。
如果哪次 `git push` 又失败，先把报错贴出来，多半还是代理。

## 2. 分工

| 谁 | 管什么 | 边界 |
|---|---|---|
| 我（PenguinHarness） | Google SERP 实测、竞品指纹、**独立复核**（只读线上与构建产物）、给到带数字的证据 | 不改仓库里的内容页 |
| Codex | 仓库内实现、构建、Vercel 发布、Search Console | 不用再管 SERP 取数 |

交接用 `docs/`。要我量什么，写在这份文档里或告诉我查询词就行。

## 3. 今晚已经验证落地的（我复核过线上）

你做的：首页静态 JSON-LD、`og:image`、FAQ 换英文、工具页 `BreadcrumbList`、`/game-character-style`（1009 词）、
`/video-upscaler`（418 词、`VideoObject`）、sitemap 57 → 59、`7c07feb` 的 studio 案例集。
这些我都在线上确认过，没问题。

## 4. `c583eea`：首页结构化数据漏到了每一个预渲染页面（已修，已推）

### 现象

`withHead` 会摘掉 shell 里那些"与路由无关"的标签（robots、canonical、og、twitter），但**没有摘 JSON-LD**。
所以 50 多个预渲染页面在自己的 schema 之外，还各自声称了一遍首页：首页的 `WebApplication`、两个 `VideoObject`、
以及首页那个两条问答的 `FAQPage`。

改动前，`/image-upscaler` 的静态 HTML：

```
[0] graph(3194B): Organization@/; WebApplication@/; VideoObject@-; VideoObject@-; FAQPage@-   ← 首页的
[1] graph(2507B): WebApplication@/image-upscaler; HowTo@-; FAQPage@-; BreadcrumbList@-       ← 自己的
```

`/tools/passport-photo`、`/game-character-style`、`/use-cases/*` 全都一样。

### 修法

`scripts/prerender-seo.ts` 里，`withHead` 的剥离链加上 shell 的 `<script type="application/ld+json">`，
同时把 shell 图里**唯一对每个 URL 都成立的那个节点**（`Organization`）读出来写进每个路由的 head。读而不是抄，
这样两边不会各自漂移。

### 改完的实测（`npm run build` 后逐页扫 `dist/**/index.html`）

| 路由 | canonical | JSON-LD `@type` |
|---|---|---|
| `/` | 1 | Organization, WebApplication, VideoObject ×2, FAQPage（不变） |
| `/image-upscaler` | 1 | Organization; WebApplication, HowTo, FAQPage, BreadcrumbList |
| `/video-upscaler` | 1 | Organization; WebPage, VideoObject ×2, FAQPage, BreadcrumbList |
| `/game-character-style` | 1 | Organization; CollectionPage, BreadcrumbList |
| `/tools/passport-photo` | 1 | Organization; WebApplication, HowTo, BreadcrumbList |
| `/pricing`、`/about`、`/docs` … | 1 | Organization |

`npm run lint` 干净，`npm test` 60/60。

**一个要你确认的取舍**：`/pricing`、`/about` 这类 `renderPublicGuide` 路由此前只有首页那张图（错的），现在只有
`Organization`（没有 `WebApplication`）。如果想让全站都带一个站点级 `WebApplication`，就在 `pageHead` 里把
shell 图里的 `WebApplication` 也一起带上 —— 我没有擅自加，因为那是个产品决定。

## 5. 还开着的问题（按优先级，都带证据）

### P0-1 工具页正文太薄

量的是静态 HTML（`curl` 后剥标签）：

| 我们的页 | 词数 | 对手同口径 |
|---|---|---|
| `/image-upscaler` | 953 | 1,000–3,300 |
| `/tools/passport-photo` | 900（目标值） | — |
| `/video-upscaler` | 916 | — |
| `/image-quality-enhancer` | 956 | — |

目标 900–1,200 词/页。对手的构成：定义段 + 步骤 + 参数与限制的表格 + 适用/不适用 + 成本对比 + FAQ。
xconvert 单页 1,840 词；patsnap eureka 的 AI 报告页 3,248 词。

### P0-2 静态 HTML 里 H3 = 0（已修复）

旧测量为抓不到 JS 的抓取器看到 `/image-upscaler` 0 个、首页 0 个。现已把工具 FAQ 问题搬入静态正文的 `<h3>`（`/image-upscaler` 当前 3 个），视频 FAQ 也采用同样结构。

### P0-3 渲染后 canonical 和路由 schema 各两份（已修复）

预渲染 head 的 canonical、robots、Open Graph、Twitter、hreflang、Organization 和路由 JSON-LD 都带 `data-rh="true"`，React SEO 组件同步输出相同标记。React 19 下部分 Helmet 标签会短暂落在 root 内，因此 `index.html` 与 SEO 组件都对整个 document 做短暂去重；这样静态 head 与水合后的 head 最终各保留一份。系统 Chrome 本地复核 `/image-upscaler`：canonical=1、JSON-LD=2（Organization + 路由 schema）、description=1。

### P0-4 三个法律页没有预渲染，落回 shell（已修复）

`/terms`、`/privacy`、`/refund` 现在由 `renderLegalPage` 写入 `dist/<route>/index.html`，使用各自的 title、description、keywords、正文和自指 canonical。系统 Chrome 复核 `/terms` 水合后 canonical=1、JSON-LD=1、H1=1；静态页也已逐页扫描。

### P1-1 `/game-character-style` 水合之后正文变薄（已修复）

静态版与 React 版现在共用 `GAME_STYLE_LONG_FORM` 的定义、约束、风格变量和验收段落。系统 Chrome 在英文 locale 下复核水合后的正文约 1,063 词、H2=6、H3=23、canonical=1、JSON-LD=2。

### P1-2 AI Overview 定义段（已修复）

`AI_OVERVIEW_DEFINITION` 现在由首页和工具页 React/静态渲染共同使用，实体名开头、单段定义式回答约 50 词，位于首屏介绍附近。

### P1-3 矩阵页

你 9 月 19 日那版方案提的是先做 6 页高意图页；我这边量到的对手规模是 xconvert 单站 20,629 个 URL、
tinyimagefy 249 页。先 6 页我没意见，但顺序上把 P0-1/P0-2 的深度补完再铺页，比铺页更划算 ——
薄页面多了会互相稀释。

## 6. 复现方式

```bash
# 静态全站扫描：canonical 数量、JSON-LD 类型、H1-H3、词数
cd ~/code/shou/dlss5main && npm run build
python3 - <<'PY'
import os, re, json, glob
for path in sorted(glob.glob('dist/**/index.html', recursive=True)):
    h = open(path, encoding='utf-8').read()
    route = '/' + os.path.relpath(path, 'dist').replace('/index.html', '').replace('index.html', '')
    blocks = re.findall(r'<script type="application/ld\+json"[^>]*>([\s\S]*?)</script>', h)
    types = [','.join(x.get('@type', '?') for x in json.loads(b)['@graph']) if '@graph' in json.loads(b) else json.loads(b).get('@type', '?') for b in blocks]
    without_scripts = re.sub(r'<script[\s\S]*?</script>', '', h)
    print(route, '| canon', len(re.findall(r'rel="canonical"', without_scripts)), '|', '; '.join(types))
PY
```

渲染后（水合）的核对要用系统 Chrome：
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`，playwright 的 `executablePath` 指过去。
`vite preview` 会把 SPA shell 当成 `/image-upscaler` 的响应，验不出预渲染文件 —— 要看预渲染结果就直接
`python3 -m http.server` 托管 `dist/`。

## 7. Codex P0 implementation (2026-09-26)

从 `364026a` 继续完成了文档中 P0/P1 的可落地部分，并保持静态 HTML 与 React 页面共用同一份内容源：

- 13 个 SEO 工具页统一加入定义、工作流、输入输出、适用场景、限制、交付、成本与质量复核段落；主要页当前静态正文约 900–1,200 词（`/image-upscaler` 959、`/video-upscaler` 916、`/image-quality-enhancer` 962、`/game-character-style` 1,228）。护照照片工具也补充了隐私、打印、规格核验和故障排查说明。
- 工具 FAQ 的每个问题在静态正文中使用 `<h3>`，答案仍由可展开的 `<details>` 提供；视频 FAQ 同步使用同一结构。
- 首页、工具页加入 40–60 词的实体优先 AI Overview 定义段，来源为 `src/content/seoDefinitions.ts`。
- 预渲染 head 的 canonical、robots、Open Graph、Twitter、hreflang、Organization 和路由 JSON-LD 均标记 `data-rh="true"`，React Helmet 水合后可复用而不追加重复标签；运行时 Organization 顺序与静态 head 一致。
- `/terms`、`/privacy`、`/refund` 已预渲染，均有自指 canonical、自己的 description/keywords 和可抓取正文；文案数据由 `src/config/legal.ts` 统一提供。
- `/game-character-style` 的 React 水合版加入与静态版共用的定义、不可变约束、风格变量和验收段落，避免水合后从 1,000 词级别退化为约 300 词。

验证结果：`npm run lint` 通过；`npm test` 60/60；`npm run build` 通过。静态 HTML 逐页扫描确认每个预渲染路由只有 1 个 canonical，JSON-LD 均为合法 JSON；主要工具页正文为 `/image-upscaler` 953、`/tools/passport-photo` 900、`/video-upscaler` 916、`/image-quality-enhancer` 956、`/game-character-style` 1,228 词。使用系统 Chrome 对本地 `dist/` 做了水合复核：`/image-upscaler` 水合后 canonical=1、JSON-LD=2（Organization + 路由 schema）、description=1、FAQ H3=8；英文 `/game-character-style` 水合后正文约 1,063 词、canonical=1、JSON-LD=2；`/terms` 水合后 canonical=1、JSON-LD=1。

## 8. Search Console 收尾记录（2026-09-26）

站点地图在 Search Console 中显示“成功”，Google 发现 59 个网址。已通过“网址检查 → 请求编入索引”成功提交以下 12 个网址：

- `/image-upscaler`
- `/blog/best-ai-image-upscaler-2026-comparison`
- `/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026`
- `/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`
- `/blog/what-is-dlss-5-neural-rendering-guide`
- `/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`
- `/en/blog/dlss-5-latest-news-september-2026`
- `/en/blog/dlss5-artistic-vision-debate-honest-assessment`
- `/en/blog`
- `/en/blog/dlss-5-online-image-upscaler-guide`
- `/game-character-style`
- `/video-upscaler`

实时检查结果显示：`/game-character-style` 尚未收录但已进入优先抓取队列；`/video-upscaler` 尚未收录且此前没有发现来源，现已进入优先抓取队列。索引报告里 3 个裸域/HTTP 地址属于正常重定向；英文比较页和证件照 `3-na-4` 规格页被 Google 选择了其他规范页，英文在线指南的“用户未选定规范网页”验证已在进行中；这几项不能靠重复提交解决。

达到 Google 当日 URL Inspection 配额后，Google 返回“抱歉！我们无法处理这项请求，因为您今天已经超出了每日配额。请明天再尝试提交此网址。”因此以下事项保留为外部待办，不再在本轮重复点击：

- **站长操作（配额恢复后）**：逐页提交 `/tools/passport-photo`、`/tools/passport-photo/3-na-4`、`/tools/passport-photo/35x45-ru` 及其余本次新增或改动的工具页；提交后复查“已收录/规范网址”。
- **Google 重新评估**：等待规范页验证结果，若仍选择根证件照页，再增加规格页独有段落或将重复规格合并为一个入口。
- **部署复核（已完成）**：`e391369` 已推送，Vercel Production Ready，`www.dlss5nvidia.com`、裸域和 `dlss5-main.vercel.app` 均指向新部署。线上浏览器复核了主页、`3-na-4` 和 `35x45-ru`：title、description、keywords、canonical 均为稳定英文且自指，`lang=en-US`；主页和规格页各保留 Organization + 路由 schema。
