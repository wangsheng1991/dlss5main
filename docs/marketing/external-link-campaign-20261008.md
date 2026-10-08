# DLSS5NVIDIA 外链与内容分发计划

**版本：** 2026-10-08  
**目标：** 用真实的技术内容、可核验的前后对比和短视频获得相关引荐流量与自然提及。外链是内容传播结果，不把批量发帖当作排名捷径。

## 先定口径

蓝星空文章可以作为渠道清单参考，但其中“几乎 100% 收录”“低于 1%”等数字没有公开样本，不能当成保证。Reddit、Hacker News、dev.to 等平台的链接属性、审核和收录都会变化；我们只采用“先解决一个具体问题，再在允许时给一个相关链接”的方式。

不做以下事情：

- 不注册备用账号绕过封禁，不用同一正文在多个社区同时刷屏。
- 不购买低质量链接，不做链接农场、自动评论、站群互链或关键词堆砌。
- 不把独立项目写成 NVIDIA 官方、合作方或授权工具，不把第三方公开参考图写成我们的模型输出。
- 不用“免费”把用户引向未说明的积分或登录门；每个落地页先写清实际流程。

## 外链落点地图

每条外链只选择一个和文章问题匹配的落点，避免全部指向首页：

| 内容意图 | 首选落点 | 适合的外链语境 | UTM 示例 |
| --- | --- | --- | --- |
| 20 组可核验的 DLSS 5 参考图 | `/marketing/reddit/dlss5-reddit-comparisons.html` | 视觉审查、渲染 QA、游戏画面对比 | `utm_source=reddit&utm_medium=community&utm_campaign=external_links_20261008` |
| 免费浏览器增强案例 | `/image-quality-enhancer` | “模糊/压缩图如何先做一轮对比” | `utm_source=devto&utm_medium=article&utm_campaign=external_links_20261008` |
| AI 图像工具横向比较 | `/comparisons` | GPT Image 2、ChatGPT Images、Midjourney、DLSS 5 的方法对比 | `utm_source=hackernews&utm_medium=discussion&utm_campaign=external_links_20261008` |
| DLSS 5 download 意图 | `/download` | 解释官方 DLSS 交付方式与独立 Studio 索取流程 | `utm_source=substack&utm_medium=article&utm_campaign=external_links_20261008` |
| 人像、建筑、产品的失败检查 | `/marketing/reddit/dlss5-reddit-comparisons.html?case=portrait` 等 | 案例讨论、评论区补充 | `utm_source=reddit&utm_medium=community&utm_campaign=case_portrait_20261008` |

UTM 只用于归因，不承诺传递 SEO 权重。自然引用时可以使用干净 URL；社区允许参数时再使用 UTM。

## 可复用的媒体单元

现有素材已经足够启动第一轮，不需要先做一堆新海报。视频和 GIF 的价值是让帖子在信息流里先说明“看什么”，落地页再承接完整证据。

1. **16:9 前后擦除，8–12 秒**：从原图到结果，固定一个局部，叠加 `Before / After` 和 `Independent reference`。落点是 `/image-quality-enhancer` 或对应案例。
2. **9:16 竖版，15 秒**：使用 `public/marketing/reddit/dlss5-studio-kit/vertical-480x854-15s.gif`，适合移动端和社交卡片；第一秒给出输入和输出，最后 2 秒显示案例页 URL。
3. **20 组参考图轮播，20–30 秒**：使用官方公开参考图 contact sheet，每组保留来源提示；结尾显示“source-led gallery / not an NVIDIA endorsement”。落点是 20 组图板。
4. **Difference view，6–8 秒**：用 `09-diff-view-ui.jpg` 的差异视图和一张真实裁剪图，说明“更锐不等于恢复事实”。落点是案例图板或增强器页。
5. **Studio 实测短片**：使用已有 `reel-1920x1080-15s-web.mp4`，只放在 Studio 文章和 Reddit kit 语境；不要把本地实测数字外推成所有 GPU 的速度承诺。

每个媒体单元只传达一个问题。不得把官方 NVIDIA 参考图与独立 Studio 输出拼成一张没有标签的“效果图”。

## 渠道优先级与发布顺序

### 第一层：相关社区（先做）

- **Reddit**：优先使用现有 `docs/marketing/reddit-dlss5-launch.md` 和 `docs/marketing/dlss5-studio-reddit/READY-TO-POST.md`。一次只发一个案例或一个问题；正文 90% 写观察方法、限制和来源，最后 10% 给落点。配一张合成图或一段短片，评论区再补原始链接。
- **Hacker News**：只有在文章确实包含技术分析、可复核数据或工具实现细节时使用。标题应是问题或方法，例如 `A visual checklist for renderer-grounded neural rendering`，不写“免费工具推广”。链接到 `/comparisons` 或技术文章，而不是价格页。
- **r/SideProject / r/IMadeThis**：只在版规允许项目展示时使用“我做了什么 + 一个真实失败案例 + 入口”。不要把同一篇 Reddit 文案复制过去。

