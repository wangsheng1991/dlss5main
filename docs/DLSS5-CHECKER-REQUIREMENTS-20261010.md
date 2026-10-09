# DLSS 5 兼容性检测器 —— 需求说明（开工版）

日期：2026-10-10｜状态：需求定稿，**壳子已留**，业务代码由王胜写
对应分析：`docs/DLSS5_NET_VS_APP_20261009.md`（Codex）、工作区 `dlss5-net-vs-app-analysis-20261009.md`（default_agent 复核）

---

## 0. 一句话

他们有一个「查表 + 让你自己选卡」的网页；我们要有一个**能真实认出你这台机器里那块卡、给出带来源和日期的结论、并把同一份结论以机器可读方式开放出去**的软件 —— 页面数还要压过他们。

**他们有的我们都要有；他们没有的（真实检测、API、更新管道），我们也要有，而且写在代码里。**

---

## 1. 靶子现状（2026-10-10 实测，可直接引用）

| 维度 | dlss5.net（第三方竞品） | 证据 |
|---|---|---|
| sitemap 声明页数 | **38** | `https://www.dlss5.net/sitemap.xml` |
| 实际可达页数 | **≥ 64**（26 个页面根本没登记进 sitemap） | 站内链接广度爬取 |
| 页面工厂 | `/gpu/rtx-5090`、`/gpu/rtx-4080`、`/gpu/rtx-4070`、`/gpu/rtx-3070`、`/gpu/rtx-3060`（按卡一页）；`/ai-pc/nvidia-rtx-spark*` 一簇 8 页；上述两类都有 `/pt` 镜像 | 爬取 + 直接探测 |
| 多语言 | 只有 `/pt`（`/es /de /fr /ja /ko /zh` 全 404） | 前缀探测 |
| 渲染 | Next.js 服务端渲染，正文在 HTML 里 | 首页 147,161 字节 |
| 结构化数据 | FAQPage（8 组）+ WebApplication + Offer | 首页 JSON-LD |
| 更新信号 | About/Editorial Policy 写 reviewed 日期；sitemap **无 lastmod** | 页面正文 |
| 排名 | `dlss 5 gpu compatibility` 有机 **#1**；`dlss 5 supported cards` ~#4；`dlss checker` ~#2–3；被 Google AI 回答引用 | 我的 SERP 实测 |
| 它**没有**的 | 真实硬件检测（它只认用户手输/选择的型号，About 明说）、机器可读 API、自动更新管道、转化路径、除 pt 外的语言 | About 页自述 + 全站扫描 |

**它的增长引擎 = 模板 × 实体 × 语言。** 每来一个新 NVIDIA 产品（RTX Spark），它就复制一簇 8 页 ×2 语言；sitemap 都不跟着更新。**我们不学它这套「填字数」，我们学它的结构，再在结构上加他们没有的三层。**

---

## 2. 我们要做的三层

```
L1 数据层   一份单一事实源（卡的型号/状态/来源/核查日期）—— 不许有第二个地方写兼容性结论
L2 应用层   真实检测 → 判定 → 结果页 → 分享 → 转化
L3 机器层   /api/*.json + llms.txt + schema —— 让 AI 直接引用我们，而不是引用他们的 HTML
```

---

## 3. 功能需求

### E1 真实硬件检测（**他们做不到的那件事**）
- 浏览器内读取用户真实 GPU：优先 WebGPU `navigator.gpu.requestAdapter()` → `adapter.info`（vendor / architecture / device / description）；回退 WebGL `WEBGL_debug_renderer_info` 的 `UNMASKED_RENDERER_WEBGL`；再无则 `navigator.userAgent` 粗判。
- 输出：`{ vendor, renderer, matchedSlug, source: 'webgpu'|'webgl'|'user-agent'|'none' }`。
- 读不到时要给**明确的可执行提示**（「用 Chrome/Edge 打开」或「手动选择型号」），不许静默失败。
- 隐私：只在本机推断，不把硬件信息上传（除非用户点「提交反馈」，那一项单独同意）。
- 验收：Chrome/Edge（WebGPU）与 Safari/Firefox（WebGL 回退）各跑一次，至少一处能给出型号或明确提示。

