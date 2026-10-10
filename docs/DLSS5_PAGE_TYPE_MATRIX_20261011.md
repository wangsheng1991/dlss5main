# 页型清单矩阵 · 2026-10-11

**本轮范围**：只读抓取与统计，未改任何站点、未写任何仓库。
**对象**：`dlss5swapper.org`、`dlss5.net`、`dlss5manager.app`、我们主站 `www.dlss5nvidia.com`、姊妹站 `www.dlss5.app`。
**口径**：一个 URL = 一页，只统计 **HTTP 200 的活页**（404 / 跳转 / 资源文件不计）；页型由 `classify-page-types.mjs` 的显式规则表判定，规则与逐页归类结果都落在 `out/` 里，可逐条审计。
**出口**：`http://127.0.0.1:1082`（curl `-x`）；`crawl-sites.mjs` 直连已验证 200。

---

## 1. 主表：页型 × 站点

（本表由 `classify-page-types.mjs` 生成，原文件 `out/main-table.md`；数字 = 该站该页型的活页数，`✗` = 没有。）

| 页型 | swapper | net | manager | 我们主站 | 我们 .app |
|---|---|---|---|---|---|
| 首页 | 7 | 2 | 1 | 1 | 5 |
| 型号页（逐 GPU） | ✗ | 10 | ✗ | ✗ | 93 |
| 型号系列页 | ✗ | 1 | ✗ | ✗ | ✗ |
| 游戏页（逐游戏） | ✗ | 4 | ✗ | ✗ | ✗ |
| 游戏支持追踪页 | ✗ | 3 | ✗ | ✗ | ✗ |
| 兼容性总览 | ✗ | 5 | ✗ | ✗ | 5 |
| 指南/教程 hub | 7 | 1 | ✗ | ✗ | ✗ |
| 指南/教程页 | ✗ | ✗ | 1 | ✗ | ✗ |
| 下载页 | 7 | ✗ | ✗ | 1 | ✗ |
| 下载/安装页 | ✗ | 2 | ✗ | ✗ | ✗ |
| 系统需求页 | ✗ | 2 | ✗ | ✗ | ✗ |
| 更新日志 | 7 | ✗ | ✗ | ✗ | 3 |
| 技术解释页 | 7 | 1 | ✗ | ✗ | ✗ |
| 证据/状态追踪页 | ✗ | 1 | ✗ | ✗ | ✗ |
| 时效/发布日期页 | ✗ | 2 | ✗ | ✗ | ✗ |
| 对比页（vs） | ✗ | 3 | ✗ | ✗ | ✗ |
| 引擎/开发者页 | ✗ | 1 | ✗ | ✗ | ✗ |
| AMD 官方状态页 | ✗ | 2 | ✗ | ✗ | ✗ |
| DLSS 4.5 簇 | ✗ | 3 | ✗ | ✗ | ✗ |
| AI-PC 话题簇 | ✗ | 17 | ✗ | ✗ | ✗ |
| 工具页（主工具） | ✗ | ✗ | ✗ | 15 | ✗ |
| 工具页（细分规格） | ✗ | ✗ | ✗ | 3 | ✗ |
| 工具页（Studio） | ✗ | ✗ | ✗ | ✗ | 3 |
| use-case 页 | ✗ | ✗ | ✗ | 3 | ✗ |
| 博客 | 2 | ✗ | ✗ | 20 | 24 |
| 播客 | ✗ | ✗ | ✗ | 6 | ✗ |
| 文档/模型/对比页 | ✗ | ✗ | ✗ | 3 | ✗ |
| 商业页 | ✗ | ✗ | ✗ | 3 | ✗ |
| 应用页（登录/工作台） | ✗ | ✗ | ✗ | 3 | ✗ |
| 渠道物料页 | ✗ | ✗ | ✗ | 2 | ✗ |
| 信任页 | 9 | 4 | ✗ | 4 | 12 |
| 支持/感谢页 | 7 | ✗ | ✗ | ✗ | ✗ |
| 语言副本 | ✗ | ✗ | ✗ | 1 | ✗ |
| 高风险：改 DLL / 注入 / 绕厂商 | 49 | ✗ | ✗ | ✗ | ✗ |
| **活页合计** | **102** | **64** | **2** | **65** | **145** |
| **sitemap 声明** | 98 | 38 | 0（`/sitemap.xml` 404） | 58 | 145 |
| **在 sitemap 之外但可达** | 4 | 26 | —（无 sitemap） | 7 | 0 |
| **语言数** | 7 | 2 | 1 | 3 | 5 |

