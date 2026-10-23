# `dlss 5 download` 24 小时读数核查与修复（2026-10-23）

王胜指出后台看到 `dlss 5 download` **2 点击 / 106 展示**。下面是界面原文核查结果与处置。

## 1 读数属实，口径是「24 小时」

- 属性：`sc-domain:dlss5nvidia.com`（网域资源），界面「上次更新日期：4 小时前」。
- 24 小时窗口，查询 `dlss 5 download`：**2 点击 / 110 展示 / 1.8% CTR / 平均排名 10.1**（抓取时数据已从 106 更新到 110）。
- 该查询 24 小时内**只由一条 URL 承接**：`https://www.dlss5nvidia.com/download`（2 / 110 / 1.8% / 10.1）—— 没有被 `/`、`/en/download` 或博客页分流，也不是属性或筛选器错位。
- 同查询 **7 天**：**26 点击 / 572 展示 / 4.5% / 平均排名 9.7**（约 3.7 点击、82 展示/天）。
- `/download` 这一页 24 小时：**48 点击 / 688 展示 / 7% / 平均排名 7.6**。
- 全站 3 个月：4,040 点击 / 4.51 万展示 / 9% / 7.3；该查询 3 个月 85 点击 / 1,710 展示。

## 2 结论：不是数据错，是排名位置

1.8% 的 CTR 对**平均排名 10.1** 是正常值（第 10 名附近 CTR 通常 1–3%）。同一天 `/download` 整体 7% 是因为该页面上还有排名 3–6 的安卓/APK 类查询在拉高。24 小时只有 2 次点击也不是异常下滑：7 天日均约 3.7 次，单日 2 次属正常波动。

所以问题定义是：**这个词排在首页底/第二页顶部（约 10 位），拿不到点击**。要解决就得让它进前 7。

## 3 这个词的竞争面（既有 SERP 记录，`docs/COMPETITOR-ROI-20261023.md` §3.1）

前 5 名全是「能下载到可执行物」的页面：GitHub 仓库 `Merserk/dlss5-visual-enhancer`、NVIDIA Developer 的 DLSS 页面、SourceForge 的 `dlss-5-swapper` 镜像、Nexus Modding Tools、uptodown 的 swapper 页。PAA 原问：「Can I download DLSS 5?」「How do I install DLSS 5?」「Is DLSS 5 available?」。

我们的 `/download` 目前是一篇「下载决策指南」，明确说没有官方独立安装包、没有 APK，Studio 需申请。**语义上答的是「不能下载」，而搜索意图是「我要下载」**——这是它停在 10 位的结构性原因。

## 4 处置（本轮就做，不新建 URL）

1. **回答 PAA 原问**：在 `/download` 首屏后加一段 answer-first 区块，逐条回答那三个原问（有来源的写来源，无来源写「未确认」，不承诺运行时）。
2. **给出真实可下载物**：发布一个站内自有、可核对的「DLSS 5 审阅工具包」`/downloads/dlss5-review-kit.zip`（来源就是已上站的审阅清单与模板），并在 `/download` 用独立小节说明：这是审阅用材料，不是运行时、不是 APK、不需要安装。让「download」这个词有一个真实、诚实的落点。
3. **把「人们实际在下什么」写成对照表**（NVIDIA App / 游戏内 DLSS 更新 / 第三方 swapper 镜像），只做事实描述，不推荐、不背书、不给下载链接。
4. **内链**：从 `/`（24 小时 34 点击 / 176 展示 / 排 4.1）与对比文章，用精确匹配锚文本指向 `/download`；不新增页面、不改既有正文语义。

## 5 验收

- 上线后 7 天内同一查询：**平均排名 ≤ 8.0**，CTR ≥ 3.5%（当前 24 小时 10.1 / 1.8%，7 天 9.7 / 4.5%）。
- 窗口读数用同口径：`sc-domain:dlss5nvidia.com`、24 小时与 7 天各取一次，写进 `docs/gsc-24h-20261023/followup-*.md`。已排一次性任务 `gsc_download_query_followup`（2026-10-30T02:00Z）。
- 若 7 天后位置没动，说明差距在站点权重而不是页面语义，转入外链与品牌面（不在这份工单里）。

## 5.1 已上线（commit `d2be38f`，2026-10-23）

| 项 | 落地内容 | 复验（我自己跑的，不是子线程结论） |
|---|---|---|
| PAA 三问 | `/download` 与 `/zh/download` 首屏后 answer-first，逐条回答 Can I download / How do I install / Is DLSS 5 available，带 NVIDIA 来源与 `Checked: 2026-10-23` | 中英两版三问都在 DOM 里；两个来源链接实测 **200**（`developer.nvidia.com/rtx/dlss`、`nvidia.com/.../dlss-4-5-super-resolution-available-now/`） |
| 可下载物 | `/downloads/dlss5-review-kit.zip`，24,437 B，8 个文件（三篇已上站稿的审阅段中英 + 空白接受/拒收 CSV + README 边界说明） | 下载后 `sha256 = 3b472ea6b2ab32df9c3abb594a94b2833674ebae716a3098dd948ac37dfb766c`，与页面展示、`DigitalDocument.encoding.sha256` 三处一致；`content-type: application/zip`；两次生成字节相同（ZIP_STORED + 固定时间戳/权限） |
| 下载事实表 | NVIDIA App / 游戏内补丁 / 第三方 swapper 镜像三行，第三方**不给链接、不背书** | 页面内 `thirdParty` 外链数 **0**；无「官方安装包 / NVIDIA 认证 / 无限免费」类措辞 |
| 内链 | `/` 与对比文章各一条锚文本 `DLSS 5 download` | 两页各 1 条，精确匹配 |
| 结构 | `DigitalDocument` + `MediaObject`（含 sha256），没有 `SoftwareApplication`；双语 | 中英各 1 个 `DigitalDocument`、`h1=1`、`main=1` |
| 闸门 | lint / 109 项测试 / build（含 `ARTICLE-MARKDOWN: PASS`）/ 旗舰页 / 无来源声明 / 保护名单 | 我复跑保护名单：`changed=0 down=0 FROZEN-OK`（基线由构建产物拍摄，线上一致，等于证明部署内容就是被验的那一份） |