### E2 判定引擎
- 输入：检测到的型号（或用户手选）→ 输出三态结论：`confirmed` / `planned` / `unsupported`，外加 `unknown`（数据不足）。
- **硬规则（写进代码并由测试守着）：没有 `sources` 或没有 `checkedAt` 的条目，永远只能返回 `unknown`。** 不允许凭印象给结论。
- 每个结论必须能回答：依据是什么（来源链接）、什么时候核对的（日期）、适用于哪个版本。
- 验收：`tests/dlss-checker.test.ts` 里的数据完整性用例通过。

### E3 结果页（可分享，这一层他们没有）
- URL：`/dlss-checker/<gpu-slug>`（例如 `/dlss-checker/rtx-4070`），服务端可读正文，独立 title / description / canonical。
- 页面内容：这块卡能不能跑 DLSS 5、依据与日期、能跑什么游戏、**以及能不能跑我们的 AI 工作流**。
- 分享：结果可复制链接（带 `?gpu=` 亦可），社交卡片有图。
- 验收：`curl` 直接取该 URL 能看到 H1 与结论正文（不依赖 JS）。

### E4 证据链（信任资产）
- 每条数据带：`sources[{ label, url, checkedAt }]`、`lastVerified`、`conflicts[]`（官方来源互相矛盾时如实写出）。
- 页面上显示「最后核对：YYYY-MM-DD」徽章；变更写进 changelog。

### E5 页面工厂（**页面数就是在这里长出来的**）
- 一份数据 → 自动生成：hub 1 页 + 卡页（每张有独立结论的卡）+ 游戏页（每个官方支持的游戏）+ 指南页。
- **红线：不为凑数生成薄页。** 生成条件写进脚本：该实体必须有 `status ≠ unknown` 且有来源；否则不生成、不进 sitemap。
- 卡片覆盖目标（他们只有 5–6 张）：RTX 50 系（5090/5080/5070/5060…）、RTX 40 系、RTX 30 系、GTX 16/10 系、AMD RX 7000/9000、Intel Arc。**每张卡只有在有官方依据时才生成页面**，预计首批 12–20 张。
- 验收：数据文件增减条目后 `npm run build` 的产物页数跟着变；未达标的实体不出现。

### E6 机器可读层（**他们没有的**）
- `/api/gpu/<slug>.json`：单卡结论 + 来源 + 日期 + 版本；`/api/dlss5/gpus.json`：全表。
- `/llms.txt`：写明「这是机器可读入口」+ 主要页面清单 + 引用建议。
- 每个 JSON 带 `lastVerified`、`sources`，字段名稳定（外部和 AI 会缓存，改名等于断链）。
- 验收：`curl /api/gpu/rtx-4070.json` 返回 200 且字段齐全；`/llms.txt` 存在且指向可用页面。

### E7 转化钩子（我们的生意，他们没有）
- 结论页底部：**「你这块卡能跑什么」** —— 本地/云端的可行工作流建议（升级、修复、样式转换），一键进主站对应工具。
- 转化路径必须与结论相关（4060 用户看到的是「够用/不够用」的真实判断），不许无脑弹窗。
- 埋点：检测触发率、检测成功率、结论页 → 工具的点击率。

### E8 更新管道
- 脚本：定时（建议每日）核对官方来源，产出 diff；有实质变化才写 changelog 并更新 `lastVerified`。
- 结论变了要在页面上留痕（谁改的、为什么），不要静默改数字。
- 验收：手工跑一次脚本，产出 diff 报告且不误报。

### E9 搜索呈现
- 每页：唯一 title / description / canonical / hreflang、H1、正文、内链、FAQ 可见问答 + `FAQPage` JSON-LD、`lastVerified` 日期。
- sitemap 由数据生成（**不要重蹈他们 sitemap 与实际页面不一致的坑**）。
- `noindex` 规则：`status = unknown` 的页面上线前必须处理——要么不生成，要么 `noindex`。

### E10 多语言
- 起步 en + zh 两套（`/` 与 `/zh`），路由与 hreflang 成对；文案按语言真实改写，不机器直译堆词。
- 他们只做了 pt；我们要在**我们真正的市场**（en 为主）上做深。

