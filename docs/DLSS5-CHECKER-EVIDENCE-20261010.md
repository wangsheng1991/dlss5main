# DLSS 5 检测器：官方证据与本地软件数据

核对日期：2026-10-10  
范围：只记录能回到原文的游戏内 DLSS 5 结论；本地 Studio 结论单独成轴。本站是独立项目，与 NVIDIA 无隶属关系。

## A. NVIDIA 官方证据

| 事实 | 来源（发布日期） | 原文要点（短引） | 数据结论 |
| --- | --- | --- | --- |
| 硬件范围 | [DLSS 5 launch article](https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/)（2026-09-01） | “for all GeForce RTX 50 Series GPUs and laptops” | RTX 50 桌面卡与笔记本属于 NVIDIA 当前明确支持范围。RTX 5090/5080 在 `dlssChecker.ts` 标为 `confirmed`；这不是对 RTX 40/30 的推断。 |
| 当前官方硬件表 | [DLSS Technology — supported hardware](https://www.nvidia.com/en-us/geforce/technologies/dlss/)（页面核对 2026-10-10） | 表格的 DLSS 3D-Guided Neural Rendering 行：RTX 50 为勾选，RTX 40/30/20 为 `-` | RTX 30（本批 RTX 3060）标为 `unsupported`；RTX 40 因下方的未来支持声明保留为 `unknown`，并记录冲突。 |
| RTX 40 的未来计划 | [DLSS 5 FAQ（NVIDIA staff）](https://www.nvidia.com/en-us/geforce/forums/nvidia-app/129/583738/dlss-5-faq-932026/)（2026-09-03 更新，页面核对 2026-10-10） | “plan to work on expanding official support to the GeForce RTX 40 Series” | 这是未来计划，不是当前可用承诺；因此 RTX 4090/4070 不发布 `planned` 结果，避免把计划误读为已支持。来源和冲突仍保留在数据条目中。 |
| 驱动版本 | [GeForce Game Ready Driver 616.64 article](https://www.nvidia.com/en-us/geforce/news/nba-2k27-dlss-5-3d-guided-neural-rendering-geforce-game-ready-driver/)（2026-09-03） | 页面明确写出 “GeForce Game Ready Driver, 616.64 WHQL” | 616.64 WHQL 是 NBA 2K27 开启 DLSS Neural Rendering 的官方驱动门槛；它不是本站 Studio 的 610+ 硬件 NVENC 门槛，两者不能混用。 |
| 已上市游戏 | 同上；另见 [NVIDIA GeForce NOW September list](https://blogs.nvidia.com/blog/geforce-now-thursday-september-2026-games-list/)（2026-09-03） | 驱动文章称 DLSS 5 “available now” in NBA 2K27；GFN 文章称 RTX 5080 云端提供该功能 | 当前能从 NVIDIA 原文核实的已上市标题只有 NBA 2K27，已填入 `GAME_ENTRIES`。Onimusha 与 The Blood of Dawnwalker 在同一篇文章中只是 Game Ready / GFN 条目，未被官方说成 DLSS 5 游戏，不能填入。 |

### A1. 官方页面之间的冲突与边界

1. 2026-09-01 发布稿写“starting now”，而 2026-09-03 驱动与 GFN 页面把可用时间写为 9 月 3 日；这是发布时间口径差异，不改变「NBA 2K27 是已确认标题」的结论。
2. 官方硬件表当前只给 RTX 50 勾选；NVIDIA staff FAQ 同时说 RTX 40 将来计划扩展。检测器因此对 RTX 40 保持 `unknown`，而不是把计划发布成当前支持。
3. NVIDIA 的 616.64 驱动文章是 DLSS 5 游戏启用证据。NVIDIA 下载站的独立 release-notes PDF 在本环境返回 403，未把无法读取的 PDF 当作额外证据；驱动文章本身足以记录版本和游戏关系。

### A2. 已写入 `src/content/dlssChecker.ts` 的游戏内结论

| 条目 | `status` | 来源情况 |
| --- | --- | --- |
| RTX 5090 | `confirmed` | NVIDIA 明确写全 RTX 50 系列，核对日期 2026-10-10 |
| RTX 5080 | `confirmed` | 同上；官方正文还给出 RTX 5080 云端机架与性能段落 |
| RTX 4090 | `unknown` | 有「未来扩展 RTX 40」来源，但与当前硬件表冲突；不输出现在支持的结论 |
| RTX 4070 | `unknown` | 同上 |
| RTX 3060 | `unsupported` | 当前 NVIDIA 支持表在该能力行对 RTX 30 标 `-` |
| GTX 1060 | `unknown` | NVIDIA 这几篇 DLSS 5 原文没有 GTX/Pascal 结论，保持未知 |
| NBA 2K27 | `confirmed` | 两篇 NVIDIA 原文，发布日期 2026-09-03，驱动 616.64 WHQL |

`src/features/dlssChecker/rules.ts` 本轮没有改动：它位于需求明确禁止触碰的 `src/features/**`，所以架构规则只保留为下一轮可直接落地的候选（Blackwell → confirmed；RTX 40 → unknown + conflict；RTX 30 → unsupported），未绕过来源守卫硬编码。

## B. DLSS5 Studio 本地软件轴

依据：[`src/content/studioPage.ts`](../src/content/studioPage.ts) 的 `req.*`、[`src/content/studioRequest.ts`](../src/content/studioRequest.ts) 的交付说明，以及 [`docs/marketing/dlss5-studio-brief.md`](marketing/dlss5-studio-brief.md)。这些是本站自己的产品事实，不是 NVIDIA 对游戏内 DLSS 5 的支持声明。

| GPU | 本地软件结论 | 依据 | 实测状态 |
| --- | --- | --- | --- |
| RTX 5090 | `supported` | `/download` 要求 RTX 20 系或更新 | 未在该卡上跑过 |
| RTX 5080 | `supported` | 同上 | 未在该卡上跑过 |
| RTX 4090 | `measured` | RTX 20+ 要求；Windows 11 Pro 26200、24 GB、驱动 591.86 | 720p → 2560×1440 H.264 MP4：87.4 s（2.43 s/frame）；旧驱动导致软件编码 |
| RTX 4070 | `supported` | RTX 20+ 要求 | 未在该卡上跑过 |
| RTX 3060 | `supported` | RTX 20+ 要求 | 未在该卡上跑过 |
| GTX 1060 | `below-minimum` | 页面要求 NVIDIA RTX，RTX 20 系或更新 | 不应声称本地 Studio 可运行；可引导在线转换器 |

### B1. 还需要的真实实测

- 至少一张 12 GB 卡（优先 RTX 4070 或 RTX 3060）：同一张图的处理耗时、显存峰值、输出文件完整性。
- 同一张 12 GB 卡跑 720p/3 秒视频，分别使用驱动 610+（硬件 NVENC）和旧驱动（软件回退），记录每帧耗时、编码格式与失败重试。
- 一张 RTX 50 笔记本或桌面卡：确认 Studio 运行、显存峰值与视频输出，不把游戏内 DLSS 5 结论混到 Studio 结果里。
- 低于 8 GB 系统内存、磁盘空间不足、无 RTX 卡的失败路径：记录页面提示，不宣称性能数字。

## C. 机器可读车道落地清单

本轮**只出方案，未做半成品导出**。现有 `scripts/export-api-catalog.ts` 只生成 `/api-catalog.json` 与 `/api-catalog/<model>.json`；直接在脚本里写新文件会让数据和导出边界不清，也会触碰本轮「只改数据文件」的限制。

### C1. 建议字段（稳定契约）

`/api/dlss5/gpus.json`：

```json
{
  "schemaVersion": 1,
  "lastVerified": "2026-10-10",
  "source": "https://www.dlss5nvidia.com/dlss-checker",
  "gpus": [{
    "slug": "rtx-5090",
    "vendor": "nvidia",
    "name": "GeForce RTX 5090",
    "generation": "Blackwell",
    "vramGb": 32,
    "gameDlss5": {"status": "confirmed", "note": "...", "sources": [], "lastVerified": "2026-10-10", "conflicts": []},
    "localSoftware": {"fit": "supported", "reason": "...", "evidence": null}
  }]
}
```

`/api/dlss5/gpu/<slug>.json` 返回同一条 GPU 对象并带 `schemaVersion`、`lastVerified`；未知 slug 返回真实 HTTP 404。字段名只增不改：`slug/vendor/name/generation/vramGb/gameDlss5/localSoftware/sources/lastVerified/conflicts`。

### C2. 生成与发布步骤

1. 新建纯函数 `dlssCheckerDocument()`，直接消费 `GPU_ENTRIES` 与 `GAME_ENTRIES`，不复制数据。
2. 在 `scripts/export-api-catalog.ts` 同一构建阶段写入 `dist/api/dlss5/gpus.json` 和逐卡文件；先校验所有非 `unknown` 条目有来源和日期。
3. 在 `public/llms.txt` 增加一行机器入口，并说明 `unknown` 代表证据不足；只有导出文件通过构建校验后才发布该链接。
4. 增加静态导出测试：全表与逐卡文件 slug 集合相等、未知 slug 404、`schemaVersion` 稳定、来源 URL 为 HTTPS。
5. 部署后用 `curl` 检查 200/404、JSON 字段、`lastVerified` 和页面结论一致，再决定是否提交索引。

## D. 本轮变更与验证

- 修改：`src/content/dlssChecker.ts`（RTX 50、RTX 30、RTX 40 冲突记录、NBA 2K27 游戏条目）。
- 新增：本证据与方案文档。
- 未修改：`src/features/**`、`src/pages/DlssChecker.tsx`、`tests/dlss-checker.test.ts`、导出脚本、线上设置。
- 验证命令：`npm run lint`、`npm test`、`npm run build`（提交前执行并记录结果）。

## E. 待王胜确认的判断

- RTX 40：是否接受「有未来计划但当前无支持」继续显示 `unknown`，还是等 NVIDIA 发布明确版本后再改 `planned`。
- `/api/dlss5/*`：是否在下一轮允许触碰导出脚本与 `llms.txt`，并把它作为公开稳定 API 契约。
- 12 GB 卡、RTX 50 笔记本、驱动 610+ 的真实实测设备与时间。
