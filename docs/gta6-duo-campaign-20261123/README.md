# GTA VI 同人合影 · 上线记录与推广素材（2026-11-23）

目标：GTA VI 于 2026-11-19 上线（PS5 / Xbox Series X|S），PC 版尚未公布，所以玩家手里能有的就是**主机截图**——这正好是本站「两张参考图」合影流程的输入。用一个页面接住这个时机，用一篇教程教人把图做得能发。

## 上线的东西

| 类型 | 英文 | 中文 |
| --- | --- | --- |
| 页面 | https://www.dlss5nvidia.com/gta6-character-photo | https://www.dlss5nvidia.com/zh/gta6-character-photo |
| 教程 | https://www.dlss5nvidia.com/blog/gta-6-character-photo-fan-made-guide-2026 | https://www.dlss5nvidia.com/zh/blog/gta-6-character-photo-fan-made-guide-2026 |
| 工具（已有） | https://www.dlss5nvidia.com/game-character-together | https://www.dlss5nvidia.com/zh/game-character-together |
| 免费示例 | https://www.dlss5nvidia.com/dashboard?tool=together&sample=together | 同左 |

提交：`250a77b`（`Add the GTA VI duo-portrait campaign page and guide`）。

### 改了哪些文件

- `src/content/gta6Duo.ts` —— 中英双语文案、FAQ、商标声明、`WebPage + BreadcrumbList + FAQPage` 结构化数据。
- `src/pages/Gta6Duo.tsx` —— 页面组件（一个组件两个语言）。
- `src/App.tsx` —— 两条路由。
- `scripts/prerender-seo.ts` —— `renderGta6Duo`，两页都出**静态 HTML**（不运行 JS 也能读到正文、CTA 和免责声明）。
- `src/content/articles/gta6Duo20261123.ts` + `types.ts` —— 教程文章，注册进 `ARTICLES`。
- `public/blog/gta-6-character-photo-fan-made-guide-2026/assets/` —— 两张配图，是**本站工具页的真实截图**（中英各一张，1100 px，JPEG），没有任何游戏内画面。
- `public/sitemap.xml`、`public/llms.txt` —— 两条页面 URL（文章 URL 由构建时自动写入 sitemap）。

## 内容口径（写死在页面里的四条）

1. 这是**同人生成图**，不是游戏功能，与 Rockstar Games、Take-Two、NVIDIA 均无关系；版权属原权利人。
2. 不出现官方原画、封面、标志，也不发布游戏内截图；演示图用的是我们自己的两张参考图跑出来的真实结果。
3. 不以游戏名命名售卖的产品（页面的产品名是「同人双人合影」）。
4. 权利人要求下架就下架。

## 验收（2026-11-23 实测）

- `npm run lint` 干净；`npm test` **262/262**；`npm run build` 通过（32 篇文章、`ARTICLE-MARKDOWN: PASS — 38 pages, 19 assetBase articles`）。
- 本地 `dist` + 系统 Chrome：四个页面 H1 正确、工具 CTA 存在、配图 `naturalWidth` 1024 / 1100、**零 console 错误**。
- 线上 `www.dlss5nvidia.com` 同样四项复验通过：`/gta6-character-photo` 与 `/zh/gta6-character-photo` H1 正确、各 2 个 `dashboard?tool=together` CTA、FAQ 区块在、零 console 错误。
- 预渲染 HTML 里 `canonical`、`hreflang=zh-CN`、`FAQPage`、`not affiliated` / `无隶属关系` 全部可读（3 个 JSON-LD 块）。
- IndexNow 已提交 186 条；四个 URL 的 CF 缓存已按文件清理（英文页部署瞬间曾被缓存成 404，已清）。

## 推广素材（可直接发）

### 1) Bluesky / X（英文，短）

> GTA VI has been out on consoles since 19 Nov, and there's still no PC build — so the only still you can get of Lucia or Jason is a PS5/Xbox screenshot.
>
> That's exactly what this needs: your screenshot + a photo of yourself → one picture, four poses, 1 credit.
>
> Free sample, no account: https://www.dlss5nvidia.com/gta6-character-photo
>
> (Fan-made, unaffiliated.)

### 2) 小红书（中文）

**标题**：PC 版还没出，用主机截图和 GTA6 角色合了张影

**正文**：
GTA6 上线第三天，PC 版还没影。所以我手里关于露西亚和杰森的画面，全是 PS5 截图。

试了个偏门的用法：把**主机截图**（关掉 HUD 那种）+ **一张我自己的照片**丢进去，选个姿势（握手 / 并肩 / 拥抱 / 背靠背），出来就是一张同框图。不是换脸，是让两个人真的站在同一个画面里。

三个经验，省你们重跑：
1. 角色要占画面大、正脸朝镜头，背对镜头的截图脸会被“补”出来，通常不是你想要的那张。
2. 截图别拿手机拍电视，主机媒体库导出，不然色偏和边框会被一起学过去。
3. 出来先看手和两个人相接的位置，那是合成图最先露馅的地方。

一次 1 额度，先跑免费示例不扣额度：dlss5nvidia.com/gta6-character-photo（中文页 /zh/gta6-character-photo）
同人图、非官方，和 Rockstar / NVIDIA 都没关系。

**话题**：#GTA6 #同人图 #AI绘图 #主机游戏 #和游戏角色合影

### 3) 知乎 / 公众号导语（一段）

> 这篇文章不讲 GTA6 本身，讲一个小工具：怎么把你自己塞进一张 GTA6 的画面里。前提是你手上只有 PS5 或 Xbox 的截图——PC 版还没出，大家手里都是这个。做法是两张参考图（你的照片 + 角色截图）交给一个双人合成流程，选好姿势，一次出一张。文里给了三条能少走弯路的经验，和一条必须说清的边界：它是同人图，角色版权不归我们。

### 4) 配图建议

- 用 `public/blog/gta-6-character-photo-fan-made-guide-2026/assets/tool-page-zh.jpg`（工具页真实截图，带前后对照）；
- 或自己再跑一版示例截图（免费、不扣额度）；
- **不要**用官方预告片截图、封面、角色原画，也不要把游戏的 logo 放进图里。

## 接下来看什么（别只看浏览量）

- CF RUM：`/gta6-character-photo`、`/zh/gta6-character-photo` 的外部来源访问；
- 站内：`/dashboard?tool=together` 的访问与「示例 → 自有图」的转化；`/register` 增量；
- 支付：Waffo 生产付款列表是否出现第一笔（目前仍为 0）。

## 还没做的一件事

GSC 的「请求编入索引」需要 Codex 的已登录浏览器线程 + 你本人的通行密钥，我这边做不了；IndexNow 已提交，Bing/Yandex 侧会先看到。要加速 Google 侧，等你有空在那条线程里提交这两个 URL 即可。
