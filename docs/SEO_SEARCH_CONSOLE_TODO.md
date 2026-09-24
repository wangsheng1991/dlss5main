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

- 重新提交 `https://www.dlss5nvidia.com/sitemap.xml`，确认状态为“成功”。
- 查看两个本地化 comparison article 的“已抓取—尚未编入索引”验证结果；不要重复提交已经处于验证中的问题组。
- 等 Google 抓取一轮后，再比较 `dlss 5 visual enhancer`、`dlss 5 upscaling` 和 `dlss 5 download` 的 CTR，不要在数据窗口尚未更新时继续改标题。

## 本次自动验证结果（2026-09-24）

- Sitemap 公开返回 200，共 53 个 URL。
- Sitemap 中的 53 个 URL 全部返回 200，均有唯一 title、description、keywords、canonical；新加入的 `/pricing` 和 `/comparisons` 也已上线。
- `/login`、`/register`、`/dashboard` 均为 `noindex,nofollow`，登录页和注册页已从 Sitemap 移除。
- 首页、模型、下载、文档、企业、比较和定价页均已预渲染独立首屏 HTML，避免 SPA fallback 把首页 metadata 当成所有页面的 metadata。
