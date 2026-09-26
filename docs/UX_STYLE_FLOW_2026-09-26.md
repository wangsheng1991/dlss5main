# 交互复核：为什么"东西多不是问题，但用起来不顺畅" — 2026-09-26

对象：线上 `www.dlss5nvidia.com`（当日实测）。你说的两件事我都复现了：**交互逻辑确实耦合在一起**，**核心的 DLSS 5 风格功能确实没有一条顺畅的路**。下面每一条都带测量结果，末尾是按优先级排的最小改动。

## 0. 结论先行

1. **首页最显眼的那个"上传框"不是上传框。** 它没有 `drop`/`dragover` 处理函数，真实拖入文件什么都不会发生，点一下只是跳到 `/dashboard`；它旁边还写着"最大 2MB"，而工作室实际接受 10 MiB。
2. **DLSS 5 风格这条路目前是断的。** `/game-character-style` 的**预渲染 HTML** 把"上传自己的角色图"指向 `/dashboard?tool=enhance`（通用增强），而 React 组件指向 `?tool=game-character-style` —— 同一个构建里两个表面互相矛盾；并且生产环境的包里根本没有风格工作流，所以那个深链接打开的是通用工作室。
3. **这条路没有"先试后登"的入口。** 全站 5 个示例里没有一个角色风格示例，`/game-character-style` 上文件输入框数量为 **0**。旗舰功能是全站唯一一个游客完全碰不到的东西。
4. **工作室在中文会话里是英文的。** 导航和首页是中文，工作室里从标题到 9 个工具名到区块标题全是英文。
5. **耦合的具体形态**：`mode`、`prompt`、`file`、`file2`、`toolChoices`、`toolExtra` 是**一份状态**，被 9 种任务共用；切换工具会静默清掉第二张图，进入风格工作流会覆写 `prompt`；提交按钮的可用性由这几样组合决定。

## 1. 怎么测的（可复现）

系统 Chrome + Playwright，zh-CN 会话，1440×900，直接打生产：

```
node <scratchpad>/probe-ux.mjs      # 首页首屏、拖放行为、点击落点、游客工作室全量
node <scratchpad>/probe-style.mjs   # 风格这条路的三个入口
node <scratchpad>/probe2.mjs        # ?tool= 三种取值 + 真的点一次角色页 CTA
```

## 2. 交互耦合：用户实际会遇到什么

### 2.1 首页首屏唯一的主控件是个仿制品

```
dashedZones: [{ tag: DIV, text: "拖拽或点击上传图片 | 支持 JPG、PNG、WEBP（最大 2MB） | 选择图片",
                hasDropHandler: false, hasDragOver: false }]
拖一个真实 JPEG 上去 → {"navigated": false, "stillNoPreview": true}
点击它            → /dashboard
```

首屏（900px 高）里可交互元素一共 17 个，其中 15 个是导航链接，剩下的是登录/注册；**真正的按钮只有一个，在 y=837px**，也就是几乎贴着首屏底部。用户第一眼看到的是"一个上传框"，而它既不能拖也不能传。

同一条链路上还有**三个互相打架的尺寸上限**：

| 出处 | 写的 |
|---|---|
| 首页上传框 | 最大 **2MB** |
| 首页"如何使用"第 1 步 | 最大 **5MB** |
| 工作室设置列 | input up to 16 MP and **10 MiB** |

### 2.2 游客落地工作室，看到的大多是不能用的东西

`/dashboard`（未登录）从上到下的实际顺序：

```
AI Image Studio                          ← 英文
Enhance & upscale / Prompt edit / Remove background / Image to SVG / Erase object
Virtual try-on / Room render / Portrait retouch / Virtual makeup     ← 9 个按钮，全部要用不了
2× / 4×
（一段说明文字）
Uploading your own image needs an account
OR TRY THESE EXAMPLES  →  Kitchen render / Bedroom render / Red teapot / Coffee badge
REAL CASES · INPUT → OUTPUT  →  7 张卡片，底部一行 "Sign in to load these inputs"
```

一次能跑的只有 4 个示例按钮，而它们排在 9 个不可用按钮和一大段说明之后。7 张案例卡片是纯展示，点不了。

### 2.3 工作室不跟随语言

zh-CN 会话下逐字抓到的英文 chrome：`AI Image Studio`、`Enhance, upscale or repair a photo, render or product image…`、`GENERATION SETTINGS`、9 个模式名、`OR TRY THESE EXAMPLES`、`REAL CASES · INPUT → OUTPUT`、`Sign in to generate`。同一时刻导航是"模型 / 免费工具 / 应用场景 / 关于 / 博客"，首页是中文。工作室是全站唯一不本地化的表面。