读表要点：

- **页型宽度**：`net` 最宽（18 类），我们 .app 只有 7 类但**型号页深度第一**（93 页 = 31 款 × 3 语种）。
- **我们完全没有的页型**共 15 行（游戏页 / 游戏追踪 / 系统需求 / 对比页 / 证据追踪 / 时效页 / guides hub / 技术解释页 / 引擎页 / 型号系列页 / DLSS 4.5 簇 / AI-PC 簇 / 下载安装页 / 社区视频聚合 / AMD 官方状态页）。
- **swapper 的 49 页高风险页**全部是我们不能碰的（见 §4）；去掉它们，它只剩 53 页，其中 **51 页是同一批模板的 7 语言复制**（7 个安全页型 × 7 语言 = 49，再加 `/privacy-policy`、`/terms-of-service`），真正独有的内容只有 `/posts` 与 1 篇 post。

---

## 2. 各站明细

### 2.1 `dlss5swapper.org` —— 全部页型 × 语言（7 语言 × 14 页型 = 98 条 sitemap）

语言：`en`、`zh`(zh-Hans)、`zh-TW`(zh-Hant)、`ja`、`ko`、`de`、`fr`（sitemap 的 `hreflang` 声明与 `loc` 一致，无缺漏）。
sitemap 之外还有 4 页可达（robots.txt 里 Disallow 了 `/privacy-policy`、`/terms-of-service`，所以没进 sitemap；`/posts` 与 1 篇 post 是博客）。逐页状态取自 `out/verify-numbers.json` 的 `swapperGrid`：

| 页型 | en | zh | zh-TW | ja | ko | de | fr | 语言数 |
|---|---|---|---|---|---|---|---|---|
| `/` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/download` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/guides` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/updates` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/dlss-5` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/dlss-5-amd` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/dlss-5-autopilot` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/dlss-5-manager` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/dlss-5-reshade` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/optiscaler-dlss-5` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/renodx-dlss` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/emulators` ⚠️ | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/support` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |
| `/contact` | 200 | 200 | 200 | 200 | 200 | 200 | 200 | 7 |

⚠️ = 改 DLL / 注入 / 绕厂商类，**绝对不能抄**（§4）。`/download` 本身不算"页型违规"，但它发的是改 DLL 的 Windows 安装器，同样不能碰。
sitemap 之外另 4 页：`/posts`（Blog 索引）、`/en/posts/nivalis-nights-reviews`（唯一 1 篇）、`/privacy-policy`、`/terms-of-service`。
页型计数：高风险 49 = 7 页型 × 7 语言；信任页 9（contact×7 + 隐私 + 条款）；支持/感谢页 7；更新日志 7；指南 hub 7；技术解释页 7（`/dlss-5`）；下载页 7；首页 7；博客 2。

### 2.2 `dlss5.net` —— 64 条可达，26 条未登记

- `/sitemap.xml` → **301** → `https://www.dlss5.net/sitemap.xml` → 200（根域 `dlss5.net/` 同样 301 到 www）。声明 **38** 条，实测可达 **64** 条（英文 42 + 葡萄牙语 22），**26 条未登记**（脚本 `verify-numbers.mjs` 逐跳复现）。
- 26 条未登记分布：`/gpu/*` 10（en 5 + pt 5）、`/ai-pc/*` 16（en 8 + pt 8）。
- 页型分类（去 `/pt` 语言前缀后归并，共 18 类）：