### E11 埋点
- 事件：`checker_detect_start` / `checker_detect_ok` / `checker_detect_fail` / `checker_result_view` / `checker_cta_click`。
- 复用 `src/lib/analytics.ts` 的既有桥接，不另起一套。

### E12 合规与边界
- 页面显著位置声明：**独立站点，与非 NVIDIA 官方无隶属关系**；不冒充官方、不承诺未发布功能。
- 所有兼容性结论必须有官方来源；引用来源要链接回原文。
- 不做「DLSS 5 下载器」这类越界承诺（他们没有下载源，我们也不做）。

### E13 本地软件必须出现在页面上（我们的东西不能缺席）
- **每一张卡的结论页要同时回答两个问题**：游戏里的 DLSS 5 支不支持，以及**我们的本地软件（DLSS5 Studio）在这台机器上能不能跑**。
- 本地软件的要求与实测数字来自我们**自己已发布**的 `/download` 要求页（`src/content/studioPage.ts` 的 `req.*`）与真实运行记录：
  - 系统：Windows 10 (1909+) 64-bit 或 Windows 11
  - 显卡：NVIDIA RTX 20 系及以上
  - 驱动：610+ 才有硬件 NVENC，旧驱动自动降级并如实记录
  - 内存：最低 8 GB，1080p/4K 视频建议 16 GB
  - 磁盘：约 3 GB 可用（解包约 1.1 GB）
  - 实测：Windows 11 Pro + RTX 4090 24 GB + 驱动 591.86，720p → 2560×1440 H.264 用时 **87.4 s（2.43 s/帧）**
- **不许让页面说一句 `/download` 页不认的话**：这些字符串有测试逐字盯着（`tests/dlss-checker.test.ts`），改一边不改另一边会红。
- 结论页永远给**两条可走的路**：本地 Studio / 在线转换器。竞品只有「支不支持」一个问题，我们有「那我该怎么办」。
- 验收：无 JS 抓取结果页能看到本地软件的要求与实测数字。

### E14 数据与理论：必须比 dlss5.net 强，而且要看得见
- **数据**：两条独立结论轴（游戏内 / 我们的本地软件）＋ 每条结论带来源、核对日期、版本；官方来源互相矛盾时写进 `conflicts` 并展示，不挑好看的当唯一真相。
- **理论**：不手打每张卡的结论，写**规则**（`src/features/dlssChecker/rules.ts`），由架构推导结论。加一个新架构只加一条规则，所有卡自动跟上；每条结论能回答「凭什么」。
  - 规则自己**没有来源就不许发布结论**（只能标记 provisional），与手工条目同一把尺子。
  - 手工条目与规则推导不一致时，识别为 `conflict`：页面发有来源的那条，维护端必须消解。
- **可外推**：竞品是 64 张手工页面，每加一张卡重写一遍；我们的规则表能覆盖整张卡表（含 AMD/Intel，他们只有 5 张 N 卡页面）。
- **可被引用**：同一份数据同时产出页面、`/api/*.json` 与 `llms.txt`，AI 引用我们时拿到的是结构化字段，不是一堆 HTML 文案。
- 验收：删掉一条规则/改一条规则，测试能立刻指出受影响的结论；`npm test` 里 103 条用例全绿（其中 9 条专盯检测器）。

---

## 4. 数据模型

```ts
type GpuStatus = 'confirmed' | 'planned' | 'unsupported' | 'unknown';

type GpuEntry = {
  slug: string;                 // rtx-4070（URL 用）
  vendor: 'nvidia' | 'amd' | 'intel';
  name: string;                 // GeForce RTX 4070
  aliases: string[];            // 检测字符串里可能的写法
  generation: string;           // Ada / Blackwell / …
  vramGb?: number;
  status: GpuStatus;
  note?: string;                // 一句话结论
  ourWorkflows?: {              // 我们独有的：这块卡跑我们的东西怎么样
    upscale?: 'good' | 'ok' | 'slow' | 'cloud-only';
    restore?: 'good' | 'ok' | 'slow' | 'cloud-only';
  };
  sources: Array<{ label: string; url: string; checkedAt: string }>;
  lastVerified?: string;        // YYYY-MM-DD
  conflicts?: string[];
};
```

