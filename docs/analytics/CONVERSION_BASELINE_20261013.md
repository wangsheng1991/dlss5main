# GA4 转化基线（2026-10-13）

## 读取范围

- 属性：`dlss5`（GA4 Measurement ID：`G-2H65VD73K0`，主站与 `.app` 共用）
- 读取时间：2026-10-13（Asia/Shanghai）
- 报告窗口：过去 28 天，GA4 界面原文为 **2026-09-15 – 2026-10-12**。
- 报告：报告 → 查看用户互动度和留存率 → 事件。
- 数据完整性提示：界面显示「此报告使用 100% 的可用数据」。

## 事件计数（界面原文）

GA4 事件报告的总计行显示：事件数 **16,714**，用户总数 **2,016**。事件表逐行显示：

| 事件 | 事件数 | 用户总数 | 界面状态 |
|---|---:|---:|---|
| `page_view` | 8,205 | 2,012 | 已显示 |
| `experience_click` | 未显示 | 未显示 | 事件表没有该事件名 |
| `generation_start` | 未显示 | 未显示 | 事件表没有该事件名 |
| `generation_success` | 未显示 | 未显示 | 事件表没有该事件名 |
| `generation_failure` | 未显示 | 未显示 | 事件表没有该事件名 |
| `download_click` | 未显示 | 未显示 | 事件表没有该事件名 |

同一份报告中还显示：`user_engagement` 2,539（1,328 用户）、`session_start` 2,478（2,014 用户）、`first_visit` 1,991（1,987 用户）、`scroll` 919（608 用户）、`click` 455（193 用户）、`form_start` 120（114 用户）、`form_submit` 4（3 用户）、`ph_probe` 1（1 用户）、`video_progress` 1（1 用户）、`video_start` 1（1 用户）。这些不是漏斗契约中的生成成功/失败事件，不能替代它们。

## 页面与渠道拆分

本次在 GA4 标准报告中核对了事件表，但没有看到 `experience_click`、`generation_start`、`generation_success`、`generation_failure` 或 `download_click` 这些事件，因此按页面（至少 `/download`、`/dashboard`、`/image-quality-enhancer`、`/image-upscaler`、`/video-upscaler`、`/`）和按渠道（自然搜索、直接、引荐）的上述关键事件计数均为 **未显示**。没有把 `click` 或页面浏览量推算成生成事件。

GA4 报告首页曾显示一个**过去 7 天**的渠道卡片（不是本次 28 天基线），因此不把它混入本表，也不据此推导 28 天渠道转化：该卡片原文为 Organic Search 578、Direct 161、AI Assistant 3、Referral 6、Unassigned 2。

## 口径边界

- GA4 只统计成功加载 GA4 标签并发出事件的访问；标签未加载、拦截或未触发事件的访问不会出现在这里。
- Cloudflare RUM 统计的是边缘侧观测到的请求/页面行为，覆盖范围与 GA4 不同，不能直接相减。
- Google Search Console 统计 Google 搜索展示与点击，不是全渠道会话，也不包含 Direct、Referral 或未触发 GA4 的访问。
- 当前基线能回答：GA4 在该 28 天窗口实际收到多少 `page_view`，以及漏斗事件是否已经以契约名称进入标准事件报告。
- 当前基线不能回答：各页面/渠道的生成成功率或下载转化率，因为契约中的五个体验/生成/下载事件在界面中未显示；也不能用 `click` 代替这些事件。
