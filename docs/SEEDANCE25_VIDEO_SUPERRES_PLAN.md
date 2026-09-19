# Seedance 2.5 + 视频超分功能计划

更新时间：2026-09-19

## 产品目标

提供一个面向短视频和商品内容创作者的二段式工作流：先使用 Seedance 2.5 生成 480p/720p 预览，用户确认镜头后，再用视频超分输出 1080p 或 4K。产品卖点是降低试错成本、保留 Seedance 2.5 的叙事与参考控制，同时给用户一个清晰的最终交付步骤。

能力边界：BytePlus 当前 Seedance 2.5 视频 API（`dreamina-seedance-2-5-260628`）公开列出的输出是 480p/720p、24fps、4–30 秒；4K 不能按官方 API 原生能力宣传，必须由超分 provider 完成，或按具体第三方路由单独核验。

## 首发 MVP

1. 视频生成：文生视频、图生视频，时长、画幅、音频开关和 480p/720p 预览分辨率。
2. 视频超分：480p/720p 预览完成后，选择 1080p 或 4K 输出；首发先接一个稳定 provider，保留第二个 provider 作为故障切换。
3. 任务状态：`QUEUED → GENERATING → PREVIEW_READY → UPSCALING → SUCCEEDED/FAILED`。
4. 结果页：预览/最终视频并排、分辨率和实际扣费、下载、删除和过期提示。
5. 计费：生成和超分分阶段估算、原子扣费、失败阶段退款、幂等重试；未经用户确认不自动进入 4K 超分。

## 后端接口建议

```text
POST /api/video/jobs
  { prompt, imageUrls?, referenceVideoUrls?, duration, aspectRatio, previewResolution, generateAudio }

GET /api/video/jobs/:id
POST /api/video/jobs/:id/upscale
  { outputResolution: "1080p" | "4k", model?: "realesrgan" }
GET /api/video/results/:id
```

provider adapter 统一实现：`createGenerationJob`、`getGenerationJob`、`createUpscaleJob`、`getUpscaleJob`、`cancelJob`。每个请求保存 provider job ID、幂等键、估算成本、实际成本、输入时长、输出分辨率和错误代码。API key 只放服务端环境变量。

## 成本模型

前端只展示估算积分，后端以 provider 返回的实际用量结算。超分成本按输出视频像素计算：

```text
outputMegapixels = width × height ÷ 1,000,000 × fps × durationSeconds
providerCost = outputMegapixels × providerRate
customerCredits = ceil(providerCost × marginMultiplier × creditScale)
```

公开费率示例显示，5 秒 4K、24fps 的超分处理约 995 个输出兆像素；若按 $0.0008/MP 计算，超分步骤约 $0.80。正式上线前需要用 Alphanet 的真实账单字段校准倍率，不能把公开示例价格写死在前端。

## 质量策略

- 默认先生成低分辨率预览，避免用户为失败镜头支付高分辨率费用。
- 对小字、快速运动、密集人群、细发丝和强胶片颗粒提示“建议原生高分辨率”。
- 结果页保留原始预览，提供 1:1 局部对比，标注 AI 增强可能产生的细节变化。
- 建立 20 个固定测试镜头：人像、商品、风景、文字、快速运动、夜景和动画，记录闪烁、结构漂移、锐化过度、音画同步和失败率。

## 上线顺序

1. 先完成后端 provider adapter、任务表和幂等/积分流程。
2. 接入测试 provider，跑 20 个固定镜头，记录真实成本和耗时。
3. 上线仅登录用户可见的灰度页面，默认 480p 预览和 1080p 超分。
4. 确认失败率、平均成本和退款率后，再开放 4K 与公开 SEO 页面。
5. 将博客文章、FAQ、价格计算器和视频示例互相链接，形成内容到功能的转化路径。

## 运营和合规

对外使用“Seedance 2.5 工作流兼容/接入”这类准确描述，避免暗示 DLSS5 NVIDIA 与 ByteDance 或 NVIDIA 官方关联。禁止用户上传未经授权的影视片段、名人肖像或受版权保护素材；产品页应保留服务条款、隐私政策、退款说明和内容举报入口。