### 第二层：可长期沉淀的文章平台

- **dev.to / Hashnode**：发布一篇有完整方法、限制、来源和前后图的长文；正文只放 1–2 个上下文链接。若平台提供 canonical/import 功能，转载版本指回原文，避免自己制造重复页面。
- **Substack**：适合“DLSS 5 download 不是安装包”“如何审查 AI 增强图”这种解释型文章。首段解决问题，中段放图板，末段再给工具入口。
- **Medium / Blogspot**：只在有真正新增观点或本地化版本时发布，不做逐段复制。中文、日文版本必须针对读者重写例子和术语。

### 第三层：代码与自有项目

- 在公开 GitHub 项目的 README 或 docs 中，仅在项目确实涉及图像处理、渲染或案例审查时添加一个“Related workflow”段落。链接文字使用自然描述，如 `browser visual-enhancer case study`，不要在所有仓库重复同一个 exact-match 锚文本。
- 已有的 houseplusplus、aipixelhouse、image2lego 互链保留为相邻工作流入口；不再扩展到无关站点。

### 第四层：社交与本地化

- Bluesky、X、LinkedIn 或飞书只做内容分发和评论回收，链接落到一个具体案例页。
- 中文渠道优先知乎、少量高质量技术社区；日文渠道等英文素材和西班牙语页稳定后再做，避免机器直译造成低质量重复。

## 可直接改写的短模板

### Reddit / HN 技术讨论

```text
I put together a source-led gallery of 20 published DLSS 5 reference pairs and three independent browser examples.

The useful question is not “does it look sharper?” but where structure changes: faces and hair, thin geometry, repeated windows, text, logos and shadows. The gallery keeps the source link for every reference and separates NVIDIA-published material from independent examples.

Gallery: https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html

Which crop or failure case would you add before trusting a visual comparison? This is an independent project and not an NVIDIA endorsement.
```

### dev.to / Hashnode 文章开头

```text
Most before/after image demos ask you to trust a polished result. This one starts with a stricter question: what changed, and which changed detail should be rejected?

I compare renderer-grounded references with a small browser workflow, then check faces, text, straight edges and repeated patterns at the same display size. The source, output dimensions and limitations stay next to each case.

Read the comparison board: https://www.dlss5nvidia.com/comparisons
```

### GitHub README 相关入口

```md
### Related visual workflow

For a source-led review of DLSS 5 references and independent browser examples, see the [DLSS 5 comparison gallery](https://www.dlss5nvidia.com/marketing/reddit/dlss5-reddit-comparisons.html). It keeps source links, before/after labels and failure checks together.
```

## 14 天执行节奏

| 时间 | 动作 | 链接落点 | 记录 |
| --- | --- | --- | --- |
| Day 1 | 选择一个真实案例，按版规发布 Reddit 或 HN 讨论 | 20 组图板或单案例 | 帖子 URL、版规、自荐限制 |
| Day 3 | 回复评论，补一张裁剪图或 Difference view | 同一帖子 | 问题类型、是否需要补充来源 |
| Day 5 | 发布一篇原创 dev.to/Hashnode 长文 | `/comparisons` | 阅读、点击、停留、注册 |
| Day 7 | 发布 Substack 解释文 | `/download` 或技术文章 | 订阅、点击、评论 |
| Day 9 | GitHub 相关项目 README 增加一个语义相关入口 | 具体案例页 | commit、referrer |
| Day 11 | 发布一个短视频/GIF，并只带一个案例链接 | `/image-quality-enhancer` | 播放完成、点击、sample run |
| Day 14 | 汇总数据，决定保留、改标题或换案例 | — | 不以“发得越多越好”为目标 |

同一正文至少间隔 48 小时再换社区；没有评论或点击时先改问题和案例，不立刻提高频率。

## 发布前检查

- [ ] 目标社区允许该类链接和自荐；不允许时只发图、来源和方法。
- [ ] 图片有 `Before / After`、来源或独立项目说明，且没有把官方图与独立输出混淆。
- [ ] 标题没有“官方合作”“最佳”“革命性”“保证收录”等词。
- [ ] 正文先回答具体问题，链接只出现 1 次或作为评论补充。
- [ ] 每个链接都有唯一落点和可追踪参数；没有全站重复 exact-match 锚文本。
- [ ] 没有上传用户图片、私人素材或未授权原图。
- [ ] 记录帖子 URL、发布时间、落地页、UTM、点击、注册和评论问题。

## 需要本人完成的事项（TODO）

- [ ] 登录各平台并逐个确认版规、自荐限制和链接格式。
- [ ] 选择首发社区与首个案例；外部发帖、评论和私信属于账号操作，保留人工发送。
- [ ] 如果要使用付费推广或平台广告，先单独确定预算和目标，不在本计划中默认开启。
- [ ] 每周把 referral、sample run、注册和 Search Console 查询变化回填到本文件。
