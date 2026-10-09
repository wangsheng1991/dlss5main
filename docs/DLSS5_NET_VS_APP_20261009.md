# DLSS5.net 与 DLSS5.app：抓取、SERP 与流量差异复核

观察窗口：2026-10-09 至 2026-10-10（Asia/Shanghai）。

本文只记录分析，不修改 `dlss5.net`、`dlss5.app` 或 `dlss5nvidia.com` 的代码、DNS、sitemap 和 Search Console 设置。SERP 是一次美国英文环境的 Google 快照；Google 会把 AI Overview、People Also Ask、视频、论坛串合在一起，下面的“位置”因此标为可复核的可见有机结果顺序，而不是把混合模块误当成精确排名。

## A. 事实

### A1. 资产归属的决定性判定

- **结论：`dlss5.net` 不是当前账号可见的 Search Console 资源，按第三方竞品处理。**【实测】2026-10-09/10 在已登录的 Google Search Console 资源选择器中看到的域名资源为 `alphanetplus.com`、`dlss5.app`、`dlss5nvidia.com`、`gpst-image2.com`、`houseplusplus.com`、`image2lego.com`，另有 `https://image2lego.com/` URL 属性；列表没有 `dlss5.net`。资源入口：[Google Search Console](https://search.google.com/search-console)。这不能证明任何法律上的所有权，只能证明该 Google 账号当前没有该资源。
- **结论：不能用本账号的 GSC 数据证明 .net 的“暴涨”。**【推断】没有 .net 资源权限，也没有公开的 .net 点击曲线、查询明细或来源报表；因此“暴涨”仍是待验证的描述，不是本轮已经证实的指标。

### A2. 三个站的抓取与规模差异

- **`dlss5.net` 的首页是服务端可读正文。**【实测】2026-10-09/10 读取 [首页](https://www.dlss5.net/) 得到 HTTP 200、约 147,161 字节；Next.js/Turbopack 资源存在，但标题、H1、H2、FAQ 和显卡内容已经在初始 HTML 中，不依赖执行 JavaScript。标题为 “DLSS 5 Supported Cards & GPU Compatibility Checker”，H1 为 “DLSS 5 Supported Cards & GPU Checker”。
- **`.net` 的页面结构直接覆盖兼容性搜索意图。**【实测】首页包含 “What is DLSS 5?”、“DLSS 5 Supported Cards & GPU Compatibility”、“DLSS 3 vs 4 vs 4.5 vs 5” 和 FAQ；页面输出 `FAQPage`（8 组问答）、`WebApplication` 与 `Offer` JSON-LD。页脚、About、Contact、Privacy、Editorial Policy、Sitemap 也形成了可爬的站内结构。证据：[首页](https://www.dlss5.net/)、[About](https://www.dlss5.net/about)、[Editorial Policy](https://www.dlss5.net/editorial-policy)。
- **`.net` 的站点地图规模明显大于 `.app`。**【实测】2026-10-09/10，[`.net sitemap.xml`](https://www.dlss5.net/sitemap.xml) 返回 38 个 `<loc>`，包括 `/dlss-5-supported-cards`、`/dlss-5-games`、按游戏的页面、指南、葡萄牙语路径及信任页面；已知 `.app` sitemap 为 16 个 `<loc>`（8 个页面 × 英文/中文）。数量差异本身不是质量证明，但代表可覆盖的搜索意图更多。
- **`.app` 首页初始 HTML 几乎没有可索引正文。**【实测】2026-10-09/10，`https://dlss5.app/` 返回 200、约 1,357 字节，主体为 `<div id="root"></div>`，正文和工具需要浏览器执行 JavaScript；全站初始 `<title>` 为 `NEURAL ARCHITECT | DLSS 5`。这会削弱无 JS 抓取、首屏语义和分享预览，但不能单独解释全部流量差异。

### A3. `.net` 的可信度、更新时间与同构域名信号

- **`.net` 明确声明自己是独立站。**【实测】页脚和 [About](https://www.dlss5.net/about) 写明 independent/not affiliated with NVIDIA；作者/创建者为 “DLSS 5 Checker Editor”，并说明工具匹配用户输入的显卡型号，不扫描本机或测量性能。不能把它当作 NVIDIA 官方站。
- **`.net` 有可见的时间与编辑信号。**【实测】[About](https://www.dlss5.net/about) 显示 “Last reviewed: September 5, 2026”，[Editorial Policy](https://www.dlss5.net/editorial-policy) 显示 “Last checked September 5, 2026”；About 叙述站点从 2026-03-16 NVIDIA GTC 公告后的信息混乱中产生。站点地图只写 `changefreq`/`priority`，没有 `lastmod`，所以不能从 sitemap 推算逐页更新时间。
- **Wayback 只能确认至少有一个 2026-09-25 快照，不能证明它是第一次抓取。**【实测】2026-10-09/10 调用 Internet Archive availability API `https://archive.org/wayback/available?url=dlss5.net%2F` 返回最近可用快照 `20260925093017`（重放地址为 `https://www.dlss5.net/`）。CDX 服务当时返回 “Temporarily Offline”，所以没有拿到完整历史序列；“新站红利”仍属待核实。
- **同名域名排查没有证明同一站长。**【实测】2026-10-09/10：`dlss5.com` 返回 Cloudflare 403；`dlss5.org` 返回 HTTP 200、标题 “DLSS 5: Everything You Need to Know”，但未发现与 `.net` 相同的 AdSense/Plausible 标识；`dlss5.io`、`dlss5.ai` 在本次出口下没有可用响应。仅凭域名相似不能合并为同一模板或同一运营者。
- **`.net` 有可见的外部引用/目录收录，但不是流量归因。**【实测】2026-10-10 的公开搜索结果出现 [LinkedIn 建站帖](https://www.linkedin.com/posts/gyaansetu-webdev_activity-7439855864691281920-yE1p)、[Smartees](https://smartees.tech/t/dlss5-checker)、[AISO Tools](https://aisotools.com/tool/dlss-5-checker)、[The Hack Stack](https://www.thehackstack.com/product/14e07a9b-1ed8-47dd-8274-5ae30ee1651d) 和 [Forocoches](https://forocoches.com/foro/index.php?showthread.php?page=2&t=10796479) 等页面/帖子。它们说明有人发现或转载了该工具，但没有给出点击量、链接属性、发布时间链或因果归因；不能据此声称“外链带来了暴涨”。

### A4. `.app` 的 Search Console 现实数据

- **最近 3 个月：29 次点击、1,779 次展示、CTR 1.6%、平均排名 12.4；报表显示最新图表日期 2026-10-06、数据更新时间约 25.5 小时前。**【实测】2026-10-09/10 在 [`.app` 效果报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adlss5.app)读取。
- **与 `.net` 同义的查询已经出现，但规模很小。**【实测】同一 3 个月窗口：`dlss 5 supported cards` 1 点击/8 展示/平均排名 46.5；`dlss checker` 0/27/平均排名 7.1；`dlss 5 welche grafikkarte` 0/5/平均排名 32；`dlss 5 architecture` 1/7/平均排名 9.9；`dlss 5 gpu` 无数据。前十中还出现 `dlss 5 vs fsr 4` 0/72、`neural rendering` 0/24、`fsr 4 vs dlss 5` 0/22。这个结果说明主题相关性开始被识别，但不能说 `.app` 已经抓住 `.net` 的排名。
- **作为已知基线，`.app` 7 天/28 天仍远低于主站。**【实测，上一轮 GSC 记录】`.app` 7 天 1 点击/33 展示，28 天 6 点击/252 展示；`dlss5nvidia.com` 同窗口为 659/6,510 与 1,690/约 17,700。两个站的产品和页面目的不同，不能把主站数据直接外推给 `.net`。

## B. Google US/English SERP 实测表

查询地址均使用 Google `gl=us&hl=en&num=20&pws=0`；观察位置为 2026-10-09/10，浏览器出口定位显示 Oregon, US。`—` 表示在可见前 20 结果中没有该域名，不代表全网没有收录。

| 查询 | 首位/首个主要结果类型 | `dlss5.net` | `dlss5.app` | `dlss5nvidia.com` | 读法 |
|---|---|---:|---:|---:|---|
| `dlss 5 supported cards` | Reddit / r/nvidia 讨论组（AI Overview 也引用社区与 `.net`） | 约有机 #4；同时是 AI Overview 来源 | — | — | `.net` 抓到的是卡型/兼容性长尾，不是 `dlss 5` 大词 |
| `dlss 5 gpu compatibility` | 兼容性工具/指南类页面 | **有机 #1**，带 supported-cards、games、download、guides 站内链接 | — | — | 这是最直接的 `.net` 优势词 |
| `dlss 5 download` | GitHub 工具/项目（AI Overview 另引 NVIDIA 官方） | — | — | — | 下载词竞争对象是官方、GitHub、视频和 Mod 项目；没有看到三站进入可见前 20 |
| `dlss 5 amd` | GitHub AMD 路径/Mod 项目 | — | — | — | 该词意图偏“能否在 AMD 上运行/社区方案”，不是 `.net` 兼容表的直接胜场 |
| `dlss checker` | Reddit / r/nvidia 讨论，随后 People Also Ask | 约有机 #2–3 | — | — | `.net` 可见，但查询仍由社区讨论吸引首屏注意 |
| `dlss 5` | NVIDIA 官方文章（AI Overview 也由 NVIDIA 主导） | — | — | — | 头部品牌词不是 `.net` 的流量解释；主站域名 `dlss5nvidia.com` 也没有出现在可见前 20 |

**B 的一句话结论：**SERP 支持“.net 通过结构化的 supported cards / GPU compatibility / checker 长尾获得可见性”，不支持“它已经赢得 `dlss 5` 大词”或“SERP 已证明流量暴涨”。`.app` 和 `dlss5nvidia.com` 在这六个可见快照中均未出现；`.net` 只在兼容性/检查器意图中明显出现。

## C. 差异 checklist：`.net` 有、`.app` 当前缺或较弱

| 能力 | `.net` | `.app` 现状 | 影响判断 |
|---|---|---|---|
| 服务端正文 / 可抓取首屏 | 首页正文在初始 HTML | 首页约 1,357 字节，主要是 `#root` | **高**：无 JS 抓取和分享预览先天吃亏 |
| 每页独立 title/description | 首页与深层页有明确标题/描述 | 已知全站初始 title 为 `NEURAL ARCHITECT \| DLSS 5` | **高**：意图与页面无法在 HTML 层区分 |
| FAQ 可见正文 + `FAQPage` | 8 组问答和 JSON-LD | 本轮未在初始 HTML 看到同等内容 | **中高**：能覆盖问题型长尾并增强语义 |
| 硬件兼容数据 | supported cards、system requirements、按 GPU/系列的内容 | 目前没有与 `.net` 同等的可爬兼容性落地页 | **高**：正好对应 `.app` 已出现的 `supported cards` / `checker` 展示 |
| 游戏/指南/专题分页 | games、guides、证据追踪、葡语页等 | sitemap 16 条，以英/中 8 个页面为主 | **中**：规模可带来意图覆盖，但只有独立价值页面才有用 |
| i18n 路由 | 至少英文、葡萄牙语及葡语专题路径 | 已知英文/中文路径 | **中**：本地化应服务真实查询，不应复制薄页 |
| 内链 | 首页 → supported cards → games/guides/evidence → 信任页 | 初始 HTML 没有可见内链网络 | **高**：影响发现、主题聚类和爬行路径 |
| 更新时间/编辑政策 | About/Editorial Policy 有 reviewed/checked 日期 | 初始 HTML 无同等编辑信号 | **中**：兼容性数据容易变化，更新口径有助信任 |
| 站点规模 | sitemap 38 个 `<loc>` | sitemap 16 个 `<loc>` | **低到中**：数字本身不是排名目标 |
| 广告/分析 | AdSense + 自建 Plausible | 两站此前未发现 AdSense | **不应作为 SEO 原因**：变现代码不能证明排名或流量因果 |

## D. 最小改造优先级

### 给 `dlss5.app`

1. **先做首页与关键入口的 SSR/预渲染正文。** 让无 JS 请求能看到 H1、用途、限制、示例和唯一主 CTA；先覆盖首页、`supported cards/checker` 意图页和一个比较/指南页。原因是一次改动同时修复抓取、分享卡片、首屏解释和内容可见性，收益最大且不需要扩张站点数量。
2. **为每个已存在路由生成独立 title、description、canonical、hreflang 和 H1。** 先解决同一 title 造成的意图混淆，再谈新增页面；canonical 必须指向自身语言/路径，避免重复页。
3. **把 FAQ 写进静态正文，再加与正文一致的 `FAQPage` JSON-LD。** 只标记真实可见问答；不要把 schema 当成隐藏关键词容器。
4. **做一个真实可用的 `/supported-cards` 或 `/dlss-checker` 落地页。** 提供 GPU 输入/筛选、明确的 confirmed/planned/unsupported 证据状态、版本和核查日期，并让结果链接回主转换功能。先做一页高价值工具，不要直接复制 `.net` 的 38 个 URL。
5. **补内链和 sitemap，但只纳入有独立答案的页面。** 首页链接到 checker、指南、案例和产品入口；checker 链到对应 GPU/游戏说明；每个页面回链一个明确 CTA。规模从 16 增加到多少，应由独立搜索意图和维护能力决定。
6. **补 About/Editorial/更新时间和来源说明。** 兼容性结论标注来源、检查日期、适用版本与“不代表 NVIDIA 官方”；这是内容可信度修复，不是装饰。
7. **再做分析与变现实验。** 先确认页面能被抓、能获得展示并带来成功使用，再考虑广告；不要把 AdSense 或脚本复制当成获取排名的办法。

### 给 `dlss5nvidia.com`

- **暂不照抄 `.net` 的页面规模或广告。** 主站已经有服务端/预渲染 SEO 基础，上一轮 GSC 同窗口为 7 天 659 点击/6,510 展示、平均排名约 7，当前风险是改动已赚钱页面造成 canonical、路由或转化回退。
- **可以做低风险的只读审计。** 如果产品确实能提供独立的“DLSS 5 supported cards / compatibility”答案，再评估一页有来源、有日期、明确非官方关系的兼容性说明，并从现有转换工具/下载页做一条相关内链；先做差异和重复检查，不能因为竞品有 38 条 URL 就批量复制。
- **不建议将 `.net` 的 `Offer`、AdSense 或“下载”话术当作主站策略。** 主站产品路径是转换/生成和 Studio 下载，兼容性参考只能服务用户决策，不能混淆为 NVIDIA 官方软件或本站 DLSS 运行时。

## E. 分歧清单（请王胜裁决）

1. **“流量暴涨”是否已经成立：不同意直接下结论。** 目前只有 `.app` 和主站 GSC 数字；`.net` 没有账号数据。SERP 证明了长尾可见性，不证明点击曲线或增速。
2. **“初始 HTML 空壳就是全部原因”：部分同意。** SSR/预渲染是高优先级、可验证的技术差异，但外部引用、查询意图、页面数量、域名历史和内容质量也可能共同决定曝光。
3. **“把 `.app` 复制到 38 个页面就能追上”：不同意。** 站点规模只是机会数量；薄页或重复页会增加维护、canonical 和索引风险。应先做一页真正能回答 supported-cards/checker 意图的工具页。
4. **“AdSense 说明 `.net` 更容易起量”：不同意。** AdSense 是变现与脚本信号，不是排名机制；公开代码也不能证明收入或所有权。
5. **“`.net` 可能是我们账号下的资产”：已被当前证据否定。** GSC 资源列表没有该域名，应按第三方站点处理；除非以后由账号管理员提供新的独立证据。
6. **“主站也应马上大改成竞品结构”：不同意。** 主站已有较高自然点击和平均排名，适合先做只读差距审计与小范围实验，不能把 `.app` 的空壳问题或 `.net` 的内容模板直接迁移到赚钱中的主站。
7. **“SERP 前 20 没出现主站就代表主站没有流量”：不同意。** SERP 只抽查六个词、一次美国快照；主站 GSC 的实际点击来自更多查询，不能用单次样本替代报表。

## F. 仍无法证实的点

- `.net` 的真实点击、展示、CTR、排名、国家/设备拆分、付费/自然流量比例和增长曲线；本账号无该资源权限。
- `.net` 外部链接的数量、follow/nofollow 属性、首次引用时间以及每个引用带来的会话；本轮搜索只证明公开页面/目录/帖子存在。
- Wayback 的**第一次**抓取时间和完整内容演进；availability API 只返回 2026-09-25 的可用快照，CDX 当时暂时离线。
- `.net`、`.org`、`.com`、`.io`、`.ai` 是否由同一人运营；同名域名和一次性脚本观察不足以归属。
- Google 在其他国家、设备、登录状态或不同时间的精确排名；B 表是一次美国英文快照，且混合模块会改变视觉位置。
- `.app` 的 7/28 天数据与 `.net` 的真实流量不是同一统计口径；不能从 `.app` 的 29/1,779 三个月数据反推竞品转化。

## 本轮操作记录

- 新增本文件；未改动网站代码、DNS、sitemap、索引提交或现有文档。
- 证据入口：[`dlss5.net`](https://www.dlss5.net/)、[`dlss5.net sitemap`](https://www.dlss5.net/sitemap.xml)、[`dlss5.net About`](https://www.dlss5.net/about)、[`dlss5.net Editorial Policy`](https://www.dlss5.net/editorial-policy)、[`.app Search Console`](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Adlss5.app)、[Wayback availability API](https://archive.org/wayback/available?url=dlss5.net%2F)。