游戏页：`GameEntry { slug, title, status, evidence[], releaseDate?, sources[], lastVerified }`。

规则表（「理论」层）：

```ts
type SupportRule = {
  id: string;                    // blackwell-native
  architectures: string[];       // 覆盖哪些架构（与 GpuEntry.generation 同写法）
  verdict: GpuStatus;
  rationale: string;             // 为什么这样推，会原样显示给用户和 AI
  sources: SourceRef[];          // 空数组 = 这条规则还不许发布结论
};
```

判定顺序：手工条目（有来源才发）→ 规则推导（有来源的规则才发）→ 都没有就写「还没有结论」。

---

## 5. 页面与 URL 规划（「页面数」怎么打）

| 阶段 | 页面构成 | 数量 | 与他们的对比 |
|---|---|---|---|
| 起步（第 1 周） | 1 hub + 3–5 张重点卡 + 1 个检测结果页 + 1 个指南 | 6–8 | 他们 64+，**数量上我们不追，先追「每页都有唯一结论」** |
| 第 1 月 | hub + 12–20 张卡 + 4–6 个游戏 + 3–5 个指南 + zh 镜像 | 25–45 | 他们的卡页只有 5–6 张；我们的卡覆盖是他们的 3–4 倍 |
| 第 2 月 | + 每张「已确认」卡的 API 页 + 逐游戏结论页 | 60–80 | 数量持平/超过，但**每页都能被 API 引用**，且 sitemap 与实际一致 |

**压过他们的具体做法（三条，互不重复）：**
1. **广度**：他们的 `/gpu/*` 只有 5 张且没登记进 sitemap；我们把卡表做全、并且 sitemap 诚实全量登记。
2. **独有页面类型**：`/dlss-checker/<gpu-slug>`（由检测结果生成的分享页）他们**结构上做不出来**，因为他们的结果是本地的、不可分享、不可索引。
3. **AI 引用面**：`/api/*.json` + `llms.txt` —— 他们只有 HTML，AI 要引用他们只能读页面；我们可以被直接结构化引用。

**反向指标（要盯的）：** 上线后 2 周内有没有出现「已抓取-尚未编入」的页面（thin content 信号）。出现即停止扩页、先补唯一数据。

---

## 6. 差异化清单

| 能力 | dlss5.net | 我们要有 |
|---|---|---|
| 服务端可读正文 / 每页独立 title | ✅ | ✅（照做，这不叫抄，这是基本功） |
| FAQ schema / 内链 / 更新日期 | ✅ | ✅ |
| 按卡、按游戏分页 | ✅（卡只有 5 张） | ✅（卡表做全，含 AMD/Intel） |
| 多语言 | 只有 pt | en + zh 起，按真实市场加 |
| **真实硬件检测** | ❌ 只认手输 | ✅ WebGPU/WebGL 读真卡 |
| **两条结论轴**（游戏内 + 我们的本地软件） | ❌ 只有「支不支持」一个问题 | ✅ 两个答案 + 两条可走的路 |
| **本地软件的要求与实测数字在页面上** | ❌ 他们没有自己的软件 | ✅ Studio 要求 + 4090 实测（87.4 s） |
| **规则推导出的结论（理论层）** | ❌ 64 张手工页面，每张重写 | ✅ 一条规则覆盖一个架构 |
| **可分享/可索引的检测结果页** | ❌ | ✅ |
| **机器可读 API + llms.txt** | ❌ | ✅ |
| **更新管道 + diff/changelog** | ❌（纯手工） | ✅ 脚本化 |
| **转化路径** | ❌（只挂广告） | ✅ 结论 → 我们的工具/Studio |
| sitemap 与实际页面一致 | ❌（38 vs 64+） | ✅ 由数据生成 |

---

## 7. 验收标准（可测）

