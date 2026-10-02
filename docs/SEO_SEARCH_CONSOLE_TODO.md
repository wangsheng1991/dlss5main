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
