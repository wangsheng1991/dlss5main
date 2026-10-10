# SEO / Search Console TODO

自动化能完成的站内 SEO、站点地图和 URL 检查已完成。只有 Google 的抓取队列和 Search Console 报告刷新需要等待，不能通过代码强制改变。

## 2026-09-27 线上复核与索引提交

- 通过已登录的 Search Console 重新检查 Sitemap：`https://www.dlss5nvidia.com/sitemap.xml` 状态为“成功”，上次读取 2026-09-25，已发现 59 个网页、0 个视频；无需重复提交 Sitemap。
- 用无缓存请求逐页检查 Sitemap 中的 59 个 URL。所有页面均返回 HTTP 200，并有非空且与路由匹配的 `title`、description、keywords、canonical 和 H1；未发现缺失或错误 canonical。博客的中英文同名标题属于不同语言版本，不是重复路由。
- URL Inspection 逐页复核新增工具：`/virtual-try-on`、`/portrait-retouch`、`/virtual-makeup`、`/game-character-style`、`/video-upscaler` 均显示“网址已编入 Google”；`/interior-design` 仍显示“已发现 - 尚未编入索引”，已在今日配额恢复后成功点击“请求编入索引”，Google 返回“已请求编入索引”，网址已进入优先抓取队列。
- 复核 Search Console 旧的覆盖率示例时，`/blog/best-ai-image-upscaler-2026-comparison` 已显示“网址已编入 Google”，说明 2026-09-21 的 13 个未编入索引数字尚未刷新，不能据此重复提交已收录页面。

当前只剩 Google 抓取队列和覆盖率报告刷新。`/interior-design` 的手动请求已完成；其余新增工具页和已收录文章不再重复请求。若报告刷新后仍有新的非规范化 URL，再按新的原因处理；在此之前没有代码侧或 Search Console 侧的自动操作可继续推进。

## 2026-09-27 后续复核

生产部署 `59eeb0d` 完成后再次检查 `/interior-design`，Search Console 已显示“网址已编入 Google”。至此本轮新增工具页（virtual-try-on、interior-design、portrait-retouch、virtual-makeup、game-character-style、video-upscaler）全部完成收录确认；不再重复请求。Sitemap 仍为成功、59 个网页、0 个视频，线上 59 个 Sitemap URL 的元数据批量复核仍为全通过。

## 仅需等待 Google 抓取队列

2026-09-25 通过已登录 Search Console 逐页复核了报告中的新文章和旧验证样本；它们当前均显示“网址已收录到 Google”，因此没有需要重复请求的 URL。报告中的“已发现—尚未编入索引”和“已抓取—尚未编入索引”数字是 2026-09-21 的历史快照，等待下一次报告刷新即可。

2026-09-25 对新增的 `/virtual-try-on` 做了网址检查，发现旧部署把它当成首页 fallback，导致 Google 显示“Google 无法识别此网址”，且未识别到 sitemap。已将四个新增工具页（virtual-try-on、interior-design、portrait-retouch、virtual-makeup）补成独立预渲染页面，包含独立 title、description、canonical、BreadcrumbList、FAQ 和 before/after 内容；部署后需重新读取 sitemap。

2026-09-25 新增独立的 `/game-character-style` 角色案例页和 `/video-upscaler` 视频超分工作流页。前者完整展示 20 组原创游戏人物 before/after 参考，后者包含 2 个 MP4 demo、VideoObject、FAQ 和 Seedance 2.5 成本文章链接；两页均有独立 title、description、canonical、JSON-LD 和 sitemap 入口。

当日对 `/virtual-try-on` 点击了“请求编入索引”，Google 返回“超出了配额：今天已经超出每日配额”。配额重置前不再重复点击；重置后只需对这四个新工具页、`/game-character-style` 和 `/video-upscaler` 各检查一次并按页面状态请求编入索引。该动作属于 Google 后台配额限制，代码侧已无可替代的提交接口。

## 复核项

- 已确认 `https://www.dlss5nvidia.com/sitemap.xml` 状态为“成功”，2026-09-25 新页面上线后再次提交成功，Google 已发现 59 个网址、0 个视频。
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

## 2026-09-26 线上复核与索引提交

已使用已登录的 Search Console 逐页检查本轮新增工具页。最新 sitemap 已在 2026-09-25 成功读取，报告显示 **59 个已发现网页、0 个视频**，因此不重复提交 sitemap。

URL Inspection 的当前结果：

- `/virtual-try-on`：网址已收录到 Google；
- `/interior-design`：未收录，原因是“已发现 - 尚未编入索引”；已点击“请求编入索引”，Google 返回“超出了配额，明天再尝试”；
- `/portrait-retouch`：网址已收录到 Google；
- `/virtual-makeup`：网址已收录到 Google；
- `/game-character-style`：网址已收录到 Google；
- `/video-upscaler`：网址已收录到 Google。

因此今天没有可继续提交的 URL。唯一待办是 Google 每日 URL Inspection 配额重置后，再对 `/interior-design` 重试一次；其余五个新页不重复请求。站内 title、description、keywords、canonical、H1 的线上批量检查已通过，59 个 sitemap URL 均返回 200。

## 2026-09-28 线上收尾复核

- 通过当前已登录的 Google Search Console 逐页检查剩余新增页面：`/virtual-try-on`、`/interior-design`、`/portrait-retouch`、`/virtual-makeup`、`/game-character-style`、`/video-upscaler`，六页均显示“网址已收录到 Google”。本轮没有重复点击“请求编入索引”，避免消耗无必要的配额。
- Search Console 的站点地图页显示 `https://www.dlss5nvidia.com/sitemap.xml` 状态为“成功”，已发现 59 个网页、0 个视频。
- 线上无缓存逐页审计覆盖 sitemap 的 59 个 URL：全部 HTTP 200；每页均有非空且与路由匹配的 title、description、keywords、canonical、H1。重点新页的 convert / game character / video 关键词均已生效。
- 首页线上静态 head 已确认包含 `dlss 5 convert`、`dlss 5 image converter`、`dlss 5 visual enhancer` 等目标词；`/game-character-style`、`/video-upscaler` 及四个 A-line 工具页各自使用独立 title、description、keywords 和 canonical。
- Search Console 概览仍显示历史的“13 个网页未编入索引 / 29 个网页已编入索引”汇总，这个汇总刷新慢于网址检查结果；当前新页面逐页结果已是已收录，不能据历史汇总重复提交。

### 当前 TODO

- 等待 Search Console 覆盖率汇总自然刷新；没有剩余新页面需要手动提交。
- 继续观察 `dlss 5 convert`、`dlss 5 image converter`、`game character style conversion`、`dlss 5 visual enhancer` 的展示、点击和 CTR，再决定是否调整标题；本轮不因未刷新数据重复改 meta。

## 2026-09-30 线上收尾复核

- 已在已登录的 Search Console 中重新提交 `https://www.dlss5nvidia.com/sitemap.xml`。提交结果为“成功”，Google 已发现 **60 个网页、0 个视频**。
- 线上无缓存批量审计覆盖 sitemap 的 60 个 URL：**60/60 HTTP 200，60/60 metadata 通过**。每页均有非空 title、description、keywords、H1，且 canonical 路径与 URL 一致。
- URL Inspection 结果：`/download`、`/tools/passport-photo`、`/tools/passport-photo/35x45-ru` 已收录；此前已收录的六个新增工具页（`/virtual-try-on`、`/interior-design`、`/portrait-retouch`、`/virtual-makeup`、`/game-character-style`、`/video-upscaler`）不重复提交。
- `/video-downloader` 原状态为“已发现 - 尚未编入索引”，已点击“请求编入索引”，Google 返回“已请求编入索引”，加入优先抓取队列。
- `/tools/passport-photo/3-na-4` 原状态为“重复网页，Google 选择的规范网页与用户指定的不同”，用户声明 canonical 和线上 title/description/keywords 均正确；已点击“请求编入索引”，Google 返回“已请求编入索引”。Google 当前选择 `/tools/passport-photo` 作为规范页，属于第三方抓取/规范化判定，等待下一轮抓取后再观察，不重复提交。

### 当前 TODO

- 等待 Google 抓取队列和覆盖率汇总刷新；没有可再提交的同一 URL。
- 观察 `/video-downloader` 是否进入索引，以及 `/tools/passport-photo/3-na-4` 是否接受自指 canonical；若仍被归并，再基于新的抓取证据决定是否增加该规格页的独有内容。
- 继续观察 `dlss 5 convert`、`dlss 5 image converter`、`game character style conversion`、`dlss 5 visual enhancer` 的展示、点击和 CTR；本轮线上 metadata 已生效，无需重复改标题。

## 2026-09-30 追加索引复核

- Search Console 站点地图实时页面仍显示 `https://www.dlss5nvidia.com/sitemap.xml` 为“成功”，已发现 60 个网页、0 个视频。
- 线上批量复核 sitemap 内 60 个 URL：60/60 返回 HTTP 200，60/60 的 title、description、keywords、H1 和自指 canonical 均通过；首页、`/video-downloader`、`/game-character-style` 和证件照规格页的线上关键词与页面内容一致。
- URL Inspection 实时复核：此前覆盖率报告里的 6 个博客样本当前均显示“网址已收录到 Google”；`/tools/passport-photo/3-na-4` 也已显示“网址已收录到 Google”。覆盖率报告仍停留在 2026-09-21，属于历史汇总，不能拿它重复提交已收录页面。
- `/video-downloader` 仍是唯一实际未收录的新页，状态为“已发现 - 尚未编入索引”；本轮在每日配额可用后再次点击“请求编入索引”，Google 返回“已请求编入索引”，已加入优先抓取队列。

### 当前 TODO

- 等待 Google 抓取 `/video-downloader` 并刷新覆盖率汇总；在状态变化前不重复提交同一 URL。
- 继续观察 `dlss 5 convert`、`dlss 5 image converter`、`game character style conversion`、`dlss 5 visual enhancer` 的展示、点击和 CTR；线上 metadata 已生效，不因历史报告延迟重复改标题。

## 2026-09-30 晚间：Studio 素材上线后的 SEO 收尾

- `1038a18` 已在 `origin/main`；Vercel Production 部署 `dpl_9pfA4WCt79jhTScaqjpeXopJ7qvj` 为 `READY`，正式别名指向 `https://www.dlss5nvidia.com`。正式域名 `/download` 的无缓存静态 HTML 已出现三段真实案例、六张截图、26.6s / 7.4s / 87.4s 与 2.43s/frame，不再是占位内容。
- `/download` 的线上静态 title 为 `DLSS5 Studio — DLSS 5 download explained, plus a local neural rendering tool`；description 和关键词列表非空，canonical 唯一且自指 `https://www.dlss5nvidia.com/download`，H1 与三段案例 H2 可抓取。正文明确预设名与实际 2560×1440 输出。此次内容更新后，通过已登录 Search Console 对该 URL 提交重新抓取请求；第一次 Google 返回临时错误，部署后重试得到 **“已请求编入索引”**，已进入优先抓取队列。不要再重复提交同一 URL。
- URL Inspection 实时结果：`/video-downloader` 已从“已发现 - 尚未编入索引”变为 **“网址已收录到 Google”**。此前待办因此关闭；已收录页面不重复提交。
- Search Console 站点地图仍为“成功”，2026-09-30 已读取，发现 **60 个网页、0 个视频**。正式域名无缓存审计重新覆盖 sitemap 中全部 60 个 URL：**60/60 HTTP 200，60/60 有非空 title、description、keywords、H1 和自指 canonical**。站点地图无需再次提交。
- “网页索引编制”汇总的更新时间仍为 **2026-09-21**（13 个未编入、29 个已编入）；这是旧报告，不能推翻当前网址检查结果，也不作为再次提交的理由。

