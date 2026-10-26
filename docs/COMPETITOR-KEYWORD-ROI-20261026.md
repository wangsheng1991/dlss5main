# 有没有 ROI 更高、竞品已经占住的词（2026-10-26）

## 0. 结论

有，而且比今天新上的 17 个内页高一个量级。

- 今天我们上的 14 个目标词：28 天实测 **529 展示 / 23 点击**，合理档 **+117 点击 = +3.9%**，天花板 +250 = +8.3%。
- 我们已经排到 **4–11 位、但一直没人点**的四个交易类词簇：28 天实测 **8,708 展示 / 562 点击**，把他们推到 3–5 位，**现实档 +679 点击 = +22.6%**，乐观档 **+969 = +32.3%**。**是新词那批的 6–8 倍。**
- 这些词上面站着的竞品有名有姓，今天实抓 SERP 逐个记下来了：`dlss 5 apk` 上面是 Uptodown / SourceForge / dlss-swapper.com / TechSpot 这类下载聚合站；`dlss 5 visual enhancer` 第 1 名是 **Merserk 的 GitHub 仓库**、第 2 名是 Reddit 一个 200+ 评论的帖；`dlss 5 supported cards` 第 1 名是 **dlss5.net**（一个就叫"DLSS 5 Supported Cards & GPU Compatibility Checker"的站），第 3 名 Reddit 370+ 评论，第 7 howtogeek、第 8 corsair。
- 但有一个坏消息改变了打法：**这六个词全部有 AI Overview**。我们 `dlss 5 vs fsr 4` 排第 3 却只有 1.6% CTR——AIO + Reddit + YouTube 把点击吃掉了。所以"抢位次"在信息类词上打折，钱在**交易类词（download / apk / mobile）**上，那些词我们实测 CTR 11–36%，说明用户认我们的措辞。

## 1. 算法（和上一份 ROI 报告同一套，可复算）

数据：GSC 主站 28 天（2026-09-25 → 2026-10-22，10-25 读取）可见查询表 1,060 行；本报告另外实抓了 6 个 Google SERP（2026-10-26，en-US，系统 Chrome，逐条 20 条结果）。

- **增量 = 簇展示 × 目标 CTR − 现有簇点击**。
- 目标 CTR 给两档：**现实档** = 该簇内我们自己实测到的最好单词语句 CTR（只看展示 ≥20 的词，避免小样本）；**乐观档** = 本站 3–5 位带宽均值 17.6%。
- 用**我们自己实测的 CTR**，本身就是"AI Overview 已经存在"条件下的结果，不需要再对 AIO 打折。

可见口径的覆盖率：1,062/2,736 点击（39%）、13,550/29,600 展示（46%）。所以下表是**下限**，全站口径的上限约 2.2 倍，但本节所有结论只按可见口径讲，不叠加放大。

## 2. 四个高 ROI 词簇

| 词簇 | 28 天展示 | 28 天点击 | 现在 CTR | 平均位次 | 现实档增量 | 乐观档增量 | 里面最好的一句话 |
|---|---|---|---|---|---|---|---|
| download（下载） | 2,400 | 132 | 5.5% | 9.7 | **+143** | +290 | `dlss 5 indir` 11.5% CTR |
| enhancer（增强） | 2,381 | 136 | 5.7% | 6.3 | **+283** | +283 | `dlss 5 visual enhancer online` 47.5% |
| 对比（vs / difference） | 1,888 | 28 | 1.5% | 6.5 | **+161** | +304 | `fsr 4 vs dlss5` 10.0% |
| apk / 手机 | 2,039 | 266 | 13.0% | 7.2 | **+92** | +92 | `dlss 5 mobile download` 35.5% |
| **合计** | **8,708** | **562** | — | — | **+679（+22.6%）** | **+969（+32.3%）** | — |

对照：今天 17 个新内页 14 个词 = 529 展示 / 23 点击，现实档 +117（+3.9%）。

## 3. 这些词上面到底站着谁（2026-10-26 实抓，en-US）

| 查询 | 我们 GSC 位次 | 今天 SERP 实际位置 | 排在前面的是谁 | 有 AIO |
|---|---|---|---|---|
| `dlss 5 download` | 11.0 | 第 2 页第 8 条（10-25 抓） | developer.nvidia.com、Merserk GitHub、SourceForge、Uptodown、Reddit、NVIDIA 新闻、NODIX GitHub | — |
| `dlss 5 apk` | 8.7 | 前 8 名里没有我们 | Uptodown、SourceForge、developer.nvidia.com、dlss-swapper.com、YouTube（76.2K 播放）、TechSpot、Merserk、Reddit | 有 |
| `dlss 5 visual enhancer` | 6.6 | **第 4 名** | GitHub Merserk 仓库、Reddit 帖（200+ 评论）、NVIDIA 官方新闻 | 有 |
| `dlss visual enhancer` | 7.4 | 前 6 名里没有我们 | Merserk、Reddit、alphasignal.ai、Chaos 论坛、NVIDIA、Blueforcer 的 ComfyUI 仓库 | 有 |
| `dlss 5 vs fsr 4` | 5.1 | **第 3 名**（4 点击 / 243 展示） | xda-developers、shattered.io | 有 |
| `dlss 4 vs dlss 5` | 7.5 | **第 6 名**（0 点击 / 182 展示） | Reddit、nvidia.com、dlss5.net、YouTube Shorts、dlss5.org | 有 |
| `dlss 5 supported cards` | 可见表里 0 行 | 前 8 名里没有我们 | dlss5.net（页面就叫 DLSS 5 Supported Cards & GPU Compatibility Checker）、nvidia.com、Reddit（370+ 评论）、metapcs、NVIDIA 新闻、YouTube（402.8K 播放）、howtogeek、corsair | 有 |