| 页型 | 页数 | 代表 URL |
|---|---|---|
| 型号页（逐 GPU） | 10 | `/gpu/rtx-5090`、`/pt/gpu/gtx-1060` |
| AI-PC 话题簇 | 17 | `/ai-pc/nvidia-rtx-spark-specs`、`/ai-pc/nvidia-rtx-spark-vs-apple-m5`、`/pt/ai-pc/nvidia-rtx-spark-notebooks` |
| 兼容性总览 | 5 | `/dlss-5-supported-cards`、`/dlss-4-5-supported-cards`、`/dlss-supported-cards`、`/pt/dlss-5-quais-placas`、`/pt/dlss-4-5-quais-placas` |
| 信任页 | 4 | `/about`、`/contact`、`/privacy`、`/editorial-policy` |
| 游戏页（逐游戏） | 4 | `/games/starfield-dlss-5`、`/games/nba-2k27-dlss-5`、`/games/resident-evil-requiem-dlss-5`、`/games/assassins-creed-shadows-dlss-5` |
| 游戏支持追踪页 | 3 | `/dlss-5-games`、`/dlss-4-5-games`、`/pt/dlss-5-jogos` |
| 对比页（vs） | 3 | `/dlss-5-vs-dlss-4-5`、`/dlss-frame-generation-vs-multi-frame-generation`、`/pt/dlss-5-vs-dlss-4-5` |
| DLSS 4.5 簇 | 3 | `/dlss-4-5-dynamic-mfg-6x`、`/dlss-4-5-dynamic-mfg-settings`、`/dlss-4-5-ray-reconstruction` |
| 首页 | 2 | `/`、`/pt` |
| 下载/安装页 | 2 | `/dlss-5-download`、`/pt/como-ativar-dlss-5` |
| 系统需求页 | 2 | `/dlss-5-system-requirements`、`/pt/dlss-5-requisitos` |
| 时效/发布日期页 | 2 | `/dlss-5-release-date`、`/pt/dlss-5-confirmado` |
| AMD 官方状态页 | 2 | `/dlss-5-amd`、`/pt/dlss-5-amd` |
| 指南 hub | 1 | `/guides` |
| 型号系列页 | 1 | `/dlss-5-rtx-40-series` |
| 技术解释页 | 1 | `/dlss-5-neural-rendering` |
| 证据/状态追踪页 | 1 | `/dlss-5-evidence-tracker` |
| 引擎/开发者页 | 1 | `/dlss-5-unreal-engine` |

### 2.3 `dlss5manager.app` —— 全站只有 2 页

- `/sitemap.xml` **404**，无 sitemap；`/robots.txt` 200（是 Cloudflare 的 content-signals 模板 + 规则）。
- 从首页抓到的站内链接只有 **1 条**：`./tutorials.html`。用系统 Chrome 渲染首页后仍只有这 1 条（无 JS 注入导航）。
- 全部可达内页与标题（`out/classified-manager.txt`）：

| URL | 标题 |
|---|---|
| `https://dlss5manager.app/` | DLSS 5 MANAGER |
| `https://dlss5manager.app/tutorials`（= `/tutorials.html`，同一页） | DLSS 5 MANAGER |

- 其余路径**全部 404**，探测记录：`/privacy`、`/privacy.html`、`/terms`、`/terms.html`、`/contact`、`/about`、`/docs`、`/download`、`/blog`、`/faq`、`/guide`、`/install`、`/sitemap_index.xml`（13 条）。
- 首页外链全部指向站外：GitHub release（`.exe` / `.rar`）、Ko-fi、Patreon。**这是单页 + 一个客户端渲染的视频画廊站**，没有任何内容型内页。

### 2.4 我们自己的两站