### 当前 TODO

- 等待 Google 重新抓取 `/download` 的新素材并刷新汇总；此前已请求优先抓取。其余已知新页均已收录，没有剩余 URL 要提交，也没有需要用户本人决定的步骤。
- 在新的效果数据回补后，再看 `dlss 5 convert` 等目标词的展示、点击与 CTR；当前无依据再次调整标题或关键词。

## 2026-10-01：公开对比/Studio 素材页补入抓取入口

- 新增的 `/marketing/reddit/dlss5-reddit-comparisons.html` 与 `/marketing/reddit/dlss5-studio-kit.html` 已完成线上检查：均返回 HTTP 200，拥有独立 title、description、keywords、`index,follow`、自指 canonical 和可抓取 H1；Studio 页的 9 张图片、MP4 与 GIF 资源也均返回 200。
- URL Inspection 对 Studio 页曾显示“Google 无法识别此网址”，原因是页面此前没有引荐 sitemap；已将两个公开展示页加入 `public/sitemap.xml`，并在 `public/llms.txt` 增加明确入口。部署后 sitemap 预期从 60 个网址变为 62 个。
- 已部署 `0990df2`（Vercel Production `dpl_AtHow8G3NHxzA2RYvzX5ygiHR7Gh`）。正式域名的 sitemap 现为 62 个唯一 URL；两个展示页的 title、description、keywords、canonical、H1 与静态正文均已复核。
- 2026-10-01 在已登录 Search Console 重新提交 `https://www.dlss5nvidia.com/sitemap.xml`，Google 返回“已成功提交站点地图”；报告已记录提交时间，网页发现数等待下一次读取刷新。
- URL Inspection 对 `/marketing/reddit/dlss5-studio-kit.html` 和 `/marketing/reddit/dlss5-reddit-comparisons.html` 各执行一次“请求编入索引”，两次均返回“已请求编入索引”，已进入优先抓取队列。
- 若 Google 尚未立即显示 62 个网页或 URL 仍未收录，不再重复提交；保留 sitemap、`llms.txt` 和页面间链接作为自然抓取路径，等待 Google 抓取队列。

## 2026-10-01：首页首屏转化路径收口

- `e9f13fa` 将首页首屏从单一“人物风格转换”按钮改为两个明确动作：`Try a free example`（带 `sample=characterStyle`，游客可运行）和 `Upload your image`（进入普通上传路径，登录后提交自己的图片）。
- 首屏直接补上 `Request DLSS5 Studio access`，并在视觉案例旁把 `ONLINE CONVERTER` 与 `LOCAL WINDOWS STUDIO` 分开说明，避免把浏览器转换器和邮件申请的本地 Studio 混成同一个下载流程。
- 英文运行时 H1、静态 HTML H1 与首页搜索标题已统一为 `DLSS 5 Style Converter Online`；中文首屏同步说明“免费缓存示例无需账户、上传自己的图片需要登录”。
- 英文/中文旧的 H100、Tensor Core 和“官方性能”暗示已改为可审阅的独立参考口径；首页不再把独立实现包装成 NVIDIA 官方运行时或基准测试。
- 本地证据：`npm run lint`、`npm test`（87/87）、`npm run build` 均通过；桌面与 390px 窄屏截图复核通过；两个首屏按钮实际分别进入带示例参数和普通上传路径，Studio 入口进入 `/download`。
- 已推送并部署 Production：GitHub `e9f13fa`，Vercel `dpl_6hZoWxdB3UcZKaxmxLuXxdpMJSUk`，正式别名为 `https://www.dlss5nvidia.com`。线上静态 HTML 已复核 title、H1、示例入口和 `/download` 链接。
- 首页在更新后仍显示“网址已收录到 Google”；已在 2026-10-01 再次点击“请求编入索引”，Google 返回“已请求编入索引，已将网址添加到优先抓取队列”。不要重复提交同一首页，等待 Google 抓取更新后的 metadata 和首屏文案。

## 2026-10-01 晚间：剩余公开页复核

- 已登录 Search Console 逐页复核 `/marketing/reddit/dlss5-reddit-comparisons.html`、`/marketing/reddit/dlss5-studio-kit.html` 和 `/video-downloader`；三页均显示“网址已收录到 Google”，不再重复请求编入索引。
- 正式域名 `sitemap.xml` 当前公开返回 62 个唯一 URL；线上逐页检查确认页面均可访问，前一轮并发请求出现的 4 次 `IncompleteRead` 在带重试的顺序请求中均恢复为 HTTP 200，属于边缘网络读取抖动，不是页面故障。
- Search Console 站点地图页仍显示上次读取发现 60 个网页（上次读取 2026-09-30）；这是 Google 尚未重新读取最新 62 条 sitemap 的延迟。站点地图已在 2026-10-01 提交成功，当前不重复提交，等待下一次读取即可。
- `/video-downloader` 已从此前的“已发现 - 尚未编入索引”变为已收录；两个营销展示页也已收录。当前没有剩余可手动提交的新 URL。

### 当前 TODO

- 等待 Google 重新读取 sitemap 并刷新覆盖率汇总；这一步只能由 Google 抓取队列完成。
- 继续观察 `dlss 5 convert`、`dlss 5 image converter`、`dlss 5 visual enhancer` 和 `dlss 5 download` 的展示、点击与 CTR；线上 metadata 已生效，不因历史报告延迟重复改标题。

## 2026-10-02：按最新查询补齐生成器、在线增强器与 Android 下载意图

最新 Search Console 数据显示：`dlss 5 online` 5 次点击 / 10 次展示，`dlss 5 image generator` 2 / 4，`dlss 5 visual enhancer` 1 / 17，`dlss 5 download android` 1 / 6，`dlss 5 image converter` 1 / 5，`dlss 5 visual enhancer online` 1 次点击。信号很明确：在线入口已有较高匹配度；生成器与在线增强器需要在首屏和结构化数据中使用完整语义；Android 下载词需要直接解释产品边界，避免把浏览器工具误解成 APK。

- 首页 title 改为 `DLSS 5 Style Converter Online — Free AI Image Generator`；description、OG/Twitter、WebApplication JSON-LD 和静态 fallback 同步加入 `AI image generator`、`online visual enhancer` 语义，并保留独立、非官方口径。
- 首页中英西文案加入 AI 图像生成器 / 在线视觉增强器的自然表达；新增 FAQ 结构化问答，明确没有独立 DLSS 5 Android APK，手机和桌面都直接使用浏览器在线转换器。
- `/download` 的动态与预渲染 metadata、可抓取正文和关键词加入 `dlss 5 download android`，明确 Android 无 APK、Windows RTX 的 DLSS5 Studio 需要申请；没有改动 Studio 索取流程。
- 本地 `npx tsc --noEmit`、`npm test`（87/87）和 `npm run build` 全部通过；线上正式域名复核 `/` 与 `/download` 静态 title、description、关键词、Android FAQ 和正文均已生效。
- 已推送 `b50b1f3` 并部署 Production（Vercel `dpl_C71vWM3z3RCVeHaDgQQxG6HtCFRk`，READY）。

### 当前 TODO

- 等待 Google 重新抓取首页与 `/download` 的 metadata，观察这六个查询的展示、点击和 CTR；不重复提交已经在抓取队列中的 URL。
- 若 `dlss 5 download android` 后续仍有展示但点击低，再考虑将 Android 说明提升到 `/download` title；当前 description、可抓取正文和 FAQ 已足够回答意图。

## 2026-10-02：博客中文 description 收口

- 全站 62 条 sitemap URL 顺序复核：**62/62 HTTP 200**；首页、下载页、营销展示页和其余页面的 title、description、keywords、canonical、H1 均可抓取。
- 发现 3 篇中文博客的 description 退回文章标题，长度过短：`what-is-dlss-5-neural-rendering-guide`、`dlss5-artistic-vision-debate-honest-assessment`、`dlss-5-online-image-upscaler-guide`。已为中英文补充独立摘要，分别覆盖神经渲染原理、艺术控制、浏览器转换与在线放大流程。
- 本地 `npx tsc --noEmit`、`npm test`（87/87）与 `npm run build` 通过；已部署 Production（Vercel `dpl_BNXXXrPJzCawUroR2LhAYJPEus81`，READY）。正式域名复核结果为 **62/62 HTTP 200，62/62 metadata 通过**；三篇中文摘要均已生效。

### 当前 TODO

- 62 URL metadata 审计已通过；不再对单页重复请求编入索引，等待 Google 自然重抓并回传新的查询数据。

## 2026-10-02：GPT-6 / Claude 工作流播客首版

- 新增 `/podcast` 索引页和 5 个英文 transcript-first 节目页，覆盖 GPT-6 Astra、Claude Opus 5.5、Claude Sonnet 5.5、DLSS 5 convert、image generator / visual enhancer / converter 意图，以及可复查的公平评估方法。
- 每一期都有独立 title、description、keywords、canonical、PodcastEpisode JSON-LD、封面、章节、5 段以上正文文字稿、来源链接和免费转换 CTA；正文明确这是独立 DLSS 5-style 参考工作流，不是 NVIDIA 官方运行时或官方基准。
- 播客入口已接入桌面/移动导航、页脚、首页研究区、静态首页 fallback、`public/llms.txt` 和 sitemap；sitemap 从 62 条扩展为 68 条。
- 音频尚未录制，因此没有伪造 MP3、AudioObject 或不可播放的 RSS enclosure；节目页保留稳定 URL，录制完成后可直接加入 `audioSrc` 并生成音频版本。
- 本地验证：`git diff --check`、`npx tsc --noEmit`、`npm test`（89/89）、`npm run build` 均通过；构建后 6 个播客静态页均有自指 canonical、唯一 title、正文 H1 与对应结构化数据。

### 当前 TODO

- 部署后复核 68 个 sitemap URL 的 HTTP、metadata、H1 和静态正文，并把 Production deployment ID 写回本节。
- 音频成片后再加入真实 MP3、`AudioObject` 和 RSS feed；在此之前不向搜索引擎宣称可播放音频。
- 等待 Google 重新读取 sitemap 和自然抓取播客页；不要在 Search Console 配额未变化时逐页重复提交。

### Production verification addendum

- 已推送 commit `1167426` 并部署 Production：Vercel `dpl_FPCR6QkTyn8uXoXaifN4iZCRgZhZ`，正式别名为 `https://www.dlss5nvidia.com`，状态 `READY`。
- 正式 sitemap 当前 68 个唯一 URL；带重试的线上复核为 **68/68 HTTP 200**。`/podcast` 与 5 个节目页均通过 title、description（>40 字符）、自指 canonical、H1 检查，且分别输出 CollectionPage / PodcastEpisode 结构化数据。
- 由于音频尚未录制，没有向 Search Console 提交不存在的 MP3，也没有重复请求已有 URL；新页先通过 sitemap、首页、导航、页脚和 `llms.txt` 进入自然抓取路径。

### 当前 TODO（线上验证后）

- 等待 Google 重新读取 68 条 sitemap URL 和自然抓取 6 个播客页；Search Console 连接器当前不可用时不重复提交。
- 音频成片后再加入真实 MP3、`AudioObject` 和 RSS feed；在此之前保持 transcript-first 口径。

### 2026-10-02 Search Console fallback audit

- 正式域名 sitemap 逐页全量复核：**68/68** 页面通过 HTTP 200、唯一 title、description（>40 字符）、keywords、自指 canonical 和 H1 检查；不是只抽查播客页。
- `robots.txt` 正常允许抓取并声明 `https://www.dlss5nvidia.com/sitemap.xml`；正式 sitemap 返回 68 个 `<loc>`。
- 尝试使用 Google 公开 sitemap ping 作为 Search Console 的替代提交方式，Google 返回 HTTP 404，并明确提示该接口已废弃；因此不再重复调用无效接口。
- 当前没有可用的 Search Console 自动化连接器，无法代替账号点击“请求编入索引”；新页已经通过 sitemap、robots、首页、导航、页脚和 `llms.txt` 建立抓取入口。

