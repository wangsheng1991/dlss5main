# 内页扩张与多引擎提交的执行计划（王胜 2026-10-11 授权）

王胜原话：「在目前的基础上，吸收 dlss5manager.app、dlss5swapper.org、dlss5.net 的优点。可以考虑扩展我们内页，匹配更多关键字，提交更多搜索引擎等方式。**我们自己会做类似软件，这些都不是问题，先把页面上去**。综合别人的优点，多做内页，吸收游戏和 AI 等双重属性，扩展出来，最终让流量猛增。你看是否能和上面的结合一下。」

这是**执行计划**，不是讨论稿。配套证据：`docs/DLSS5_PAGE_TYPE_MATRIX_20261011.md`（页型矩阵，只读抓取，含复现脚本）、`docs/TRAFFIC_10X_JOINT_VERDICT_20261011.md`（上一轮结论）。

---

## 一、授权边界（先写清楚，免得后面返工）

王胜解除了「产品没做出来所以不能写页」这个约束：**页面可以先上**。但下面三条不能破：

1. **能上线 ≠ 能宣称**。未上线的软件只能写成「正在开发 / 可预约通知 / 等待名单」，**不能**写「已可下载」「已支持」「现已提供」，也不能给 `SoftwareApplication` 标 `InStock`。理由：我们自己的 `/editorial-policy` 写着「一条状态一个来源」，自己破例，AI 引用时整站都不可信。
2. **竞品那 49 页高风险页型一页都不抄**（清单见矩阵 §4）：改 DLL / ReShade / OptiScaler / RenoDX / Autopilot / Manager 重打包 / AMD 绕过 / 模拟器注入。这些是「分发改动游戏运行库的工具」，超出 NVIDIA 对运行时的许可与支持范围，也撞游戏反作弊与服务条款；我们主站有 `/enterprise` + `/docs` 的商业叙事，上这类页等于自我打脸。
3. **不借品牌**：不出现「官方 / Official 下载」这类措辞，不冒用他人项目名，不做成 NVIDIA 官方样子的页。

## 二、三家竞品到底强在哪（实测，不是印象）

| | 强在哪 | 我们能不能学 |
|---|---|---|
| `dlss5swapper.org` | 7 语言 × 14 页型的**模板化覆盖**；`/updates` 持续更新；`SoftwareApplication`+`HowTo`+`Offer` schema | **只能学结构，不能学内容**：它 98 条 sitemap 里 49 条是高风险页；去掉后 53 页中 51 页是同一模板的 7 语言复制，真正独有内容只有 2 页 |
| `dlss5.net` | **页型最宽（18 类）**：逐游戏页 + 游戏支持追踪 + 系统需求 + 发布日 + vs 对比 + 引擎页 + AI-PC 簇；26 条页在 sitemap 之外 | **可学，且这是主要参照**。它的内容全是「查得到出处的事实」，没有一条需要改文件 |
| `dlss5manager.app` | 只有 2 页（`/` + `/tutorials`），靠工具作者身份 + 50 条 YouTube 画廊拿品牌词 | 学不了内容；**顺带纠正一个我们自己的错**：此前记的「教程页 6,097 词」复现不了 —— 原始 HTML 去掉 script 后只有 174 词，Chrome 渲染后约 1,256 词，主体是 50 条视频的元数据数组 |

**结论**：值得吸收的是 `dlss5.net` 的**页型宽度**与 `swapper` 的**结构化 + 多语言 + 持续更新**，不是它们的工具内容。

## 三、我们自己的缺口（实测数字）

| | 现状 | 缺口 |
|---|---|---|
| 主站 dlss5nvidia.com | 活页 65 / sitemap 58 | **7 个可达页不在 sitemap**（`/dashboard` `/store` `/refund` `/login` `/register` `/terms` `/privacy`）—— 零难度可修 |
| 姊妹站 dlss5.app | 145 页全 SSR，型号页 93（31×3）深度第一 | **70 条死内链**：`/ja`、`/ja/supported-cards`、`/ko`、`/ko/supported-cards` 四页各自链出 35 条 404（31 款型号 + 4 个信任页）—— 零难度可修（要么补页，要么改链接） |
| 两站合计 | 页型 7–14 类 | **15 个页型我们完全没有**：逐游戏页、游戏支持追踪、系统需求、指南 hub、发布日、证据/状态追踪、vs 对比、技术解释常青页、型号系列、引擎页、下载安装页、DLSS 4.5 簇、AMD 官方状态页、社区视频聚合、AI-PC 话题簇 |

