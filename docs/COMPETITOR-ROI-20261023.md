# GSC × 竞品：先做可核对的选择器，再决定真实图片试用（2026-10-23）

## 1. 口径与抓取记录

本轮只读调研、写方案；未改站点源码、未部署、未安装竞品软件、未提交索引请求。依据 [工单](COMPETITOR-ROI-TASK-20261023.md) 与 [GSC 原始复盘](GSC-ROI-ANALYSIS-20261022.md)。此前 `2468af1` 已改过摘要和答案开头，本次不把已有工作再包装成新方案。

GSC 窗口为 **2026-09-22—2026-10-19**，全球、全设备、Web，引用查询行原文。**查询是抽样/截断式非全量，通常只给约 Top 1000；不是统计学随机抽样，也不是全部需求。** 本轮没有刷新 GSC。历史平均排名不等于本次 US/en 名次，不能将跨日期、跨国家数据直接作排名升降。

系统 Google Chrome + Playwright，未登录的新 context，`hl=en&gl=us&num=20`，locale `en-US`，视口 `1280×1600`，代理 `http://127.0.0.1:1082`。页面页脚均显示 **Morrow County, Oregon - From your IP address**（空白统一）；这是本次出口定位，不代表全国排名。候选都是英文查询，没有中文词组，故不额外编造 zh-CN 样本。

共享 `shared_env/seo/serp-batch.mjs` 和 `parse-serp.py` 原文件未改，副本、原始 DOM、可见正文、抓取元数据、解析脚本都在 `/tmp/serp-20261023/`。`parse-evidence.py` 修正原解析器漏掉独立视频结果的问题：取带外链的 h3，自上而下编号，包含独立视频卡；排除 AIO 引用、视频合集、PAA、广告、讨论合集，不把视频合集中的每段视频当自然链接。Google `/goto` 链接已解析成最终 URL。不是截图像素位置排名。

日志全部出现 `[被拦]`，这是共享脚本用 HTML 中 `captcha` 字符串检测的误报：五份页面均有完整自然结果、正文、定位页脚，无验证墙。竞品正文的真实 HTTP 403 另行记录。`Shopping / Images` 导航按钮不算购物/图片结果包；五次均未在可见正文发现独立购物或图片包，不代表其他地区或折叠状态没有。


| 主查询 | 抓取时间 UTC（北京时间 +08:00） | 自然结果数（解析计数） | AIO | PAA | 视频 | 文件前缀 |
|---|---|---|---|---|---|---|
| dlss 5 download | 00:17:17（08:17:17） | 7 | 有 | 有 | 有（含 AIO 内视频或视频合集） | `dlss-5-download` |
| dlss 5 visual enhancer | 00:17:53（08:17:53） | 6 | 有 | 未出现 | 有（含 AIO 内视频或视频合集） | `dlss-5-visual-enhancer` |
| dlss 5 apk | 00:18:30（08:18:30） | 8 | 有 | 未出现 | 有（含 AIO 内视频或视频合集） | `dlss-5-apk` |
| dlss 5 vs fsr 4 | 00:19:07（08:19:07） | 6 | 有 | 有 | 有（含 AIO 内视频或视频合集） | `dlss-5-vs-fsr-4` |
| dlss 4 vs dlss 5 | 00:19:43（08:19:43） | 6 | 有 | 有 | 有（含 AIO 内视频或视频合集） | `dlss-4-vs-dlss-5` |

每个前缀均有 `.html`、`.txt`、`.json`；最终清单 `serps-parsed.json`、`parsed-summary.txt`，候选 `pool.json`。竞品为 `competitor-<hostname>.html/.json/.png`，计数来自已渲染 DOM。浏览器被挡的页面，改用网页读取工具补读；补读只证明正文，不补造 schema/媒体数。Reddit 补读的相对时间与实时 SERP 不一致，不能用它推算发布日期。

本站在五次抓到的自然结果中均未出现（每页实际只解析到上表数量，`num=20` 不保证返回二十条）。因此可以说“本样本前列对手”，不能声称本站今天确切第几，或把历史平均位次当今日落后幅度。两站没有第三方流量数据；不以 stars、播放或下载计数推算访问量。

## 2. 词池：15 条、5 组

推断：粗筛规则固定为展示≥150且位次4–15；补充低CTR边界为展示≥100、点击≤1且位次4–15。共16条满足，统一用“展示×假设CTR增加2个百分点”排序，保留前15条。2个百分点仅为可重复的排序假设，不是行业基准或增长承诺。被截掉 `dlss 4 vs 5`（109展示 / 0点击 / 0% / 8.5）仍属既有对比意图，不另建组。高CTR的安卓词也保留，供否决低ROI方向。

