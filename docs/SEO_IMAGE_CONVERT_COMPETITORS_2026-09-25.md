# image convert / 风格转换 词簇的竞品 SEO 实测 — 2026-09-25

## 0. 结论先行

查了 8 个查询的 Google 实际结果页，并把排在前面的站点按同一把尺子量了一遍。三件事：

1. **在 DLSS5 词簇里，赢家不是工具站。** `dlss 5 image converter` / `visual enhancer` / `style transfer` / `upscaler` 的自然结果位置被 **GitHub 仓库、Reddit 讨论帖、科技新闻** 占着。翻遍这四个词，没有一个"在线工具站"排在我们前面 —— 和我们同类的对手在这里根本不存在，我们是在跟仓库和讨论区抢。
2. **在通用 image convert 词里，赢家是程序化页面工厂。** `image converter online free` 的第一屏是 img2go / xconvert / pixelfocal / tinyimagefy 这类站，其中 xconvert 的 sitemap 索引展开后**光 25 个子图就有 20,629 个 URL**。我们全站 57 个。
3. **8 个查询，8 个顶部都有 AI Overview**，其中若干还带论坛块和 People-also-ask。也就是说，就算排到第 1，落到我们站上的点击也被上面那块吃掉一轮 —— 现在真正的"第 1 名"是**被 AI Overview 摘进去**。

所以"加强 image convert 这一块"不是再写一个页面，而是三件不同的事：**让首页能被 AI 摘取、让工具页的深度和结构化数据追平对手、把 DLSS5 词簇的战场搬到 GitHub/Reddit 而不是官网。**

## 1. 取数与复现

| 手段 | 做法 |
|---|---|
| Google SERP | 真实 Chrome（`/Applications/Google Chrome.app`）渲染 `google.com/search`，取 DOM 后离线解析。curl 拿到的是一页 JS 跳转，解析不出来 |
| 竞品页面 | 同一个脚本量：title/desc/keywords/canonical/hreflang/JSON-LD `@type`/正文字数/H1-H3 结构/内外链/图片数/关键词特征（免费、无需注册、客户端处理、批量、FAQ、步骤、对比、更新日期） |
| 规模 | `sitemap.xml`，是 sitemapindex 就展开子图累加 |
| 我们自己的页面 | **同一把尺子**量，才有可比性 |

抓取时间 2026-09-25，来源是干净的 en-US 会话（无登录、无个性）。

## 2. 每个查询前面站着谁

| 查询 | 自然结果前几名 | 页面上的其它块 |
|---|---|---|
| `dlss 5 image converter` | ① aivectorengine.com（"把 DLSS-5 转成无损矢量"）②–⑤ Reddit/UGC 讨论 ⑥ technobezz 新闻 | AI Overview · PAA · 视频 · 购物 |
| `dlss 5 visual enhancer` | ① GitHub `maxaeexe/dls…`（After Effects 插件）② Reddit r/DLSS ③ trendshift.io ④ arstechnica ⑤ GitHub `topics/reshade-dlss-5` | AI Overview · 论坛块 · PAA · 视频 |
| `dlss 5 style transfer` | ① GitHub `Jadema5416/ComfyUI-DLSS5-Enhancer` ② Reddit r/aiwars ③ 新闻 ④ gamefaqs ⑤ patsnap eureka ⑥ arstechnica | AI Overview · PAA · 视频 |
| `dlss 5 upscaler` | ① Reddit ② patsnap eureka ③ gamefaqs ④ patsnap eureka | AI Overview · PAA · 视频 |
| `dlss 5 image` | ① daily.dev（文章合集） | AI Overview · PAA · 视频 |
| `image converter online free` | img2go · xconvert · pixelfocal · tinyimagefy · toolsleb · 7converters · aiseesoft | AI Overview · PAA · 图片包 · 视频 |
| `style transfer online free` | ninjachat.ai · zsky.ai · pixifixi.app | AI Overview · PAA · 视频 |

**我们自己的站点，在这些干净会话的前十几条里没出现。** 但 Search Console 说 `dlss 5 image converter` 平均排名 4.7、CTR 25.7%（最近 7 天）。两件事同时为真不矛盾：GSC 是"所有展示的平均"（含未登录、含别的地区、含长尾变体，也包括被 AI Overview 引用时的展示），而干净的同城会话未必给我们这个位次。**不要用一个平均值替代实际看一遍结果页。**

## 3. 对手在做什么（都有实测数字）