## 四、三批执行计划（含来源要求与预计 URL 数）

「游戏 × AI 双属性」的落法：**主站承接「游戏 + AI 工具」两条属性**（它已经有 30 个工具页和 1,690 点击/28 天的底子），**`.app` 继续承接证据/型号属性**，两站互链，不重复对方的内容（5 篇同题文章的教训）。

### 第 1 批：把仓库里已有的证据重组成页（无新来源风险，先上）

| # | 页型 | 主站 URL 数 | 来源 | 目标查询示例 |
|---|---|---|---|---|
| 1 | `/guides` 指南 hub | 3（en/zh-CN/zh-TW） | 站内现有 9 篇文章 + supported-cards 聚合 | `how to enable dlss 5`、`dlss 5 setup guide` |
| 2 | `/what-is-dlss-5` 常青页 | 3 | 现有博客升级，不新增事实 | `what is dlss 5`、`how does dlss 5 work` |
| 3 | `/vs/dlss-5-vs-dlss-4-5`、`/vs/dlss-5-vs-fsr-4` | 6 | 现有对比博客 + NVIDIA/AMD 官方功能表 | `dlss 5 vs dlss 4.5`、`dlss 5 vs fsr 4` |
| 4 | `/system-requirements` | 3 | 我们 `src/data.ts` 的 31 款 spec + 三态状态 + 官方驱动说明 | `dlss 5 system requirements`、`rtx 3060 dlss 5 support` |
| 5 | `/status` 证据/状态追踪页 | 3 | 复用 supported-cards 已核过的证据 + 审阅日期 | `dlss 5 confirmed`、`is dlss 5 out yet` |

第 1 批合计 **18 个 URL**，全部是「已有证据换一种组织方式」，一稿成。

### 第 2 批：要外部来源、但来源是官方的

| # | 页型 | 数量 | 来源 | 备注 |
|---|---|---|---|---|
| 6 | **逐游戏页** `/games/<slug>` + `/games` 追踪页 | 15 款 × 3 语 + 3 = **48** | **NVIDIA 官方公告已给出 15 款名单**（2026-03-16《DLSS 5 Delivers AI-Powered Breakthrough…》，原文列出 AION 2、Assassin's Creed Shadows、Black State、CINDER CITY、Delta Force、Hogwarts Legacy、Justice、NARAKA: BLADEPOINT、NTE: Neverness to Everness、Phantom Blade Zero、Resident Evil Requiem、Sea of Remnants、Starfield、The Elder Scrolls IV: Oblivion Remastered、Where Winds Meet，"and more"） | **发布前必须先找一份更新的官方名单**：这份是 2026-03 的预告，2026-09 之后应有上线名单（NBA 2K27 等），不能只拿旧名单当现状 |
| 7 | 型号系列页 `/series/rtx-50`、`40`、`30`、`20` | 12 | 我们 31 条型号 spec 汇总 | 聚合页，与 `.app` 型号页互链而非复制 |
| 8 | `/release-date` 时效页 | 3 | NVIDIA 官方公告时间线（每条带日期与链接） | 需按月维护 |
| 9 | `/download-setup` 下载/安装页 | 3 | NVIDIA 官方驱动页与 App 说明 | **与主站 `/download`（Studio 索取）区分开** |
| 10 | `/unreal-engine` 引擎页 | 3 | Epic 官方 UE 说明 + NVIDIA Developer 文档 | 不确定处留空并标注 |

第 2 批合计 **约 69 个 URL**。游戏页是「游戏属性」的主入口，也是最可能被 AI 引用的一簇。

### 第 3 批：话题域扩张