### 2.4 一份状态，九种任务

`Dashboard.tsx` 里 `mode / prompt / file / file2 / toolChoices / toolExtra` 全在一个组件里，被 9 种工具共用：

- 切换工具会**静默丢弃第二张图**（`file2Mode` 那个 effect），用户只会看到图没了。
- 进入风格工作流会**覆写 `prompt`**（`CHARACTER_STYLE_DEFAULT_PROMPT`），之前在 Prompt edit 里写的字直接消失。
- 提交按钮的可用条件由 `profile && prompt.trim() && sourceSize && file2` 组合而成，而"输出多大、扣不扣积分、能不能跑"分别写在设置列的三处。

这不是"内容多"，是**同一条状态被九种语义同时占用**。

## 3. 核心功能：DLSS 5 风格为什么走不通

### 3.1 两个表面互相矛盾（同一个构建里）

| 表面 | "上传自己的角色图"指向 |
|---|---|
| React 组件 `src/pages/GameCharacterStyle.tsx:45` | `/dashboard?tool=game-character-style` |
| 预渲染 HTML（`scripts/prerender-seo.ts` 的 `renderGameStyleLanding`） | `/dashboard?tool=enhance` |
| 线上实际返回的 HTML | `/dashboard?tool=enhance` |

预渲染那份就是抓取器和首屏看到的那份 —— 也就是说**从"DLSS 5 风格"页出发，用户被送进了通用增强工具**。

### 3.2 生产环境里这个功能根本不在

在真实浏览器里读实际加载的 chunk：

```
Dashboard-D_IldU0B.js   88,434 bytes   game-character-style:0   "Cyberpunk neon":0   "Style conversion settings":0
```

对照本地构建 `Dashboard-B43r3pzz.js` **92,162 bytes**，三样都在。实测三种 query 的差别：

```
?tool=erase-object  → 高亮 "Erase object"        ← query 机制本身是好的
?tool=upscale       → 高亮 "Enhance & upscale"
?tool=game-character-style → 高亮 "Enhance & upscale"，h1 仍是 "AI Image Studio"，风格预设数 0
```

所以不是 query 坏了，是**这份代码还没上线**（你正在写的那个改动还没提交/部署）。

### 3.3 没有任何"先试"的路径

- `src/config/samples.ts` 共 5 个示例（游客可跑 4 个），`tool` 取值只有 `null` / `cutout` / `erase` / `vectorize` —— **没有一个是角色风格**。
- `/game-character-style` 上 `input[type=file]` 数量为 **0**，唯一的 CTA 是要登录的工作室。

结果就是：这一页用 20 组对比图把预期讲得很清楚，然后**游客一步都走不了**。而其它工具（去背景、矢量化、增强）都有免费示例 —— 旗舰功能是唯一没有的。

## 4. 你正在写的那版（未提交）覆盖了什么

工作区里 6 个文件被改动（+95/−21）：`Dashboard.tsx +72`、`SEO.tsx +29`、`prerender-seo.ts`、`GameCharacterStyle.tsx`、`Home.tsx +3`、`index.html`。

覆盖了：把两处 CTA 改成 `?tool=game-character-style`；在工作室里加 `characterStyleWorkflow`（h1、3 步说明条、5 个风格方向单选、隐藏分享/历史、网格从三列变两列）；首页加"直接开始人物风格转换 →"。**方向对，但下面 5 条它没有覆盖**，而且有两条正是"耦合"本身。

## 5. 建议的最小改动（按优先级；每条都给了验收标准）

**R1 · 首页那个框要么真能传，要么别装。**（最小，最显眼）
两个选项：(a) 真做 —— 接 `onDrop`/`onDragOver`，拿到 `File` 后存进 `sessionStorage`，跳到 `/dashboard` 时恢复；(b) 不做 —— 去掉虚线框和"最大 2MB"，换成一个说实话的按钮（"打开工作室 · 免费试用示例"）。
**验收**：往首屏拖一个 JPEG，要么看到预览并带着它进入工作室，要么这个区域已经不存在，且首屏不再出现任何上传尺寸承诺。

**R2 · 尺寸上限只留一个来源。**
从 `src/config/tools.ts` 的 `MAX_UPLOAD_MIB` / 16 MP 生成所有对外文案，删掉首页的 2MB 与 5MB。
**验收**：全站 grep 出的上传上限文案，数值与 `tools.ts` 一致。

