# Download 核心三问更新（2026-10-25）

服务规则：R1（Studio 交付与游戏画面主线）、R3（沿用产品页，不造同义页）。

用户明确授权只更新核心三问，保留其他内容，不编下载或支持承诺。

## 改动

只改 `src/components/DownloadIntent.tsx` 的三条答案及对应来源行。组件由客户端与预渲染共享，中英文一起对齐；其余模块未动。完整中英逐条改前/改后见 [answers.json](answers.json)，线上旧正文与新产物完整三问对照见 [before-after.json](before-after.json)。

- 问一：从“独立下载途径未确认”更新为 NVIDIA 已发布的 NBA 2K27 / RTX 50 / 616.64 实例，区分驱动、开发者资源与本站材料包。
- 问二：从 DLSS 4.5 的通用说明更新为 NVIDIA 对该指定游戏的驱动与设置说明；不外推游戏/显卡范围，不提供 DLL 修改或注入步骤。
- 问三：确认有来源的已发布实例，同时说清 Studio 是独立 Windows RTX 风格转换与神经渲染重绘工具，申请不保证获准或交期，无公开 Studio 安装包或 APK；浏览器示例不是手机游戏内 DLSS。

来源：https://www.nvidia.com/en-us/geforce/news/nba-2k27-dlss-5-3d-guided-neural-rendering-geforce-game-ready-driver/

来源发布日 2026-09-03；本次 2026-10-25 curl 核验 HTTP 200，正文与 JSON-LD 日期及 NBA 2K27 / RTX 50 范围一致。616.64 是该公告发布的驱动，不宣称它是今天最新驱动。

## 本地验收

- `npm run lint`：通过。
- `npm test`：110/110 passed。
- `npm run build`：通过；ARTICLE-MARKDOWN: PASS。
- 无来源声明闸门：两站各 0 命中，PASS。
- 定向静态比对：中英文各 3 问、3 条一手来源；三问以外所有可见文字、title/meta/canonical/hreflang 保持一致；组件其他源码保持一致。构建脚本/样式文件哈希属于构建产物，不当作 SEO 字段变化。
- 上线前保护巡检：PROTECTION: changed=0 down=0 verdict=FROZEN-OK。

## 生产验收

代码提交：`85939ef`，已 push 到 origin/main；Vercel dlss5-main 状态 success（Deployment has completed）。

- `/download`、`/zh/download`：匿名抓取 HTTP 200，原始 HTML 三问逐字匹配本地产物；标题、meta、canonical、hreflang 与改前一致。见 [online-results.json](online-results.json)。
- 浏览器客户端：三问均显示新答案与 Checked: 2026-10-25，一手来源链接正确；见 [browser-en.json](browser-en.json) 与 [截图](online-questions.png)。
- `FLAGSHIP-PAGES: fails=0 verdict=PASS`（中英下载页）。
- 更新前保护巡检：仅 `/download` 的 words / bodyHash 变化；`changed=1 down=0` 为本次已授权正文变更，SEO 字段无变化，其余保护页未变。变更已逐页写外部 CHANGE-LOG，旧基线已归档，再捕获新基线。
- 不提交 GSC 请求，不重新提交 sitemap；本次不能声称 Google 已更新摘要或排名提升。

最终保护巡检：`PROTECTION: changed=0 down=0 verdict=FROZEN-OK`。