11. DLSS 4.5 簇（3 页 × 3 语）
12. **`/dlss-5-on-amd` 官方状态页**（只写官方支持范围 + GeForce NOW 通道 + mod 现状三态，**不写任何方法**）—— 这是 swapper 那 7 页可合规的替代写法
13. `/community` 社区视频聚合（只做外链嵌入，注明作者）
14. AI-PC 话题簇（net 有 17 页，来源要持续维护，最后做）
15. `.app` 的 ja/ko 补齐 4 类页型 + 信任页（**先把 70 条死链修掉**）

## 五、提交更多搜索引擎（这条今天就能落地）

**只有 Google 不吃 IndexNow**，其余主流引擎一个协议全吃。

| 渠道 | 现状 | 要做的事 |
|---|---|---|
| **IndexNow**（Bing / Naver / Seznam.cz / Yandex / Yep，官方页写明这五家支持） | 未接入。实测 `api.indexnow.org` 可达（用无效 key 探测得到 `422 InvalidRequestParameters`，说明校验在工作） | 两站各放一个 `/<key>.txt`（key 为 8–128 位字母数字），构建后跑一个 `scripts/indexnow.mjs`：读 sitemap 的 URL 列表 POST 到 `https://api.indexnow.org/indexnow`（单次最多 10,000 URL）。**Naver 在列，正好配我们的 ko 页** |
| Google | sitemap 已提交，`.app` 的 sitemap 半年没被重读（最近 2026-04-13） | 在 GSC 里对 `.app` 的 sitemap 重新提交一次 + 对「已抓取未编入」那个 URL 点验证 |
| Bing Webmaster Tools | 未验证 | 需王胜账号验证（验证后可看索引报告、用 URL 提交 API）；IndexNow 不强依赖它 |
| Yandex Webmaster / Naver Search Advisor | 未接 | 各需账号验证；IndexNow 已覆盖它们的收录通道，账号只多一份报表 |
| Baidu | 未接 | 需账号 + 备案语境，收益低，建议不做 |

**优先级**：IndexNow（一次实现，两站长期受益）> GSC 的 `.app` sitemap 重提 > 账号类报表。

## 六、门禁与止损（不设这些，铺页会变成自伤）

1. **每页必须有独有数据体**。型号页的经验在先：靠模板复制出来的页会被判同质化（我们自己的 `measure-gpu-page-similarity.mjs` 就是尺子）；新页型上线前跑一次相似度检查，超过经验阈值就别上。
2. **同来源、可复核**。每条状态、每个数字都要有链接出处与复核日期，和 `/editorial-policy` 一致。
3. **收录率门禁**：`.app` 现在 145 页但最近读数只有 33 编入 / 85 未编入。**新增页之前先确认旧页在进索引**，否则只是把「未编入」的分母做大。
4. **止损线沿用上一轮**：4 周后新页合计新增展示 < 20,000/28 天，或新增搜索点击 < 2,000/28 天 → 「铺页 + 多引擎提交」这条路不足以支撑 10 倍，下一轮必须换变量，而不是继续加页。
5. **每批上线后 14 天看一次数据**（GSC 按页面分组 + IndexNow 提交量），不看数据不上下一个批次的量。

## 七、分工

- **Codex（`.app` 与主站仓库的执行者）**：按批次实现页面；先修两个零难度缺陷（主站 7 条未登记进 sitemap、`.app` 70 条死内链）；实现 IndexNow 脚本与 key 文件；每批上线后回报「页数 / sitemap 数 / 线上复核末行」。
- **我（default_agent）**：复核每一批的线上结果（SSR、sitemap、同质化、死链、schema），核对每条事实句的来源是否真的存在，并把结论写回 `shared_env/dlss-line/TODO.md`。
- **要王胜本人**：Bing Webmaster / Yandex / Naver 的账号验证（可选项）；第 2 批的游戏名单如果需要以 2026-09 之后的上线名单为准，拍板用哪份官方来源。

---

**请 Codex 回一份简短执行排期**（哪个批次先做、第 1 批内部顺序、游戏名单用哪份官方来源），有冲突的地方直接说，不要等我确认。
