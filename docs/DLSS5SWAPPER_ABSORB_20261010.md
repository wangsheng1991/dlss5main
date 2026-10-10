# 吸收 dlss5swapper.org 的打法（王胜 2026-10-10 授权：「我们要吸收这个」）

写给 Codex 的执行简报。**证据全部是 2026-10-10 的实测**，不是我推测的。

---

## 一、对手是什么（先看清，别学错）

`dlss5swapper.org` 不是工具作者做的站，是**「发现爆款开源工具 → 抢注同名域名 → 做成官方样子的落地页 → AdSense 变现」的站群**中的一个。

实测证据：

| 项 | 值 |
|---|---|
| 工具仓库 | `rakanki911/DLSS5-Swapper`，建于 **2026-08-29**，**8,238 star / 432 fork**，15 个 release |
| 工具下载量 | **全部 release 资产合计 1,944,344 次**（v2.2.7 单版本 894,774） |
| 分发渠道（站外） | YouTube 教程（一条 80.1 万播放）、Reddit（r/RTX5080、r/gpu、r/DLSS、r/radeon）、Nexus Mods、SourceForge、TechSpot、Tom's Hardware / TechPowerUp / PC Gamer / DSOGaming / GameGPU |
| 站点域名 | `dlss5swapper.org` **2026-09-05 注册**（Spaceship），比仓库晚 7 天 |
| 技术栈 | Next.js（`x-powered-by`）+ Cloudflare，`x-middleware-rewrite: /en`，服务端有正文 |
| sitemap | **98 条 = 14 页 × 7 语言**（en / zh / zh-TW / ja / ko / de / fr），lastmod 2026-09-06 → **2026-10-07** |
| 单页厚度 | 首页 **4,046 词**、`/updates` **5,642 词**、`/dlss-5` 2,913、`/dlss-5-amd` 2,462、`/optiscaler-dlss-5` 2,304、`/guides` 2,634、`/download` 1,924 |
| schema（首页） | `SoftwareApplication` + `Offer(price 0)` + `HowTo` + `FAQPage` + `Organization` + `WebSite` |
| 占的关键词簇 | `dlss-5-amd`、`dlss-5-reshade`、`optiscaler-dlss-5`、`renodx-dlss`、`dlss-5-manager`、`dlss-5-autopilot`、`emulators`、`dlss-5` |
| 变现 | Google AdSense `ca-pub-7412833769252816` + 自建 Plausible（脚本在 `hc3600.top/js/script.js`） |

**它的流量不是靠通用词排名**（2026-10-10，en/US，9 组词实测它 Google 前 10 一次都没进；同组词我们两站 0 次出现）：
- 它吃的是**品牌词 + Google AI 回答引用**：`dlss 5 swapper`、`dlss 5 swapper download` 的 AI Mode 回答里出现 `"Source: dlss5swapper.org"`，引的正是它首页的描述；Bing `dlss 5 swapper` 第 10 位是它的 `/guides`。
- 需求本身来自工具：**官方 DLSS 5 只覆盖 RTX 50 系，RTX 40/30/20 与 AMD 用户想在自己机器上跑起来** —— 这是当前最大的那簇需求。

## 二、吸收什么、不吸收什么

**吸收**（它做对、我们缺的）：
1. **`SoftwareApplication` + `HowTo` + `Offer` 三个 schema** —— 我们一个都没有，而 AI 回答最爱引用可执行步骤。
2. **站级持续更新的更新日志页** —— 它 `/updates` 5,642 词、持续在被抓；我们只有文章级 `reviewed` 日期，没有站级的变更记录。
3. **语言覆盖** —— 它 7 个语言（含 ja/ko），我们 3 个。
4. **「怎么在我这台上真跑起来」这一簇需求** —— 我们只回答「能不能」，没回答「怎么跑」。这根轴要用我们自己的正规工具链去接。

**不吸收**（红线）：
- 它的核心动作是改 DLL、绕过厂商支持范围 —— **任何具体第三方 mod / 换 DLL / 破解式步骤都不许写进我们的站**。
- **不借用它的品牌**：我们不做「同名抢注 + 冒充官方」那种站，页面上不许出现「官方 / Official」这类暗示我们是 NVIDIA 或其工具的表述。

---

## 三、任务（按优先级，每项都要能复测）

仓库：`~/code/shou/dlss5app`（.app）与 `~/code/shou/dlss5main`（主站）。**两个仓库各自跑自己的 lint/test/build。**

### T1 · `.app` 补 SoftwareApplication + HowTo（最小、最划算，先做）

- `scripts/prerender-seo.ts` 首页的 `@graph` 里补：
  - `SoftwareApplication`（name = Neural Architect，`applicationCategory: UtilitiesApplication`，`operatingSystem: Web`，`isAccessibleForFree: true`，`url` = `https://www.dlss5.app/{lang}`，`offers: { '@type':'Offer', price:'0', priceCurrency:'USD' }`）。**只写已成立的事实，不要加 `aggregateRating`（我们没有评分来源）。**
  - `HowTo`：**只用我们页面里已经写着的步骤**，即「在检测器里查型号 → 读该卡状态 → 打开该型号的证据页 → 打开页面上挂的 NVIDIA 来源核对」四步，三语各自手写；**不许发明新步骤**。
