# AlphaNet 图片编辑 API：给 SaaS / Vercel 集成者

## 先看这几项

- **网关 Base URL：`https://dashboard.alphanetplus.com`**。后台和项目 API 目前共用该域名。
- **不要用 `https://api.alphanetplus.com` 替代**：那个域名仍指向旧 GPU 服务，鉴权和接口不同。
- 模型：`flux-klein`；当前接入 FLUX.2 Klein 9B KV INT4 图片编辑。
- 鉴权：`Authorization: Bearer <项目 API Key>`。在后台「API 密钥」获取已配置模型渠道、余额和有效期的项目密钥。
- Node SDK：仓库 `integrations/alphanet/client.mjs`，无第三方依赖。复制到项目中使用。用项目当前支持的 Node 运行时及其原生 `fetch`。
- API Key 只放后端环境变量，例如 `ALPHANET_API_KEY`；绝不能放进前端、`NEXT_PUBLIC_*`、Git 或日志。无需提供 Linux、阿里云或 Cloudflare 的密码。
- 本指南描述当前已部署的接口，不是 fal SDK 的原样兼容替换。

## 一次编辑的流程

1. SaaS 后端申请上传地址。
2. 浏览器使用返回的短期签名地址，把图片直接 PUT 到 R2。
3. SaaS 后端提交编辑任务，迅速把 `task_id` 返回前端。
4. 前端通过自己的 SaaS 后端轮询；成功时直接取得 `result.images`。
5. 浏览器直接下载/显示结果图片。

图片字节不必经过 Vercel 或 GPU 网关。不要在一次 Vercel 请求中一直等待推理完成。

## 接口速查

以下请求均带项目 Bearer Key；唯独签名地址的 R2 PUT/GET **不带项目 Key**。

| 方法 | 路径 | 用途 |
|---|---|---|
| POST | `/v1/flux/uploads` | 申请输入图片上传凭证 |
| POST | `/v1/tasks/alphanet-flux` | 提交任务，必须带 `Idempotency-Key` |
| GET | `/v1/tasks/{task_id}?include_result=true` | 推荐轮询，成功时附带 `result` |
| GET | `/v1/tasks/{task_id}` | 兼容旧版的状态查询 |
| GET | `/v1/tasks/{task_id}/result` | 单独获取结果或刷新过期的结果链接 |
| GET | `/v1/tasks/{task_id}/timings` | 已采集的阶段耗时 |
| POST | `/v1/tasks/{task_id}/telemetry` | 可选：上报真实测量的客户端耗时，详见 monitoring.md |

### 初始化 SDK（仅后端）

```js
import { AlphaNetClient } from './alphanet-client.mjs';

export const client = new AlphaNetClient({
  baseUrl: 'https://dashboard.alphanetplus.com',
  apiKey: process.env.ALPHANET_API_KEY,
});
```

在模块级复用 client，避免人为关闭连接。Node `fetch` 在存活的运行时内支持连接池；Vercel 不同冷启动实例之间不能保证复用。

### 1. 申请上传地址

```js
// SaaS 后端：先验证当前用户、上传额度、类型和大小。
const ticket = await client.createUpload({
  fileName: 'reference.webp',
  contentType: 'image/webp',
  size: fileSizeInBytes,
});
// 将 ticket 返回给已授权的当前用户。
```

等价 POST JSON：

```json
{
  "model": "flux-klein",
  "file_name": "reference.webp",
  "content_type": "image/webp",
  "size": 20208
}
```

响应包含 `file_id`、`upload_url`、`headers`。支持 `image/png`、`image/jpeg`、`image/webp`，申报文件大小须在 1 字节至 10 MiB 内（2026-09-22 起从 20 MiB 下调）；实际上传必须与申报一致。当前上传票据本身不是硬性的对象大小限制，SaaS 必须自行限制上传滥用。

### 2. 浏览器直接上传图片

```js
const upload = await fetch(ticket.upload_url, {
  method: 'PUT',
  headers: ticket.headers,
  body: file, // 浏览器 File，大小和类型与申请时一致
});
if (!upload.ok) throw new Error(`图片上传失败：${upload.status}`);
// 上传成功后，再把 ticket.file_id 交给自己的后端提交任务。
```

按返回值使用签名 URL 和 headers，不要改写域名、路径或签名参数，不要额外添加 Authorization。正式网站域名需加入 R2 上传 CORS 配置；新域名上线时必须实测浏览器 PUT，不能用服务器上传成功代替。

### 3. 提交编辑（仅后端）

```js
const input = {
  model: 'flux-klein',
  prompt: '将参考图中的蓝色立方体改为绿色，保持构图和背景不变。',
  image_ids: [fileId],
  width: 1024,
  height: 1024,
  num_inference_steps: 4,
  seed: 42,
  output_format: 'webp',
};

// operation 必须先持久化到你自己的数据库，并绑定当前 SaaS 用户。
// idempotencyKey 为每个逻辑编辑操作唯一的 UUID；网络重试使用原来的值。
const accepted = await client.submit(operation.input, operation.idempotencyKey);
// 将 accepted.task_id 与 operation/currentUser 绑定保存，然后立即响应前端。
```

上面的 `operation.input` 即持久化后的 `input`。不要每次 HTTP 重试都生成新 UUID。提交响应为 HTTP 200/202，包含 `task_id`；收到任务号不代表图片已完成。

