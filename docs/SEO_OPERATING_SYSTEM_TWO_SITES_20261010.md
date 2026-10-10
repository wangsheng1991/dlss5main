# 两站 SEO / GEO 运营系统（dlss5nvidia.com + dlss5.app）

日期：2026-10-10
状态：首版运行边界与任务队列，默认只产出草稿和 PR，不自动发布外部内容。

## 结论

这四个开源项目不应被整包拼成一个“自动发文器”。最稳妥的组合是：

1. **Marketing Skills 作为工作方法与周期**：使用它的 product context、SEO operator、claims ledger、query map、work queue 和 PR 审核边界。
2. **SEO Machine 只借用研究与旧文更新流程**：它的发布适配器面向 WordPress/Yoast，而两个站是 Vite/Vercel，不能直接接入发布步骤。
3. **pSEO Engine 只作为受控的选题/来源采集实验**：先输出 YAML brief 和待审草稿，不接生产 sitemap 或自动发布。
4. **Models.dev 作为模型元数据参考源**：可用于名称、提供商、能力和价格的基础记录；DLSS 5 显卡支持、我们自己的耗时和产品能力必须继续使用 NVIDIA/本站可核实证据，不能用 Models.dev 代替。

依据：Marketing Skills 的 `marketing-loops` 已把每周 SEO 扫描、事实台账、查询映射、机会队列和 PR 默认审核写成持续运行配方（[仓库](https://github.com/coreyhaines31/marketingskills)，版本说明 [v2.11.19](https://newreleases.io/project/github/coreyhaines31/marketingskills/release/v2.11.19)，核对 2026-10-10）；SEO Machine 明确使用 GA4/GSC/DataForSEO，并以 WordPress REST/Yoast 为发布目标（[README](https://github.com/TheCraigHewitt/seomachine)，核对 2026-10-10）；pSEO Engine 的定位是带人工审核门的 YAML 关键词矩阵、来源采集和草稿流水线（[README](https://github.com/m0ntydad0n/pseo-engine-oss)，核对 2026-10-10）；Models.dev 提供模型目录 API，但不是 DLSS 兼容性证据（[README](https://github.com/anomalyco/models.dev)，核对 2026-10-10）。

## 两站分工与正本

| 站点 | 负责的问题 | 正本查询簇 | 主要转化 |
| --- | --- | --- | --- |
| `dlss5nvidia.com` | 在线转换、视觉增强、人物风格、API、DLSS5 Studio 下载与教程 | `dlss 5 online`、`dlss 5 image converter`、`dlss 5 image generator`、`dlss 5 visual enhancer`、`dlss 5 download` | 体验免费示例 → 上传/注册 → 成功生成 → 下载/付费 |
| `dlss5.app` | 显卡兼容性、逐型号证据、FAQ、状态解释、硬件长尾 | `dlss 5 supported cards`、`dlss 5 gpu`、`dlss checker`、`dlss 5 compatibility`、`RTX <model> DLSS 5` | 查卡 → 查看来源 → 回到产品工作流 |

主站不再复制 `.app` 的型号证据表；`.app` 不再复制主站的工具落地页。跨站链接必须回答下一步问题：型号页指向对应工具/下载页，工具页指向显卡证据页。共享品牌实体、统一 canonical 主机和当前 GPU 一致性脚本继续作为发布门禁。

## 共享数据契约

运营系统的每条记录都必须能落到以下对象；没有来源或没有产品入口的记录不进入发布队列。

```yaml
claim_id: dlss5-gpu-rtx5090-status
site: app                 # app | nvidia
page: /en/gpu/rtx5090
primary_query: RTX 5090 DLSS 5 support
intent: evidence          # evidence | workflow | comparison | download
claim: "status text shown on the page"
source_url: https://...
source_type: official-nvidia # official-nvidia | measured | product-fact | derived
checked_at: 2026-10-10
review_after: 2026-11-10
evidence_level: official
product_cta: https://www.dlss5nvidia.com/models
owner: seo-operator
```

另外维护四张表：

- **query map**：每个页面只能有一个 primary query，记录 7/28 天展示、点击、CTR、排名和当前页面。
- **page registry**：URL、站点、语言、canonical、页面类型、对应工具、是否在 sitemap、最近复审日期。
- **claims ledger**：产品事实、GPU 状态、测量数字、来源和失效日期；页面正文与 JSON-LD 只能引用台账。
- **work queue**：按“预期成功生成数 / 修改小时”排序，记录证据、改动、验证结果和未完成项。

现有主站事件口径已经能承接这条漏斗：`page_view → experience_click → generation_start → generation_success/failure → download_click`，并保留 `utm_*` 首次来源；不发送图片、提示词、文件名、邮箱或 token。`.app` 目前没有同等的行为统计脚本，先以 GSC + 链接 UTM 作为入口层数据，新增行为采集前先做隐私评估。

## 首轮队列（不自动发布）

### P0：每次运行必做

1. 读取两站 sitemap，检查每个 URL 的 HTTP、title、description、canonical、hreflang 和是否被声明为 noindex。
2. 读取主站 GSC 7/28 天查询与页面，更新 query map；重点监控 `image converter`、`online`、`image generator`、`visual enhancer`、`download`。
3. 读取 `.app` 的 URL Inspection 变化，优先处理“新页面未识别”和真实 canonical 冲突；已在验证队列的 URL 不重复提交。
4. 运行 `.app` 的 `npm run check:consistency`，确保共同 GPU 型号的显存/状态与主站为 0 处冲突；未覆盖的型号保持显式 coverage gap，不把未知变成支持。

### P1：每周一次

1. 从 GSC 选出排名 8–20 且有展示的页面，先改首屏答案、证据链接和 CTA，再考虑新建页面。
2. 选 5 个真实选题：主站 3 个工具/用例，`.app` 2 个硬件/证据长尾；每个选题必须填写来源、独立信息增量、目标工具和避免重复的理由。
3. 为同一主题生成一份教程、一份真实案例/对比、一份社区草稿；三者共享 claim_id 和 UTM campaign，不自动发帖。
4. 复核跨站内链：主站工具页 → `.app` 对口证据页；`.app` 型号页 → 主站对应工具或 `/download`。

### P2：每月一次

1. 复查过期事实、价格、模型名、驱动和测量日期；无新证据不更新 `lastmod`。
2. 对照 28 天 GSC 与成功生成事件，决定页面是继续、改写还是停止；只有曝光不等于需求成立。
3. 汇总外部素材带来的 `utm_source / utm_campaign → generation_success → download_click`，播放量只作辅助指标。

## 内容生产与发布闸门

每个候选页面或素材必须通过以下顺序：

1. **事实检查**：关键数字有来源或标记为 measured/derived/unknown。
2. **意图检查**：页面首屏只回答一个主要问题，并给一个主要体验入口。
3. **站点归属检查**：查询属于主站还是 `.app`；交集主题必须改写角度或明确正本，不能两站自指互抢。
4. **技术检查**：唯一 title/H1/description/canonical、可抓正文、结构化数据与 sitemap 一致。
5. **转化检查**：CTA 带 UTM；成功事件与失败事件分开，点击按钮不算生成成功。
6. **人工审核**：先生成 PR/草稿和逐项验证证据；正式部署、外部发帖、联系创作者和花钱仍需王胜确认。

## 第一轮验收

首轮不追求大量页面，连续运行两次即可证明系统有效：

- 第一次：从现有 GSC 查询生成 5 个机会，完成 1 个主站页面更新、1 个 `.app` 证据页更新和 3 份分发草稿。
- 第二次：读取第一次的变化，淘汰无展示/无开始体验的选题，保留带来成功生成的组合；不能只报告“生成了多少文章”。
- 每次输出固定三段：**改动清单、验证证据、未完成项/需本人决定项**。

## 不做的事

- 不批量复制 `.net` 的页面规模，不为关键词制造空壳页。
- 不把 Models.dev、社区帖子或模型宣传页当作 NVIDIA DLSS 支持证据。
- 不自动向 Reddit、Bluesky、GitHub、邮件或创作者账号发布内容。
- 不把 sitemap URL 数、lastmod 或“已提交请求”写成 Google 已收录或带来流量。

## 从 dlss5.net 抢同一批需求的做法

目标不是复制 `.net` 的页面，而是用两个站把同一搜索需求拆成“证据 → 工具”的完整答案。`.net` 的公开首页/页面结构已经证明 `supported cards`、`games`、`download`、`evidence tracker`、按型号页和多语言入口是有搜索意图的页面类型；我们用更强的证据和可运行结果承接它们：

1. **先抢兼容性长尾**：`.app` 的 31 个型号页、`supported-cards` 和三语 SSR 是入口。每张卡显示 VRAM、架构、状态、来源和复审日期；缺来源就显示 unknown。页面底部只放一个相关工具入口，把“这张卡能查什么”送到主站。
2. **再补游戏/证据 hub**：`.app` 计划中的 games/evidence 页面只能使用 NVIDIA 官方文章和发布日期。NVIDIA 2026-03-16 的公告列出首批将支持的游戏，2026-09-01 的上线文章确认 NBA 2K27 已可用，且 DLSS 5 面向 RTX 50 系列桌面卡和笔记本；这些页面应把“已发布”“即将支持”“开发者宣布”分开，不把名单全部写成已上线。来源：[NVIDIA GTC 公告](https://www.nvidia.com/en-gb/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/)、[NBA 2K27 上线说明](https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/)、[官方开发者/游戏名单 PDF](https://nvidianews.nvidia.com/_gallery/download_pdf/69b84ccd3d63329dc60e9f04/)，核对 2026-10-10。
3. **把 download 意图交给主站**：`.app` 的 Studio 证据页只解释运行条件和证据边界，CTA 指向主站 `/download`；主站明确“本站工具”和 NVIDIA 官方软件不是同一件事，避免用下载词抢到错误承诺。
4. **用主站吃转化词**：主站首页、`/image-quality-enhancer`、`/dashboard`、`/download` 负责 `online / image converter / image generator / visual enhancer / download`。这些页面已有 7 天 GSC 点击/展示基线，改动优先看 CTR 和成功生成，不再给 `.app` 复制一份工具页。
5. **两站互相导流但不互相稀释**：`.app` → 主站用“用这张卡运行转换 / 查看 Studio 条件”等主题锚文本；主站 → `.app` 用“查看 RTX 5090 来源 / 检查兼容性证据”等主题锚文本。所有外部分发链接统一带 `utm_source`、`utm_medium`、`utm_campaign`，但不把点击或 sitemap 提交当作生成成功。

可验收的超越指标不是“页面数超过 .net”，而是同一查询簇的合格访问、成功生成和回访。首个 28 天实验门槛：每个渠道至少 100 次可归因到站；若只有展示没有点击改标题/素材，若有到站没有开始体验改首屏，若开始多但成功少修生成链路。样本不足时只写“证据不足”。