**能直接读出三件事**：

1. **竞品赢的不只是页面，是平台。** Merserk 用一个 GitHub 仓库拿下 `dlss 5 visual enhancer` 第 1，Reddit 帖占第 2，YouTube 上有 267K / 402.8K 播放的教程。我们没有 Reddit、YouTube 阵地，这是差距的根因，不是标题没写好。
2. **`dlss 5 supported cards` 这条我们今天是零。** dlss5.net 用同一个页面结构（兼容性检查器）占了第 1，而且 howtogeek、corsair 都在写——这说明这个词有真实需求。我们今天的 `/dlss-checker` 还不在前 8，短期抢不动，但这是唯一一个"结构性新词"（不是我们已有流量里的存量机会）。
3. **`dlss 4 vs dlss 5` 我们第 6 名却 0 点击**，同组 `dlss 5 vs fsr 4` 第 3 名也只有 4 点击。AIO 把对比类词的点击吃光了——这类词只值得做"被 AIO 引用"，不值得为点击投人力。

## 4. 按 ROI 排序的动作

| # | 动作 | 依据 | 增量（28 天，可见口径） | 成本 | 风险 |
|---|---|---|---|---|---|
| 1 | `/download` 补"APK 到底有没有"的显式答案段，并把 `/dlss-5-apk` 接成内部承接（不动 title/h1，不改冻结指纹） | `dlss 5 apk` 359 展示 / 21 点击、位次 8.7；SERP 前 8 全是聚合站，**没有一个官方口径页**；`dlss 5 mobile download` 我们 CTR 35.5% | +92 ~ +190 | 半天 | 低（只加段、加内链） |
| 2 | 给 enhancer 补一条 GitHub 阵地（照 studio 仓库的打法，命名避开 Merserk，内容必须真实：样例、限制、申请入口） | Merserk 的仓库实测占 `dlss 5 visual enhancer` 第 1；我们第 4 | +70 ~ +283 | 1–2 小时 | 低，但要保持内容诚实 |
| 3 | `/visual-enhancer` 增加 4–5 条 AIO 可引用的短答案（是什么/不是什么/免费额度/输入输出规格），不改 title | 该词 953 展示、我们第 4、CTR 只有 3.8%（3–5 位带均值 17.6%）；AIO 已在位 | +70 ~ +283 | 半天 | 低 |
| 4 | 对比簇：只补答案结构，不为点击投人力 | 第 3 名 1.6%、第 6 名 0% | ≤ +161，且大概率拿不到 | — | — |
| 5 | `dlss 5 supported cards`：靠内链+时间，不指望两周内 | dlss5.net 占 #1，我们尚未进前 8 | 未知 | — | — |

**只能做一件的话：做 1。** 它是唯一一个"需求已被 SERP 证明、又没有任何官方页面占据、我们自己 CTR 已经 13–35%"的组合，不需要外链和平台就能吃到。

## 5. 口径限制（必须一起说）

- 竞品的**真实流量我拿不到**（没有 Similarweb/Ahrefs 这类数据源），所以"流量远超我们"只能用同一个 SERP 上的占位与我们的实测 CTR 来证：例如 `dlss 5 vs fsr 4` 我们排第 3 却只拿到 1.6% 点击，说明剩余点击被 AIO、Reddit、YouTube 等分走——这是可测的推断，不是第三方流量估计。
- 查询表是 GSC 的可见切片（39% 点击 / 46% 展示），所以第 2 节的增量是**下限**。
- 六个查询全部有 AI Overview，任何"位次→点击"的换算都要按我们自己实测的 CTR 走，不能用行业均值。
- 本次没有改站点、没有部署、没有提交 GSC（配额今天已满），只读数据 + 看 SERP。

## 6. 数据来源

| 文件 | 用途 |
|---|---|
| `~/code/shou/artifacts/gsc-roi-20261022/main28_queries.json` | 主站 28 天可见查询表（簇展示/点击/位次、簇内最佳 CTR） |
| `docs/serp-20261026/serp-google-2026-10-26.json` | 今天 6 个 SERP 的实抓结果（含 AIO 与 PAA 标记） |
| `docs/gsc-20261025/serp-download-*.json` | 10-25 的 `dlss 5 download` 两页 SERP（US / NL） |
| `docs/PAGE-KEYWORD-ROI-20261026.md` | 新页那批的 ROI（同一套 CTR 曲线） |