### 当前 TODO（唯一外部等待项）

- 等待 Google 重新读取 sitemap、自然抓取 6 个播客页并刷新覆盖率数据；不要重复提交相同 URL，也不要继续调用已废弃的 sitemap ping。

## 2026-10-03：24 小时国家、设备与下载意图复核

- 已在已登录的 Google Search Console（`wustwangsheng@gmail.com`）读取 24 小时报告；报告标注“上次更新日期：3 小时前”。全站为 **77 次点击 / 926 次展示 / 8.3% CTR / 平均排名 7.7**。
- 设备拆分：桌面 **39 / 621（6.3% CTR）**，移动 **38 / 297（12.8% CTR）**，平板 **0 / 8（0% CTR）**。移动只拿到约一半展示，却带来几乎相同的点击，移动 CTR 约为桌面的 **2.0 倍**；保留移动首屏的单一转换 CTA，不把它改成下载页。平板样本很小，当前只做可读性修正，不做独立产品分流。
- 国家点击集中在印度尼西亚 **11 / 45（24.4%）**、巴西 **9 / 62（14.5%）**、印度 **6 / 41（14.6%）**、美国 **5 / 95（5.3%）**、德国 **4 / 44（9.1%）**、俄罗斯 **4 / 29（13.8%）**、西班牙 **4 / 20（20.0%）**；乌克兰 **3 / 11**、韩国 **3 / 11**、哥伦比亚 **3 / 6（50.0%）**。国家分布已经是多区域长尾，不能用美国单一口径改首页；西语国家（西班牙、哥伦比亚，另有萨尔瓦多/智利/阿根廷各有展示）值得继续补齐西语落地文案，但 24 小时样本不足以单独建大量新页。
- 查询与页面的对应关系仍清楚：`dlss 5 mobile download` **3 / 7（42.9%）**、`dlss 5 download` **2 / 26（7.7%）**、`dlss 5 visual enhancer` **1 / 38（2.6%）**、`dlss 5 image converter` **1 / 5（20.0%）**。低 CTR 的两个词说明搜索结果需要更直接的语义承接；不新增重复 URL，以现有 `/download` 和 `/image-quality-enhancer` 集中权重。
- 已将 `/download` 的中英文 title/description 前置为 `DLSS 5 Download`、`mobile/Android` 与 Windows Studio 边界；已将 `/image-quality-enhancer` 的 title/H1/description/keywords 前置为 `DLSS 5 Visual Enhancer Online`，FAQ 明确这是独立浏览器工具，不是 NVIDIA 官方运行时。`/download` 平板断点从 `md` 调整为 `lg`，截图与要求卡片在窄平板上改为单列，避免三列挤压。
- 本地验证：`git diff --check`、`npx tsc --noEmit`、`npm test` **90/90**、`npm run build` 全部通过。已推送 `a1c806a` 并部署 Production：Vercel `dpl_BcGTWzgaMp9j77Q5L4kZzxjS6xnu`，状态 `READY`；正式域名 `/download` 与 `/image-quality-enhancer` 均已复核 HTTP 200、title、description、keywords 生效。
- 为避免把 24 小时小样本当成长期趋势，又核对了 7 天报告（421 / 4,619 / 9.1% CTR）：美国 **55 / 580**、印度尼西亚 **41 / 216**、巴西 **28 / 213**、印度 **28 / 195**、德国 **26 / 246**、俄罗斯 **21 / 152**、西班牙 **13 / 112**。美国承担最多展示但 CTR 约 9.5%，东南亚、拉美和西语流量的点击效率更高；这支持“英文主站 + 西语重点入口 + 不做美国单一化”的方向。

### 当前 TODO

- 等待 Google 重新抓取新 metadata，再比较 `dlss 5 download` 与 `dlss 5 visual enhancer` 的 CTR；24 小时数据不重复请求同一 URL。
- 下一轮优先把 `/download` 的西班牙语 metadata 与首屏说明补齐，并在西语国家有稳定展示后再决定是否增加独立页面；暂不复制英文页面造成关键词稀释。

### Search Console 编入索引收口（2026-10-03）

- 已在 Search Console 重新提交当前正式 `https://www.dlss5nvidia.com/sitemap.xml`；Google 返回“已成功提交站点地图”，提交日期更新为 2026-10-03。报告里的“已发现网页 60”仍是 2026-09-30 的旧读取值，等待 Google 下一次处理，不重复提交。
- 旧覆盖率报告（更新时间 2026-09-21）列出的 6 个“已发现 - 尚未编入索引”博客 URL 已逐一做 URL Inspection，实际状态全部为“网址已收录到 Google”，无需再次请求。
- 新增播客索引页及 5 个节目页此前均为“网址尚未收录到 Google”，已逐页执行请求编入索引：`/podcast`、`gpt-6-astra-vs-claude-opus-5-5-dlss-5-style-prompts`、`gpt-6-dlss-5-convert-game-frame-workflow`、`claude-sonnet-5-5-character-identity-preservation`、`ai-image-generator-vs-visual-enhancer-vs-converter`、`gpt-6-claude-dlss-5-evaluation-method` **6/6 已请求成功**。Google 已明确提示已加入优先抓取队列；不重复点击。

### 当前 TODO

- 等待 Google 抓取 6 个播客页并刷新 sitemap/网页索引报告；这是第三方队列等待，当前没有可继续提交的 URL。

## 2026-10-03：工具页案例更新后的 Search Console 复核

- 正式 sitemap 仍为 68 个唯一 URL。对每个正式 URL 重新抓取并检查 HTTP 状态、`title`、description（>40 字符）、keywords、自指 canonical 和 H1，结果 **68/68 通过**。
- 逐页检查 6 个播客 URL（索引页 + 5 个节目页）后，Google 均返回“网址已收录到 Google”；此前覆盖率报告中的“已发现 - 尚未编入索引”6 条记录是 2026-09-21 的旧快照，不再重复请求。
- 本轮改动涉及工具页案例图片和免费示例入口，没有新增 sitemap URL；工具页仍由现有 sitemap、首页、导航、页脚和 `llms.txt` 发现。生产域名已复核 `/image-quality-enhancer`：独立 H1、`Free reference case`、对应案例图片和 `Try free example` 链接均已生效。

### 当前 TODO

- 等待 Search Console 刷新旧的网页索引报告；当前没有需要再次提交的 sitemap URL。若 Google 报告出现新的未收录 URL，再逐页检查后处理。

## 2026-10-04：7 天查询与页面 CTR 收口

- 已读取 Search Console 最新 7 天报告（2026-09-23—2026-09-29，最近更新约 6.5 小时前）：全站 **421 次点击 / 4,619 次展示 / 9.1% CTR / 平均排名 7.5**。
- 主要查询：`dlss 5 online` 17/80、`dlss 5 image converter` 14/43、`dlss 5 image generator` 13/40、`dlss 5 image enhancer` 11/43、`dlss 5 download` 6/106、`dlss 5 upscaler` 5/30。下载词的展示量最高但 CTR 只有约 5.7%，是本轮优先优化的摘要入口。
- 主要页面：`/` 321/2,079、`/download` 49/1,042（4.7% CTR）、在线放大指南 18/234、英文指南 10/155、`/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` 3/618（0.49% CTR）、`/image-quality-enhancer` 3/50（6% CTR）。对比文章和下载页的高展示低点击信号明确，不新增重复 URL，直接提升现有页面的搜索摘要承接。
- `/download` 英文/中文 title 与 description 改为以 `DLSS 5 Download` 开头，明确“免费在线转换器、手机/桌面、Windows Studio”三条路径和“没有官方 Android APK/独立安装包”的边界；keywords 同步补齐 `dlss 5 online`、`dlss 5 download mobile`、`free dlss 5 converter` 与 `dlss 5 studio download`。
- `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` 的英文/中文标题改为 2026 对比指南，补充独立 description，并在正文首段加入可抓取的快速结论，直接区分 DLSS 5 神经渲染、DLSS 4/4.5 超分/帧生成与 FSR 4。
- `/image-quality-enhancer` 摘要改为以 `free DLSS 5-style visual enhancer online` 开头，直接说明可先试免费前后案例，再处理自己的图片；保持独立第三方与无安装口径。
- 本地验证：`git diff --check`、`npx tsc --noEmit`、`npm test` **91/91**、`npm run build` 均通过；预渲染页确认 `/download`、英文/中文对比文章和 `/image-quality-enhancer` 的 title、description、H1 已同步。

### 当前 TODO

- 等 Google 重新抓取新摘要，再比较 `dlss 5 download`、`dlss 5 visual enhancer` 与对比文章的 CTR；Search Console 的报告存在延迟，不把旧快照当成失败。

### Production verification

- 已推送 `506f6cb` 并部署 Production：Vercel `dpl_6aG2ZDrqt1EDo3D59s5s5tqVAd5Y`，状态 `READY`，正式别名为 `https://www.dlss5nvidia.com`。
- 正式域名静态 HTML 已复核 `/download`、英文/中文对比文章和 `/image-quality-enhancer`：4/4 HTTP 200，title、description、canonical、H1 均与新版本一致；下载页和增强器页的免费在线路径已出现在可抓取摘要中。
- 没有重复请求编入索引：这些 URL 原本已在 Google 索引中，当前等待 Google 自然重抓 metadata。Search Console 报告的 7 天数据仍可能滞后于本次部署。

## 2026-10-06：查询—落地页错配复盘与第二轮修复

- 已读取 Search Console 最新 7 天报告（2026-09-27—2026-10-03，约 8.5 小时前更新）：全站 **542 次点击 / 5,662 次展示 / 9.6% CTR / 平均排名 7.2**。相比上一窗口 421/4,619/9.1%/7.5，整体已经上升；“最近改进没有作用”的判断主要来自个别页面，而不是全站趋势。
- `/download` 当前 **84/1,286（6.5% CTR）**，较上一窗口 49/1,042（4.7%）已有改善，但 `dlss 5 download` 仍只有 **6/114、平均排名 14.6**。根因是页面原来的静态 H1 是 `DLSS 5 Studio — download by request`，与搜索标题中的 download/converter/mobile 意图不完全一致，且页面仍像 Studio 产品介绍而不是下载决策页。
- `dlss 5 visual enhancer` 为 **4/207（1.9% CTR）**，其中 **206 次展示落在首页，只有 1 次落在博客页**；`/image-quality-enhancer` 的摘要修改单独无法改变这个词的结果。根因是 Google 已把首页当成该查询的权威落地页，而首页 title 没有写出 visual enhancer。
- 对比文章为 **3/725（0.4% CTR，平均排名 6.9）**。查询拆分为 `dlss 5 vs fsr 4` 1/57、`fsr 4 vs dlss 5` 1/41、`fsr vs dlss 5` 1/6；`dlss 5 vs dlss 4` 与反向词合计有展示但无点击。上一轮对比标题与 description 在 2026-10-04 才部署，因此完全不在本窗口，不能用这份报告判断新摘要失败。
- 本轮按证据修复：首页 title 改为 `DLSS 5 Converter Online — Free Image Generator & Visual Enhancer`，description/OG/Twitter/静态壳同步，覆盖首页实际承接的 visual enhancer 查询；`/download` 的 React H1、静态 H1、首段和关键词统一为 `DLSS 5 Download Guide — DLSS5 Studio by Request`，并增加到视觉增强器的静态内链；没有增加重复 URL，也没有改付费或 Studio 索取流程。
- 本地验证：`npx tsc --noEmit`、`npm test` **91/91**、`npm run build`、`git diff --check` 均通过；预渲染确认首页和下载页的 title、description、H1 与动态页面一致。