**重复提交规则：**保持同一个项目 Key、Idempotency-Key、请求体和序列化方式。当前幂等校验会区分不同原始请求字节，跨 Python/JavaScript 重序列化或改变字段顺序可能冲突。同一操作应一直使用同一 SDK/序列化路径。

### 4. 查询并直接获取结果（推荐）

```js
// 每次 SaaS 查询路由先检查 taskId 属于当前登录用户。
const state = await client.poll(taskId);

if (state.status === 'SUCCESS') {
  // state.result 是旧 /result 接口返回的结果对象。
  const images = state.result.images;
  // 将需要的 url、width、height、content_type 等返回前端。
} else if (state.status === 'FAILURE') {
  // 显示失败状态；不要为了“自动恢复”擅自创建新的收费任务。
} else {
  // 尚未完成；前端稍后再次调用自己的查询路由。
}
```

响应结构示意（不是实际 URL）：

```json
{
  "task_id": "task_...",
  "platform": "alphanet-flux",
  "status": "SUCCESS",
  "progress": "100%",
  "result": {
    "images": [{
      "url": "https://storage.example/short-lived-signed-result",
      "width": 1024,
      "height": 1024,
      "content_type": "image/webp",
      "sha256": "..."
    }]
  }
}
```

只有成功的 FLUX 任务才会附带 `result`。`QUEUED`、`IN_PROGRESS` 等其他状态均按未完成处理；`UNKNOWN` 不得当作成功。前端可从每 1 秒查询一次开始，页面隐藏时降低频率，终态后停止。查询失败可有限重试查询，绝不重新提交任务。

结果 URL 过期但对象仍保留时，通过 `client.result(taskId)` 获取新签名。保存任务号，不要把签名 URL 当永久地址。当前图片保留约 7 天；需要长期历史时，由 SaaS 在对象到期前复制到自己的存储。有效签名链接持有者能读取图片，不应公开记录到日志。

## Vercel 建议路由

| 自己的 SaaS 路由（示例，可改名） | 服务端职责 |
|---|---|
| POST `/api/image-edit/upload` | 检查登录、大小/类型/配额；请求带宽高时按模式检查像素上限（超限直接 400，尺寸和上限写进错误里），不要等上游回 413；调用 createUpload；绑定 file_id 与当前用户 |
| POST `/api/image-edit/jobs` | 检查文件属于当前用户；持久化幂等操作及参数；submit；保存 task_id；立即响应 |
| GET `/api/image-edit/jobs/{id}` | 根据自己的记录检查用户归属；调用 poll；返回状态/结果 |

**项目 API Key 只隔离项目，不隔离 SaaS 内部不同用户。** 每次提交、查询和结果刷新都要检查你的用户归属，不能拿到任意 task_id 就转发。不要把整个平台的管理员密钥发给每个用户。

SaaS 账单由自己的服务处理，不能把测试配置的单价当作最终产品售价。本服务不是完整的商业计费/对账平台；崩溃边界的幂等与计费恢复仍需要运营核对。

## 错误处理

- 401/403：检查 Key、有效期、配额/渠道权限；如果是 Cloudflare 的 HTML/1010 响应，属于公网入口拦截，不是模型错误。
- 404：任务/文件不存在、已不可用，或当前账号无权访问；不要更换账号绕过。
- 409 `result_not_ready`：任务还没成功，继续查状态。
- 409 幂等冲突：核对原始请求字节、Key、Idempotency-Key；不要生成新操作来掩盖冲突。
- 409 `submission_pending_or_uncertain` 或提交超时：保留原操作并核对，不能判断为“没有执行”。
- 429/5xx/查询网络错误：使用有限次数、带间隔的读取重试。成功任务刷新结果失败不应改变为推理失败。
- 失败任务会按当前已验证流程退款，但 SaaS 必须以实际任务和账单记录核对，不能自行重复发起生成。

SDK 抛出的 API 错误带 `status`、`code`；非 JSON 的网关响应或网络错误可能只有普通异常，调用方也要兜底处理。

## 给集成 AI 的任务说明（可直接复制）

> 阅读 integration-guide.md 和 integrations/alphanet/client.mjs。把图片编辑接入现有 SaaS，Base URL 使用 https://dashboard.alphanetplus.com，模型 flux-klein。API Key 仅从后端环境变量读取。采用浏览器签名直传、后端异步提交、client.poll 获取完成结果。持久化用户归属、输入文件归属、任务号及幂等操作；禁止超时后换 Key 重提。不要让 Vercel 单次请求等待整段推理。完成后用真实图片验收成功、失败、跨用户隔离、相同操作重试和过期结果链接刷新。先查现有框架和数据结构再实现，不要假设这是 fal 官方 SDK 兼容接口。

## 进一步资料

- `integrations/alphanet/client.mjs`：实际可用的 Node SDK。
- `docs/alphanet/monitoring.md`：耗时、遥测、图片预览及连接复用测试。
- `docs/alphanet/real-flow.md`：部署/域名及真实验收历史。
- `docs/alphanet/task-api.md`：通用任务 API 与幂等边界。

本指南对应 2026-09-15 的部署。当前已做真实编辑与权限验证，但美国地区、实际 Vercel 项目、并发压力及长期稳定性不在本次已验收范围内。
