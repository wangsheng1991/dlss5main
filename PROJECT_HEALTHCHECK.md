# 项目体检与服务器迁移清单

检查日期：2026-09-12。代码基线：`c18135f`。项目：`dlss5-main`，域名：`www.dlss5nvidia.com`。

## 结论与检查范围

现有仓库是 React/Vite 前端，不包含 GPU 推理、OSS 服务、支付回调或业务后端源码。前端可构建，但有类型检查失败、客户端密钥暴露设计、积分与权限边界缺口。尚不具备把这个仓库搬到新服务器就完整迁移业务的条件。

本次完成源码审查、依赖安装及审计、类型检查、生产构建、Vercel 环境变量名称检查和公开 HTTP 探测。没有提交推理任务、注册用户、修改生产数据库、修改云配置或部署。Firestore 结论针对仓库规则，未获取线上实际生效规则。外部服务内部鉴权、队列、文件校验及数据备份尚未验证。

## 当前真实架构

```text
浏览器 React/Vite（Vercel 静态托管）
  ├─ Firebase Auth：Google / 邮箱密码登录
  ├─ Firestore：用户资料、余额、注册赠送记录
  ├─ /api/oss/* → https://oss.alphanetplus.com/*
  ├─ /api/gpu/* → https://gpu-api.alphanetplus.com/*
  └─ 图片输出 CDN：https://mtdsosscdn.oppein.com
```

Vercel 的 `/api` 是转发规则，不是本仓库提供的服务端函数。开发代理另写在 `vite.config.ts`。两个入口均需在迁移时处理。

Firebase 项目：`gen-lang-client-0654303469`。Firestore 使用命名数据库 `ai-studio-01314581-d2f2-4ede-8d5b-93cb8071dc7f`，不能误连默认数据库。配置来自 `firebase-applet-config.json`；Firebase Web 配置本身不等同于服务端私钥。

## 优先问题

| 优先级 | 问题、触发和影响 | 证据 |
|---|---|---|
| P0 | GPU/OSS 共用的 `VITE_API_KEY` 被前端读取并作为 `X-API-Key` 发送。生产构建配置该变量后，浏览器能取得它；Vercel 把变量标记为 Encrypted 不会阻止前端暴露。应改为服务端保存上游密钥，切换完成后轮换旧密钥。 | `src/pages/Dashboard.tsx:9,184,209,245,267`；`.env.example` |
| P0 | 任务请求不携带 Firebase ID token；访客配额靠 localStorage，会员/余额检查靠前端状态。用户可以绕过网页的额度逻辑。服务端是否另有限额未知，当前仓库没有用户级强制校验。 | `Dashboard.tsx:79-108,209-277`；`vercel.json` |
| P1 | 新用户文档允许自建任意数值余额：规则仅要求 credits 为 number，没有固定注册余额和非负整数约束。注册赠送流水允许重复创建不同 ID，不能保证只赠送一次。若线上使用同一规则，新用户可在首次建档时自定余额。 | `firestore.rules:89-98,129,154-157` |
| P1 | 签到执行 `credits: increment(5)`，规则却只允许余额减少，因此仓库规则部署后正常签到会被拒绝。即使放宽规则，当前先读后写、客户端日期的实现也无法防止并发重复签到；不能简单放开余额增加权限。 | `AuthContext.tsx:136-155`；`firestore.rules:131-134` |
| P1 | 推理完成之后才由浏览器扣费。关闭页面或跳过扣费可造成任务与账目脱节；多标签并发可透支；扣费失败时，已生成的结果也不会展示。没有与任务 ID 绑定的幂等流水、预扣或失败退款。 | `Dashboard.tsx:290-304`；`AuthContext.tsx:128-134` |
| P1 | 邮箱注册后首次建档可能写入 undefined 的 name/image；当前 Firestore 初始化未设置忽略 undefined。常见邮箱用户没有 photoURL，会导致资料写入失败；Auth 回调也缺少 try/finally，loading 可能不结束。 | `AuthContext.tsx:49-105`；`src/lib/firebase.ts` |
| P1 | SeedVR2 无限轮询，每 5 秒一次，没有最大时长、取消、刷新恢复或持久任务记录。FLUX 同步请求也没有超时控制。迁移后服务超时/状态枚举变化会导致用户一直等待。 | `Dashboard.tsx:209-287` |
| P1 | `/download` 导入图标 Download，同时声明同名页面组件 Download，TypeScript 报 TS2440；页面内 `<Download>` 还存在解析为页面自身的递归渲染风险，需浏览器复验。 | `src/pages/Download.tsx:3,24,95,141` |
| P2 | UI 放大倍数 scale 可选，但 upscale 请求没有传该参数，选择不会影响请求。 | `Dashboard.tsx:41,251,411-419` |
| P2 | “API connected”是固定显示，没有健康检查；5 MB/文件格式限制仅在前端可见；新服务必须独立验证文件内容、大小、像素量及任务参数。 | `Dashboard.tsx:131-144,320-323` |
| P2 | 支付、购买积分、订阅回调、管理员后台、生成历史未发现实际实现；subscriptions 只有规则和数据说明。模型/企业页面是展示，不能当成已实现后端能力。 | `src/App.tsx`、`src/pages/Models.tsx`、`src/pages/Enterprise.tsx`、`firestore.rules` |
| P2 | 忘记密码链接为 `#`；localStorage JSON 解析没有异常处理；预览 object URL 未回收；所有页面静态导入，首包约 1 MB。 | `src/pages/Login.tsx`、`Dashboard.tsx:49-52,151-167`、`src/App.tsx` |