### Production verification

- 已推送 `e941d99` 并部署 Production：Vercel `dpl_98GaF699GhpZzjbYLWcH6aBzsAY7`，状态 `READY`，正式别名为 `https://www.dlss5nvidia.com`。
- 正式域名静态 HTML 已复核 `/`、`/download`、`/image-quality-enhancer`：3/3 HTTP 200；title、description、canonical、H1 均与预渲染版本一致。首页 title 现在直接包含 `Visual Enhancer`，下载页 H1 现在直接包含 `DLSS 5 Download`。
- 已在 Search Console URL Inspection 复核首页与 `/download`：两页均显示“网址已收录到 Google”；因本轮确实更新了 metadata 和静态正文，已各点击一次“请求编入索引”，Google 均返回“已将网址添加到优先抓取队列”。不再重复提交这两个 URL。

### 当前 TODO

- 已完成正式域名复核；等待至少一个完整 Search Console 窗口（新报告覆盖 2026-10-06 之后）再比较 `dlss 5 visual enhancer` 和 `dlss 5 download` CTR。本轮部署前的旧窗口不能作为新标题的结论。
- 对比文章目前平均排名已在第一页，先等待新标题/description 被 Google 重抓；若下一窗口仍低于 1% CTR，再考虑缩短 `— DLSS 5 Blog` 后缀或增加可见的“快速对比结论”摘要，不提前重复改写。

## 2026-10-06：24 小时 visual enhancer 查询仍由首页承接

- 已在已登录的 Search Console 读取 24 小时报告（报告更新时间约 12 小时前）：全站 **57 次点击 / 534 次展示 / 10.7% CTR / 平均排名 6.7**。查询表中 `dlss 5 online` 为 **4/7**、`dlss 5 visual enhancer` 为 **1/31**、`dlss5 visual enhancer` 为 **1/7**。
- 对 `dlss 5 visual enhancer` 加查询过滤后切到“网页”维度，31 次展示 **全部落在 `https://www.dlss5nvidia.com/`**（1 次点击）；`/image-quality-enhancer` 没有成为该词的主要落地页。此前 7 天报告已经显示 206/207 次展示落在首页，本轮证实错配仍在持续。
- 根因不是没有内容，而是首页 title、首段和在线入口把 converter、generator、visual enhancer 写成同一主意图，Google 因此继续把首页视为这个词的权威答案；独立增强器页虽然有正确 H1/title/案例，内部链接和页面分工仍不够清楚。
- 本轮修复：
  - 首页 SEO title 改为 `DLSS 5 Style Converter Online — Free AI Image Converter`，把 convert 作为唯一主意图；description、OG/Twitter 和静态 shell 同步，visual enhancer 改为“需要锐化时转到独立页面”的次级意图。
  - 首页首屏两个主按钮下新增明确的次级内链 `Open the free DLSS 5 visual enhancer`，在线入口卡片也提供同一链接；静态 fallback 同步加入可抓取的完整锚文本，避免无 JS 或爬虫只看到首页 converter。
  - 中英文 `onlineBody` 改为先描述 DLSS 5 style converter，再明确已有图片清晰化应使用独立 visual enhancer；没有改 API、计费或 Studio 索取流程。
- 本地验证：`npx tsc --noEmit`、`npm test` **91/91**、`npm run build`、`git diff --check` 全部通过。构建后首页和 `/image-quality-enhancer` 均有唯一 title、description、canonical、H1；首页静态 HTML 含完整 visual enhancer 内链。

### Production verification

- 已推送 commit `2868929` 并部署 Production：Vercel `dpl_DQa1JhiekapEzK9jFYnPMsVkffpt`，状态 `READY`，正式别名为 `https://www.dlss5nvidia.com`。
- 正式域名静态 HTML 复核通过：`/` 与 `/image-quality-enhancer` 均 HTTP 200；首页 title 已是 `DLSS 5 Style Converter Online — Free AI Image Converter`，首页 H1、canonical 和首屏 `Open the free DLSS 5 visual enhancer online` 内链均生效；增强器页 title、description、H1 和自指 canonical 均保持独立且准确。
- 本次部署遇到一次 Vercel CLI 上传 TLS 重试，但部署已创建并最终 Ready；没有产生重复 URL 或重复索引请求。

### 当前 TODO

- 等 Production 部署并让 Google 重抓首页与 `/image-quality-enhancer`；24 小时报告的“12 小时前更新”意味着不能在本次部署后立即判断 CTR。下一窗口重点看该词是否从首页转移到 `/image-quality-enhancer`，以及首页 `dlss 5 online` 是否保持点击。
- 不重复提交已在索引中的 URL；若 Search Console 仍把 visual enhancer 全部归到首页，再考虑仅在增强器页增加独立 use-case 入口，不再把首页 title 加回 visual enhancer。

## 2026-10-08：最新查询复核与相关项目外链

- Search Console 最新可用的 7 天窗口（2026-09-28—2026-10-04，报告约 22 小时滞后）为 **588 次点击 / 6,069 次展示 / 9.7% CTR / 平均排名 7.1**，较上一窗口 542/5,662/9.6%/7.2 继续上升。主要查询为 `dlss 5 online` 24/74、`dlss 5 image converter` 12/36、`dlss 5 image generator` 10/42、`dlss5 image converter` 9/46、`dlss5 online` 9/20、`dlss 5 visual enhancer online` 8/13、`dlss 5 download` 6/120、`dlss 5 visual enhancer` 5/215。
- 最新 24 小时窗口为 **44 次点击 / 449 次展示 / 9.8% CTR / 平均排名 6.5**。桌面 29/317、移动 14/126、平板 1/6；移动 CTR 仍高于桌面，但平板样本太小，不做独立产品分流。国家分布继续覆盖美国、印度、印度尼西亚、巴西、英国、俄罗斯、法国、德国和香港等市场。
- `dlss 5 visual enhancer online` 的 8/13 说明精确在线意图已经匹配；宽泛 `dlss 5 visual enhancer` 的 5/215 仍偏低，且无空格变体当前仍有展示落在首页。首页与增强器页的最新 metadata 已上线，但 Google 报告尚未覆盖完整重抓周期，本轮不重复改标题或提交 URL。
- 为增加真实的主题相关发现入口，新增一个短的“Related visual workflows”区块，并同步到 React 首页、`index.html` 静态壳和 `public/llms.txt`。只链接三个有独立产品和不同任务的公开项目：RenVi 室内设计（`houseplusplus.com`）、PixelHouse 空间设计（`aipixelhouse.com`）和 Image2LEGO 3D 建模（`image2lego.com`）。这不是批量互链目录；每个链接都解释相邻工作流，保持用户预期和爬虫语义一致。
- RenVi 和 PixelHouse 的公开页脚各增加一个指向 DLSS 5 architecture render enhancer 的相关工作流链接；使用普通可抓取的 HTTPS 链接和 `noopener noreferrer`，没有使用 `nofollow`，也没有添加无关项目。主站 `robots.txt` 继续 `User-agent: * / Allow: /` 并声明 sitemap；测试现在会检查这些外链同时出现在静态首页和 `llms.txt`。
- 本地验证：`git diff --check`、`npx tsc --noEmit`、`npm test` **92/92**、`npm run build` 均通过。主站提交 `80999a7` 已推送，Vercel Production `dpl_5gyer9DigvRmRV5JHTgkJAGLoZaK` 已 `READY`。
- 正式域名静态复核：`https://www.dlss5nvidia.com/` 返回 HTTP 200，title、H1、canonical 和三条相关项目链接均存在；`/robots.txt` 返回 `User-agent: *`、`Allow: /` 和正式 sitemap；`/llms.txt` 含三条项目链接。两个反向入口也已推送：RenVi `05cd9fb`（Production 已 Ready）和 PixelHouse `15be5b4`（Vercel `ark-space` Production 已 Ready）。线上 HTML 复核确认 RenVi 与 PixelHouse 都能抓到指向 DLSS5NVIDIA architecture enhancer 的上下文链接；三站 robots 均允许公开营销页抓取并声明 sitemap。

### 当前 TODO

- 等 Google 重抓首页、增强器页和新增相关项目入口，下一窗口重点观察 `dlss 5 visual enhancer` 是否从首页转移到 `/image-quality-enhancer`，以及相关页面是否获得自然展示；不重复请求已经在索引中的 URL。
- 外部项目的反向入口需要各自 Vercel 自动部署完成后再做线上 HTML 复核；若某项目未发布该链接，只保留主站的相关项目入口，不继续扩展互链数量。

## 2026-10-08：Search Console 重复网页验证

- Search Console 的网页索引编制报告（数据更新时间 2026-10-04）目前只有 **1** 个“重复网页，用户未选定规范网页”：`https://www.dlss5nvidia.com/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`，上次抓取为 2026-10-02。URL 检查明确显示当时“用户声明的规范网址：无”，Google 选择了默认英文路径 `/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`。
- 这不是当前线上 HTML 仍缺 canonical：正式域名抓取和本地预渲染都已确认该 `/en/blog/...` 页面输出自指 canonical，并输出 `en`、`zh-CN`、`x-default` 三组 hreflang；当前页面与默认路径的语义关系已经明确。问题报告使用的是 10 月 2 日的旧抓取快照。
- 已在 Search Console 对该 URL 执行“测试实际网址”：Google 在 2026-10-08 10:48 显示“网址可编入 Google 索引”；随后再次请求编入索引，并在“验证详情”中点击“开始新的验证”。验证状态现在为“已开始”，待定样本为 1，仍指向同一旧抓取 URL。
- 线上 sitemap 68 个 URL 的 canonical 审计结果：已读取的页面均有自指 canonical；3 个博客请求出现 `IncompleteRead` 是网络读取超时，不是页面 HTTP 或 canonical 错误，重试可正常返回。当前不改 URL 结构、不删除 `/en` 本地化入口，等待 Google 用新抓取结果完成验证。

### 当前 TODO

- 等 Google 验证队列重新抓取这 1 个 URL；验证完成前不重复请求同一 URL，也不把报告里的旧快照误判为当前缺陷。
- 若验证重新失败，下一步只检查该 URL 的实际抓取 HTML 与 Google 选择 canonical 的差异，再决定是否将英文博客默认路径收敛为单一 canonical；在有新证据前不改现有 hreflang 结构。


## 2026-10-08：索引队列收尾与线上 metadata 复核

- Search Console 网页索引编制报告（数据更新时间 2026-10-04）显示 **69 个已编入索引、9 个未编入索引**。剩余原因是 3 个自动重定向、2 个 noindex、2 个“Google 选择的规范网页”、1 个“已发现尚未编入索引”和 1 个“重复网页，用户未选定规范网页”。自动重定向与 noindex 对应预期行为，已写入待办，不把它们当作需要强行索引的页面。
- 对“已发现尚未编入索引”的 `https://www.dlss5nvidia.com/comparisons` 做了 URL 检查：正式页面 HTTP 200，title 为 `AI Image Tools Compared: GPT Image 2, ChatGPT Images, Midjourney & DLSS 5`，description、H1 和自指 canonical 均生效；已在 Search Console 点击“请求编入索引”，Google 返回“已将网址添加到优先抓取队列中”。
- 对“Google 选择的规范网页”中的两个英文文章 URL 启动了修正验证，并分别请求重新抓取：
  - `/en/blog/dlss-5-online-image-upscaler-guide`
  - `/en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`
  两页线上均输出自指 canonical 和 `en`、`zh-CN`、`x-default` hreflang；GSC 的旧报告仍显示 Google 曾选择无 `/en` 的默认路径，这是旧抓取快照，验证已开始，两个 URL 均已进入优先抓取队列。