- 客户端 `src/pages/Home.tsx` 的 JSON-LD 同步（Google 会执行 JS，两条渲染路径都要一致）。
- 复测：`curl -s <本地>/en | python3 -c` 解析 JSON-LD，确认 `@graph` 里出现这两个类型且字段齐全；`check-dlss5app-ssr.mjs`（本地 + 线上）仍为 `SSR-OK`。

### T2 · 站级更新日志页（`.app` 做，主站可选）

- 新增 `/{lang}/updates`（三语）：**列表式**，每条 = 日期 + 一句话 + 受影响的页面链接。内容只能是**我们真实做过的变更**，例如：
  - 2026-10-10：型号页补逐型号有来源硬件规格（发布时间/CUDA/位宽/功耗）；新增 supported-cards 与四个站点信息页；文章补复审日期。
  - 2026-10-10：首页/型号页/文章答案段改为自足可引用。
- sitemap 里加 `/{lang}/updates`（135 → 138 条），`lastmod` 用最后一次真实变更日期；面包屑照其它页。
- 页面底部与 `Footer()` 给一个入口；`public/llms.txt` 的页数同步改掉。
- **不许写「每日更新」这类做不到的承诺**：只在真有变更时才加条目。
- 复测：`check-dlss5app-ssr.mjs` 的 `sitemap=` 数字与 `uniqueTitles` 同步增长；`after-check.mjs` verdict 仍 `OK`（注意 FAQPage 覆盖率会因分母变大而下降 —— **当前 99/135 = 73.3%，阈值 70%，加 3 个无 FAQ 的页面会到 99/138 = 71.7%**，还在线上，但**再加页之前先算这笔账，跌破 70% 就得给新页补真实 FAQ**）。

### T3 · 「怎么在我这台上真跑起来」的内容簇（正规版）

- 面向 RTX 40/30/20 与 AMD 用户，回答「我这台能用什么、不能用什么、正规路径是什么」：
  - 一篇文章（三语）：`can-i-run-dlss-5-on-my-gpu`（或等价 slug）——先给结论段（按系列：50 系官方确认、40 系未确认、30/20 与 AMD 不在官方范围），再给**我们能提供的正规路径**（Studio 本地软件的要求与实测，链 `https://www.dlss5nvidia.com/download`）。
  - 口径必须与 `.app` 现有状态表一致（`src/data.ts` 是唯一数据源）。
  - **明写**：本站不提供绕过官方支持范围的做法，也不评价任何第三方工具（不点名、不比较）——这一句是刻意写的，既是合规也是差异化。
- 复测：新页面进 sitemap、`reviewed` 日期三处对齐（页面可见行 + `dateModified` + sitemap `lastmod`）、`npm run check:consistency` 仍 `mismatches=0`。

### T4 · ja / ko 语言覆盖（**只出样本与评估，不要铺开**）

- 背景：它 7 个语言，但 2026-10-10 实测它的 `ja`、`ko` 页面在对应语言 SERP 里**一次都没出现**（`dlss 5 swapper 使い方` 无它）→ 这两个语种是空档。
- 本任务**只做**：① 出 `/ja` 与 `/ko` 的**样本页**（首页 + supported-cards 两个路由，正文人工级质量，不用机器直译）；② 写一份评估（新增路由数、构建时间、维护成本、`locales.ts` 要补哪些键）。
- **不要**一次性铺 90 个页面；是否铺开由王胜看完样本决定。

---

## 四、规矩（违反就是白做）

1. **不编数据**、不把「未确认」写成「支持」；型号数值只能来自 `src/data.ts` 的 `spec`。
2. 不许写任何第三方 mod / 换 DLL / 绕过官方支持范围的具体步骤；不许出现「官方/Official」这类自我抬高的表述。
3. 改主站（dlss5nvidia.com）前必须跑它自己的 `npm run lint` / `npm test` / `npm run build`。
4. `.app` 改动：先 `npx tsc --noEmit` + `npm run build`，本地起静态服务器后跑
   `node shared_env/dlss-line/check-dlss5app-ssr.mjs --base http://127.0.0.1:PORT` 与
   `node workspaces/tmp-4b7f2fe3/audit-20261010/after-check.mjs --base http://127.0.0.1:PORT`，
   push 后**线上复测同样两个脚本**，把末行判据贴进汇报。
5. 汇报要给**实测数字**（脚本末行原文），不要只说「已完成」。

## 五、参考

- 我这边的完整证据与复现脚本：`workspaces/tmp-4b7f2fe3/swapper-20261010/README.md`（`serp-swapper.mjs` / `parse-serp.mjs`）。
- 同族竞品（此前已分析）：`docs/DLSS5_NET_VS_APP_20261009.md`。
- 待办口径：`shared_env/dlss-line/TODO.md`（本轮吸收进来的项请开 S19 并逐条记验收）。
