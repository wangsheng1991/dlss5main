# 10 倍流量假设补证（2026-10-11）

本文件只补三件事：80,000 次工具簇展示的证据边界、`dlss5studio.com` 的竞争影响、以及 `.app` 两个 Search Console 窗口的口径。没有改页面、没有提交 sitemap、没有请求编入索引。

## 1. 80,000 次工具簇展示：目前不能当成需求预测

上一份报告的 80,000 是**规划情景**，不是关键词工具读数。现有证据只能证明部分查询已经发生，不能证明新增词簇会自然产生 80,000 次展示。因此本轮把 80,000 拆成十个**待验证目标**，并给每个目标写明证据来源；目标总和仍为 80,000，但不再把它描述为搜索量预测。

| 候选查询 | 28 天规划展示配额 | 目前可核证的依据 | 量级状态 |
|---|---:|---|---|
| `dlss 5 image converter` | 12,000 | 主站 GSC 已记录 **233 展示 / 60 点击**；主站首页当前 title 直接包含 `DLSS 5 Style Converter Online`（[线上首页](https://www.dlss5nvidia.com/)，核对 2026-10-11） | 已有需求，新增配额未证实 |
| `dlss 5 online image converter` | 10,000 | 与现有 `dlss 5 online`、`image converter` 两个已出现词的组合；需要 GSC 或关键词工具验证 | 未证实 |
| `dlss 5 visual enhancer online` | 10,000 | 主站 7 天记录曾有 **16 展示 / 8 点击**；GitHub 上存在标题为 `DLSS 5 Visual Enhancer` 的公开项目（[仓库](https://github.com/dlss5visualenhancer/DLSS5-Visual-Enhancer)，检索 2026-10-11） | 已有需求，新增配额未证实 |
| `dlss 5 ai image generator` | 8,000 | 主站 GSC 已记录 `dlss 5 image generator` **97 展示 / 26 点击**；首页搜索摘要也称 AI image generator | 已有需求，新增配额未证实 |
| `dlss 5 image upscaler` | 8,000 | 站内已有 Image Upscaler 页面；GitHub 有 [`DLSS5-Image-Converter`](https://github.com/criso2hd-alt/DLSS5-Image-Converter) 项目标题直接使用 Image & Video Converter（检索 2026-10-11） | 竞品标题信号，无量级 |
| `dlss 5 image enhancer` | 8,000 | 主站曾记录 `dlss 5 image enhancer` **43 展示 / 11 点击**（7 天窗口）；`visual enhancer` 是同一意图簇 | 已有需求，新增配额未证实 |
| `dlss 5 video upscaler` | 8,000 | [`dlss5-video-player` README](https://github.com/2600th/dlss5-video-player) 明确有视频播放、导出与 Upscaler 行；YouTube 存在 [`DLSS 5 for video upscaling`](https://www.youtube.com/watch?v=8zmYbbEQKGU) 主题（检索 2026-10-11） | 主题存在，搜索量未证实 |
| `dlss 5 video converter` | 6,000 | GitHub [`DLSS5-Image-Converter`](https://github.com/criso2hd-alt/DLSS5-Image-Converter) 标题写明 Image & Video Converter；另有 [`DLSS5-Video-Converter`](https://github.com/perseval-BLR/DLSS5-Video-Converter) 项目（检索 2026-10-11） | 竞品标题信号，无量级 |
| `dlss 5 game screenshot enhancer` | 5,000 | 竞品 [`dlss5studio.com`](https://dlss5studio.com/) 首页公开展示 gameplay video、逐帧预览和前后对比；这是任务证据，不是搜索量证据 | 任务存在，搜索量未证实 |
| `dlss 5 character style converter` | 5,000 | 主站已有 [游戏人物风格转换页](https://www.dlss5nvidia.com/game-character-style) 与 20 组案例；这是本站产品入口信号，不是外部搜索量证据 | 任务存在，搜索量未证实 |
| **合计** | **80,000** | — | **规划配额，不是预测** |

### 证据结论

- 目前只有第一、第三、第四、第六行有主站 GSC 的真实展示记录；它们合计的已观测量仍只有上一份报告的 **1,507 展示**（converter 233 + online 209 + generator 97 + visual enhancer 968）。
- 其余行的依据是可访问的竞品页面标题、README、视频主题或我们已有功能页，证明“有人把这个任务做成页面/工具”，不能推出月搜索量。
- 因而 **80,000 不能继续作为预期增量**。在拿到 Google Keyword Planner、Search Console 新查询行或至少 14–28 天的新增展示前，应把它写成实验上限；若要保守预算，先按 10,000–20,000 新展示验证工具簇，再决定是否扩大。

## 2. `dlss5studio.com` 的竞争影响

### 2.1 线上核对

我在 2026-10-11 读取了 `https://dlss5studio.com/`，页面重定向到 `/en`。页面列出 **11 个语言入口**（意大利语、英语、西班牙语、法语、德语、中文、日语、韩语、巴西葡萄牙语、印尼语、波兰语），首屏标题是 **“DLSS 5 on your videos, even without an RTX.”**，并公开写着上传视频、单帧预览、真实 RTX 40/50 运行、三分钟时段和免费/无账号入口。页面正文没有匹配 `dlss5nvidia.com` 字符串；这证明首页没有链接到主站，但不等于全站所有深层页都已穷尽检查。

来源：`https://dlss5studio.com/`（线上页面，核对 2026-10-11）；页面可见语言导航、首屏标题、视频流程和 FAQ/How it works 段落。

### 2.2 对把握和优先级的修正

- **工具型需求把握从“中等”降为“中低”**：同名品牌占位、11 语言和“无 RTX 在线视频”承诺说明这个意图簇已经有强竞争者，不能再把 80,000 展示当成空白市场。
- **P1 不取消，改为 P0.5 防守 + 差异化承接**：先确保用户搜到 `DLSS5 Studio` 或 `DLSS 5 online` 时能清楚区分独立站、浏览器图像转换、本地 Studio 索取流程和实际限制；再扩展视频/语言内容。否则新增页面只会把品牌词让给对方。
- **不追逐对方未核实的能力承诺**：对方页面自称真实 RTX 40/50 和免费视频流程，这是对方公开声明，不是本站可复用的事实。本站继续使用已有可核验的 API、Studio 请求页和实测数据，不写成同一产品或官方渠道。
- **优先级变化**：主站工具入口（品牌澄清、`convert` 主路径、真实案例、下载/索取区别）提前；宽泛的 video upscaler 词簇延后，直到我们有稳定、可复现的真实视频链路和可公开素材。

### 2.3 建议的防守验收

1. 用 Search Console 单独观察 `dlss5 studio`、`dlss 5 online`、`dlss 5 image converter` 的查询—页面分布，不用总点击代替品牌防守。
2. 把 `/download` 明确写成“DLSS5 Studio 本地产品索取页”，把首页/Studio 工具写成“独立的 DLSS 5 风格转换与视觉参考工具”，避免两个入口互相抢同一个承诺。
3. 所有外部链接和 UTM 都指向真实目的页；不引用或借用 `dlss5studio.com` 的品牌、截图或文案。

## 3. `.app` 的 28 天与 3 个月数字并不矛盾

- **28 天**：最近一次已保存的 Search Console 界面快照是 **6 点击 / 252 展示 / CTR 2.4% / 平均排名 10.5**，报告更新时间记录为 2026-10-04。
- **3 个月**：另一条记录是同一资源最近三个月窗口累计 **29 点击**。它不是“同一窗口的第二个版本”，而是更长日期范围的累计值。
- 如果三个月窗口包含上述 28 天，29 点击可以包含这 6 点击，剩余约 23 点击来自更早日期；由于当前没有保存三个月的确切起止日期，不能把 23 当成精确的非重叠值。
- 本轮刷新 Search Console 时浏览器网络挂起，因此没有用新读数覆盖这两个已记录窗口。后续只要补读一次，就应同时保存日期范围、更新时间、查询总数和 top20 行，避免再次出现“窗口不同但并排引用”的歧义。

## 最终结论

80,000 展示目前只能作为实验配额，不能作为市场规模证据；`dlss5studio.com` 让工具簇从“中等把握的新增需求”变成“中低把握、但必须先做品牌防守”的方向。`.app` 的 6/252 与 3 个月 29 是不同窗口，前者不是后者的改写。下一轮应先验证 10 个候选查询的真实展示，再决定是否继续 10 倍算术，而不是先扩页面数量。
