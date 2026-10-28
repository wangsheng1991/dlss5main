# 竞品 ROI 推荐的执行状态（工单，2026-10-26 立）

对应 [COMPETITOR-ROI-20261023.md](COMPETITOR-ROI-20261023.md) §6 的推荐：**只能做一件，选方案 A**（在原对比文章内做附来源的「该看哪个功能」选择器）。

本文件不是新的实施工单——**方案 A 已经在 2026-10-25 实施完毕**。写下来是为了固定执行口径和验收，避免重复开工。

## 1. 方案 A：已实施

| 环节 | 落点 | 证据 |
|---|---|---|
| 组件 | `src/components/FeaturePicker.tsx`（6,332 B，2026-10-25 10:21） | `git log -- src/components/FeaturePicker.tsx` |
| 挂载 | 只在对比文章正文里：`src/pages/Blog.tsx:329`，按当前语言渲染 `locale`，同一 slug 一篇只出现一次 | `grep -n FeaturePicker src/pages/Blog.tsx` |
| 实现提交 | `8a1c088` — add sourced "which feature" picker to DLSS/FSR comparison | `git log` |
| 埋点提交 | `1cfe29b` — Track feature picker completion and NVIDIA source clicks | `git log` |

选择器与报告 §5 的口径一致：输入是**目标 / GPU 系列（含未知）/ 游戏是否在已核对范围内**，输出是「相关功能 + 可核实状态 + 去哪里确认开关 + 来源与核对日」，不根据 GPU 自动推断游戏支持；来源链接只在 NVIDIA 发布页那一条打 `feature_picker_source_click`。

## 2. 事件口径（验收读数时必须分开统计）

- `feature_picker_complete`：一次完整选择，**组合去重**（同时记录 `goal` / `gpu` / `game_in_list` / `verdict`）
- `feature_picker_source_click`：`target: nvidia-dlss5`
- 2026-10-25 我方实测：选满三项发 1 条，换显卡再发 1 条，点来源发 1 条；禁用 JS 时静态回退仍可读。
- **禁止**把 `feature_picker_complete` 当点击、把 `verdict` 分布当需求分布：它只证明交互被用过。

## 3. 验收（已排 `competitor_roi_acceptance`，2026-11-21 触发）

按报告 §5 的预先写死的判据，不临时改口径：

- 窗口：上线后首个完整日连续 28 天，GSC 完整数据可用时读数
- 五词点击合计 **≥38**（基线 18）
- 两组 CTR：DLSS4/5 组 **≥3%**、FSR 组 **≥5%**
- 展示量至少维持 **460 / 470**
- 同时记录 `feature_picker_complete` 与 `feature_picker_source_click` 的绝对量（只作「有没有人用」的证据，不换算成搜索点击）
- 判负条件：点击不升 / CTR 不达目标 / 展示掉到无法同口径比较 → 判「未验证收益」，**不自动加文章、不追加同类组件**

预期情景仍是报告里的目标假设：DLSS4/5 三词 182/161/117 展示、FSR 两词 243/227，按 3% / 5% 目标算 **+19.3 点击/28 天**。这是目标，不是承诺；AIO 吃掉零点击需求时增量为 0。

## 4. 方案 B：已实施（2026-10-23，`3a6b9f5`），预算口径已定

本报告 2026-10-23 写「方案 B 未实施、需先给预算上限」，那句话在当天就被推翻了：同日 `3a6b9f5` 已经把它做进页面，只是这份工单没跟着更新。

| 环节 | 落点 | 证据 |
|---|---|---|
| 组件 | `src/components/OwnImageEnhancer.tsx`（10,039 B） | `git log -- src/components/OwnImageEnhancer.tsx` |
| 挂载 | `src/pages/VisualEnhancer.tsx`，两语页面正文中间，带 `#own-image` 锚点（首屏示例运行后的「用自己的图」就跳到这里） | `grep -n OwnImageEnhancer src/pages/VisualEnhancer.tsx` |
| 实现提交 | `3a6b9f5` — feat(visual-enhancer): run own image in place with existing auth and quota | 2026-10-23 |

**流程**：选图（JPEG/PNG/WebP，上限 `MAX_UPLOAD_MIB`）→ 目标倍数 → 提交（1 额度）→ 轮询同一任务 → 原图/增强后滑块对比 → 下载结果；断线可「恢复同一个任务」，不会重复扣额度；失败提示退款去看额度。未登录只显示登录闸门，不发请求。

**预算上限（王胜 2026-10-28 授权「你直接用就行了」，由执行方按此口径定，不新增花钱路径）**：

- 不新增匿名推理、不新增免费试用额度：页面只花**登录账号自己的额度**，沿用现有注册 10 额度 / 每次任务 1 额度。
- 并发沿用现在的单账号单槽；页面不开批量、不开排队放宽。
- 最坏情况的天花板就是已注册账号各自的额度，站点不为这一页新增任何按次计费的路径。

**耗时怎么来的（不靠掐表）**：`server/job-store.ts` 的每个任务都存 `createdAt` 与 `completedAt`（毫秒），两者之差＝排队＋推理；下载耗时只能在浏览器侧测。目前真机样本三次（同一条 API，客户端路径）：**14 s / 16 s / 19 s**（1440×778 → 1536×832 WebP，207,666 B）。因此页面正文**不写秒级承诺**，报告原话「不能写秒级承诺」继续有效。

**验收**：已并入 `competitor_roi_acceptance`（2026-11-21 触发），B 组四词基线 1,541 展示 / 52 点击，判据 ≥116 点击、CTR ≥7.5%、展示 ≥1,541；同一任务里另取 A 组的五词读数与两份站内事件。目标仍是目标，不是承诺。

**今天复核（2026-10-28）**：线上 `/visual-enhancer` 与 `/zh/visual-enhancer` 均能渲染该区块（`#own-image`「在这里增强自己的图片」/「Enhance your own image here」），未登录只见登录闸门、`input[type=file]` 数量 0、控制台 0 报错。

## 5. 红线（本条线任何后续改动都适用）

不把套件版本当全功能支持、不给无来源 FPS/画质赢家、不动保护页的 title/H1/canonical/robots/hreflang、不把 `flux-klein` 重绘叫 NVIDIA 官方效果、不承诺 APK 或真超分。