**R3 · 给旗舰功能一个"一键就能试"的示例。**（这条最关键）
在 `SAMPLES` 里加一个角色风格示例（一张人物帧 + 五个风格方向里的一个 prompt），复用它已有的 `useSampleRun`（已带缓存、免账号、自带前后对比滑块），在 `/game-character-style` 和风格工作流里都放上。
**验收**：未登录用户在 `/game-character-style` 上，不跳转、不登录，一次点击就能跑出一次真实的风格转换。

**R4 · 工作室本地化。**
把硬编码文案搬进 i18n（h1、描述、9 个模式名走 `TOOL_SUMMARY[x].label`、区块标题、游客提示、示例/案例标题）。
**验收**：`language=zh` 时工作室除产品名外没有英文 chrome。

**R5 · 别把风格工作流做成九工具页上的一个开关。**
你已经用 `characterStyleWorkflow` 布尔量做了，方向没问题，但要顺手断两处耦合：
- 风格工作流**自己持有** `prompt`/文件，不要让进入它覆写通用编辑的 prompt，也不要让它在退出时影响通用流程；
- 网格形状在两种模式下不同（三列 → 两列），页面会重排；明确取舍：保留案例面板（它的案例就是风格参考），还是用风格方向替换它。
**验收**：在通用 Prompt edit 里写一段字 → 切到风格工作流再切回来，字还在；第二张图不会被模式切换静默清掉，或清掉时给出可见提示。

**R6 · 游客首屏先给他们能跑的。**
未登录时把能跑的示例提到前面，把要登录的东西收进一条明确的分界线（"登录后解锁上传与 9 个工具"），而不是铺 9 个灰按钮 + 7 张点不了的卡片。

## 6. 我这边接下来做什么

你提交并部署 R1–R3 之后告诉我，我用同一套脚本（`shared_env/ux/check-style-flow.mjs`）复测这三条的验收条件，把结果写回这份文档。SERP 与线上复核照旧归我。

## 7. 收口（2026-09-26 12:56，本地）

Codex 在 11:22 提交并部署了 `6d7bf64`（R5：把风格工作流从九工具页里分出来，生产已 Ready），随后在 11:40 中断，留了 4 个未提交文件。这一节记录由谁把剩下的口收掉、用什么证据、还剩什么。

### 7.1 落地的改动（7 个文件）

- **R3 · 旗舰功能有了免登录的第一次点击。** `src/config/samples.ts` 新增 `characterStyle`（`game-cyber-1-before.jpg` + 赛博朋克 brief），因为 `tool: null`，它自动进入 `GUEST_SAMPLE_IDS`；`/game-character-style` 页头下方新增 `FreeStyleExample`：一次点击、不跳转、不登录，直接跑这个缓存示例并给出前后对比滑块（复用 `useSampleRun`）；页头 CTA、首页的"免费试跑一个角色风格示例"都带上 `&sample=characterStyle`。
- **深链带样例。** `Dashboard.tsx` 挂载时读取 `?sample=`：预选该示例、切到它所属的工具、写入它的 brief（`isSampleId` 校验，未知值忽略）。
- **R4 · 工作室本地化。** 把 Codex 写进字典却没人调用的 86 个键接到 `Dashboard.tsx`：h1/描述（`studioTitle` / `styleWorkflowTitle`）、9 个模式名（`MODE_LABEL_KEY` → `mode*`，并新增 `modeCharacterStyle`）、区块标题、游客提示、上传区、第二张图槽位、示例网格与运行按钮、结果/继续任务/下载/清除、输出与费用行。示例名改读 `nameZh`。
- **R5 的可见提示。** 切工具时清掉第二张图，现在会写一行 `secondImageChanged` 说明，而不是静默清空。
- **R1 / R2**（Codex 已做，本次一并提交）：首页的假上传框换成诚实的"打开图片工作室"入口卡；首页"如何使用"里的上传上限改为读 `MAX_UPLOAD_MIB`。
- `scripts/prerender-seo.ts`：`/game-character-style` 的静态快照与 React 页面同步（CTA 带 `&sample=characterStyle`，并注明有一个免费的缓存示例）。

### 7.2 证据（全部在本地构建上）

- `npm run lint`（tsc --noEmit）干净；`npm test` **72/72**；`npm run build` 干净，预渲染 9 篇文章 × 3 语言 + 13 个工具页 + 3 个工作流页。
- `shared_env/ux/check-style-flow.mjs http://localhost:4321`（本地 dist，zh-CN，1440×900，未登录）：**5/5**，其中 R1 报"页面上不再有上传尺寸承诺，只剩 10 MiB"、R4 报"zh 会话里已无英文 chrome"。
- 点击探针：`/game-character-style` 上的免费示例按钮真的发出 `POST /api/image-edit/samples {"sample":"characterStyle"}`（本地静态预览无 serverless 函数，所以如预期报错）；`?tool=game-character-style&sample=characterStyle` 打开后 h1 为"DLSS5 风格转换工作流"、示例已选中、按钮为"运行示例 · 免费"、brief 正是该示例的提示词。