- 先前“用户未选定规范网页”的 GPT-6 Astra 文章仍处于验证队列；线上 HTML 已有自指 canonical，未重复提交。
- 正式域名静态 HTML 复核：`/`、`/comparisons`、`/download`、`/image-quality-enhancer`、上述两个英文文章页和 GPT-6 Astra 文章全部 HTTP 200；每页均有唯一 title、description、canonical、H1。首页当前 title 是 `DLSS 5 Style Converter Online — Free AI Image Converter`，增强器页当前 title 是 `DLSS 5 Visual Enhancer Online — AI Image Quality Enhancer`，下载页当前 title 是 `DLSS 5 Download (2026) — Free Online Converter, Mobile & Windows Studio`。
- 本地质量门槛此前已通过：`npx tsc --noEmit`、`npm test`、`npm run build`、`git diff --check`。本轮没有改页面代码、路由或 sitemap，只记录 Search Console 操作与线上证据。

### 当前 TODO

- 等 Google 抓取并完成两个 canonical mismatch 验证；在验证结果返回前不重复提交同一批 URL。
- 等下一完整 Search Console 窗口确认首页与 `/image-quality-enhancer` 对 `dlss 5 visual enhancer` 的落地页分流，以及 `/download` 对 `dlss 5 download` 的 CTR；报告存在延迟，不能用本轮旧快照判断新 metadata 失败。
- 若 Google 再次报告 canonical 不一致，再基于新的实际抓取 HTML 处理；在此之前不改现有 `/en` hreflang/URL 结构。


## 2026-10-08：比较页产品化与重新抓取

- `/comparisons` 已从单一对照表升级为可运行的证据页：首屏提供人物风格转换和视觉增强的免登录缓存示例入口；页面包含 20 组来源图板、独立浏览器案例、四项可重复检查标准、一个明确标注为单次观察的 Studio 实测快照和 FAQ。
- React 页面与 `scripts/prerender-seo.ts` 的静态预渲染同步更新，避免爬虫只看到旧的泛介绍；新增 Article + FAQPage JSON-LD，title、description、keywords、canonical 保持唯一。
- 本地 `npx tsc --noEmit`、`npm test`（92/92）、`npm run build` 和 `git diff --check` 均通过。
- 已部署 Production：Vercel `dpl_AZBj2L2WaTyAHHhihhJvscLEJskP`。正式域名复核 `/comparisons` HTTP 200，title、description、keywords、canonical、H1、FAQ schema 和 sitemap 条目均生效。
- Search Console URL 检查显示该页已收录；本轮更新后再次点击“请求编入索引”，Google 返回“已将网址添加到优先抓取队列中”。

### 当前 TODO

- 等下一完整 Search Console 窗口观察 `comparisons` 的展示、点击、外链引荐和 sample run；不在短时间内重复提交同一 URL。
- 外链发布按 [`external-link-campaign-20261008.md`](./marketing/external-link-campaign-20261008.md) 执行，先人工确认平台版规和账号权限，再发布首个真实案例。

## 2026-10-08：索引报告复核与旧快照验证收口

- Search Console 网页索引编制报告当前仍显示 **69 个已编入索引、9 个未编入索引**，报告数据更新时间为 2026-10-04。未编入索引的 9 条由 3 个自动重定向、2 个 noindex、1 个 `/comparisons`“已发现 - 尚未编入索引”、1 个“重复网页，用户未选定规范网页”和 2 个“Google 选择的规范网页与用户指定的不同”组成；其中自动重定向与 noindex 是预期行为。
- 对 `/comparisons` 的“已发现 - 尚未编入索引”问题启动了“验证修正情况”，Search Console 已显示 **验证已开始（2026-10-08）**。网址检查同时显示该 URL 已收录并已进入优先抓取队列，当前不重复点击请求编入索引。
- “重复网页，用户未选定规范网页”目前仍只有 `https://www.dlss5nvidia.com/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`，验证已开始；“Google 选择的规范网页与用户指定的不同”仍是 `/en/blog/dlss-5-online-image-upscaler-guide` 与 `/en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`，验证也已开始。三页线上 HTML 均已输出自指 canonical 与对应 hreflang，等待 Google 新抓取结果，不改 URL 结构。
- Search Console 站点地图页显示 `https://www.dlss5nvidia.com/sitemap.xml` **成功**，最近读取 2026-10-03，已发现 **68 个网页、0 个视频**。本轮不重复提交未变化的 sitemap。
- 正式域名线上复核：sitemap 中 68 条 URL 首轮并发检查 **67/68 通过**；唯一失败是 `/pricing` 的一次网络 `IncompleteRead`。随后独立重试 `/pricing` 返回 HTTP 200，title、description、keywords、canonical 和 H1 均存在且 canonical 自指，因此确认是读取瞬断，不是页面或 SEO 元数据问题。

### 当前 TODO

- 等 Google 完成 `/comparisons` 和 3 个 canonical 验证队列；验证期间没有可替代的代码或 Search Console 提交动作。
- 下一次报告刷新后再判断旧快照是否消失；不重复请求已收录或已在验证队列中的 URL。

## 2026-10-08：路由收敛、游客漏斗与入口页复核

- 本地提交 `ce2ac3d` 收口三类工作：
  - SEO 路由：`/en/blog/dlss-5-online-image-upscaler-guide` 单跳 301 到已选定的 `/blog/...`；预渲染、博客内链和 sitemap 不再产生新的重复英文地址；移除 SPA catch-all 并加入真实 404 外壳，避免 `/image2lego` 等不存在路径返回首页 200。
  - 漏斗统计：复用现有 GA4/dataLayer，记录 `page_view → experience_click → generation_start → generation_success/failure → download_click`，带页面、工具、UTM、语言和匿名/登录状态；不记录图片、邮箱、文件名、UID 或完整 URL。
  - 入口内容：视觉增强页和下载页首屏补“用途 / 输出 / 限制”三点；对比文章改为来源可核验的 DLSS 5 / DLSS 4 / FSR 4 口径，并保留官方来源链接。
- QA 证据已写入 [`docs/qa/guest-flow-20261008.md`](./qa/guest-flow-20261008.md)：英文/中文、桌面/375px 窄屏游客示例均从入口跑到前后对比和下载；缓存示例约 0.99–1.39 秒，下载 HTTP 200、WebP 1024×1024；注入失败会显示错误和重试按钮。登录后的自有图片与付费链路不在本轮范围。
- 本地构建验证：`npx tsc --noEmit`、`npm test` **94/94**、`npm run build`、`git diff --check` 均通过。生成的 `/download` 静态 HTML 已包含与 React 相同的 At a glance 文案；正式文章和增强器页的 title、description、canonical、H1 均唯一。构建后随机不存在路径均为真实 404，弃用 `/en` 文章不再生成静态副本。
- 5 个真实 Studio 案例与 10 份分发素材的来源、参数、局限和入口见 [`docs/marketing/materials-20261008.md`](./marketing/materials-20261008.md)。Image2LEGO 仍缺真实运行和授权证据，明确列为待补，没有把说明性插画冒充实测。

### 当前 TODO

- `ce2ac3d` 尚未推送/部署；正式上线前需确认发布窗口。上线后再在线复核 301、3 个随机 404、3 个入口页的静态 metadata 与 GA4 事件。
- 部署后仅对新变更或仍未收录的 URL 做一次 URL 检查；不重复提交已在验证队列中的 canonical 问题，也不把 Google 抓取延迟当作代码失败。
- 外部平台发布、创作者联系、付费推广和公开下载仍需人工版规检查与产品负责人确认，本轮只准备素材。

## 2026-10-08：部署前后线上差异复核

- 当前正式域名仍是上一版 Production：线上 sitemap 返回 **68** 条 URL，仍包含待收敛的 `/en/blog/dlss-5-online-image-upscaler-guide`；本地新构建的 sitemap 为 **67** 条，已移除该重复地址。未知路径线上仍会落到首页 200，这也与本地新 404 行为不同。
- 对线上 sitemap 当前可抓取的 67 个 URL 做了带浏览器 User-Agent 的并发复核：67/67 返回 HTTP 200，且每页均有非空 title、description、canonical 和 H1。线上 `/`、`/image-quality-enhancer`、`/download`、`/comparisons` 与对比文章的现有 metadata 可读；本地新版本的 title、路由和 404 修复尚未进入正式域名。
- 因此本轮没有对 Google 重复提交 sitemap 或 URL；在新构建正式部署前提交只会让 Google 继续抓旧壳。部署需要产品负责人确认，已保留在 TODO。

## 2026-10-09：生产部署与 Search Console 收尾复核

- `bb2e733` 已推送到 `origin/main`；Vercel Production 部署 `dlss5-main-4rkniffgb-wangsheng1991s-projects.vercel.app` 状态为 **READY**，提交信息与该 commit 一致。
- 正式域名路由复核：`/en/blog/dlss-5-online-image-upscaler-guide` 返回单跳 **301** 到 `/blog/dlss-5-online-image-upscaler-guide`；`/image2lego`、`/does-not-exist-404`、`/blog/not-a-real-article` 均返回真实 **404**，不再把不存在路径伪装成首页 200。
- 正式 `sitemap.xml` 返回 **67** 个 `<loc>`，不再包含已弃用的 `/en/blog/dlss-5-online-image-upscaler-guide`。首页、`/image-quality-enhancer`、`/download`、对比文章和 `/comparisons` 均返回 200，title、description、keywords、canonical 与 H1 均非空且 canonical 自指。
- Search Console 网页索引报告仍是旧快照（2026-10-04）：69 个已编入索引、9 个未编入索引。打开“已发现 - 尚未编入索引”的明细后发现 `/comparisons` 已进入验证队列；随后 URL Inspection 实时结果显示 **“网址已收录到 Google”**，因此不重复提交。其余 8 条为预期重定向/noindex 或已在进行中的 canonical 验证。
- 站点地图界面仍显示 2026-10-03 读取、68 个已发现网页，这是 Google 尚未重新读取 67 条新 sitemap 的延迟；尝试提交相对路径时被界面判为无效，没有改变现有成功的 sitemap 记录，也没有重复提交同一 URL。

### 当前 TODO

- 等 Google 重新读取 67 条 sitemap 并完成 3 个 canonical/发现类验证；在状态变化前不重复请求同一 URL。
- 继续观察 `dlss 5 convert`、`dlss 5 image converter`、`dlss 5 visual enhancer` 和 `dlss 5 download` 的新窗口数据；当前线上 metadata 已验证，无代码侧 SEO 阻塞。

## 2026-10-09：全量 sitemap metadata 审计与 Search Console 状态复核

