# SEO / Search Console TODO

自动化能完成的站内 SEO、站点地图和 URL 检查已完成。只有 Google 的抓取队列和 Search Console 报告刷新需要等待，不能通过代码强制改变。

## 仅需等待 Google 抓取队列

2026-09-25 通过已登录 Search Console 逐页复核了报告中的新文章和旧验证样本；它们当前均显示“网址已收录到 Google”，因此没有需要重复请求的 URL。报告中的“已发现—尚未编入索引”和“已抓取—尚未编入索引”数字是 2026-09-21 的历史快照，等待下一次报告刷新即可。

2026-09-25 对新增的 `/virtual-try-on` 做了网址检查，发现旧部署把它当成首页 fallback，导致 Google 显示“Google 无法识别此网址”，且未识别到 sitemap。已将四个新增工具页（virtual-try-on、interior-design、portrait-retouch、virtual-makeup）补成独立预渲染页面，包含独立 title、description、canonical、BreadcrumbList、FAQ 和 before/after 内容；部署后需重新读取 sitemap。

2026-09-25 新增独立的 `/game-character-style` 角色案例页和 `/video-upscaler` 视频超分工作流页。前者完整展示 20 组原创游戏人物 before/after 参考，后者包含 2 个 MP4 demo、VideoObject、FAQ 和 Seedance 2.5 成本文章链接；两页均有独立 title、description、canonical、JSON-LD 和 sitemap 入口。

当日对 `/virtual-try-on` 点击了“请求编入索引”，Google 返回“超出了配额：今天已经超出每日配额”。配额重置前不再重复点击；重置后只需对这四个新工具页、`/game-character-style` 和 `/video-upscaler` 各检查一次并按页面状态请求编入索引。该动作属于 Google 后台配额限制，代码侧已无可替代的提交接口。

## 复核项

- 已确认 `https://www.dlss5nvidia.com/sitemap.xml` 状态为“成功”，2026-09-25 重新提交后发现 57 个网址，当前代码新增两页后应刷新为 59 个网址，已发现视频仍以 Google 报告为准。
- 新增的四个生成式工具页、角色案例页和视频工作流页已加入同一份 sitemap，并由 prerender 脚本生成独立 HTML；上线后每页的 title、description、canonical、BreadcrumbList 和 h1 均不再回退到首页。
- 报告中的重复规范页和重定向页不应单独提交；它们由 canonical/重定向规则处理。
- 等 Google 抓取一轮后，再比较 `dlss 5 visual enhancer`、`dlss 5 upscaling` 和 `dlss 5 download` 的 CTR，不要在数据窗口尚未更新时继续改标题。

## 本次自动验证结果（2026-09-24）

- Sitemap 公开返回 200，共 53 个 URL。
- Sitemap 中的 53 个 URL 全部返回 200，均有唯一 title、description、keywords、canonical；新加入的 `/pricing` 和 `/comparisons` 也已上线。
- `/login`、`/register`、`/dashboard` 均为 `noindex,nofollow`，登录页和注册页已从 Sitemap 移除。
- 首页、模型、下载、文档、企业、比较和定价页均已预渲染独立首屏 HTML，避免 SPA fallback 把首页 metadata 当成所有页面的 metadata。

## Search Console 执行记录（2026-09-25）

已在已登录的 Search Console 网址检查中完成逐页复核。以下页面都显示“网址已收录到 Google”；此前记录中的“已请求编入索引”是当时的提交动作，当前不再重复提交：

- `https://www.dlss5nvidia.com/image-to-svg`：已请求编入索引。
- `https://www.dlss5nvidia.com/blog/best-ai-image-upscaler-2026-comparison`：已请求编入索引。
- `https://www.dlss5nvidia.com/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026`：已请求编入索引。
- `https://www.dlss5nvidia.com/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`：已请求编入索引。
- `https://www.dlss5nvidia.com/blog/what-is-dlss-5-neural-rendering-guide`：已请求编入索引。
- `https://www.dlss5nvidia.com/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`：已请求编入索引。
- `https://www.dlss5nvidia.com/en/blog/dlss-5-latest-news-september-2026`：已请求编入索引。
- `https://www.dlss5nvidia.com/en/blog`：已请求编入索引。

复核时发现以下页面已经收录，无需重复请求：

- `/remove-background`
- `/erase-object`
- `/es/mejorar-calidad-imagen`
- `/blog/dlss5-artistic-vision-debate-honest-assessment`

报告中的重定向页和重复规范页不应单独提交；其规范化由站点重定向/canonical 规则处理。Google 的索引状态不会在提交后立即变更，后续只需等待抓取队列处理并观察报告刷新。

线上复核（2026-09-25）：sitemap 返回 200，57 个 URL 全部返回 200，且每页 title、description、keywords、canonical 均存在并与 URL 匹配。首页静态 HTML 也已补齐与 React 首屏一致的 title、description、Open Graph/Twitter 图片和 JSON-LD。

## 静态 SEO 修复（2026-09-25）

- 首页静态 `<title>`、description、keywords 已对齐当前 DLSS 5 visual enhancer / image converter 搜索意图，避免无 JavaScript 抓取时仍显示旧的 image upscaler 标题。
- 首页增加 Organization、WebApplication、VideoObject 和 FAQPage JSON-LD，以及 Open Graph/Twitter 大图标签；React 首页不再重复注入同一份结构化数据。
- 工具页结构化数据增加 BreadcrumbList，保留原有 WebApplication、HowTo 和 FAQPage。
- `npm run lint`、`npm test`（51/51）和 `npm run build` 均通过。

## 内容与转化修复（2026-09-25）

- 根据最近 Search Console 的查询—落地页错配，在首页增加了明确的 `DLSS 5 game character style conversion`、`DLSS 5 visual enhancer` 和 `DLSS 5 image converter` 语义入口。
- 移除了依赖 `picsum.photos` 的随机社区瀑布流，改为可复核的本地原创素材，避免随机图片、随机用户名和第三方加载影响可信度与稳定性。
- 增加 20 组通用图像前后对比、20 组游戏角色风格参考、两个 6 秒 MP4 对比演示，并为视频加入 `VideoObject` 结构化数据。所有素材均标注为独立原创参考，不声称是 NVIDIA 官方 DLSS 5 输出。
- 角色案例明确展示不变项（轮廓、服装、动作、身份）与可变项（光照、材质、调色、环境），用于承接游戏角色风格转换搜索意图。

上线后需要观察：`dlss 5 visual enhancer`、`dlss 5 image converter`、`game character style conversion` 和 `dlss 5 online` 的查询—页面分布与 CTR。不要在 Google 尚未刷新数据前重复改标题。