| 站点 | 页面规模 | 单页词数 | JSON-LD `@type` | 其它特征 |
|---|---:|---:|---|---|
| **xconvert** | 20,629+（索引里 25 个子图） | 1,840 | FAQPage · Question · Answer · **HowTo** · HowToStep · **BreadcrumbList** · ListItem · **SoftwareApplication** · Offer · **AggregateRating** | 每个 "X→Y" 一个页；`convert-m2v-to-jpeg` 的 canonical 指到 `convert-m2v-to-jpg`（变体去重）；文案明说 free / no sign-up / in-browser |
| **patsnap eureka** | 1,140 | 3,248 | Article · Organization | AI 批量生成的"用 DLSS 5 做某事"报告页，一套模板铺开；`dlss 5 upscaler` 一个词占了两条 |
| **tinyimagefy** | 249 | 1,587 | FAQPage · **HowTo** · **BreadcrumbList** · ListItem | "100% client-side browser processing, zero server uploads" 写进 description；页尾 Related Tools；批量队列 |
| **pixelfocal** | 21（tools 目录页） | 1,045 | **CollectionPage** · BreadcrumbList · ListItem | 工具站做成分类目录（Core Editing / Transform & Brand / Privacy & Analysis / Developer & Workflow），单页 71 条内链 |
| **zsky.ai** | — | 1,012 | WebPage · Person · Organization · ImageObject · BreadcrumbList · **FAQPage** | FAQ 的每个问题就是一个 H3（5 个）；H2 里放"What AI image editing normally costs"对比段 |
| **GitHub 仓库**（ComfyUI-DLSS5-Enhancer） | — | 1,467 | 无 | README 就是落地页：带 emoji 的 H3 分块（True Neural Rendering / Batch Image Processing / Video Enhancement…），26 个 H3，star 数当信任背书 |
| **GitHub topics 页** | — | 1,142 | 无 | 381 条内链，把 11 个仓库串成一个"DLSS5 生态"入口 |
| **aivectorengine** | — | 首页只有 122 词 | 无 | 但它排在我们最好的那个词的第 1 —— 靠的是"把 DLSS-5 输出转成矢量"这个**别人没有的角度**，不是靠页面质量 |

三个可以立刻偷的招：

- **FAQ 的每个问题做成 H3**，而不是塞在折叠面板里（zsky、tinyimagefy 都这么干，也是 AI Overview 爱摘的形状）。
- **BreadcrumbList 家家都有，我们没有。**
- **AggregateRating / SoftwareApplication + Offer** 出现在 xconvert 上 —— 我们工具页已经有 SoftwareApplication，缺 rating 和面包屑。

## 4. 我们自己现在的样子（同一把尺子）

| 页面 | 词数 | H3 | JSON-LD（静态 HTML / 渲染后） | og:image |
|---|---:|---:|---|---|
| `/` | 658 | 0 | **0 / 1** | ✗ |
| `/image-upscaler` | 301 | 0 | 1 / 2 | ✓ |
| `/image-to-svg` | 510 | 0 | 1 / 2 | ✓ |
| `/tools/passport-photo` | 226 | 0 | 1 / 2 | ✓ |

两点需要说清楚：

- **首页的 JSON-LD 只在 JS 跑完之后才有**（静态 HTML 里 0 个），而三个工具页的静态 HTML 里就有。抓取器不跑 JS 时，首页等于没有结构化数据。
- **首页那份 FAQPage，四个问题全是中文**，而页面本身是英文（title、H1、canonical 都是英文）。同一页两种语言，`seo-strategy.md` 里"已做双语 FAQ"的说法在线上不成立。

还有一个小的整洁问题：**渲染后的 DOM 里 canonical 和 JSON-LD 各出现两份**（静态预渲染一份 + React 的 `SEO` 组件再注入一份，两份内容一致）。首页和工具页都是这个形态，风险不大，但该收掉。

hreflang 这一块不用动：`/image-quality-enhancer` ↔ `/es/mejorar-calidad-imagen` 是 en / es / x-default 三件套且**互指**，中英博客页同理；没有本地化版本的 `/image-upscaler` 就不带 alternate 标签，这是对的。

项目规模对照：**我们 57 个 URL**（其中 27 个是 9 篇博客的三语版本），工具页约 20 个。

## 5. 差距清单

| 维度 | 我们 | 排前面的对手 | 影响 |
|---|---|---|---|
| 能不能被 AI Overview 摘 | 没有一段"这是什么"的定义式回答 | 每家都有可摘的 FAQ/定义段 | **最大** —— SERP 顶部那块是第一入口 |
| 单页深度 | 226–510 词 | 1,000–3,300 词 | 大 |
| 段落结构 | H1/H2，**0 个 H3** | 5–26 个 H3（FAQ 问题即 H3） | 中 |
| 结构化数据 | WebApplication/HowTo/FAQPage（工具页有） | 再加 BreadcrumbList、SoftwareApplication+Offer+AggregateRating | 中 |
| 首页结构化数据 | 只在 JS 后存在，且 FAQ 是中文 | 静态就有 | 中 |
| og:image | 首页没有 | 都有 | 小 |
| 页面量 | 57 | 249 – 20,629 | 中（但别硬凑，见 §7） |
| 第三方落点（GitHub/Reddit） | 无 | DLSS5 词簇的自然结果几乎全是它们 | **最大** —— 这个词簇的战场不在官网 |