- [ ] `curl` 取结果页能看到 H1 + 结论（无 JS）。
- [ ] 每个页面的 title/description 唯一（脚本抽查）。
- [ ] `/api/gpu/<slug>.json` 200 且字段齐全、`lastVerified` 非空。
- [ ] 数据完整性测试通过：`status ≠ unknown` 的条目必须有来源与核对日期。
- [ ] 检测器在 Chrome/Edge 与 Safari/Firefox 都能给出型号或明确提示。
- [ ] 上线 2 周：sitemap 100% 被抓取，无「已抓取-尚未编入」新增。
- [ ] 埋点口径可见：检测成功率、结论页 CTA 点击率。

---

## 8. 明天你写代码时，壳子在这里（我已留好）

| 文件 | 里面已有什么 | 你要补什么 |
|---|---|---|
| `src/content/dlssChecker.ts` | 类型定义、**本地软件要求（与 `/download` 逐字一致）与本机实测数字**、示例条目（游戏内结论全部 `status: 'unknown'`，刻意不编数据）、`TODO(DATA)` 清单 | 用 NVIDIA 官方来源填 `status` / `sources` / `lastVerified` / `ourWorkflows` |
| `src/features/dlssChecker/rules.ts` | 「理论」层：`SupportRule` 类型、`deriveFromRules()`、证据分级 `EVIDENCE_TIERS`（规则表现在是空的，填写模板在注释里） | 拿到官方原文后加规则；来源不齐的规则只能继续 provisional |
| `src/features/dlssChecker/detect.ts` | `detectLocalGpu()` 已实现：WebGPU → WebGL → UA 三级回退，含失败提示 | VRAM 估算、驱动版本、更多浏览器边界 |
| `src/features/dlssChecker/verdict.ts` | `normalizeGpuName()`、`matchGpu()`、`canConclude()`（无来源不下结论）、`reconcile()`（手工 vs 规则推导对账，冲突会被识别并展示）、`verdictFor()`、`localSoftwareVerdict()` | 版本维度、置信度打分、冲突来源的加权 |
| `src/pages/DlssChecker.tsx` | 页面骨架：检测区 / **两条结论轴** / 本地软件要求与实测 / 「我们怎么定的」证据分级 / 卡表 / FAQ，均带 `TODO(王胜)` 标记 | 每个区块的真实文案与交互、结果页路由 `/:gpu-slug`、分享卡片 |
| `src/App.tsx` | **仅本机开发可见**的路由 `/dlss-checker`（生产构建里连分块都不存在，已实测） | 预渲染登记、sitemap 生成、`noindex` 规则 |
| `tests/dlss-checker.test.ts` | 9 条用例：归一化、匹配、无来源不下结论、规则 provisional 与冲突、两条轴独立、**本地软件要求防漂移**、数据完整性、slug 规范 | 结果页与 API 的用例 |
| `docs/DLSS5-CHECKER-REQUIREMENTS-20261010.md` | 本文件 | — |

**「页面数」的计数器**：`shared_env/dlss-line/count-dlss5net-pages.mjs`（只读；数 sitemap 声明数、实际可达数、未登记列表，并与上次比对 delta）。要盯他们的增长节奏就跑它，别靠感觉。

---

## 9. 不做的事（红线）

- 不照抄他们的文案与页面结构（学结构，不抄字句）。
- 不为了页面数生成无唯一数据的薄页。
- 不在结论里出现「NVIDIA 官方」「官方下载」这类误导表述。
- 不在 dlss5nvidia.com 上做未经评估的路由/转化改动；壳子默认只在本地可见。
- 不为竞品做负向操作（不刷、不举报、不抢域名）。

---

## 10. 待拍板

1. **「20 万/月」的来源**：是第三方估算（Similarweb 之类）还是你自己的后台？我们这边可实测的基线是：dlss5nvidia.com 28 天 **1,690 次点击**（GSC），dlss5.app 三个月 **29 次点击**。口径不同结论会差很多。
2. **托管位置**：并进 `dlss5nvidia.com`（借已有权重，但要动在赚钱的站）还是独立站/子域（干净但要自己攒权重）。**我倾向并进主站**，理由是主站已被判定为主题相关且有稳定排名。
3. **软件形态**：网页优先（先拿到 SEO 与 AI 引用），还是同时要桌面版（本地跑真检测、生成报告）？
