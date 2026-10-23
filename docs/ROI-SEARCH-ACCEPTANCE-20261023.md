R1/R2/R3/R5：维护风格转换与 Studio 主线，增强器仅作为有限入口；只发布有来源与真实日志的证据。

# A–E 搜索落点验收 · 2026-10-23

仅修改两个英文 `/vs` 对比页、英文 `/visual-enhancer`、`/dashboard`。首页、下载页、冻结博客和中文页面均未改；未 capture 或更新保护基线。用户已有未提交文件不纳入本次提交。

## A：三次真实任务

隔离构建中的 useAuth 模拟已登录用户与额度，真实供应商签名上传、flux-klein 推理、轮询、结果和浏览器下载。不是生产账户鉴权/扣费验收。素材为仓库自有 public/examples/sample1.jpg、sample2.jpg，按 sample1 / sample2 / sample1 顺序，默认目标因子 2，上限 1536；没有失败替换样本。计时从点击提交到下载文件 saveAs 完成；输出尺寸由下载后的 WebP 实际解码得到。每笔仅提交一次。

| 次序 | 开始 UTC | 下载完成 UTC | 端到端秒 | 下载输出尺寸 | 结果 | task id |
|---|---|---|---|---|---|---|
| 1 | 2026-10-23T08:29:22.128Z | 2026-10-23T08:29:37.997Z | 15.869 | 1536×1104 | 成功 | task_SsU1aJMRUZL7b326GPlahMdxQzrMBRfI |
| 2 | 2026-10-23T08:29:42.418Z | 2026-10-23T08:29:58.775Z | 16.357 | 1536×1056 | 成功 | task_bcUMIhNYLoPi0CfviI2gYoY0Dw5iPgU5 |
| 3 | 2026-10-23T08:30:03.614Z | 2026-10-23T08:30:19.581Z | 15.967 | 1536×1104 | 成功 | task_acydlZifpvXKzvUkv4dnTOZRwnBiK4kt |

三次成功，页面公布精确区间 15.869–16.357 秒、样本量与方法，不构成速度承诺。永久公开日志：`public/evidence/enhancer-runs-20261023.json`；原始 runner、真实输出、截图、日志 `/tmp/roi-ae-20261023/`（real.mts、real.log、results.json、run-1 至 run-3）。日志未含 API key、授权头或签名结果 URL。

## B/C：条件化答案

两个 `/vs` 页各增加指定三个 PAA 原问；从 `src/content/roiEvidence.ts` 复用上线文章答案，未修改其数据或博客组件。增加可见 Last checked、官方来源 URL/核对日、FAQPage/Question/Answer、dateModified，以及比较全文和 `#feature-picker-heading` 选择器的描述性内链。原 FAQ 保留并合并为单一 FAQPage，避免重复。四条 NVIDIA/AMD 来源本轮 curl 均 HTTP 200，明细 `/tmp/roi-ae-20261023/sources.json`。未核实范围保留，不给 FPS 或性能百分比。

## D/E：边界与内链

增强器新增边界 FAQ，包含1536上限、2/4目标因子、非逐像素超分、同 task id 恢复；RTX/Android 仅说明浏览器缓存示例，不承诺桌面兼容或 APK。保留已有可见 FAQ，并在单一 FAQPage 中合并，静态与 React 使用同一组件。
Dashboard 原文/结构保持，末尾只增加两个描述性链接；noindex 不变。

## 验收原文

- `FLAGSHIP-PAGES: fails=0 verdict=PASS`（默认旗舰名单及三个内容目标定向检查）
- `判定: PASS — 没有无来源的数字/引语/技术名`
- `PROTECTION: changed=0 down=0 verdict=FROZEN-OK`
- `npx tsc --noEmit`：exit=0，无错误输出。
- `109/109 passed`
- `✓ built in 4.12s`

本地检查使用既有 fetch 适配器把生产域名读取指向候选 dist，保留真实 canonical；只对首页复现已知 Cloudflare email protection 转换。未改闸门脚本与基线。首次用 localhost 作为 --base 导致 canonical/sitemap 域名不匹配，改为 fetch 适配后通过；未为过闸门修改页面。全部 HTML 排除构建资源文件名后比较，仅本轮四条 URL 变化。四页浏览器检查 PASS，内容页仅一个 FAQPage，手机390px无横向溢出；截图在上述临时目录。静态块与浏览器共享同一个 React 组件。React best practices 检查：静态数据、无新 effect/请求/依赖，语义标题与真实链接、稳定列表 key。

部署后 curl 与 IndexNow 结果另存 `/tmp/roi-ae-20261023/online/`、`indexnow-*.log`。IndexNow 只通知支持该协议的搜索引擎，不通知 Google，也不保证收录或排名。