## 6. 建议动作

### P0 — 这周，纯元数据和结构（每一条都能当天验）

1. **首页 FAQPage 换成英文**，别再让英文页挂中文问答。
2. **首页的 JSON-LD 进静态 HTML**（现在 prerender 没带），否则不跑 JS 的抓取器看不到。
3. **工具页补 BreadcrumbList**，并把现有 FAQ 的每个问题在正文里也做成一枚 H3 —— 对手是这么排的，也是 AI 爱摘的形状。
4. **首页补 og:image**（工具页都有）。
5. **收掉渲染后 DOM 里重复的 canonical 与 JSON-LD**（静态一份 + React 再注入一份，内容一致，低风险但没必要）。

验收：`curl` 原始 HTML 里数 `application/ld+json`（首页要 ≥1）、数 `<h3>`（工具页要 ≥ FAQ 条数）、数 `<link rel="canonical">`（每页 1 个）。

### P1 — 两周，内容厚度与"可摘取"

6. **每个工具页补到 900–1200 词**，写对手写了而我们没写的真实问题：能不能批量、会不会改变构图、多久、收费吗、上限多大、失败怎么办。不是加形容词，是把已经在 FAQ 里的答案摊开。
7. **给 DLSS5 词簇写一段 40–60 词的定义式回答**，直接回答"什么是 DLSS 5 image converter / visual enhancer"，放在首页第一屏下面。这是现在唯一还能抢的"第 1 位"。
8. **风格转换做一页 prompt→风格对照画廊**（我们已经有 `gameStyleCases`），因为那一条词的自然结果是 GitHub 和 Reddit —— 我们要拿"真实前后对照"去打他们的 README 截图。

### P2 — 一个月，规模与渠道

9. **程序化转换页矩阵**：按 xconvert 的模板做 `/convert/<a>-to-<b>`（png-to-svg、webp-to-jpg、heic-to-jpg…），每页 800–1200 词、BreadcrumbList + HowTo + FAQPage，变体 URL canonical 到一个。**先做 20–40 页看收录再铺**，别一上来就几千页。
10. **把 GitHub / Reddit 当渠道**：DLSS5 词簇的自然结果几乎全是仓库和讨论帖。我们手上已经有浏览器端工具（证件照、格式转换）—— 挑一个开源出去，README 就是落点；发布帖去 r/DLSS 这类地方。

## 7. 不要做的事

- **不要编 AggregateRating。** 对手在用，但假评分是明确的结构化数据违规，换来的富摘要不值这个风险。
- **不要从 57 页硬扩到几千页薄页。** 8/8 个查询顶部都有 AI Overview，薄页在那边更容易被判成"没有独立价值"。要做就做成模板 + 每页真有差异（每个转换对的上限/陷阱/示例都不同）。
- **风格转换不要碰侵权 IP。** 那一块的需求词（角色、风格）很多是指向具体作品的，我们的"独立、非官方"定位要一直写在页面上。

## 8. 复现方式

```bash
# 1) Google SERP：真实 Chrome 渲染（curl 只会拿到一页 JS 跳转）
node serp-batch.mjs            # 8 个查询，落 DOM 到 /tmp/serp/
python3 parse-serp.py          # 离线解析：排序 + AI Overview / 论坛块 / PAA

# 2) 竞品与自身的同口径指纹
node fingerprint.mjs competitors.json
node fingerprint.mjs ours.json

# 3) 规模
curl -sSL https://www.xconvert.com/sitemap.xml | grep -o '<loc>[^<]*' | wc -l   # 是索引，要展开子图
curl -sSL https://www.dlss5nvidia.com/sitemap.xml | grep -c '<loc>'             # 我们：57
```

脚本在 agent 的共享目录 `~/.penguin/data/default_project/agents/default_agent/shared_env/seo/`（`serp-batch.mjs` / `parse-serp.py` / `fingerprint.mjs` + `competitors.json` / `ours.json`），要长期用就搬进仓库 `scripts/`。`serp-batch.mjs` 需要 `playwright`，本机只有 `~/code/ark/roomredeginv2/node_modules` 里有，且必须用系统 Chrome 的可执行文件（`executablePath`），Playwright 自带的 chromium 版本对不上。
