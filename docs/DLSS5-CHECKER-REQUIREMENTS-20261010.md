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
| `src/content/dlssChecker.ts` | 类型定义、判定规则常量、**各字段含义与填写规矩**、示例条目（全部 `status: 'unknown'`，刻意不编数据）、`TODO(DATA)` 清单 | 用 NVIDIA 官方来源填 `status` / `sources` / `lastVerified` / `ourWorkflows` |
| `src/features/dlssChecker/detect.ts` | `detectLocalGpu()` 已实现：WebGPU → WebGL → UA 三级回退，含失败提示 | VRAM 估算、驱动版本、更多浏览器边界 |
| `src/features/dlssChecker/verdict.ts` | `normalizeGpuName()`、`matchGpu()`、`verdictFor()`、`canConclude()`（无来源即 unknown 的守卫）已实现 | 版本维度、置信度打分、冲突来源处理 |
| `src/pages/DlssChecker.tsx` | 页面骨架：检测区 / 结果区 / 卡表 / 「你能跑什么」区 / FAQ 区，均带 `TODO(王胜)` 标记 | 每个区块的真实文案与交互、结果页路由 `/:gpu-slug`、分享卡片 |
| `src/App.tsx` | **仅本机开发可见**的路由 `/dlss-checker`（上线前删 DEV 判断 + 在 `scripts/prerender-seo.ts` 登记） | 预渲染登记、sitemap 生成、`noindex` 规则 |
| `tests/dlss-checker.test.ts` | 已实现：归一化、匹配、守卫、数据完整性四个用例 | 结果页与 API 的用例 |
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