### 7.3 没有验证的部分

- **没有部署**：本机此刻没有外网出口（`127.0.0.1:1082` 对所有 CONNECT 返 503，DNS 应答 `198.18.0.x` 假地址，直连也失败），`vercel deploy` 与 `git push` 都跑不了。7.2 的 5/5 是**本地构建**的结果，不是线上。
- 生产上 `/game-character-style` 的免费示例是**首次运行**，会走"202 → 轮询 → 缓存"的路径，第一次点击可能等十几秒；缓存写入 Firestore 后才稳定免费（`SAMPLE_CACHE_VERSION = geometry-v2`，新样例没有旧缓存）。
- 部署后请用同一条命令复测并把结果写回本节。

### 7.4 仍然残留的英文（已知，未处理）

- 案例面板 `ShowcasePanel`：`Real cases · input → output`、`What to look at`、`Where it stops`、各案例标题与"看点"文字来自 `src/config/showcase.ts`，是内容不是 chrome。
- 工具模式下的提交按钮仍是 `TOOL_SUMMARY[mode].short · 1 credit`（provider 词汇），以及 `· second image still required` 这条行内提示。
- 增强/擦除/矢量化/抠图四个模式下的设置说明段落（"Pick an image first…" 等）还没有键。
- 导航栏的 `Pricing` 在 zh 会话下仍是英文（不属于工作室范围）。

## 8. 继续收口（2026-09-26 14:10，本地）

Codex 从 11:40 起没有再动，网络也没有恢复，所以这一轮由我接手。新增两件用户能感觉到的事，并修掉一处让"切回来"失效的路由问题。

### 8.1 R5b · 两个工作流各持有自己的提示词

原先通用编辑器和风格工作流共用同一个 `prompt`。因为 `/dashboard` 与 `/dashboard?tool=game-character-style` 是同一条路由，站内跳转不会重挂组件，所以进入风格工作流会**静默**覆盖读者在通用编辑器里写的内容。现在 `stylePrompt` 与 `prompt` 分开，进入/离开互不影响，风格方向按钮只改自己的那份。

顺带修了同一个根因的另一面：工作流标志原本读 `window.location`，而组件并不订阅路由，于是"查看全部工具"把地址栏改回 `/dashboard` 之后，页面**仍停在风格工作流**（实测：URL 已是 `/dashboard`，h1 还是"DLSS5 风格转换工作流"）。改为 `useLocation()`。

**验收（本地探针）**：通用编辑器里 mode=提示词编辑、prompt=默认句 → 从首页 CTA 进风格工作流（h1 变、brief 变成示例提示词）→ 点"查看全部工具"回来 → prompt 仍是**默认句**、mode 仍是**提示词编辑**。PASS。

### 8.2 R6 · 游客先看到能跑的，再看到要登录的

未登录时，示例网格移到登录门之前；那个 300px 高的虚线大框换成一行"登录后可以上传自己的图片，并解锁全部 9 个工具"。实测游客首屏：示例标题 y=420，登录那一行 y=864，虚线框 0 个。

### 8.3 案例面板的 chrome 也本地化了

`ShowcasePanel` 的 `Real cases · input → output`、`What to look at`、`Where it stops:`、`Sign in to load these inputs`、`Load these inputs`、`Measured …` 走 i18n（新增 9 个键）。案例标题与"看点"文字仍在 `src/config/showcase.ts` 里是英文 —— 那是内容，不是 chrome，留待决定。

### 8.4 证据（本地 dist，非线上）

- `npm run lint` 干净、`npm test` **72/72**、`npm run build` 干净。
- `check-style-flow.mjs http://localhost:4321`：**5/5**。
- 新探针 `probe-r5b-r6.mjs`：R5b PASS、R6 PASS（见 8.1 / 8.2 的数字）。
- 字典两语言键完全对齐（dashboard 命名空间 159 键），重复键（`generationSettings`/`orTryExamples`/`newImage` 的旧条目）已清理。

### 8.5 还是没部署

网络出口依旧不通（`api.github.com` 与站点都返回 000）。本地 `main` 现在比 `origin/main` 多 4 个提交；已挂一个 30 分钟一次的探针任务 `deploy_when_online`：一旦出口恢复就推送（推送即触发 Vercel 部署）、跑线上 5 条验收、把结果写回本节，然后自己撤掉。
