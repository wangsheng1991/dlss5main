# 内容来源归因（`ref`）—— 交办说明

日期：2026-09-22
状态：**待实现**。写这份的人不是这个仓库的维护者；改动点已经定位到行，照做即可。
配套：`content-engine/docs/SOCIAL_STACK.md` §10

---

## 1. 要解决的问题

北星指标是「**注册并完成首张出图**」。今天这个数字**测不出来**：从内容页点进 dlss5 的链接是

```
https://www.dlss5nvidia.com          ← 线上实测：光秃秃，没有任何参数
```

于是注册的用户和「他是从哪篇内容来的」之间没有连接。发文只能看平台侧曝光，看不到转化。

---

## 2. 现状（已核对的代码事实）

| 事实 | 位置 | 意义 |
|---|---|---|
| 建号只有一个入口 | `api/me/bootstrap.ts` → `JobStore.bootstrap()`（`server/job-store.ts:32`） | **唯一的挂载点** |
| bootstrap 天然幂等 | `if (user.exists) return user.data()!;` 然后 `tx.create(ref, data)` | 天生「首次才写」，不用额外去重 |
| 首图事件**已经存在** | `image_operations/{id}`（`server/job-store.ts`），带 `uid` | **不用新增埋点**，这是最关键的一点 |
| CTA 链接无参数 | 编译产物 `dist/site/topics/<slug>/index.html` | 内容侧要加 |

**结论：只缺「ref 随注册落库」这一小段。** 不是一个大工程。

---

## 3. 设计：first touch，只记一次

用户第一次落地时把 `ref` 存下来，注册时写进 `users/{uid}`，之后**永不覆盖**。

```
内容页 CTA  https://www.dlss5nvidia.com/...?ref=ml-sharp
      │
      │ ① 落地即捕获（localStorage，key 固定，已存在则不覆盖）
      ▼
   localStorage['ri.acquisition'] = { ref, landingPath, referrer, firstSeenAt }
      │
      │ ② 注册/登录后调 bootstrap 时带上
      ▼
   POST /api/me/bootstrap  { acquisition }
      │
      │ ③ 仅在首次建号时写入（bootstrap 已经是这个语义）
      ▼
   users/{uid}.acquisition = { ref, landingPath, referrer, firstSeenAt }
      │
      │ ④ 报表：ref × 首图 —— 首图从已有的 image_operations 取 min(createdAt)
      ▼
   每篇内容带来多少注册、多少首图
```

---

## 4. 改动清单（4 处，都很小）

**① 落地捕获** — 新增 `src/lib/acquisition.ts`

- 读一次 `new URLSearchParams(location.search)` 的 `ref`（校验：`/^[a-z0-9-]{1,64}$/`，不合法就丢弃）
- 顺带记 `document.referrer` 和 `location.pathname`
- 写进 `localStorage['ri.acquisition']`；**已存在就不动**（first touch 才是指路的那个）
- 不设 cookie、不 fingerprint、不生成跨设备 ID

**② 注册时带上** — `src/contexts/AuthContext.tsx:60`

现在：
```ts
await fetch('/api/me/bootstrap', { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } });
```
改成把 `readAcquisition()` 的结果放进 body（没有就传空对象）。

**③ 服务端落库** — `api/me/bootstrap.ts` + `server/job-store.ts:32`

`bootstrap(uid, email, name, acquisition?)`，在 `data` 里多一个字段：

```ts
const data = { ...现有字段, acquisition: normalize(acquisition) };
```

因为 `tx.create(ref, data)` 只在用户不存在时执行，**这个字段天然只写一次**，重复调用不会改。
`normalize()` 只接受白名单字段、截断长度、`ref` 再过一次正则 —— 不能把任意 payload 写进库里。

**④ 报表** — 一个只读脚本，不需要新接口

```js
// 每个 ref：注册数、首图数、首图转化率
users.where('acquisition.ref', '!=', null)        → uid, acquisition.ref
  ⟕ min(image_operations.createdAt) group by uid  → 首图时间
```

---

## 5. 内容侧要做的（我这边做，不需要等）

`content-engine` 编译时给每个 CTA 追加 `?ref=<slug>`。这样同一个 slug 的站点页、博客、Bluesky、
GitHub README、HF 卡片全部带同一个 ref，来源可对账。

---

## 6. 边界（写死，免得以后跑偏）

- **不做指纹、不做跨设备 ID、不设追踪 cookie。** 只用 URL 参数 + localStorage，用户清掉就没了，这没问题 ——
  归因是产品改进，不是监控用户。
- **不覆盖首次来源。** 老用户从新内容点进来，仍然算他原来的来源；否则数字会随投放漂移。
- **没有 ref 的注册照常算「直访」**，不能因为拿不到归因就丢弃这条记录。
- **归因失败不得阻塞注册。** ①②③ 任一环节出错都要静默降级，账号创建是主路径。

---

## 7. 验收标准

1. 访问 `https://www.dlss5nvidia.com/?ref=smoke-test`，注册新账号 → `users/{uid}.acquisition.ref === 'smoke-test'`
2. 同一账号再调一次 bootstrap → `acquisition` **不变**（幂等）
3. 清掉 localStorage 后不带 `ref` 再注册 → 不报错，`acquisition` 缺失或为空
4. `?ref=<script>alert(1)</script>` → 被正则拒绝，库里没有脏值
5. 报表脚本能算出：`ml-sharp → N 个注册 → M 张首图`
