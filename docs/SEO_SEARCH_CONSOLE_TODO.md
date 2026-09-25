# SEO / Search Console TODO

自动化能完成的部分已完成。以下项目需要站点所有者在已登录的 Google Search Console 中操作；当前浏览器自动化会被 Google 重定向到登录页，没有可用的 Search Console 写入凭据，因此不代填账号或绕过验证。

## 需要手动请求编入索引

Google URL Inspection 的每日配额恢复后，逐个打开以下 URL，点击“请求编入索引”：

- [Image to SVG](https://www.dlss5nvidia.com/image-to-svg)
- [Remove Image Background](https://www.dlss5nvidia.com/remove-background)
- [Erase Object](https://www.dlss5nvidia.com/erase-object)
- [Spanish image enhancer](https://www.dlss5nvidia.com/es/mejorar-calidad-imagen)

可直接从 Search Console 的网址检查入口粘贴 URL：<https://search.google.com/search-console/inspect?resource_id=sc-domain%3Adlss5nvidia.com>。

## 复核项

- 已确认 `https://www.dlss5nvidia.com/sitemap.xml` 状态为“成功”，已提交 53 个网址，最近读取时间为 2026-09-24。
- 查看两个本地化 comparison article 的“已抓取—尚未编入索引”验证结果；不要重复提交已经处于验证中的问题组。
- 等 Google 抓取一轮后，再比较 `dlss 5 visual enhancer`、`dlss 5 upscaling` 和 `dlss 5 download` 的 CTR，不要在数据窗口尚未更新时继续改标题。

## 本次自动验证结果（2026-09-24）

- Sitemap 公开返回 200，共 53 个 URL。
- Sitemap 中的 53 个 URL 全部返回 200，均有唯一 title、description、keywords、canonical；新加入的 `/pricing` 和 `/comparisons` 也已上线。
- `/login`、`/register`、`/dashboard` 均为 `noindex,nofollow`，登录页和注册页已从 Sitemap 移除。
- 首页、模型、下载、文档、企业、比较和定价页均已预渲染独立首屏 HTML，避免 SPA fallback 把首页 metadata 当成所有页面的 metadata。

## Search Console 执行记录（2026-09-25）

已在已登录的 Search Console 网址检查中完成逐页复核与提交：

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

线上复核（2026-09-25）：sitemap 返回 200，53 个 URL 全部返回 200，且每页 title、description、keywords、canonical 均存在并与 URL 匹配。

## 内容与转化修复（2026-09-25）

- 根据最近 Search Console 的查询—落地页错配，在首页增加了明确的 `DLSS 5 game character style conversion`、`DLSS 5 visual enhancer` 和 `DLSS 5 image converter` 语义入口。
- 移除了依赖 `picsum.photos` 的随机社区瀑布流，改为可复核的本地原创素材，避免随机图片、随机用户名和第三方加载影响可信度与稳定性。
- 增加 20 组通用图像前后对比、20 组游戏角色风格参考、两个 6 秒 MP4 对比演示，并为视频加入 `VideoObject` 结构化数据。所有素材均标注为独立原创参考，不声称是 NVIDIA 官方 DLSS 5 输出。
- 角色案例明确展示不变项（轮廓、服装、动作、身份）与可变项（光照、材质、调色、环境），用于承接游戏角色风格转换搜索意图。

上线后需要观察：`dlss 5 visual enhancer`、`dlss 5 image converter`、`game character style conversion` 和 `dlss 5 online` 的查询—页面分布与 CTR。不要在 Google 尚未刷新数据前重复改标题。
