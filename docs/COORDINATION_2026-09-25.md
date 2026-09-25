# 两条线的分工、进度与开放问题 — 2026-09-25

这份文档是给 Codex 的交接件。写它的原因是：今晚 `docs/` 这条路已经验证是通的 —— 19:45 我在这里放了
`SEO_IMAGE_CONVERT_COMPETITORS_2026-09-25.md`，19:53 它就被收走并执行了。所以进度、证据、待办都写在这里，
不再另开通道。

## 0. 当前状态（都是实测，不是计划）

| 项 | 值 |
|---|---|
| `main` / `origin/main` | `c583eea`，一致，工作区干净，本地没有独有提交 |
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
| `/image-upscaler` | 301 | 1,000–3,300 |
| `/tools/passport-photo` | 226 | — |
| `/video-upscaler` | 418 | — |
| `/image-quality-enhancer` | 301 | — |

目标 900–1,200 词/页。对手的构成：定义段 + 步骤 + 参数与限制的表格 + 适用/不适用 + 成本对比 + FAQ。
xconvert 单页 1,840 词；patsnap eureka 的 AI 报告页 3,248 词。

### P0-2 静态 HTML 里 H3 = 0

抓不到 JS 的抓取器看到的 H3：`/image-upscaler` 0 个、首页 0 个（渲染后有 78 个）。
对手是 5–26 个。**FAQ 的每一条问题在静态正文里做成 `<h3>`** 是最省事的一步 —— zsky.ai 就是这么做的
（FAQ 每条一个 H3 + 成本对比一个 H2），而 FAQ 文案我们已经有了，只差从 JSON-LD 里搬到正文。

### P0-3 渲染后 canonical 和路由 schema 各两份

线上渲染后：`/image-upscaler` 的 `link[rel=canonical]` 有 2 个（同一个 URL），路由自己的 schema 也出现 2 次。

机制（我读了 `node_modules/react-helmet-async/lib/index.js:507-547`）：`updateTags` 只把
`head` 里带 `data-rh` 属性的同类标签当作"自己的"，能 `isEqualNode` 匹配上的就复用，匹配不上的留成待删。
prerender 写的标签没有 `data-rh`，所以 Helmet 不认，直接追加 → 两份。

修法：让 prerender 输出的每个 head 标签都带 `data-rh="true"`。这样 Helmet 要么复用、要么替换，
无论哪种结果都只剩一份。**代价要一并处理**：凡是被标了 `data-rh` 而 React 侧不再输出的标签，Helmet 会在水合时删掉它 ——
比如 hreflang。所以标之前要逐页确认 React 侧把它 prerender 的那些 `alternates` 都传了
（`ToolLanding.tsx`、`Blog.tsx` 已经传了，其余页面要一个一个核）。

### P0-4 三个法律页没有预渲染，落回 shell

`/terms`、`/privacy`、`/refund` 不在 `writeRoute` 列表里，所以线上直接吃 `dist/index.html`：
**静态 canonical 指向首页**（`https://www.dlss5nvidia.com/`），还带着首页整张图。

```
/about     canonical= https://www.dlss5nvidia.com/about   jsonld=1
/models    canonical= https://www.dlss5nvidia.com/models  jsonld=1
/terms     canonical= https://www.dlss5nvidia.com/        jsonld=1   ← 指向首页
/privacy   canonical= https://www.dlss5nvidia.com/        jsonld=1   ← 指向首页
/refund    canonical= https://www.dlss5nvidia.com/        jsonld=1   ← 指向首页
```

两个选项，你判断：把这三页按 `renderPublicGuide` 预渲染（canonical 自指，正文得跟 React 侧那三页对齐，
不然又变成静态/运行时两套文案），或者明确接受现状。

### P1-1 `/game-character-style` 水合之后正文变薄

预渲染的静态版 1,009 词，React 渲染完只剩 **293 词**（H2 从 24 变成 2，H3 23 个）。工具页是反过来的
（`/image-upscaler` 静态 301 → 渲染后 433），所以这一页的 React 版比它自己的预渲染版信息少 ——
抓得到 JS 的抓取器看到的是薄的那一版。建议让 React 侧把静态版里的定义段和说明段落也带上。

### P1-2 AI Overview 定义段

8 个查询顶部 8 个都有 AI Overview。我们目前没有一段"可以整段被摘"的定义式回答。
建议在首页和 `/image-upscaler` 首屏附近各放一段 40–60 词的、以实体名开头的陈述句（不是小标题，不是问句）。

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
    blocks = re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>', h)
    types = [','.join(x.get('@type', '?') for x in json.loads(b)['@graph']) if '@graph' in json.loads(b) else json.loads(b).get('@type', '?') for b in blocks]
    print(route, '| canon', len(re.findall(r'rel="canonical"', h)), '|', '; '.join(types))
PY
```

渲染后（水合）的核对要用系统 Chrome：
`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`，playwright 的 `executablePath` 指过去。
`vite preview` 会把 SPA shell 当成 `/image-upscaler` 的响应，验不出预渲染文件 —— 要看预渲染结果就直接
`python3 -m http.server` 托管 `dist/`。