**主站 `www.dlss5nvidia.com`（sitemap 58，活页 65）**

| 页型 | 页数 | 备注 |
|---|---|---|
| 博客 | 20 | en 10（1 索引 + 9 篇）+ zh 10（1 索引 + 9 篇） |
| 工具页（主工具） | 15 | `/image-upscaler`、`/unblur-image`、`/virtual-try-on` … |
| 工具页（细分规格） | 3 | `/tools/passport-photo` + `3-na-4` + `35x45-ru` |
| 播客 | 6 | `/podcast` + 5 期 |
| 信任页 | 4 | `/about`、`/privacy`、`/terms`、`/refund` |
| use-case 页 | 3 | architecture / portrait / product |
| 文档·模型·对比 | 3 | `/docs`、`/models`、`/comparisons` |
| 商业页 | 3 | `/pricing`、`/store`、`/enterprise` |
| 应用页 | 3 | `/dashboard`、`/login`、`/register` |
| 渠道物料页 | 2 | `/marketing/reddit/*.html` |
| 下载页 | 1 | `/download`（Studio 下载/请求页） |
| 语言副本 | 1 | `/es/mejorar-calidad-imagen` |
| 首页 | 1 | `/` |
| 未登记但可达 | 7 | `/dashboard`、`/store`、`/refund`、`/login`、`/register`、`/terms`、`/privacy` —— **不在 sitemap 里**，可修 |

**姊妹站 `www.dlss5.app`（sitemap 145 = 活页 145）**

| 页型 | 页数 | 备注 |
|---|---|---|
| 型号页（逐 GPU） | 93 | 31 款 × en / zh-CN / zh-TW |
| 博客 | 24 | 8 篇 × 3 语种 |
| 信任页 | 12 | about / contact / privacy / editorial-policy × 3 语种 |
| 首页 | 5 | en / zh-CN / zh-TW / ja / ko |
| 兼容性总览 | 5 | supported-cards × 3 语种 + ja + ko |
| 更新日志 | 3 | en / zh-CN / zh-TW |
| 工具页（Studio） | 3 | `/studio` × en / zh-CN / zh-TW |

- 语言覆盖是**跛的**：`ja`/`ko` 只有 2 页（首页 + supported-cards），其余 4 类页型只有 3 个语种。
- ⚠️ **顺带发现一个真缺陷（只读观测，未修）**：`/ja`、`/ja/supported-cards`、`/ko`、`/ko/supported-cards` 这 4 页各自链出 **35 条 404**（31 款 GPU + 4 个信任页），去重后 **70 条死内链**。来源与目标清单见 `out/verify-numbers.json` 的 `oursAppDeadLinks`。

---

## 3. 我们缺的、且可合规补（按我方难度从低到高）

难度 = 我方工作量（来源是否现成、是否要持续维护）。"来源"写的是这一页成立所必需的证据出处；"能覆盖的查询词"是具体查询串，不是"相关关键词"。

