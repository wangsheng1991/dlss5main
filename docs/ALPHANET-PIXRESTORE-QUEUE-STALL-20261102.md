# `pixrestore-s` 队列卡死：2026-11-02 实测记录

写给上游（Alphanet）的一条可核对记录；本站没有改动任何代码来绕过它。

## 现象

| 项 | 值 |
|---|---|
| 模型 | `pixrestore-s`（本站 `/api-docs` 里公开的 "Detail restore"） |
| task id | `task_nCLnQ9E7vC0AoRbnvplL12TYuTATXISp` |
| 提交 | 2026-11-02T01:08:36Z，`POST /v1/tasks/alphanet-flux` 返回 200 且 `status: queued` |
| 之后 | 01:08Z 起每 15–20 秒 `GET /v1/tasks/{id}`，到 01:37Z 仍是 `status: QUEUED`、`progress: 20%`、`finished_at: 0`、`fail_reason: ""` |
| 排队时长 | 已超过 25 分钟；本站文档写的实测时延是「3131 × 1549 的图约 3.5 秒（2026-09-17 端到端）」 |
| 输入 | 12,287 字节 JPEG（本站公开样例 `examples/case-product-low.jpg`），`num_inference_steps: 1`、`seed: 42` |

## 同一分钟内的对照（排除网关整体故障、密钥、配额）

- `cutout-fast`：`task_aI7iGF6W5TKpYm4wIlDfXrl856R8BtpH`，01:25:16Z 提交 → 01:25:20Z `SUCCESS`（约 4 秒），结果 PNG 1,434 字节，可下载。同一个 base URL、同一个 key。
- `flux-klein`：本站每小时监控 `shared_env/flux-monitor` 在 2026-11-02T01:05:28Z 那次仍是 OK（15 秒、1024×1024 webp），此后每小时继续 OK。
- 未登录探测：`GET https://dashboard.alphanetplus.com/` 正常，鉴权失败的返回仍是结构化 `new_api_error`，说明服务与鉴权层活着。

结论：不是网关整体不可用、不是 key 失效、不是配额，而是 `pixrestore-s` 这条模型渠道的队列没有消费任务。

## 我们这边的影响与处置

- 站内 Studio 的 edit / enhance 走的是 `flux-klein`，**不受影响**（每小时监控与当日实测均正常）。
- `/api-docs` 里公开的 `pixrestore-s` 能力受影响：任何按文档接入的调用方会在排队阶段一直等下去。
- 未做任何绕过：没有改前端、没有改服务端超时、没有重试刷任务（同一幂等键已留在我们这边）。

## 请求上游确认

1. `pixrestore-s` 的 worker 是否在 2026-11-02T01:00Z 前后挂了或队列被暂停？
2. 队列里的任务（含上面这条）会被补跑还是丢弃？超时策略是什么？
3. 排队超过 N 分钟能否返回一个明确的 `fail_reason`（现在 `fail_reason` 是空串，客户端无法区分「慢」和「死」）。

## 恢复记录（同日回看）

- `task_nCLnQ9E7vC0AoRbnvplL12TYuTATXISp`：01:08:36Z 提交 → **02:52:43Z 完成**，排队加执行共 6,247 秒（1 小时 44 分）；结果 PNG 139,999 字节、320×213，与输入同尺寸。
- `task_Mwg1G63MifEz6k8qGPJZjAgm2W1sojE6`（02:37:58Z 提交的对照任务）→ **02:52:50Z 完成**，共 892 秒（14 分 52 秒）。
- 可见 02:52Z（北京时间 10:52）前后 worker 恢复，**积压任务是补跑的，没有被丢弃**，`fail_reason` 全程为空。
- 恢复后新提交一条 `task_ocjMhj7OYtKDP92qWj3Aaa44erXvMcgP`：端到端 **9.3 秒** SUCCESS，输出 139,953 字节、320×213 PNG。渠道目前正常。
- 教训保留：排队期间 `status` 一直是 `QUEUED`、`progress` 停在 20%、`fail_reason` 为空串，调用方无法区分「慢」和「死」。仍然建议上游给出排队超时的明确状态。
