# 手机搜索承接改动（2026-11-21）

目的：让手机搜索访问者在现有页面完成可核对的角色风格体验，保留产品风格转换与Studio交付主线。不将独立浏览器工具称为NVIDIA运行时，不通过删除曝光提高CTR。

依据：2026-11-20多维复核的四个mobile查询合计点击98→49；APK页仍在索引，因此本次不改canonical、不重定向、不新增近义URL、不重复请求索引。

改前：APK页解释可用性并链接到其他工具；下载页手机模块有步骤和外链，访客需要再导航才能试用。
改后：两页的中英版本使用同一个 PhoneStyleExample 组件。直接调用既有 useSampleRun(characterStyle)；输入是既有自有角色图，返回后显示实际输入/输出完整并排图与下载链接。缓存、限额、错误、自己上传需登录与积分均明示。原有正文、title、description、H1、canonical、hreflang不改；组件与预渲染同时输出，初始HTML含输入图、边界说明和后续内链。

路径：/dlss-5-apk、/zh/dlss-5-apk、/download、/zh/download。

埋点：点击使用既有tool_cta_click事件，surface分别为apk_phone_example/download_phone_example；复用现有generation_start/success/failure。参数是否可在GA4历史报表拆分取决于自定义维度配置；本次不更改GA4设置，也不声称已有完整入口转化归因。

验证：lint通过、125/125测试通过、build通过；PHONE-SSR: 4/4 PASS; source image exists。390×844本地浏览器：输入图、运行按钮、步骤及链接完整可读，document scrollWidth=390，未出现整页横向溢出。React检查：状态驱动渲染、运行中按钮禁用、错误用role=alert、完成用role=status；图片有alt/宽高，键盘可操作，无原生DOM清理逻辑。

发布后必须点真实免费示例核对结果；构建通过不等于线上任务成功。点击/CTR改善要等后续同口径GSC数据，不以发布代替效果。尚未修改游戏状态，这项单独处理。

线上初验发现输入横图、缓存输出方图，已将新模块改为各自原比例完整显示，避免擦除滑块暗示像素对齐；不裁切、不拉伸图片。初次真实请求界面原文：Example ready · served from cache。