**注**：`/download` 的文案跟随浏览器语言（`i18n` 检测），所以中文环境访问英文 URL 会看到中文区块——这是页面既有行为，不是本次新增的串台；`/zh/download` 由路由强制中文。英文语言环境下实测英文 CTA：`Download review materials ZIP (no installation)`。

**能力边界照旧**：ZIP 是审阅材料，装不进游戏；`dlss 5 download` 里「给我一个能跑 DLSS 5 的东西」这部分意图，我们仍然不满足也不假装满足。

## 6 原始数据

`docs/gsc-24h-20261023/` 下的 `*.json`（AX 原文）与三张截图：`queries-table.png`、`download-query-pages.png`、`download-page-row.png`。

## 7 28 天按查询拆分（2026-10-23 22:35 抓取）

原始数据：`docs/gsc-download-deepdive-20261023/`（`queries-28d-raw.json`、`queries-7d-raw.json`、`devices-24h-raw.json`、`pages-24h-raw.json`、`appearance-*-raw.json`，配套 `README.md` 记了每个窗口的界面口径与抓取时间）。属性 `sc-domain:dlss5nvidia.com`，按页面 `/download` 过滤，窗口 2026-09-24 → 10-21，**表内 50 个查询合计 407 点击 / 4,475 展示**；整页同一窗口 900 点击 / 1.11 万展示，差额是长尾查询，不是数据错。

### 7.1 意图簇

| 簇 | 查询数 | 点击 | 展示 | CTR | 占表内展示 |
|---|---:|---:|---:|---:|---:|
| 安卓 / APK / 手机（`apk`、`android`、`mobile`、`for android`、`descargar para android`） | 20 | 278 | 2,012 | **13.8%** | **45.0%** |
| DLL（`nvngx_dlss.dll` 等） | 5 | 12 | 288 | 4.2% | 6.4% |
| Studio | 3 | 15 | 233 | 6.4% | 5.2% |
| 非英文（西 / 葡 / 俄 / 阿 / 土 / 匈） | 8 | 35 | 386 | 9.1% | 8.6% |

单条最高 CTR：`dlss 5 android apk` 24.2%（排名 7.0）、`dlss 5 android download` 22.1%（5.7）、`dlss 5 mobile download` 21.4%（5.5）、`dlss 5 download for android` 19.7%（5.2）；最大展示 `dlss 5 download` 1,077 展示 / 49 点击 / 4.5% / 排名 10.5。

### 7.2 两个可动的结论

1. **手机意图占一半，但落地页首屏没有可点的东西。** 手机端 CTR 是桌面的 4 倍（24 小时设备表：手机 13 点击 / 124 展示 / 10.5%，桌面 5 / 205 / 2.4%），Cloudflare RUM 28 天 `/download` 也是 mobile 880 / desktop 510。但 390×844 实测原页面首屏 `main a` 与 `main button` 均为 0，第三个按钮在 3,942px。→ 处置见 §8。
2. **`dlss 5 download` 本体卡在排名 10.5，不是摘要问题。** 位置不动的话，页面语义这一层已经做完，剩下的是权重与外链（§5 已写）。

### 7.3 尚未服务的意图

`nvngx_dlss.dll` 相关的 5 个查询（288 展示 / 4.2% CTR）要的是「一个 DLL 文件」。我们的页面不给二进制，但也没有正面回答「这个 DLL 到底从哪来」。这是一个独立簇，值得单开一节，等 §8 观察完再动（一次只改一个变量）。

## 8 首屏动作面板（2026-10-23 上线）

依据 §7.2：手机访客占大头，首屏却没有任何可点目标。

- 改动（commit `ca28000`）：`src/components/DownloadActionPanel.tsx` 插在 `hero.sub` 与「At a glance」之间，三个 48px 高的动作——浏览器立即试用（`/dashboard?tool=game-character-style&sample=characterStyle`）、配方包 v2 ZIP（35 KB）、申请 Studio（`#request`）；说明行写明没有 APK、独立安装包未确认。预渲染 HTML（`scripts/prerender-seo.ts`）同步带上，中英双语。
- 我自己的线上复验（390×844，iPhone UA）：EN 面板 529–789、按钮 557–605 / 613–661 / 669–717；ZH 面板 417–677、按钮 445–493 / 501–549 / 557–605；两页 `anyLinkInFold` 各 3 条、`horizontalOverflow: false`、`h1=1`、`main=1`。
- 点击事件实测离开浏览器：`en=download_click&ep.surface=download_hero&ep.file=recipe-kit-v2`（GET `/g/collect`，属性 `G-2H65VD73K0`）。
- 保护名单：CHANGE-LOG 登记后重拍基线，`changed=0 down=0 FROZEN-OK`。
- 验收（7 天后，已并入 `gsc_download_query_followup`）：SERP 侧仍看 `dlss 5 download` 平均排名 ≤ 8.0、CTR ≥ 3.5%；面板侧只报三个事件的量与 `/dlss-5-apk` 的展示变化，不设达标线。
