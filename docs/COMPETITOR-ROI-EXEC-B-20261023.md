# 执行工单：方案 B —— /visual-enhancer 原地完成「自己的图片」（2026-10-23）

依据：`docs/COMPETITOR-ROI-20261023.md` 第 5 节「方案 B」。方案 A 已完成（`8a1c088`），现在做 B。
**只做 B。不新建页面、不做视频、不做客户端。**

## 1 目标

让已登录用户在 `/visual-enhancer`（以及中文 `/zh/visual-enhancer`）**不跳走**就能完成：
上传自己的 JPEG/PNG/WebP → 增强 → 同屏前后对比 → 下载结果。

免登录的缓存示例（`sample1`）必须原样保留，匿名用户仍能跑那一个示例。

## 2 现状（先核对再改）

- `src/pages/VisualEnhancer.tsx`：免登录按钮跑 `sample1`；「增强自己的图片」当前指向 `/dashboard?tool=enhance`。
- `src/config/enhance.ts`：图像模型是**重绘细节**，最长边上限 **1536**，目标因子 2/4。
- 上传/任务链路已有：`api/image-edit/upload.ts`、AlphaNet `flux-klein`、签名上传、异步任务轮询。
- **先读这些文件确认可复用点，再动手**；能用现有接口就不要新写一套。

## 3 硬约束

- 只能**已登录**用户跑自己的图，沿用现有额度和鉴权；**不允许**匿名无限推理。
- 不新增客户端安装包、不接视频、不承诺批量。
- 文案红线：不写「官方效果」「NVIDIA 认证」「像素级超分」「秒级完成」这类没有依据的话；它是重绘细节的增强，最长边 1536。
- 不改 `/visual-enhancer` 的 title/H1/canonical/robots/hreflang；只加功能与必要文案。
- 失败/超时要能**用同一个 task id 恢复**，不许靠重复提交装成成功。
- 中英文两版都要有，文案一致。

## 4 验收（原文照抄）

1. `npm run lint`、`npm test`、`npm run build`
2. `check-flagship-pages.mjs`（`/visual-enhancer` 与 `/zh/visual-enhancer`）
3. `check-unsourced-claims.mjs`（两站 0 命中）
4. 保护名单 `check-protection-list.mjs`（改前 `--capture` 备份，改后复跑 `changed=0 down=0 FROZEN-OK`）
5. **功能实测**（这是重点，不能只跑静态检查）：
   - 用现有的 stubbed signed-in 构建（`shared_env/ux/check-studio-signed-in.mjs` 那套）驱动：上传 → 提交 → 轮询 → 结果 → 下载按钮出现；
   - 记录**至少一次真实任务**的端到端耗时（排队 + 推理 + 下载），参照：2026-10-23 00:05 的一次 `flux-klein` 1024×1024 任务耗时 **14 秒**；
   - 记录一次失败路径（超时或 4xx）后同一 task id 能否恢复，以及界面上给用户的提示文案。
   - 截图存 `/tmp/competitor-roi-b-20261023/`，报告里写路径。

## 5 交付

- 单独 commit：`feat(visual-enhancer): run own image in place with existing auth and quota`；推送 `main`。
- `CHANGE-LOG.md` 追加一行（改了什么、commit sha、闸门与实测结论）。
- 回报 ≤12 行：commit sha、闸门原文行、实测耗时（端到端）、失败恢复结论、你判断这个流程能不能作为搜索落地页承接（一句话，别吹）。

如果做到一半发现必须改鉴权模型、或必须开放匿名推理才能完成，**停下回报**，不要擅自扩大范围。