| # | 建议页型 / URL | 难度 | 需要什么来源 | 能覆盖的查询词（具体） | 竞品对照 |
|---|---|---|---|---|---|
| 1 | 系统需求页 `/en/system-requirements`（+ zh-CN/zh-TW） | **低**（数据已在我们仓库） | 我们 `src/data.ts` 里 31 款型号的 spec + 每个状态三态（Confirmed / Planned / Unsupported）；NVIDIA 官方 driver 版本说明 | `dlss 5 system requirements`、`dlss 5 minimum requirements`、`dlss 5 driver version`、`rtx 3060 dlss 5 support` | net 2 页 |
| 2 | 指南 hub `/en/guides` | **低**（现有 8 篇博客 + supported-cards 聚合即可） | 站内现有内容 + 面包屑，不需新证据 | `how to enable dlss 5`、`dlss 5 setup guide`、`dlss 5 not showing in game`、`dlss 5 怎么开启` | swapper 7、net 1 |
| 3 | 证据/状态追踪页 `/en/status`（把 supported-cards 的三态抽成独立页 + 时间线 + 审阅日期） | **低** | 复用我们 supported-cards 已核过的证据与审阅日期 | `dlss 5 confirmed`、`dlss 5 support status`、`is dlss 5 out yet`、`dlss 5 确认 支持` | net 1（`/dlss-5-evidence-tracker`） |
| 4 | 技术解释常青页 `/en/what-is-dlss-5`（现有博客升级成常青页） | **低** | 现有博客 `what-is-dlss-5-neural-rendering-guide` + `dlss-5-architecture-explained` | `what is dlss 5`、`dlss 5 neural rendering explained`、`how does dlss 5 work` | swapper 7、net 1 |
| 5 | 对比页 `/en/vs/dlss-5-vs-dlss-4-5`、`/en/vs/dlss-5-vs-fsr-4`（从博客搬成常青对比页，带表格） | **低** | 现有博客 `dlss5-vs-dlss4-vs-fsr4-comparison-2026`；DLSS/FSR 官方功能表 | `dlss 5 vs dlss 4.5`、`dlss 5 vs fsr 4`、`dlss 5 vs dlss 4 performance` | net 3 |
| 6 | 时效/发布日期页 `/en/release-date` | **低-中**（初稿易，需按月维护） | NVIDIA 官方公告时间线（每条带日期与链接） | `dlss 5 release date`、`when did dlss 5 come out`、`dlss 5 launch date` | net 2 |
| 7 | 型号系列页 `/en/series/rtx-50`、`rtx-40`、`rtx-30`、`rtx-20`（从 31 张型号页聚合） | **低-中** | 我们型号页的 31 条 spec 汇总 | `rtx 40 series dlss 5`、`is dlss 5 coming to rtx 20`、`rtx 50 series dlss 5` | net 1 |
| 8 | 引擎/开发者页 `/en/unreal-engine` | **中** | Epic 官方 UE 版本说明、NVIDIA 开发者博客 / NVIDIA Developer 文档；不确定的部分要留空并标注待确认 | `dlss 5 unreal engine 5`、`dlss 5 ue5 plugin`、`dlss 5 unreal engine support` | net 1 |
| 9 | 游戏支持追踪页 `/en/games` + 逐游戏页 `/en/games/<slug>` | **中**（每条要核实，且要持续更新） | NVIDIA 官方游戏公告与 driver release notes、Steam/Epic 商店页的 DLSS 标记、发行商补丁说明；每条标注来源与复核日期 | `dlss 5 games list`、`games that support dlss 5`、`starfield dlss 5`、`nba 2k27 dlss 5`、`dlss 5 游戏 支持` | net 3 + 4 |
| 10 | 下载/安装页 `/en/download-setup`（driver + 游戏内设置步骤，与主站 `/download` 的 Studio 下载区分开） | **中** | NVIDIA 官方 driver 下载页与 NVIDIA App 说明；不提供任何改文件步骤 | `how to turn on dlss 5`、`dlss 5 not working`、`dlss 5 in game settings` | net 2 |
| 11 | DLSS 4.5 簇（`/en/dlss-4-5`、`dynamic-mfg`、`ray-reconstruction` 3 页） | **中** | NVIDIA 官方 DLSS 4.5 文档与公告 | `dlss 4.5 dynamic mfg`、`dlss 4.5 supported cards`、`dlss 4.5 ray reconstruction` | net 3 |
| 12 | AMD 官方状态页 `/en/dlss-5-on-amd`（**只写官方支持范围 + 云游戏通道，不写任何绕过步骤**） | **中** | NVIDIA 官方支持范围、GeForce NOW 官方机型列表；不做任何 mod 描述 | `dlss 5 on amd`、`dlss 5 radeon support`、`dlss 5 geforce now` | net 2（这是"可合规"的写法） |
| 13 | 社区视频/教程聚合页 `/en/community` | **中** | 公开 YouTube 教程只做**外链嵌入**（需逐个确认可嵌入、注明作者与语言），不自建视频内容 | `dlss 5 tutorial video`、`dlss 5 youtube guide` | manager 1（50 条视频画廊） |
| 14 | AI-PC 话题簇（`/ai-pc/<slug>`，net 有 17 页） | **高**（新话题域，来源要持续维护） | NVIDIA 官方产品/规格页、笔电厂商公布机型列表、Apple 与高通官方规格页；每条数值都要有官方出处 | `nvidia rtx spark specs`、`rtx spark vs apple m5`、`rtx spark release date`、`rtx spark laptops` | net 17 |
| 15 | 语言补齐（ja / ko 补齐 4 类页型 + 信任页） | **高**（翻译工作量；但先把 §2.4 的 70 条死链修掉是**零难度**） | 现有 en / zh-CN 文案 + 翻译 | 不新增页型，只补语言覆盖与内链 | .app 自身缺口 |