## 本地与线上验证

- `npm ci --ignore-scripts`：成功，使用已有 lock，不执行依赖安装脚本。
- `npm run lint`：失败，`Download.tsx(3,10): TS2440`。该命令实际只是 TypeScript 检查，不是 ESLint。
- `npm run build`：成功；JS 约 1,019.67 kB，gzip 279.05 kB。**构建成功不等于类型或页面运行正确**。未配置业务自动化测试脚本。
- `npm audit`：13 个受影响依赖包（2 critical、7 high、2 moderate、2 low）。包括 protobufjs、websocket-driver、react-router-dom、vite 及传递依赖。扫描器报告均有可用修复，但未运行自动升级。告警涉及开发服务器、SSR 等多种条件，不能把依赖级严重性直接等同于这个静态站点可被远程利用。
- 首页返回 HTTP 200。
- GPU、OSS 的 `/health` 直连和站点代理均返回 HTTP 403（text/plain）。这些是无凭证探测，可能受鉴权、网关或网络策略影响；不能据此认定服务宕机，也不能认定健康。
- CDN 根地址返回 200，只证明该地址有响应，不证明对象存在、上传可用或权限正确。
- 没有进行真实上传/推理/扣费、浏览器交互测试、生产规则读取或漏洞利用。

## 当前环境与迁移映射

| 配置 | 当前来源 | 迁移处理 |
|---|---|---|
| `VITE_API_KEY` | Vercel Production，已配置；未输出取值 | 改为后端专用上游密钥（新命名如 `GPU_API_KEY`/`OSS_API_KEY`），不要继续暴露到前端 |
| `VITE_DEFAULT_SEED` | Vercel Production，已配置 | 可保留非敏感默认值；代码 `Number(...) || 42` 会把合法 0 变成 42 |
| Firebase Web 配置 | `firebase-applet-config.json` | 先保留现有项目和数据库可避免用户迁移；更换登录域名时确认授权域名 |
| GPU/OSS upstream | `vercel.json`、`vite.config.ts` | 新后端或网关统一配置，保持路径/请求/响应兼容 |
| `CDN_BASE` | `Dashboard.tsx` 硬编码 | 迁移对象与输出路径，优先由后端返回最终可访问 URL |
| `oss://` / `dlss/input/*` / `env=prod` | Dashboard 上传及生成逻辑 | 确认新服务支持相同对象命名、环境和 URI 协议 |

Vercel 查询中这两个环境变量均只配置在 Production；Preview/Development 没有对应条目。本次本地构建没有加载生产密钥，不能用于验证推理。

## 需要兼容的接口

| 接口 | 当前请求 | 前端期待 |
|---|---|---|
| OSS `POST /upload?env=prod&key=...` | multipart `file`，`X-API-Key` | JSON `success`；对象可被 GPU 通过 `oss://key` 访问 |
| GPU `POST /v1/flux2/generate` | `image,prompt,seed,num_inference_steps,output_format:oss` | `success,enhanced`（oss URI），失败 `error` |
| GPU `POST /v1/seedvr2/upscale` | `oss_key` 或 `image_url` | `job_id` |
| GPU `GET /v1/seedvr2/status/{job_id}` | `X-API-Key` | `status:done` + `output_url`，或 `status:failed` + `error` |

## 迁移顺序与验收

1. **先补齐资产**：取得 GPU/OSS 两个服务的源码、当前部署清单、进程管理/容器配置、模型版本及权重位置、CUDA/Python 依赖、GPU 型号与显存实测、对象存储 bucket/region、CDN/DNS 管理权限、队列/任务存储方式。仓库无法推断显存和新服务器规格。
2. **建立业务后端**：验证 Firebase ID token；用户/访客限流；上传验证；事务式积分预扣、失败退款及任务幂等；服务端签到与注册赠送；任务查询校验所有者。上游密钥只由该服务读取。
3. **新环境并行验证**：分别验证真实图片上传、FLUX 成功/失败/超时、SeedVR2 排队/失败/完成/刷新恢复；检查结果图片可访问、扣费恰好一次、余额不足拒绝、不同用户不能查询对方任务、同日并发签到只赠送一次。
4. **数据先行**：保留 Firebase 时无需搬用户库，但需备份现有数据并核对线上规则；迁移 OSS 时保留原 key，核对对象数量/校验值及旧链接。若更换认证/数据库，另做 UID、密码迁移能力、积分流水与切换方案。
5. **切换与回滚**：先用 Preview/测试域名验证，再切 API upstream；如果前端也离开 Vercel，配置 HTTPS、SPA fallback 和 API 反向代理，API 错误不得落入 index.html。保留旧后端和存储到观察期结束，避免两个写入口造成双重扣款；失败时回退 upstream/DNS。

若只换 GPU 服务器，建议先保留 Vercel 前端、Firebase 和现有对象存储，缩小首次迁移范围。但外部服务管理权限和部署资料仍是实际迁移的前提。