- 正式域名 `https://www.dlss5nvidia.com/sitemap.xml` 当前返回 **67** 个 `<loc>`，不包含已弃用的 `/en/blog/dlss-5-online-image-upscaler-guide`。对 67 个 URL 做了带浏览器 User-Agent、绕过失效本地代理并带重试的逐页静态审计：**67/67 通过**。每页均返回 HTTP 200，并同时具备非空 `title`、`meta description`、`meta keywords`、`<h1>` 和自指 `rel=canonical`；未发现 sitemap 页面级 metadata 或 canonical 漂移。
- 关键入口线上复核：`/` 的 title 为 `DLSS 5 Style Converter Online — Free AI Image Converter`，`/image-quality-enhancer` 的 title 为 `DLSS 5 Visual Enhancer Online — AI Image Quality Enhancer`，`/download` 的 title 为 `DLSS 5 Download (2026) — Free Online Converter, Mobile & Windows Studio`，`/comparisons` 和对比文章均返回 200 且 canonical 指向自身。
- 旧英文文章路径通过 `curl -L` 实测为单跳 **301**：`/en/blog/dlss-5-online-image-upscaler-guide` → `/blog/dlss-5-online-image-upscaler-guide`；最终目标返回 200。`/image2lego`、`/does-not-exist-404`、`/blog/not-a-real-article` 均为真实 **404**。
- Search Console（账号 `wustwangsheng@gmail.com`，报告更新时间仍为 2026-10-04）当前读数没有变化：**69 个已编入索引、9 个未编入索引**。未编入索引的 9 条由 3 个预期重定向、2 个预期 noindex、2 个正在验证的 canonical mismatch、1 个正在验证的“重复网页，用户未选定规范网页”和 1 个正在验证的“已发现 - 尚未编入索引”组成；此前 `/comparisons` 的实时 URL 检查已显示“网址已收录到 Google”，因此本轮没有重复消耗 URL 检查或索引请求配额。
- Search Console 站点地图界面仍显示最近读取 2026-10-03、发现 68 个网页，属于 Google 尚未重新读取线上 67 条 sitemap 的延迟；当前 sitemap 本身可正常访问，未再提交相对路径或重复提交同一 sitemap。

### 当前 TODO

- 等 Google 重新读取 67 条 sitemap，并完成 3 个 canonical/发现类验证队列；这些是 Google 抓取和报告延迟，代码与线上 metadata 已无可修复项。
- 下一次 Search Console 报告刷新后再观察 `dlss 5 convert`、`dlss 5 image converter`、`dlss 5 visual enhancer` 与 `dlss 5 download` 的展示和点击变化；在状态变化前不重复请求已收录或已进入验证队列的 URL。

## 2026-10-09：审计记录生产发布

- 本轮审计记录提交 `9f69f9c` 已推送到 `origin/main`；Vercel Production deployment `dpl_HrqTaZv6gbFu54QeVUpi39hM5qa2` 已 **READY**，正式域名别名仍指向该生产项目。
- 发布后再次复核：旧英文文章路径单跳 301 后到默认文章，首页、视觉增强、下载、比较页均返回 200 且 title、description、canonical 存在；正式 sitemap 返回 200、67 条 URL、无弃用英文重复地址。

## 2026-10-09：dlss5.app 联动入口

- 首页相关视觉工作流、静态首页外壳和 `public/llms.txt` 新增 `https://www.dlss5.app/zh-CN` 入口，定位为 Neural Architect 的 GPU 检查与 DLSS 5 功能矩阵；该页面与本站的图像转换工具承担不同任务，避免生成重复关键词页。
- `dlss5.app` 现有页面已经反向提供“Try Our Tool”入口指向 `https://dlss5nvidia.com`，因此本轮形成双向发现路径；没有修改其部署或页面源代码。
- 本轮不新增本站 URL、不改变 sitemap 条目，也不需要在 Search Console 单独提交索引请求。上线后只需观察首页外链抓取和相关查询表现。
- 提交 `e3557cd` 已推送并部署为 Production（Vercel deployment `dpl_2NzUkTsGMSbTuTEWhjSi8pViragu`，状态 Ready）。正式首页与 `/llms.txt` 均返回 HTTP 200 并包含联动入口；正式 sitemap 仍为 67 个站内 URL。

## 2026-10-09：dlss5.app Search Console 资源核实

- 账号 `wustwangsheng@gmail.com` 下的资源 `dlss5.app` 存在并可访问，Search Console 概述页正常显示资源名；本轮没有遇到重新验证或权限提示。
- 站点地图页显示两条历史提交记录，均为 **成功**，没有重复提交：
  - `https://www.dlss5.app/sitemap.xml`：提交日期 2026-04-13，最近读取 2026-04-13，已发现 14 个网页、0 个视频。
  - `https://dlss5.app/sitemap.xml`：提交日期 2026-04-11，最近读取 2026-04-14，已发现 14 个网页、0 个视频。
  公开 sitemap 当前有 16 个 `loc`，所以 Search Console 的已发现数量仍少于文件中的 URL 总数；本轮不重复提交，先等待 Google 重新读取。
- 网页索引编制摘要的报告更新时间为 **2026-10-04**：**33 个已编入索引、85 个未编入索引**。未编入索引明细只有 3 类：`备用网页（有适当的规范标记）` 49 个、`网页会自动重定向` 35 个、`已抓取 - 尚未编入索引` 1 个；当前摘要没有显示“重复网页，用户未选定规范网页”或“Google 选择的规范网页与用户指定的不同”。
- 结论：资源和 sitemap 均已建立，主要缺口是 Google 尚未将大部分已知 URL 纳入索引，以及 sitemap 发现数尚未覆盖公开文件的全部 16 条。下一步只观察抓取/索引报告变化；不重建资源、不改 DNS、不修改 dlss5nvidia.com 页面。

## 2026-10-09：dlss5nvidia Search Console 复核收口

- 本次复核 Search Console：报告更新时间仍为 **2026-10-04**，**69 个已编入索引、9 个未编入索引**；未编入索引仍为 3 个自动重定向、2 个 noindex、1 个“重复网页，用户未选定规范网页”、2 个 Google 选择其他规范网页、1 个“已发现 - 尚未编入索引”，其中 3 个非预期类仍显示“已开始”验证，抓取未编入索引为 0 且“已通过”。
- 站点地图仍显示 `https://www.dlss5nvidia.com/sitemap.xml` 最近读取 **2026-10-03**、已发现 **68** 个网页、状态成功；线上 sitemap 可读取 **67** 条 `<loc>`。这是 Google 报告滞后，不重复提交 sitemap 或逐页请求已在验证队列中的 URL。
- 线上正式 sitemap 在绕过代理并重试后仍为 67 条；此前全量审计已确认 67/67 页面具备 HTTP 200、非空 title/description/keywords、H1 和自指 canonical。本轮未发现新的页面或 metadata 回归。
- 结论：当前没有可安全推进的索引提交动作；下一步仅等待 Google 完成 sitemap 重读和验证队列，数据刷新后再按新出现的 URL 处理。

## 2026-10-09：dlss5.app 流量与收录复核

- Search Console 效果报告口径：搜索类型“网络”，界面显示上次更新 **22 小时前**，图表最新日期为 **2026-10-06**。
- `dlss5.app` 最近 7 天：**1 次点击 / 33 次展示 / CTR 3% / 平均排名 12.2**。
  - 查询（点击 / 展示）：`dlss 5 neural screen` 0/3；`dlss 5 supported cards` 0/1。
  - 页面（点击 / 展示）：`https://dlss5.app/de` 1/5；`https://dlss5.app/` 0/15；`https://www.dlss5.app/ko` 0/6；`https://dlss5.app/en/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026` 0/2；`https://www.dlss5.app/ja/blog/what-is-dlss-5-neural-rendering-guide` 0/2；`https://www.dlss5.app/es` 0/1；`https://www.dlss5.app/de` 0/1；`https://dlss5.app/es` 0/1。
  - 国家（点击 / 展示，前 10）：瑞士 1/2；韩国 0/6；英国 0/4；德国 0/4；美国 0/3；比利时 0/2；芬兰 0/2；巴西 0/2；印度 0/1；多米尼加共和国 0/1。
  - 设备：桌面 1/29；移动设备 0/4；平板电脑未显示（0/0）。
- `dlss5.app` 最近 28 天：**6 次点击 / 252 次展示 / CTR 2.4% / 平均排名 10.5**。
  - 查询（前 10，点击 / 展示）：`dlss5 app` 1/7；`dlss 5 architecture` 1/6；`dlss checker` 0/9；`neural rendering` 0/5；`dlss 5 app` 0/4；`fsr 4 vs dlss 5` 0/3；`dlss 5 neural screen` 0/3；`dlss 5 live flow` 0/2；`dlss 5 welche grafikkarte` 0/2；`dlss 5 archviz` 0/1。
  - 页面（前 10，点击 / 展示）：`https://dlss5.app/` 4/134；`https://dlss5.app/de` 1/32；`https://dlss5.app/es` 1/2；`https://www.dlss5.app/ko` 0/19；`https://www.dlss5.app/es` 0/14；`https://www.dlss5.app/de` 0/10；`https://dlss5.app/en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` 0/9；`https://www.dlss5.app/ja/blog/what-is-dlss-5-neural-rendering-guide` 0/7；`https://dlss5.app/en/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026` 0/5；`https://dlss5.app/fr` 0/3。
  - 国家（前 10，点击 / 展示）：巴西 1/9；中国香港 1/7；瑞士 1/6；墨西哥 1/5；意大利 1/4；希腊 1/2；德国 0/41；韩国 0/23；美国 0/23；英国 0/12。
  - 设备：桌面 4/184；移动设备 2/68；平板电脑未显示（0/0）。
- `dlss5.app` 索引明细中唯一的“已抓取 - 尚未编入索引” URL 为 `https://www.dlss5.app/en/blog/dlss5-ai-slop-controversy`，上次抓取 2026-08-24；本轮只读取，没有点击“验证修正情况”。
- `dlss5nvidia.com` 同窗口对比（报告同样更新于 22 小时前）：
  - 最近 7 天：**659 点击 / 6,510 展示 / CTR 10.1% / 平均排名 7**。前 5 查询：`dlss 5 online` 25/62；`dlss 5 image converter` 13/40；`dlss 5 image generator` 12/46；`dlss5 online` 12/26；`dlss5 image converter` 11/42。前 5 页面：首页 499/2,832；`/download` 104/1,434；`/blog/dlss-5-online-image-upscaler-guide` 28/457；`/dashboard` 26/211；`/image-upscaler` 4/28。
  - 最近 28 天：**1,690 点击 / 1.77 万展示 / CTR 9.5% / 平均排名 7.3**（展示数按 Search Console 界面原样记录）。前 5 查询：`dlss 5 image converter` 60/233；`dlss 5 online` 56/209；`dlss 5 download` 28/502；`dlss 5 image generator` 26/97；`dlss 5 visual enhancer` 20/968。前 5 页面：首页 1,313/9,255；`/download` 255/4,272；`/blog/dlss-5-online-image-upscaler-guide` 56/783；`/dashboard` 32/275；`/en/blog/dlss-5-online-image-upscaler-guide` 11/158。
- 结论：`dlss5.app` 当前流量主要来自多语言首页（尤其根路径，其次德语/西语）和桌面搜索，意图集中在品牌、GPU 架构与硬件兼容性；`dlss5nvidia.com` 规模约高两个数量级，主要由首页承接 `image converter / online / download / visual enhancer` 等高意图词。两站本轮只读，不改页面、不改 DNS、不提交 sitemap 或索引请求。

## 2026-10-09：GPT-6 英文重复 URL 修复与生产复核

- Search Console 当前概览仍显示 **69 个已编入索引、9 个未编入索引**；网页索引报告更新时间为 **2026-10-04**。未编入索引原因仍为 3 个自动重定向、2 个 noindex、1 个“重复网页，用户未选定规范网页”（验证已开始，2026-10-08）、2 个 Google 选择其他规范网页（验证已开始）和 1 个“已发现 - 尚未编入索引”（验证已开始）。
- 复核“重复网页，用户未选定规范网页”明细，受影响 URL 为 `https://www.dlss5nvidia.com/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`，上次抓取 2026-10-02。线上旧版本曾对该地址返回 200、自指 canonical，确实与已收录的无前缀文章重复。
- 提交 `ceab656` 已将该英文重复地址改为单跳 301 到 `/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`，同步调整 React/预渲染内链与 hreflang，并从 `public/sitemap.xml` 移除 `/en` 重复条目；保留中文 `/zh` 版本。`npm run lint`、`npm test`（94/94）和 `npm run build` 均通过。
- GitHub 已推送 `ceab656`；Vercel Production `https://dlss5-main-bspuzigj8-wangsheng1991s-projects.vercel.app` 已 Ready。正式域名复核：旧 URL 返回 **301**，目标返回 **200**；目标 title、description、keywords、canonical 均生效；线上 sitemap 不再包含该 `/en` URL。
- 本轮没有重复点击 sitemap 提交或 URL 编入索引按钮：重复 URL 已在验证队列，目标页面需等 Google 重新抓取后再读报告；对已收录 URL 不重复消耗请求配额。

