# Studio 视频工具与搜索入口 · 2026-11-20

对应 CORE-POSITIONING R1 / R3 / R4。视频工具帮助挑选、复核和交接待重绘的镜头；Studio 风格转换继续承接成片方向。

- 两套目录：[/video-studio](https://www.dlss5nvidia.com/video-studio) 与 [/zh/video-studio](https://www.dlss5nvidia.com/zh/video-studio)。
- 表内每个路径前置 `/video-studio/`。中文路径再前置 `/zh`。每页独立预渲染、自指 canonical、互返 hreflang 和可抓取的目录内链。
- 发布前线上站点地图含 161 个 URL。本次添加 20 个中英文 URL，构建产物合计 181 个。该数字描述公开搜索入口，实际收录、排名和点击分别在 GSC 核对。

| 子页 | 英文搜索意图 | 中文搜索意图 | 可核验产物或操作 |
| --- | --- | --- | --- |
| frame-extractor | video frame extractor | 视频抽帧 / 视频转 PNG | 当前解码帧 PNG |
| contact-sheet | video contact sheet | 视频缩略图总览 | 带取样时间的网格 PNG |
| metadata-viewer | video resolution checker | 视频分辨率和时长查看 | 分辨率、画幅与时长 JSON |
| vertical-crop-preview | vertical video crop preview | 竖屏视频裁切预览 | 可调位置的 9:16 / 1:1 静帧预览与 PNG |
| before-after-comparison | side by side video comparison | 视频前后并排对比 | 两段同源结果共用一个定位控件 |
| event-timeline | video event timeline | 视频事件时间轴 | 原始样片模型标签、手工事件和 JSON |
| scene-change-review | video scene change finder | 视频切镜检测 | 画面差分候选时刻，点选回看 |
| clip-range-planner | video clip range planner | 高光片段起止点标记 | 选段起点和终点 JSON |
| slow-motion-review | slow motion video review | 视频慢放逐格检查 | 变速与定时步进 |
| object-box-annotator | video bounding box annotation | 视频帧目标框标注 | 单帧归一化坐标及时间戳 |

前述工具面向浏览器内的素材准备。保留原有图生视频、超分、插帧和视频理解的上线状态以及高光的受邀内测。宣传资产使用实际工具界面和许可样片，模型速度、效果与价格对比继续采用可核验的同源证据。

验收跟踪：新 URL 的可索引静态 HTML、样片运行与真实结果、语言互链、sitemap 覆盖。Google 读到新增 sitemap 后，用页面前缀 `/video-studio/` 与 `/zh/video-studio/` 查看编入索引、展示与点击，用前一等长窗口作比较。历史窗口中这批新 URL 的表现以 GSC 界面为准。

网页播放副本在 `public/examples/video-workbench/`，与高光、超分评测原文件分开。路口原片、剪辑和同步基线/候选预览均来自 [Mixkit #4401](https://mixkit.co/free-stock-video/crowds-of-people-cross-a-street-junction-4401/)。前两个从 `video-highlights` 取样，后两个来自 `video-upscale-lab` 的同源产出。网站副本保留各原片时轴，降低下载体积。视频事件时间轴上的 JSON 沿用同路口原片的保存结果。