| 查询原文（粗排） | 展示 | 点击 | CTR | 平均排名 | 意图组 / 落点 | 情景机会：展示×2%（计算） |
|---|---|---|---|---|---|---|
| dlss 5 download | 978 | 49 | 5% | 11 | 下载；/download | 19.56 |
| dlss 5 visual enhancer | 953 | 36 | 3.8% | 6.6 | 视觉增强；/ 与 /visual-enhancer | 19.06 |
| dlss 5 apk | 359 | 21 | 5.8% | 8.7 | APK / 安卓 / 手机；/download（APK页只见零星展示） | 7.18 |
| dlss visual enhancer | 244 | 3 | 1.2% | 7.4 | 视觉增强；/ 与 /visual-enhancer | 4.88 |
| dlss 5 vs fsr 4 | 243 | 4 | 1.6% | 5.1 | DLSS / FSR 对比；/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026 | 4.86 |
| dlss 5 download android | 233 | 40 | 17.2% | 6.9 | APK / 安卓 / 手机；/download（APK页只见零星展示） | 4.66 |
| fsr 4 vs dlss 5 | 227 | 13 | 5.7% | 5.1 | DLSS / FSR 对比；/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026 | 4.54 |
| dlss5 visual enhancer | 217 | 12 | 5.5% | 5.4 | 视觉增强；/ 与 /visual-enhancer | 4.34 |
| dlss 4 vs dlss 5 | 182 | 0 | 0% | 7.5 | DLSS 4 / 5 对比；同一篇对比文章 | 3.64 |
| dlss 5 mobile download | 171 | 32 | 18.7% | 6 | APK / 安卓 / 手机；/download（APK页只见零星展示） | 3.42 |
| dlss 5 android download | 170 | 35 | 20.6% | 6 | APK / 安卓 / 手机；/download（APK页只见零星展示） | 3.4 |
| dlss4 vs dlss5 | 161 | 0 | 0% | 8 | DLSS 4 / 5 对比；同一篇对比文章 | 3.22 |
| dlss 5 android | 159 | 14 | 8.8% | 8 | APK / 安卓 / 手机；/download（APK页只见零星展示） | 3.18 |
| dlss5-visual-enhancer | 127 | 1 | 0.8% | 5.6 | 视觉增强；/ 与 /visual-enhancer | 2.54 |
| dlss 5 vs dlss 4 | 117 | 1 | 0.9% | 7.1 | DLSS 4 / 5 对比；同一篇对比文章 | 2.34 |

下表为查询样本求和（计算），不是 GSC 界面簇值、人数或收入；不与页面展示再次相加。

| 组 | 所选查询展示合计（计算） | 点击合计（计算） |
|---|---|---|
| 下载 | 978 = 978 | 49 |
| 视觉增强 | 953+244+217+127 = 1541 | 52 |
| APK / 安卓 / 手机 | 359+233+171+170+159 = 1092 | 142 |
| DLSS / FSR 对比 | 243+227 = 470 | 17 |
| DLSS 4 / 5 对比 | 182+161+117 = 460 | 1 |

计算：所选15条展示合计 **4,541**、点击合计 **261**。这里的“覆盖”只是逐查询求和，不是假称 GSC 给出了一个4,541的聚合读数。

纠错：原复盘 ROI 段把“244展示/3点击”简写为 `image enhancer`；原始查询表是 **`dlss visual enhancer`**。本报告不把泛词 image enhancer 的未知市场量塞入预期。

## 3. 每组 SERP 与竞品解剖

### 3.1 前五自然结果

标题保留本次 SERP 原文（截断省略号也保留）；描述列为中文摘要，不作为技术事实背书。完整英文 snippet 在 `serps-parsed.json`。页面类型为人工判读；“工具”区分网页可运行与下载软件，不因有下载按钮就写成在线工具。


#### 下载 — `dlss 5 download`

