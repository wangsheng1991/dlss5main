# Visual Enhancer 目标与实验策略（2026-10-15）

## 目的（一句话，可测）

在不牺牲首页 converter 流量的前提下，把已有的 enhancer 搜索展示变成可完成任务的访问：以 14 天为一个观察窗，让 enhancer 查询簇在展示量不少于 1,000 时从当前 **42 次点击 / 1,328 次展示（CTR 3.2%）** 提升到至少 **60 次点击且 CTR ≥5%**，并让其中一部分完成免费示例运行；没有达到就停止继续扩展该主题。

这里的目标是「进站后能先完成一次增强任务，再决定是否使用 Studio」，不是争夺一个固定的第一名。

## 证据

### GSC 基线

任务书记录的 28 天窗口（2026-09-15—2026-10-12）显示：

| 查询簇 | 点击 | 展示 | CTR | 平均排名 |
|---|---:|---:|---:|---:|
| `dlss 5 visual enhancer` | 21 | 935 | 2.2% | 约 7 |
| `dlss visual enhancer` | 0 | 163 | 未单列 | 未单列 |
| `dlss 5 enhancer` | 3 | 131 | 未单列 | 未单列 |
| `dlss 5 image enhancer` | 18 | 99 | 18% | 4.3 |
| 合计 | 42 | 1,328 | 3.2% | 未单列 |

同一窗口首页整体是 **1,400 点击 / 8,991 展示（CTR 15.6%）**。这支持「查询意图与摘要不匹配」的判断，但不能证明所有 1,328 次展示都来自首页；页面分布的现场核对显示，`dlss 5 visual enhancer` 的 935 次展示中 926 次落在首页，专页当时只有 4 次。

### SERP 现场快照

使用已登录 Chrome 的 Google 结果页读取，日期 2026-10-15，Google 按出口推断为美国俄勒冈，结果包含个性化和 AI 概览提示。

#### `dlss 5 visual enhancer`

前部结果依次被这些类型占据：

1. GitHub `Merserk/dlss5-visual-enhancer`：便携 Windows 应用，主张图片和视频增强，入口是源码/Release。
2. Reddit Stable Diffusion 讨论：独立神经渲染项目、视频和 ReShade/RenoDX 路径，入口是讨论和外部项目。
3. YouTube：`Turn Any Image & Video into DLSS 5 NR ...`、`How to Enhance Video Quality Using DLSS 5 ...`，入口是视频观看。
4. GitHub Releases：强调 Live mode 和播放时调整参数。
5. `Blueforcer/ComfyUI-DLSS5-Enhancer`：ComfyUI 节点、图片批处理和视频流程，前提是已有 ComfyUI 环境。
6. Chaos Forum、AlphaSignal：解释或转载本地工具和视频能力。
7. NVIDIA 新闻页：官方技术背景，但不是在线增强工具。

本次前部结果没有出现本站 `/visual-enhancer`、首页或 `/image-quality-enhancer`。

#### `dlss visual enhancer`

仍由 GitHub、Reddit、YouTube、ComfyUI 和 AI 概览占据。本站 `/image-quality-enhancer` 在后续结果出现：

- title：`Image Quality Enhancer Online — Make Photos Clearer with AI`
- 摘要：`Make a blurry, noisy or compressed image clearer online. AI image enhancement restores texture and edge definition while preserving the original scene.`
- 该查询的 Google 站点卡片现场显示：过去 28 天 **0 点击、176 展示、平均排名 8.1**。

#### `dlss 5 enhancer`

前部仍是 GitHub、YouTube、Reddit、ComfyUI；本站 `/image-quality-enhancer` 在后续结果出现。Google 的相关问题包括「Is DLSS 5 still upscaling?」「Does DLSS 5 improve graphics?」「Will DLSS 5 boost FPS?」，说明用户同时关心定义、效果和性能边界。

## 对草案的反驳

草案说「落差不在排名而在摘要与意图不匹配 + 落地页不能当场办事」，前半句证据充分，后半句需要收紧：平均排名约 7 并不等于所有查询都稳定在前列，且 Google 结果中本站新页尚未出现。当前更准确的说法是：**首页已经获得可见性，但首页的 converter 摘要不能代表 enhancer 任务；新页必须先证明自己能获得展示，再证明点击后的免费任务完成率。**

草案还隐含了「新页上线就能赢词」。SERP 事实不支持这个推断：竞争页有 GitHub 权威、Release 更新、Reddit 讨论和视频资产，`/visual-enhancer` 目前没有这些外部信号。新页的优势是结果页里没有看到的「无需登录、浏览器内一键运行、前后对比和下载」，这足以做低成本实验，但不足以承诺排名或流量跃升。

## 建议

### 先做

1. **先观察新页，不再改首页 title。** 新页已经承接 `visual enhancer` 主词，首页保留 converter title；首页 description 只承接「转换前检查图像质量」的旁支意图。
2. **验证“点击后办完事”而非只看点击。** 记录 `/visual-enhancer` 的 `experience_click`、示例请求、成功显示对比、下载点击；成功定义必须是结果出现，不能把点击按钮当作成功。
3. **保持当前新页信息架构：** 首屏免费示例 → 前后对比/下载 → 独立工作流解释 → 在线与桌面路径边界 → FAQ → 相关工具。它正好补足 GitHub/ComfyUI 结果没有提供的即时浏览器体验。

### 后做

如果 14 天后新页已经获得展示但 CTR 低，再只改新页 description 或首屏答案句中的一个变量；如果有点击但免费示例成功率低，先修工具失败提示和结果呈现，不再扩大 SEO 文案。

### 不做

- 不在观察窗内再次改首页 title、`/image-quality-enhancer` title 或三者的相同关键词。
- 不复制 GitHub 项目的本地安装、ReShade、ComfyUI 或视频播放器叙事；这些属于不同产品路径，也有来源和合规风险。
- 不为追求词量新建更多 enhancer 同义页；当前证据只支持一个可运行的专页。
- 不把第三方页面的下载、视频或 AI 概览描述写成本站功能，也不编造性能数字。

## 判据与回滚

- **观察窗：** 2026-10-16 至 2026-10-29；2026-10-31 读取结算后的 GSC 数据，避免最后两天延迟造成误判。
- **成功：** enhancer 查询簇展示不少于 1,000，点击至少 60，CTR ≥5%；同时首页总点击较前一等长窗口下降不得超过 10%，免费示例成功事件必须有真实记录。
- **证据不足：** 展示少于 1,000，或免费示例成功次数过少，结论写「证据不足」，不宣布失败，也不扩页。
- **回滚：** 展示不少于 1,000 但 CTR <2.5%，或首页总点击连续两个等长窗口下降超过 10%，回滚最近一次首页 description 改动；新页保留用于继续观察，但停止继续改首页元数据。
- **业务边界：** 以 1,328 次展示为量级，即使 CTR 达到 5%，也约是 66 次点击，较当前增加约 24 次。只有其中出现可观的成功运行或 Studio 申请，这个实验才值得继续投入。

## 风险

- SERP 当前被 GitHub、Reddit、YouTube 和 ComfyUI 外部信号占据，新页短期可能没有展示；这属于权威与时间问题，不应通过批量重复页面解决。
- 首页是高流量资产（28 天 1,400 点击），任何继续改动的机会成本都高于 enhancer 簇的增量；因此 description 实验只做一次并冻结观察。
- 第三方结果宣称的本地视频、实时模式和技术名不能作为本站事实。本站应坚持独立浏览器工具、真实免费示例和清晰边界这条差异。