> 建议的前三批：**第 1 批 = #1 #2 #3 #4 #5**（都是把仓库里已有的证据重组成页，一次成稿，无新来源风险）；**第 2 批 = #6 #7 #8 #9 #10**（要外部来源 + 复核节奏）；**第 3 批 = #11 #12 #13 #14 #15**。

---

## 4. 竞品有、但我们不能碰

| 页面 / 页型 | 谁有 | 为什么不能碰 |
|---|---|---|
| `/download`（Windows 安装器，一键在游戏目录里换 DLSS 运行库）+ `dlss5manager.app` 全站（经 GitHub release 发 `.exe` / `.rar`） | swapper（7 语言）、manager（全站就是这个） | 分发改动游戏运行库的工具：改的是游戏安装目录里的厂商运行时组件，超出 NVIDIA 对运行时的许可与支持范围，也会撞游戏的反作弊/服务条款。我们主站有 `/enterprise`（私有 API）与 `/docs`（商业接口）叙事，上线这类页等于自我打脸。 |
| `/dlss-5-reshade`（ReShade AIO） | swapper ×7 语言 | 包装第三方注入器、改游戏渲染管线；既是他人项目（不能这样转售/重打包），也属于"注入"这一类。 |
| `/optiscaler-dlss-5` | swapper ×7 语言 | OptiScaler 的本质是把 DLSS 调用转译到 FSR/XeSS，即绕开厂商的显卡 gating；且不能冒用他人项目名做分发页。 |
| `/renodx-dlss` | swapper ×7 语言 | ReShade 系第三方附加组件，同上，还多一条"借用他人品牌"。 |
| `/dlss-5-manager`（"DLSS 5 Manager v1.3.1" 下载页） | swapper ×7 语言 | 转载他人二进制并挂上 DLSS 5 品牌，典型的重打包 + 品牌借用。 |
| `/dlss-5-autopilot` | swapper ×7 语言 | 另一个第三方 DLL 替换器；同为改文件路径。 |
| `/dlss-5-amd`（"DLSS 5 on AMD **Download**"） | swapper ×7 语言 | 在 AMD 卡上跑 DLSS 超出 NVIDIA 官方支持范围，唯一实现路径是伪装/转译。**可合规的替代写法**是 net 那种：只并列官方状态、云游戏通道、mod 现状三态，且不提供任何方法（我们 §3 #11 就是照这个边界做）。`/pt/dlss-5-amd` 同理。 |
| `/emulators`（模拟器 DLSS 注入） | swapper ×7 语言 | 把 DLSS 注入到模拟器里，绕过游戏本身的支持范围。 |
| 全站的品牌与命名方式 | swapper 的 "DLSS 5 Swapper"，manager 的 "DLSS 5 Manager"，`dlss5.net` / `dlss5.app` / `dlss5.org` 同名品牌词站 | 都是抢 "DLSS 5" 品牌词的自建站。我们自己的页面**不能暗示是 NVIDIA 官方或官方合作**（不能出现官方徽标、不能用"官方下载"这类措辞）。这条是贯穿全站的边界，不只是某一个页型。 |