| 序 | 标题 / URL | 域名 | 描述摘要 | 类型 / 工具 |
|---|---|---|---|---|
| 1 | [Merserk/dlss5-visual-enhancer: DLSS 5 Neural Rendering ...](https://github.com/Merserk/dlss5-visual-enhancer) | github.com | 摘要指向发布、安装或功能需求 | 软件仓库/Issue；有软件发布或开发讨论；不等于浏览器即用 |
| 2 | [NVIDIA DLSS ／ NVIDIA Developer](https://developer.nvidia.com/rtx/dlss) | developer.nvidia.com | 按开发环境提供 DLSS 插件 | 厂商开发者官网；SDK/插件下载入口，非图片工具 |
| 3 | [DLSS 5 Swapper download](https://sourceforge.net/projects/dlss-5-swapper.mirror/) | sourceforge.net | Windows 安装、配置与恢复 | 软件镜像分发；有软件下载，非在线运行 |
| 4 | [Modding Tools](https://www.nexusmods.com/site/mods/2228) | www.nexusmods.com | Modding Tools，摘要提示登录 | Mod分发；下载/登录入口，运行未验证 |
| 5 | [DLSS 5 Swapper for Windows - Download it from ...](https://dlss-5-swapper.en.uptodown.com/windows) | dlss-5-swapper.en.uptodown.com | Windows 游戏图形管理 | 软件聚合下载；有软件下载，未安装 |

PAA 原问（摘录3条，完整见 txt）：“Can I download DLSS 5?”；“How do I install DLSS 5?”；“Is DLSS 5 available?”。

SERP：AIO 有；视频有；独立图片包/购物包未见。AIO 的硬件、性能说法未作事实来源。

#### 视觉增强 — `dlss 5 visual enhancer`

| 序 | 标题 / URL | 域名 | 描述摘要 | 类型 / 工具 |
|---|---|---|---|---|
| 1 | [NVIDIA DLSS 5 Technical Preview - Neural Rendering is ...](https://www.techpowerup.com/review/nvidia-dlss-5-technical-preview/7.html) | www.techpowerup.com | 技术预览或盲测讨论；版本与查询未必相同 | 评测/论坛；未验证在线工具 |
| 2 | [Made a GUI for DLSS 5 before upscaling](https://www.reddit.com/r/OptimizedGaming/comments/1wm9icu/made_a_gui_for_dlss_5_before_upscaling_looking/) | www.reddit.com | 安装、功能差异或工具开发讨论 | 论坛UGC；讨论与外链；非站内增强器 |
| 3 | [How to Boost DLSS 5's Performance with this ONE Upscaling ...](https://www.youtube.com/watch?v=lC51DH1s0BM) | www.youtube.com | 教程或版本对比，有视频结果 | 视频；视频播放；不是站内增强器 |
| 4 | [Feature Request — DLSS Ray Reconstruction · Issue #111](https://github.com/Merserk/dlss5-visual-enhancer/issues/111) | github.com | 摘要指向发布、安装或功能需求 | 软件仓库/Issue；有软件发布或开发讨论；不等于浏览器即用 |
| 5 | [Merserk/dlss5-visual-enhancer — GitHub trending stats & ...](https://trendshift.io/repositories/203951) | trendshift.io | 汇总软件定位与趋势 | 仓库聚合；仓库目录；运行未验证 |

PAA：本次未出现，取不到原问；不拿 People also search for 充数。

SERP：AIO 有；视频有；独立图片包/购物包未见。AIO 的硬件、性能说法未作事实来源。

#### APK / 安卓 / 手机 — `dlss 5 apk`

| 序 | 标题 / URL | 域名 | 描述摘要 | 类型 / 工具 |
|---|---|---|---|---|
| 1 | [How do I download dlss5 for any game? : r/DLSS](https://www.reddit.com/r/DLSS/comments/1wnve3o/how_do_i_download_dlss5_for_any_game/) | www.reddit.com | 安装、功能差异或工具开发讨论 | 论坛UGC；讨论与外链；非站内增强器 |
| 2 | [DLSS 5 finally on mobile](https://www.facebook.com/groups/748054870699908/posts/1524030136435707/) | www.facebook.com | 手机话题或对比口径争论 | 社群UGC/视频；帖子/视频，未见在线增强工具 |
| 3 | [You can now apply DLSS 5 to your entire desktop with a ...](https://www.pcgamer.com/hardware/you-can-now-apply-dlss-5-to-your-entire-desktop-with-a-free-app-and-it-even-works-with-rtx-30-series-cards/) | www.pcgamer.com | 桌面应用介绍与操作体验 | 媒体新闻/体验；文章外链软件，非站内工具 |
| 4 | [Modding Tools](https://www.nexusmods.com/site/mods/2228) | www.nexusmods.com | Modding Tools，摘要提示登录 | Mod分发；下载/登录入口，运行未验证 |
| 5 | [DLSS 5 explained, with Linus Tech Tips ／ The Vergecast](https://www.youtube.com/watch?v=1NdPr8nQkWg) | www.youtube.com | 教程或版本对比，有视频结果 | 视频；视频播放；不是站内增强器 |

PAA：本次未出现，取不到原问；不拿 People also search for 充数。

SERP：AIO 有；视频有；独立图片包/购物包未见。AIO 的硬件、性能说法未作事实来源。

#### DLSS / FSR 对比 — `dlss 5 vs fsr 4`

| 序 | 标题 / URL | 域名 | 描述摘要 | 类型 / 工具 |
|---|---|---|---|---|
| 1 | [AMD FSR 4 vs Nvidia DLSS 4 at 4K](https://www.techspot.com/article/2976-amd-fsr4-4k-upscaling/) | www.techspot.com | 同分辨率图像质量对比 | 硬件测试长文；对照测试，非上传工具 |
| 2 | [Blind Test Shows Gamers Prefer NVIDIA DLSS 4.5 Over ...](https://www.techpowerup.com/forums/threads/blind-test-shows-gamers-prefer-nvidia-dlss-4-5-over-amd-fsr-4-1.348633/) | www.techpowerup.com | 技术预览或盲测讨论；版本与查询未必相同 | 评测/论坛；未验证在线工具 |
| 3 | [Nvidia DLSS 4.5 and AMD FSR 4 Compared](https://www.noobfeed.com/hardware/dlss45-fsr4-4k-image-quality-breakdown) | www.noobfeed.com | DLSS 4.5 与 FSR 4 图像质量 | 硬件对比长文；长文，未见可运行工具 |
| 4 | [The Ultimate Battle: DLSS 4.5 vs FSR 4!](https://www.youtube.com/shorts/Ho6nl_0-GXQ) | www.youtube.com | 教程或版本对比，有视频结果 | 视频；视频播放；不是站内增强器 |
| 5 | [Why compare DLSS 4 to DLSS 5 instead of native ...](https://www.facebook.com/groups/372119787729533/posts/1468658724742295/) | www.facebook.com | 手机话题或对比口径争论 | 社群UGC/视频；帖子/视频，未见在线增强工具 |

PAA 原问（摘录3条，完整见 txt）：“Do I use FSR or DLSS?”；“How much better is DLSS 4.5 than DLSS 4?”；“Will AMD have something similar to DLSS 5?”。

SERP：AIO 有；视频有；独立图片包/购物包未见。AIO 的硬件、性能说法未作事实来源。

#### DLSS 4 / 5 对比 — `dlss 4 vs dlss 5`

| 序 | 标题 / URL | 域名 | 描述摘要 | 类型 / 工具 |
|---|---|---|---|---|
| 1 | [What is the difference that makes DLSS 4 and 5 so different?](https://www.reddit.com/r/pcmasterrace/comments/1w3ld6q/what_is_the_difference_that_makes_dlss_4_and_5_so/) | www.reddit.com | 安装、功能差异或工具开发讨论 | 论坛UGC；讨论与外链；非站内增强器 |
| 2 | [DLSS Technology](https://www.nvidia.com/en-us/geforce/technologies/dlss/) | www.nvidia.com | 抓不到 | 抓不到；抓不到 |
| 3 | [Why compare DLSS 4 to DLSS 5 instead of native ...](https://www.facebook.com/groups/372119787729533/posts/1468658724742295/) | www.facebook.com | 手机话题或对比口径争论 | 社群UGC/视频；帖子/视频，未见在线增强工具 |
| 4 | [DLSS 5 vs DLSS 4.5: What Actually Changes?](https://www.dlss5.net/dlss-5-vs-dlss-4-5) | www.dlss5.net | 区分重建/帧生成与光照材质 | 主题指南；有 Checker 入口，本对比页未见可运行表单 |
| 5 | [DLSS 5 vs DLSS 4: Which Is Actually Better?](https://dlss5.org/dlss5-vs-dlss4/) | dlss5.org | 性能与视觉目标对比 | 主题指南；图像对比滑块，非用户图片生成器 |

PAA 原问（摘录3条，完整见 txt）：“Is DLSS 4 only for RTX 50 series?”；“How much better will DLSS 5 be?”；“Which GPUs are supported by DLSS 5?”。

SERP：AIO 有；视频有；独立图片包/购物包未见。AIO 的硬件、性能说法未作事实来源。

### 3.2 前三域名级解剖（同域复用一次；NVIDIA 两个子域合看）

下表“正文量”是 main/article 优先、否则 body 的空白分词计算，含页面模块，不是假称纯文章字数；图片包括头像、徽章、推荐图，视频包括 iframe。统计只是 DOM 元素，不能据此认定素材原创、视频能播放或产品有效。403 验证墙不拿其字数/零图片冒充竞品指标。未见 JSON-LD 不等于没有 microdata。


| 抽样页面（同域代表） | 正文量/表格（DOM计算） | JSON-LD 类型 | 图片/视频iframe（DOM计算） | 同host链接/全部链接（DOM计算） | 日期线索 |
|---|---|---|---|---|---|
| [developer.nvidia.com](https://developer.nvidia.com/rtx/dlss) | 664词 / 0表 | Organization | 3 / 5 | 12/19 | 未见可解析更新日期；相对日期见下文 |
| [dlss5.org](https://dlss5.org/dlss5-vs-dlss4/) | 989词 / 1表 | 未见 JSON-LD | 18 / 0 | 2/4 | 未见可解析更新日期；相对日期见下文 |
| [github.com](https://github.com/Merserk/dlss5-visual-enhancer) | 1907词 / 4表 | 未见 JSON-LD | 19 / 3 | 139/158 | 未见可解析更新日期；相对日期见下文 |
| sourceforge.net | Chrome 403，抓不到（补读见下文） | 抓不到 | 抓不到 | 抓不到 | 抓不到 |
| [www.dlss5.net](https://www.dlss5.net/dlss-5-vs-dlss-4-5) | 1112词 / 2表 | Answer, BreadcrumbList, FAQPage, ListItem, Question | 0 / 0 | 13/18 | Updated October 1, 2026（可见） |
| [www.facebook.com](https://www.facebook.com/groups/748054870699908/posts/1524030136435707/) | 45词 / 0表 | 未见 JSON-LD | 11 / 1 | 5/5 | 未见可解析更新日期；相对日期见下文 |
| www.noobfeed.com | Chrome 403，抓不到（补读见下文） | 抓不到 | 抓不到 | 抓不到 | 抓不到 |
| [www.nvidia.com](https://www.nvidia.com/en-us/geforce/technologies/dlss/) | 1503词 / 1表 | 未见 JSON-LD | 134 / 4 | 268/303 | 未见可解析更新日期；相对日期见下文 |
| [www.pcgamer.com](https://www.pcgamer.com/hardware/you-can-now-apply-dlss-5-to-your-entire-desktop-with-a-free-app-and-it-even-works-with-rtx-30-series-cards/) | 929词 / 0表 | BreadcrumbList, Dataset, ImageObject, ItemList, ListItem, NewsArticle, Organization, Person, SiteNavigationElement, SpeakableSpecification, WebPage | 13 / 0 | 26/45 | datePublished=2026-09-10T13:25:57+00:00；dateModified=2026-09-10T13:25:57+00:00 |
| www.reddit.com | Chrome 403，抓不到（补读见下文） | 抓不到 | 抓不到 | 抓不到 | 抓不到 |
| www.techpowerup.com | Chrome 403，抓不到（补读见下文） | 抓不到 | 抓不到 | 抓不到 | 抓不到 |
| www.techspot.com | Chrome 403，抓不到（补读见下文） | 抓不到 | 抓不到 | 抓不到 | 抓不到 |
| [www.youtube.com](https://www.youtube.com/watch?v=lC51DH1s0BM) | 375词 / 0表 | 未见 JSON-LD | 73 / 1 | 146/148 | 未见可解析更新日期；相对日期见下文 |

- **GitHub / Merserk**：公开仓库可读，README 给发布下载、解压、运行路径；运行需 Windows 与相应硬件，未下载执行，软件自身是否另需鉴权/费用未验证。页面有功能/媒体格式表、视频示例、Releases/Issues/Wiki；可见 `Star1.5k` 为约数、`97 Commits`、`39` Issues，不是本站可复制的用户信任存量。截图确认仓库界面，不证明软件效果。无逐项基准测量证据；有 LICENSE/THIRD-PARTY-NOTICES 可追溯。无本页 `/tools` 目录，存在同项目 `tools` 源码目录，二者不同。[仓库](https://github.com/Merserk/dlss5-visual-enhancer)
- **NVIDIA**：两个官网页无需登录阅读；开发者页的下载是否需要账号本轮未点击验证，消费页不是上传工具。消费者页有支持硬件表、带捕获设置的游戏展示；开发者页有 SDK/论坛/GitHub 出口。厂商身份是来源优势，不能通过模仿标题复制。未见统一页面更新日，不以插件文件名冒充 dateModified。媒体为厂商展示，未重跑验证；同主题内链到 DLSS、Reflex、支持游戏；不把官网身份等同每个搜索词都不可竞争。[开发者页](https://developer.nvidia.com/rtx/dlss)、[技术页](https://www.nvidia.com/en-us/geforce/technologies/dlss/)
- **SourceForge**：Chrome 403；网页读取补到正文：明确是 GitHub 项目的镜像，Windows、MIT、Files/Reviews/Activity、`Last Update: 2026-09-29`；下载入口可见，未下载验证登录要求。评论区要求登录且提示成为首位评论者，不能写“已有真实好评”。正文、schema与媒体精确计数抓不到；有同项目文件/活动内链，没有证据支持独立在线工具。[镜像页](https://sourceforge.net/projects/dlss-5-swapper.mirror/)
- **TechPowerUp**：Chrome 403，网页读取也失败；正文体量、schema、媒体、登录、内链、逐项来源全写**抓不到**。只能确认 SERP 是技术预览/论坛盲测，不能编成我们已核验其评测方法或真实用户意见。[预览页](https://www.techpowerup.com/review/nvidia-dlss-5-technical-preview/7.html)
- **Reddit**：Chrome 403；网页补读 GUI 帖可见作者自述 Windows 工具、GitHub 仓库与评论讨论，网页无登录可读，评论操作未测试。补读的 `1d ago` 与 SERP 的 `1 month ago` 不一致，时间取不到可统一绝对值。schema、原 DOM 媒体、纯正文字数抓不到；论坛相关主题内链可见，非本站工具。评论真实性/作者身份未验证，不能当作产品口碑结论。[GUI 帖](https://www.reddit.com/r/OptimizedGaming/comments/1wm9icu/made_a_gui_for_dlss_5_before_upscaling_looking/)
- **YouTube / Gaming Optimized**：可见标题、频道、说明和相关 DLSS 视频；播放器明确要求登录确认非机器人，**本次无法看完验证演示**。页面 `17K views`、`1mo ago` 是约数/相对值，不换算访问量或日期。正文有游戏反作弊警示及社区链接，未见逐条实验来源；推荐视频内链很多，不能视为手工同主题内容库。未见本页 JSON-LD，不推断平台没有 VideoObject。[视频](https://www.youtube.com/watch?v=lC51DH1s0BM)
- **Facebook**：公开帖子只见短文、社群、作者、评论与视频元素；可见 `September 8`（未写年）、`1 comment`。无需登录可读这部分，视频是否完整可播/加入社群是否必需未验证；截图真实性、技术承诺无从核验。没有证据证明“mobile”标题意味着真实可用 APK，不能复制它的承诺。[手机帖](https://www.facebook.com/groups/748054870699908/posts/1524030136435707/)
- **PC Gamer**：新闻体验页可无登录阅读；有署名 James Bentley、发布日期、应用 GitHub 与其他报道外链、作者自述体验、On/Off 图片和边界说明。不是站内上传工具，未安装应用；图片是页面中的效果对照，未核验生成过程。主题标签及同主题报道内链清晰；`39` 为评论入口显示，不证明已读完评论。[体验文](https://www.pcgamer.com/hardware/you-can-now-apply-dlss-5-to-your-entire-desktop-with-a-free-app-and-it-even-works-with-rtx-30-series-cards/)
- **TechSpot**：Chrome 403，网页补读成功；署名 Tim Schiesser、`April 26, 2025`、`16 comments`。目录把纹理、稳定性、植被、性能分开，描述同分辨率、不同显卡采样与关闭特定画面效果；是可阅读的硬件对照长文，不是在线生成器。正文体量取不到可复核字数：未获无验证墙DOM，不报精确字数/媒体/schema/dateModified；有前一篇测试和硬件页内链、Downloads 分类，未见本页 `/tools`。其测量结论不能拿我们的重绘模型替代验证。[测试文](https://www.techspot.com/article/2976-amd-fsr4-4k-upscaling/)
- **NoobFeed**：Chrome 403，网页补读成功；`Jan 29, 2026`、作者 Mitsuba Miyu，可见按反射、远景等组织的对比段落和图片，声称排除光追及帧生成。没有获得本轮可数 DOM，精确正文量、schema/dateModified、媒体数抓不到；可读文本不见在线工具或逐条原始测量表，不推断实际测试质量。分类/作者内链存在。[对比文](https://www.noobfeed.com/hardware/dlss45-fsr4-4k-image-quality-breakdown)

### 3.3 补看更可复制的第4/5名（不是冒充前三）

- **dlss5.net**：公开文章无需登录，首段直答，功能与版本表、FAQ、同主题支持卡/预设/设置内链、引用官方资料；标题贴查询、更新日可见。本页没有上传/推理工具，Checker 是另一个入口。纯信息整理已是竞争门槛，不足以成为我们新增优势。[页面](https://www.dlss5.net/dlss-5-vs-dlss-4-5)
- **dlss5.org**：公开阅读、正文表格和图片对比滑块、无登录墙；有相关游戏/GPU入口。首屏截图确认文章+广告位；DOM有对照图片，不证明是独立实测。本次正文仍写“尚未在游戏发布”之类时间状态，且未见逐条来源链接；我们不能照抄其支持/帧数/购买推荐。其优势是直答和可视对照，而不是我们核验过的事实准确性。[页面](https://dlss5.org/dlss5-vs-dlss4/)

## 4. 可检验归因：为什么占词、哪些能复制

推断：下面是有证据的竞争假设，**不是 Google 排名因果证明**。没有竞品跳出率、链接质量或转化率数据，因此不写“有工具所以跳出率低”。

| 组 | 可检验假设与当前证据 | 可复制性 / 成本（估） | 如何证伪 |
|---|---|---|---|
| 下载 | 推断：前三交付的是软件/SDK/镜像，安装意图比申请表更直接；仓库包含发布、格式、限制、演示，单改摘要填不了交付差距。 | 部分；如做独立批处理客户端，分发、签名、更新和GPU验证不止一日；本轮不选，不冒充原软件。 | 分离“下载软件”与“浏览器图片”访客；若用户仍要求原生RTX软件，我们的图片管线不满足该词。 |
| 下载 | 推断：厂商源与公开仓库的可追溯性有帮助，但并非长文长度；官网页比仓库更短。 | 来源、版本/限制表可复制，估0.5日；厂商身份和历史社区不可复制。 | 若补交付信息仍不能完成目标，停止靠堆字解释效果。 |
| 视觉增强 | 推断：前列有评测、GUI讨论、教程，混有软件实体意图；视频块/AIO挤占普通链接。本站已有缓存样例，并不是空白介绍页，但用户真图需另跳工作室。 | 部分；专页内真实上传→结果→下载，估4日；不宣称替代Merserk或NVIDIA。 | 区分“寻找指定Windows项目”与“处理自己的图片”；后者才是MVP目标，若真实任务没人完成则不加预算。 |
| 视觉增强 | 推断：可检查的真实任务比新增同义页更有差异；仅替换meta无法复制演示与可交付物。 | 能复制操作证据，不能复制未核验的RTX视频/插帧效果；估入上述4日。 | 提供输入、模型与输出尺寸，让用户核对；输出失败/改坏文字、人脸同样公开为限制。 |
| APK/手机 | 推断：AIO已回答可用边界，前三是UGC与桌面应用新闻，不是我们核验到的可用APK；CTR已较高的多个安卓词不是急需“多一个下载入口”。 | 解释边界可做，但10-22已有；“原生DLSS APK”不可复制，故不立新项目。 | 若精确手机查询仍寻找PC工具，浏览器试用不能计作满足；不得把移动流量当软件购买意愿。 |
| APK/手机 | 推断：标题可吸引点击但不代表兑现；Facebook短帖与PC Gamer长文并存，单纯字数不是胜因。 | 可复制清楚的设备/安装路径；品牌社群存量不能复制。 | 以实际成功运行而不是标题CTR验收，未成功则不继续引导下载。 |
| DLSS/FSR | 推断：前列围绕4/4.5的截图/同条件质量讨论，搜索5却被旧版本内容覆盖；存在版本澄清机会，但测试证据本身比一张结论表更强。 | 部分；基于来源的功能选择器估1日；真实游戏基准要专门设备，本轮不承诺。 | 复抓精确查询，若用户实质求4.5测试而非5的分工，选择器CTR不增则停止，不扩大文章数量。 |
| DLSS/FSR | 推断：现有文章也有来源与对照表；新价值应是按目标/硬件输出可核对答案，不是再加表格。 | 能；复用正本文章，未知支持返回“未核实”，不生成性能数。 | 如果输出与原文重复且不能减少找答案步骤，取消交互，保留来源直答。 |
| DLSS4/5 | 推断：PAA问具体GPU，前三是差异问答/官网/社群，第4名已做功能表与FAQ；简单改title或抄FAQ没有独特性。 | 能做任务与支持条件的组合答案，估入1日MVP；厂商背书不能复制。 | 对PAA原问逐项核对数据来源；无来源、过期或全都输出泛话算失败。 |
| DLSS4/5 | 推断：第5名仍留时间状态表述，来源日期和未知态可以提供可检验优势；不能由此证明其排名会下降。 | 能；规则行显示来源URL/核对日，估入1日。 | 若我们也不能维护来源，或用户必须到别处才能确认答案，就不声称优于静态文。 |

## 5. 仅两个方案（待点选；本轮不实施）

### 方案 A — 原对比文章内的“该看哪个功能”选择器（优先）

推断：抢两组对比词，承接正本 `/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026`，不新建同义URL、不改首页。所选 DLSS4/5 三词原数为182/0、161/0、117/1（展示/点击）；FSR两词为243/4、227/13。当前均位次5.1–8，且前列存在版本混排。

推断：优势不是宣称比媒体更会测游戏，而是把“想提帧/改善重建/改光照材质”与硬件、游戏集成分开，回答PAA的具体条件；每条输出带官方来源和核对日。比泛泛开头多的是可复核选择过程，比真正基准少的是实测性能，明确不做后者。

推断：**输入**仅目标、GPU系列（含未知）、游戏是否列入已核对支持范围；**输出**是相关功能、可核实的支持/未知状态、去哪里确认开关、来源和条件。第一版只维护文章涉及的功能与官方硬件表，不做全游戏数据库，不根据GPU自动推断游戏支持。无需登录、无需上传、无需模型调用，浏览器规则匹配；算力在客户端，不调用GPU管线。计算耗时无需网络推理，实际交互延迟待实现测量，目标操作后即时展示而不编“实测毫秒”。结果以可抓取的静态答案作为底层，JS失效仍能读表。

推断：MVP **估1日 / 8人时**：梳理可核对规则与来源、文章内一个选择组件、未知态、键盘/移动端和静态fallback核对。不包括全站样式、全文重写、真实游戏对照或模型图伪装官方截图。超出来源范围就缩小选项而不是延长到大全。

推断：固定曝光的条件情景——DLSS4/5目标CTR **3%**，(182+161+117)×3%−(0+0+1)=**12.8**；FSR目标 **5%**，(243+227)×5%−(4+13)=**6.5**；合计 **19.3，约+19点击/完整28天**。这是目标假设，不是实测或承诺；约2.4点击/估计人时，不能换算收入。AIO可能消耗零点击需求，保守情景是增量0。

推断：验收从上线后首个完整日连续28天，待GSC完整数据可用：同五词点击合计≥38（当前18）、两组CTR分别≥3%/5%，展示至少维持460/470；同时记录文章选择完成及来源点击。复抓同US/en三次看是否开始稳定出现前五，但不把排名作为唯一成功条件。若点击不升、CTR不达目标，或展示掉到无法同口径比较，判“未验证收益”，不自动加文章。功能验收要求每条确定输出有来源、未知硬件/游戏不假答；有误支持结论即停止发布。

推断：红线是把套件版本当全功能支持、给出无来源FPS/画质赢家、改保护页title/H1/canonical/robots/hreflang。需王胜点选“在现有保护文章正文加这个组件”，明确内容边界；本轮不默认获实施授权。

### 方案 B — /visual-enhancer 原地完成自己的图片（第二顺位）

推断：抢视觉增强组选中的四词：953/36、244/3、217/12、127/1，合计1541展示/52点击（计算）。**不是泛词 image enhancer 的已知数据**；面对的是混合意图，只争“处理自己图片”的部分，不伪称取代搜索者指定的Windows项目。

源码可核对现状：`src/pages/VisualEnhancer.tsx` 免登录按钮运行 `sample1`，自己的图指向 `/dashboard?tool=enhance`；已有缓存示例无需再造。`src/config/enhance.ts` 的图像模型是重绘细节、最长边上限 **1536**、目标因子 **2/4**，不能宣传逐像素超分。`docs/alphanet-integration-guide.md` 与 `api/image-edit/upload.ts` 已描述 AlphaNet / `flux-klein`、签名上传、异步任务；本轮只读，没有跑模型或测GPU。

推断：MVP把**用户自带 JPEG/PNG/WebP → 保持比例的增强图 → 同屏对比/下载**留在专页完成，复用现有登录、上传、任务、结果校验；样例继续免登录，真图沿用现有登录/额度，不为这轮开放无上限匿名推理。客户端直传存储，后端只签名/鉴权/提交任务；算力放既有 AlphaNet 后方GPU管线，浏览器不要求RTX，Vercel不承担GPU推理。当前每次GPU费用、显存容量、真实端到端时延**抓不到**，不能写现有系统“几秒完成”。

推断：MVP **估4日 / 32人时**，仅静态图片、单任务、已登录用户，复用限额、幂等和轮询，不新增客户端安装包、不接视频插帧、不承诺批量。时延验收目标（待测）为标准样本端到端P95≤60秒；超时保持同一task id并可恢复，不靠重提获得假成功。发布前用真实样本记录排队/推理/下载时间、每次消耗与失败率，再由王胜批准预算；若服务不满足目标，先解决瓶颈，不对外写秒级承诺。

推断：固定曝光、目标CTR **7.5%**（参考上轮精确主词7天CTR，不代表这四词自然都能达到），1541×7.5%−52=**63.575，约+64点击/28天**；约2.0点击/估计人时。假设曝光与需求混合不变、专页真图流程的差异能通过摘要/结果反馈被搜索者识别；仅做内部转化优化本身未必提升搜索CTR，故增量也可能为0。这一情景不含视频词或APK词，不与方案A/旧ROI预测直接相加。

推断：验收分两层：发布前自有授权测试图片成功率≥95%，无跨用户取图、重复计费、超规格承诺；上线后连续完整28天四词合计点击≥116、CTR≥7.5%、展示≥1541，并单独记录真图提交→成功→下载漏斗及成本，排除缓存sample事件。原页已有样例成功不算新功能收益；若仅专页涨、首页同词等量跌，也不算净增。CTR不升或成本超过王胜批准上限，停止扩展，不转做同义页。

推断：红线是把 `flux-klein` 重绘叫NVIDIA官方效果、承诺不存在的APK/真超分/无条件免费、把生成图冒充同游戏实测、绕过现有鉴权。需王胜点选此方案及推理预算；预算未知不能宣称财务ROI。

## 6. 推荐与不做

推断：**只能做一件，选方案A：在原对比文章内做附来源的选择器。** 预计增量较小但投入仅估1日、无新增GPU成本，当前明确有零点击的对比词和可核验PAA；按本轮情景约2.4点击/人时，高于方案B约2.0。它也必须验证，不是假定交互本身能提排名。若王胜更看重可卖的软件能力而不是最短期点击/人时，可选B，但不能以未知转化率替换这一排序。

推断：不做APK/游戏注入器、不再造同义文章、不先做庞大Windows/视频客户端：分别存在意图与交付冲突、重复承接、以及当前词池不足以覆盖的研发与验证成本。厂商官网、社区历史和媒体实测不能通过堆内容或自有图像模型复制。

待王胜拍板：**A还是B**；选A批准现有文章内的小组件，选B还需推理成本上限。当前只交方案，未实施。