### 当前 TODO

- 等 Google 重新抓取 `ceab656` 后完成“重复网页，用户未选定规范网页”验证；下一次报告刷新时确认该 URL 从未编入索引样本中消失。
- 继续等待其余两个 canonical 验证和一个 discovered-not-indexed 验证；若报告出现新的、非重定向/noindex 且不在验证中的 URL，再逐页检查并请求编入索引。

## 2026-10-09：第二个英文重复文章入口收敛

- 对 Search Console 中“Google 选择的规范网页与用户指定的不同”样本 `https://www.dlss5nvidia.com/en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` 做了线上核验：旧版本返回 HTTP 200 且 canonical 指向自身，而无前缀文章同样返回 200，属于同内容双 URL。
- 提交 `15c196c` 将该 `/en` 路径加入英文默认文章集合，改为单跳 301 到 `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`，同步移除预渲染副本、站内英文卡片链接和 sitemap 重复条目；中文 `/zh` 版本保留。
- 本地 `npx tsc --noEmit`、`npm test`（94/94）、`npm run build` 和 `git diff --check` 通过。GitHub 已推送，Vercel Production `https://dlss5-main-dvh78bbeh-wangsheng1991s-projects.vercel.app` 已 Ready。
- 正式域名复核：旧 URL 返回 **301**，目标返回 **200**；目标 title、description、keywords、canonical 均为该文章自身，线上 sitemap 不再包含 `/en` 重复 URL。

### 当前 TODO

- 等 Google 重新抓取该 301 并完成已有 canonical 验证；本轮不重复点击请求编入索引。已收录的目标文章不需要再次提交。

## 2026-10-09：对比文章目标 URL 索引确认

- 对收敛后的 `https://www.dlss5nvidia.com/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026` 做 URL 检查，Search Console 返回 **“网址已收录到 Google”**、**“网页已编入索引”**。因此没有再次点击“请求编入索引”，避免消耗配额。

## 2026-10-10：新页面线上 metadata 与索引队列复核

- Search Console 已登录资源 `dlss5nvidia.com` 的网页索引报告仍显示：**69 个已编入索引、9 个未编入索引**，报告更新时间为 **2026-10-04**。未编入索引的 5 类原因仍为 3 个自动重定向、2 个 noindex、1 个“重复网页，用户未选定规范网页”、2 个 Google 选择其他规范网页、1 个“已发现 - 尚未编入索引”；后 3 类均显示“已开始”验证。
- “已发现 - 尚未编入索引”的唯一样本仍是 `https://www.dlss5nvidia.com/comparisons`。该 URL 已于 2026-10-08 进入验证队列，之前 URL Inspection 已显示“网址已收录到 Google”，本轮不重复请求编入索引。
- Search Console 站点地图页仍显示 `https://www.dlss5nvidia.com/sitemap.xml` 状态“成功”、最近读取 **2026-10-03**、发现 **68 个网页、0 个视频**。线上 sitemap 当前实际返回 **65 个 `<loc>`**；这是报告读取滞后，不重复提交同一 sitemap，也不提交相对路径。
- 线上逐页复核（2026-10-10，带浏览器 User-Agent、跟随重定向）覆盖播客索引页与 5 个节目页、`/game-character-style`、`/video-upscaler`、`/video-downloader`、`/comparisons`、`/tools/passport-photo`、`/tools/passport-photo/3-na-4`，共 **12/12**：全部 HTTP 200；每页均有非空且与页面用途对应的唯一 `<title>`、`meta description`、自指 canonical 和 H1。示例：播客索引 title 为 `DLSS 5 AI Workflow Podcast — GPT-6, Claude and Visual Conversion`；人物风格页 title 为 `20 Game Character Style Conversion Examples — Before and After`；比较页 title 为 `AI Image Tools Compared: GPT Image 2, ChatGPT Images, Midjourney & DLSS 5`。
- Search Console 效果报告最近 7 天（报告更新 **26.5 小时前**，日期 2026-09-30 至 2026-10-06）仍为 **659 点击、6,510 展示、CTR 10.1%、平均排名 7**。热门查询为：`dlss 5 online` 25/62、`dlss 5 image converter` 13/40、`dlss 5 image generator` 12/46、`dlss5 online` 12/26、`dlss5 image converter` 11/42、`dlss 5 generator` 8/48、`dlss5 apk` 8/26、`dlss 5 visual enhancer online` 8/16、`dlss 5 download android` 7/57、`dlss 5 visual enhancer` 6/234（点击/展示）。这说明 converter、online、generator 仍是当前主要入口，visual enhancer 有展示但 CTR 明显较低。
- 仓库 HEAD 的 `f96c933` 是 dev-only 的 DLSS 5 compatibility checker scaffold，未进入线上 sitemap/部署，本轮不把它作为可提交索引的新页面。

### 当前 TODO

- 等 Google 重新读取线上 65 条 sitemap，并完成 3 个 canonical/发现类验证；这些是第三方抓取和报告延迟，当前没有安全的替代提交动作。
- 下一个报告窗口重点观察 `dlss 5 image converter`、`dlss 5 image generator`、`dlss 5 visual enhancer` 与新播客页的页面分流；已有 URL 不重复消耗索引请求配额。
- 如报告出现新的、非重定向/noindex 且不在验证队列中的 URL，再逐页做 URL Inspection、确认 title/description/canonical 后请求编入索引。

## 2026-10-10：英文博客重复路由全量收敛与生产复核

- 根因实测：对线上 sitemap 原有 65 个 URL 做静态审计，发现 7 对英文重复地址（`/blog` 与 `/en/blog` 首页，以及 6 篇英文文章的 `/blog/<slug>` 与 `/en/blog/<slug>`）。每对的正文文本长度与 SHA-256 均一致，而两个地址此前都返回 200 并使用各自的自指 canonical；这是真实的重复内容/规范选择风险，不是 Google 报告误报。
- 提交 `fd885f1` 已统一收敛：`/en/blog` 与 9 个已确认的 `/en/blog/<slug>` 旧入口（其中 3 个此前已处理，本轮补齐 6 个）全部配置为单跳 301 到无前缀英文地址；英文预渲染、React 内链、站点 profile、`llms.txt` 和 sitemap 只保留无前缀英文 canonical，中文 `/zh/blog` 继续保留。旧路径不再生成静态副本，也不再出现在 sitemap。
- 质量门禁：`npm run lint` 通过；`npm test` **103/103**；`npm run build` 通过（Vite、API catalog、SEO 预渲染均完成）；`git diff --check` 通过。未触碰工作区中与本轮无关的 Reddit/launch 草稿文件。
- 已推送 `origin/main`。Vercel Production 部署 `dpl_DHELYf5XbcZTSC5cy4QhheMxrx6n` 状态 **READY**，正式别名 `https://www.dlss5nvidia.com` 已切换。
- 线上复核：10 个废弃英文入口均返回 HTTP **301**，并各自直接指向对应无前缀文章/博客首页；跟随后目标均为 200。正式 `sitemap.xml` 返回 **58** 条 `<loc>`，不含任何 `/en/blog`；58/58 URL 均通过静态检查（HTTP 200、非空 title、description≥40 字符、H1、自指 canonical）。
- Search Console：在账号 `wustwangsheng@gmail.com` 的 `dlss5nvidia.com` 资源中重新提交完整地址 `https://www.dlss5nvidia.com/sitemap.xml`，界面返回“已成功提交站点地图”。Google 界面仍显示最近读取 2026-10-03、已发现 68，说明新提交已接收但尚未完成下一次读取；不把这个旧快照误报为 58 条已发现。
- 近期效果基线（报告更新仍滞后至 2026-10-06）：最近 7 天 **659 点击 / 6,514 展示 / CTR 10.1% / 平均排名 7**；主要查询仍是 `dlss 5 online`、`dlss 5 image converter`、`dlss 5 image generator`、`dlss5 online`、`dlss5 image converter`。这些查询对应的首页/工具页已在本轮线上 metadata 审计中通过。

### 当前 TODO

- 等 Google 重新读取 58 条 sitemap，并完成已开始的 canonical/发现类验证；301 旧地址不再请求单页编入索引，避免把不可索引的重定向重新送入队列。
- Search Console 下一次报告刷新后，确认 7 对重复地址从问题样本中消失，并观察 converter、online、generator 与 visual enhancer 的点击/展示变化。
- `dlss5.app` 与 `dlss5.net/.org` 的流量超越方案另行规划：优先补 SSR/独立 metadata、硬件兼容性/FAQ 数据、可运行检测器结果和多语言内链；本节不直接改姊妹站代码。

## 2026-10-10：dlss5.app 预渲染与姊妹站联动更新

- 对照 `dlss5.net` / `dlss5.org` 的公开结构后，确认姊妹站原主要缺口是 SPA 空壳：初始 HTML 只有 `#root`，所有路径共用 title，GPU 表格、FAQ 与文章正文要等 JavaScript 执行。该问题已在 `wangsheng1991/dlss5app` 提交 `e353caa`（静态 SEO 预渲染、多语言正文、独立 JSON-LD、24 条 sitemap、`llms.txt`、真实 404）和 `4aae107`（生产 `www` 主机的 canonical/hreflang 对齐）中修复；随后 `14c30de` 移除一次会造成 www/裸域循环的实验性 host redirect。
- 线上 Production `dpl_BDmPVYZfTtKep7xoWz4HfDr2AiVi` 已 READY，正式 `https://www.dlss5.app` 复核通过：`/en`、`/zh-CN`、`/en/blog`、英文文章和中文文章均 HTTP 200，静态源码直接含唯一 title、description、H1、self-canonical 和正文；随机不存在路径返回真实 404；`/sitemap.xml` 返回 **24** 条 `<loc>`，`/llms.txt` 返回 200。生产裸域由 Vercel 统一 307 到 www，因此 canonical 与 sitemap 已统一使用 `https://www.dlss5.app`。
- 账号 `wustwangsheng@gmail.com` 的 `dlss5.app` Search Console 站点地图页已重新提交 `https://dlss5.app/sitemap.xml`，界面返回“已成功提交站点地图”；Google 的已发现数量仍是旧快照 14，等待下一次读取后再核对 24 条。
- 本次目标是让 `.app` 具备与 `.net/.org` 同级的可抓取硬件/FAQ/文章基础，再用独立的免费检测结果、官方证据和多语言正文形成差异；流量超越属于后续 7–28 天实验结果，当前不能提前宣称。

### 当前 TODO

- 等 Google 重新读取 `www.dlss5.app/sitemap.xml` 并刷新 7/28 天效果报告；下一次复核 24 条页面是否进入索引，以及 `dlss 5 supported cards`、`dlss checker`、`dlss 5 gpu` 等长尾的展示变化。
- 继续补充有官方来源的 GPU/游戏条目和真实更新日期；没有官方原文的条目维持未确认，不用猜测填充。

## 2026-10-10：生产 sitemap 与 URL Inspection 实时复核

