# AlphaNet + Vercel 部署与验收

## 服务端环境变量

在 Vercel **Production/Preview** 环境分别配置：

```text
ALPHANET_BASE_URL=https://dashboard.alphanetplus.com
ALPHANET_API_KEY=<AlphaNet 项目 Key>
FIREBASE_PROJECT_ID=<Firebase project id>
FIREBASE_DATABASE_ID=<命名 Firestore database id>
FIREBASE_WEB_API_KEY=<Firebase Web API key>
FIREBASE_SERVICE_ACCOUNT_JSON=<一行 JSON，不要提交 Git>
```

`ALPHANET_API_KEY` 和 `FIREBASE_SERVICE_ACCOUNT_JSON` 必须是 Vercel Server-only 变量，不能以 `VITE_` 开头。不要把服务账号 JSON 写进仓库、日志或浏览器响应。

## 路由

```text
POST /api/me/bootstrap
POST /api/image-edit/upload
POST /api/image-edit/jobs
GET  /api/image-edit/jobs/:operationId
GET  /api/health
```

浏览器只拿到短期上传票据和自己的任务状态。AlphaNet Key、Firebase Admin 凭证和任务提交都留在 Vercel API Function。

## Firestore 集合

- `users/{uid}`：套餐、积分、日/月额度、活跃任务数；
- `image_uploads/{sha256(fileId)}`：用户和 AlphaNet `file_id` 归属；
- `image_operations/{sha256(uid + idempotencyKey)}`：请求指纹、任务 ID、状态、结算状态；
- `credit_ledger/{operationId_kind}`：预扣、结算和退款记录。

这些集合由 Firebase Admin SDK 事务写入。客户端不能直接写积分、任务或上传归属。

## 上线前验收

使用一个真实测试用户和一张不含隐私的 JPEG/PNG/WebP：

1. 新用户登录后调用 `/api/me/bootstrap`，只得到一次 Free 初始额度；
2. 上传票据申请成功，浏览器 PUT 使用返回的 URL 和 headers，不添加 Bearer；
3. 提交任务携带固定 `Idempotency-Key`，返回自己的 operation ID；
4. 相同 key、相同 body 重试只得到同一操作，不重复扣费；
5. 相同 key 改 prompt 返回 `409 idempotency_key_conflict`；
6. 任务成功后只扣 1 次，刷新页面仍能恢复结果；
7. 任务失败后只退款 1 次，反复刷新不增加余额；
8. 第二个用户用第一个用户的 operation ID 得到 `404`；
9. 并发超过套餐限制时得到 `429`，积分不变；
10. AlphaNet 暂时不可达时保留 `SUBMISSION_UNCERTAIN`，重试使用原 key，不能换 key 重提。

## 回滚

保留上一版本 Vercel deployment。发现扣费、退款或任务归属异常时先切回上一部署，并暂停生成入口；不要清理 `image_operations` 或 `credit_ledger`，这些记录是恢复和对账依据。