---

## 5. 抓不到 / 无法复现的（不编数据）

| 项 | 结论 | 原因 |
|---|---|---|
| `dlss5manager.app` 的 sitemap | **抓不到** | `/sitemap.xml` 与 `/sitemap_index.xml` 都是 404，robots.txt 里也没有 Sitemap 行。只能从首页取链接。 |
| `dlss5manager.app/tutorials` 的"约 6,097 词" | **无法复现** | 该页是**客户端渲染的社区视频画廊**，不是长文。实测：原始 HTML 92,786 字节，去掉 `<script>` 后的可见文本仅 **174 词**；用系统 Chrome 渲染后再数也只有 **≈1,256 词**（`--dump-dom`，`--virtual-time-budget=15000`）。页面主体是 `<script>` 里的 `YOUTUBE_VIDEOS` 数组：**50 条有效条目 + 1 条注释掉的占位**，另有 `PRE_SEEDED_DATA` **15 条**预置元数据。数字见 `out/verify-numbers.json`。 |
| swapper 的 `/privacy-policy`、`/terms-of-service` | 可达但**不进 sitemap** | robots.txt 里 `Disallow: /privacy-policy`、`Disallow: /terms-of-service`。实测都是 200 且有真实正文（"Privacy Policy" 出现 8 次、cookie 相关 22 次），但 `<title>` 仍是首页标题——是竞品自己的 SEO 缺陷。 |
| 竞品的排名 / 流量 / AI 引用情况 | **本轮不测** | 本轮只做页型盘点与可达性；没有引入第三方排名数据源。 |
| `dlss5.net` 的 pt 语区是否还有更多未登记页 | **受限于我的爬法** | 我只从 sitemap + 首页出发做站内 BFS（每站上限 400 页），能发现的未登记页取决于站内互链；没有 sitemap 覆盖的孤立页可能漏掉。 |
| `dlss5.app` 的 git 源码 vs 线上 | **未比对** | 本轮不改仓库、不拉仓库，只测线上。 |

---

## 6. 复现方式

脚本都在 `tenx-20261011/` 下，文件名自明：

| 文件 | 作用 | 命令 |
|---|---|---|
| `crawl-sites.mjs` | 抓 5 个站的 sitemap（跟随 301）、逐页 BFS 抓 `<title>`/状态码/站内链接 | `node crawl-sites.mjs [swapper\|net\|manager\|ours-main\|ours-app]` |
| `classify-page-types.mjs` | 把活页按显式规则表归类，生成主表 | `node classify-page-types.mjs` |
| `verify-numbers.mjs` | 单独复核：net 跳转链、manager 教程页构成、.app 死链按来源页、swapper 语言×页型栅格 | `node verify-numbers.mjs` |

产出目录：
- `raw/` —— 原始快照（`swapper-sitemap.xml`、`net-sitemap.xml`、`ours-main-sitemap.xml`、`ours-app-sitemap.xml`、`manager-home.html` / `manager-home-rendered.html`、`manager-tutorials.html` / `manager-tutorials-rendered.html`）
- `out/` —— `crawl-<站>.json`（每页状态/标题/内链）、`classified-<站>.txt`（逐页归类，可审计）、`page-type-matrix.json`、`verify-numbers.json`、`main-table.md`

其它：
- 网络出口只走 `http://127.0.0.1:1082`；`crawl-sites.mjs` / `verify-numbers.mjs` 用 Node 直连（已验证 200），动态页用系统 Chrome `--headless=new --proxy-server=http://127.0.0.1:1082`。
- 本轮**没有**任何写操作：未提交、未部署、未改任何站点文件。