- 本地质量门禁重新通过：`npm run lint`、`npm test` 与 `npm run build` 均成功；工作区中与本轮无关的 Reddit/launch 草稿保持未暂存。
- 生产 `https://www.dlss5nvidia.com/sitemap.xml` 当前返回 **58** 条 `<loc>`。逐页跟随重定向复核 58/58：全部 HTTP 200，且均有非空 `<title>`、`meta description`、`meta keywords`、H1 与自指 canonical；canonical 与 sitemap URL 一致，没有新的 metadata 或规范化回归。
- Search Console 站点地图页（账号 `wustwangsheng@gmail.com`）显示：`https://www.dlss5nvidia.com/sitemap.xml` 于 **2026-10-10** 提交成功；最近读取仍为 **2026-10-03**，已发现 **68** 个网页、0 个视频。这是 Google 尚未重读新提交的旧快照，不能当作线上 58 条的当前发现数。
- 网页索引报告更新时间仍为 **2026-10-04**：**69 个已编入索引、9 个未编入索引**。未编入索引原因为：自动重定向 3、noindex 2、重复网页（用户未选定规范网页）1、重复网页（Google 选择的规范网页不同）2、已发现尚未编入索引 1、已抓取尚未编入索引 0；后三类验证均显示“已开始”。
- “已发现尚未编入索引”旧样本是 `https://www.dlss5nvidia.com/comparisons`（报告快照）；通过 Search Console 网址检查实时复核，该 URL 当前显示 **“网址已收录到 Google”**、**“网页已编入索引”**，因此没有再次点击请求编入索引。
- “重复网页，用户未选定规范网页”旧样本是 `https://www.dlss5nvidia.com/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026`（最后抓取 2026-10-02）；当前生产代码已将该入口改为单跳 301，属于等待 Google 重抓的历史样本，不应再次提交。
- 效果报告实时读数（图表日期 2026-09-30 至 2026-10-06）：最近 7 天 **659 点击 / 6,514 展示 / CTR 10.1% / 平均排名 7**；最近 28 天 **1,690 点击 / 约 1.77 万展示 / CTR 9.5% / 平均排名 7.3**。7 天主要查询仍为 `dlss 5 online`、`dlss 5 image converter`、`dlss 5 image generator`；28 天主要查询仍为 `dlss 5 image converter`、`dlss 5 online`、`dlss 5 download`、`dlss 5 image generator`、`dlss 5 visual enhancer`。

### 当前 TODO

- 等 Google 重读 2026-10-10 的 sitemap 提交并刷新索引报告；刷新后确认 58 条正式 URL 的发现数与重复路由验证结果。
- 继续观察 converter、online、generator、visual enhancer 及新播客/案例页的点击分流。当前没有新的、非重定向或 noindex 且未进入验证队列的 URL，因此本轮不再逐页重复请求编入索引。

## 2026-10-10：两站 Search Console sitemap 与 URL Inspection 复核（15:00 CST）

- 账号：`wustwangsheng@gmail.com`；本次使用已登录 Chrome 的 Search Console 界面，只做 sitemap 提交、索引读取和 URL Inspection。
- `dlss5.app` 站点地图页原文：`https://dlss5.app/sitemap.xml`，提交日期 **2026年10月10日**，上次读取 **2026年4月14日**，状态 **成功**，已发现网页 **14**、视频 **0**；`https://www.dlss5.app/sitemap.xml`，重新提交后界面显示提交日期 **2026年10月10日**，上次读取 **2026年4月13日**，状态 **成功**，已发现网页 **14**、视频 **0**。两条都指向同一份 sitemap；线上实际 sitemap 已扩展，但本次提交后 Google 尚未重读，不能把 14 当成当前线上发现数。
- `dlss5.app` 网页索引报告原文：上次更新 **2026/10/4**；已编入索引 **33**；未编入索引 **85**。原因分布：备用网页（有适当的规范标记）**49**、网页会自动重定向 **35**、已抓取 - 尚未编入索引 **1**。报告显示验证均为“未启动”。
- `dlss5nvidia.com` 站点地图页原文：`https://www.dlss5nvidia.com/sitemap.xml`，重新提交后界面显示提交日期 **2026年10月10日**，上次读取 **2026年10月3日**，状态 **成功**，已发现网页 **68**、视频 **0**。
- `dlss5nvidia.com` 网页索引报告原文：上次更新 **2026/10/4**；已编入索引 **69**；未编入索引 **9**。原因分布：网页会自动重定向 **3**、被“noindex”标记排除 **2**、重复网页（用户未选定规范网页）**1**、重复网页（Google 选择的规范网页与用户指定的不同）**2、已发现 - 尚未编入索引 **1**、已抓取 - 尚未编入索引 **0**。前两类验证“未启动”，后三类验证“已开始”（已抓取类为“已通过”）。
- 指定 URL Inspection（`www.dlss5.app` 资源）结果：
  - `/en`：`网址尚未收录到 Google`；原因“备用网页（有适当的规范标记）”；用户规范 `https://dlss5.app/en`；Google 选择 `https://dlss5.app/`。
  - `/en/supported-cards`：`网址尚未收录到 Google`；原因“Google 无法识别此网址”；站点地图、引荐来源均“未检测到”；抓取与规范均“不适用”。
  - `/en/studio`：同上，“Google 无法识别此网址”，站点地图/引荐来源均“未检测到”。
  - `/en/gpu/rtx5090`：同上，“Google 无法识别此网址”，站点地图/引荐来源均“未检测到”。
  - `/zh-CN/gpu/rtx5090`：同上，“Google 无法识别此网址”，站点地图/引荐来源均“未检测到”。
  - `/en/blog/what-is-dlss-5-neural-rendering-guide`：`网址尚未收录到 Google`；原因“备用网页（有适当的规范标记）”；用户规范为该 `/en` URL，Google 选择旧的 `https://dlss5.app/es/blog/...`；最后抓取 **2026年8月26日 16:27:33**，网页抓取成功。
- 实际网址测试：`https://www.dlss5.app/this-page-does-not-exist` 返回原文“网页无法编入索引：未找到 (404)”，网页抓取“失败：未找到 (404)”，测试时间 **2026年10月10日 15:02:21**；不是软 404。
- 旧 URL 检查：`https://www.dlss5.app/de` 显示“网址已收录到 Google”；`https://www.dlss5.app/es` 显示“网址尚未收录到 Google”，原因“备用网页（有适当的规范标记）”，Google 选择与用户声明规范相同；`https://www.dlss5.app/games` 显示“网址尚未收录到 Google”，原因“Google 无法识别此网址”。
- 本次重新提交成功：`https://www.dlss5.app/sitemap.xml`、`https://www.dlss5nvidia.com/sitemap.xml`；未重复提交 apex sitemap（它此前已在 2026年10月10日成功提交，但仍显示 2026年4月14日旧读取快照）。
- 本次点击“请求编入索引”并看到“已请求编入索引 / 已将网址添加到优先抓取队列中”的 URL：
  - `https://www.dlss5.app/en/supported-cards`
  - `https://www.dlss5.app/en/studio`
  - `https://www.dlss5.app/en/gpu/rtx5090`
  - `https://www.dlss5.app/zh-CN/gpu/rtx5090`
  未对 `/en` 或重复文章页请求，以免在规范路由尚未收敛前消耗配额。

### 当前 TODO

- 等 Google 重新读取两条正式 sitemap，并刷新索引报告；提交成功不等于已读取或已编入索引。
- app 的 `/en` 与旧语言/文章 URL 仍有历史规范选择样本，后续 F3 收敛 canonical 后再观察，不在本次 GSC 操作中重复请求。

## 2026-10-10：新增 GPU 证据页的线上复核与优先抓取请求

- 本地与线上产物已完成同一轮验证：`dlss5app` 的 `npm run lint`、`npm run check:consistency`、`npm run build` 均通过；一致性脚本输出 `app=31 main=6 compared=5 mismatches=0 verdict=OK`。主站 `npm run lint`、`npm test`（103/103）和 `npm run build` 也通过。主站仍只维护 6 条有证据的检测器记录，app 的 25 条额外型号未被猜测复制为主站结论。
- 线上 `https://www.dlss5.app/sitemap.xml` 当前返回 **135 个 `<loc>`**；`/en/gpu/rtx3070ti`、`/en/gpu/rtx5080`、`/en/gpu/rtx5070ti`、`/en/gpu/rtx5070` 均返回 HTTP **200**，并分别有自指 canonical、唯一型号 title、description 与 H1。示例 title：`RTX 3070 Ti DLSS 5 support and VRAM evidence | Neural Architect`。
- 在已登录的 Search Console（`wustwangsheng@gmail.com`，`dlss5.app` 资源）中逐页检查并点击“请求编入索引”，Google 对以下四个此前显示“网址尚未收录到 Google / Google 无法识别此网址”的 URL 均返回原文 **“已请求编入索引”**，并提示“已将网址添加到优先抓取队列中”：
  - `https://www.dlss5.app/en/gpu/rtx3070ti`
  - `https://www.dlss5.app/en/gpu/rtx5080`
  - `https://www.dlss5.app/en/gpu/rtx5070ti`
- `https://www.dlss5.app/en/gpu/rtx5070`
- `https://www.dlss5.app/zh-CN/supported-cards`
- 这五条只是进入抓取队列，不等于已经编入索引；之前已提交的 `/en/supported-cards`、`/en/studio`、`/en/gpu/rtx5090`、`/zh-CN/gpu/rtx5090` 不重复提交。Google 站点地图和索引报告仍可能显示旧快照，后续只在报告或 URL Inspection 出现新状态后再复核。

## 2026-10-10：主站新工具页 URL Inspection 复核

- 使用已登录的 Google Search Console `dlss5nvidia.com` 资源逐页检查：
  - `https://www.dlss5nvidia.com/game-character-style`
  - `https://www.dlss5nvidia.com/video-upscaler`
  - `https://www.dlss5nvidia.com/podcast`
  - `https://www.dlss5nvidia.com/tools/passport-photo`
- 四个 URL 的界面原文均为 **“网址已收录到 Google”**，并显示 **“网页已编入索引”**；未出现新的 canonical 冲突、未发现“Google 无法识别此网址”或抓取异常。
- `video-upscaler` 另外显示视频索引区域存在有效视频结构化内容；本轮只读取，没有重复点击“请求编入索引”。
- 结论：主站新增工具、播客与案例入口已经进入 Google 索引，当前剩余问题仍是历史重复/重定向验证队列和 sitemap 报告滞后，不再对已收录 URL 重复提交。

### 当前 TODO

- 等 Google 刷新 sitemap 与索引报告，确认历史重复路由验证结果；报告更新前不重复提交同一 URL。
- 下一次数据刷新后比较 `image converter`、`online`、`image generator`、`visual enhancer` 与新工具页的点击分流。

## 2026-10-10：SEO 生产面最终核验（本轮）

- 线上 `https://www.dlss5nvidia.com/sitemap.xml` 返回 **58** 个 `<loc>`；并发逐页抓取 58/58 均 HTTP 200，均有非空 title、description（≥40 字符）、keywords、H1 与自指 canonical；canonical 与 sitemap URL 一致。
- 58 个标题全部唯一（`duplicateTitleCount=0`），未发现新的软 404、canonical 漂移或 sitemap 外的重复正式 URL。
- `robots.txt` 允许抓取，并指向 `https://www.dlss5nvidia.com/sitemap.xml`。
- 可直接修复的代码侧 SEO 项已收口；Search Console 当前剩余是 Google 重新读取 sitemap、刷新索引报告和既有验证队列。提交已成功但界面仍显示旧读取快照时，不重复提交同一 sitemap、不重复请求已收录 URL。
- 待 Google 报告刷新后再核对：58 条正式 URL 的发现数、历史重复/规范验证是否结束，以及 converter / online / generator / visual enhancer 的页面分流。
- 本轮尝试读取已登录浏览器中的 Search Console 时，浏览器运行时返回“Unable to load browser request-header policy”；未重复重试、未执行任何 GSC 写操作。
