# Studio B 线文章证据审查 — 2026-10-23

服务规则：R1（回答桌面交付工作流）、R4（素材对应真实用途）、R5（证据不足不交稿）。本记录不修改核心定位或任何闸门。

## 决定

本轮不新增文章。已有真实桌面材料，但不足以写《Studio 桌面版到底能干什么：一个风格转换任务在里面怎么走完》。不把「尚未找到证据」写成「产品没有该能力」。

## 已核对

- docs/CORE-POSITIONING.md 第 1 节及 R1：A、B 均为主线。
- https://www.dlss5nvidia.com/download 可访问；https://www.dlss5nvidia.com/studio-beta 经 curl 回源为 HTTP 200。页面描述本地 Windows RTX 图片/视频处理与登录后申请，不能替代实际桌面任务记录。
- public/studio/studio-overview.jpg 与 studio-shortcuts.jpg 已目视检查。前者是旧版真实夜景处理界面；后者是快捷键界面，背景是合成测试图且提示结果与当前预设不一致，不能当成完整任务结果。
- docs/STUDIO_PROMO_2026-09-30.md 以及仓库外 alibaba-drive/DLSS5-Studio/promo-20260930/promo/README.md：已有截图对应夜景降噪、老照片、视频处理；嵌入素材来自 CC0 / 公共领域第三方来源，不能因为放在 public/studio 就改标成完全自有素材。
- 仓库外 studio-docs/README.md、docs/v12-run-report.md、docs/studio-distribution-design.md 与 studio-docs/backend_API.md 提供历史能力、运行报告、设计及接口材料，未找到足以复现本轮题目的同一自有素材跨网页/桌面任务记录。设计中的激活或网页步骤不当作已完成实现。
- src/content/studioPage.ts 旧文本描述无账号、无网络步骤；src/content/studioRequest.ts 的边界文本描述联网激活及有限离线期。需要对应当前可运行版本的实测记录才能确定文章采用哪套行为。

## 补证到什么程度才能写

1. 提供可核对版本的可运行桌面环境与构建标识，让本轮实际打开并操作；保留版本画面与环境记录。
2. 用站点自有游戏帧、角色或房间素材走完一次桌面风格转换：导入、实际可用设置、提交、完成、查看并导出。保存原输入、返回/导出文件、任务日志及对应真实界面截图，标明许可。
3. 对同一任务核对网页与桌面各自能完成什么；如需回网页，实测并记录具体入口和原因；如不需要，也据实记录。不得自行补写同步、登录、激活或自动交接。
4. 对当前版本列出已实现、未实现、未测试三类能力；以实测和对应实现证据区分，不能仅据路线图判断。

只有上述证据能够支撑真实动作段落、素材许可与桌面/网页分工后，才写本篇。未申请、未发信、未安装或运行桌面包，也未声称做过这些动作。

## 本轮验收

原样运行 content-library/check-articles.mjs，退出码 0；未新增文章目录，未修改既有文章或闸门。

```text
10 articles, 0 failing  (shared-line limit 35%)
```
