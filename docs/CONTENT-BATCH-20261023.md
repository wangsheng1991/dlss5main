# 内容批次：结合本周最新新闻写 3 篇（2026-10-23）

王胜原话：「最新的文章也可以结合写几篇」。依据今天的热点扫描（`/tmp/hot-take-2026-10-23.txt`，177 条原始头条 → 15 条可联动）与内容库既有规则。

## 0 规矩（继承 `docs/CONTENT-LIBRARY-TASK-20261016.md`，不再重复解释）

- 每篇一个目录：`~/code/shou/artifacts/content-library/2026-10-23-<slug>/`，含 `article.en.md`、`article.zh.md`、`assets/`、`social.md`、`video/`（没有合格视频就**不放**，在 `gate.md` 写清原因）、`gate.md`。
- 英文 ≥1200 词、中文 ≥1500 字；开头 40 词内给结论 + TL;DR 框；H2/H3 分层，段落 ≤4 行。
- 每篇至少 **2 张真实图**（我们真跑的前后对比或真实截图），每张带 caption、来源与许可；**不用媒体官图、新闻社照片、游戏官方截图**。
- 至少 1 段可复现（分步或命令）。
- 结尾写边界 + 独立性声明（independent, not affiliated with NVIDIA / AMD / 相关厂商）。
- 头部写：目标关键词 / 落点页面 / 一句「为什么这篇能带来人」。
- 不编数字、不宣称性能、不称官方；口径不越 `src/config/enhance.ts`（flux-klein 重绘、上限 1536 px、2×/4×、不是逐像素超分）。
- 用 skill `promo-topic-score` 打分（<70 不做）、`promo-copy` 写、`promo-quality-gate` 过闸（必须 ✅）。
- 每篇完成后回一句：目录 + 词数/字数 + 图数 + 闸门判定。

## 1 三篇选题（都来自今天的扫描，带原始日期与来源）

**① Aiarty Image Enhancer 评测**
- 新闻：RedShark News，2026-10-15，`score 16`，簇 image upscaling。
- 落点：`/unblur-image`；目标词：aiarty image enhancer review / image enhancer review / unblur image ai。
- 切角：评测里的前后图都是厂商样张；写「怎么自己做一次可复现的验证」，用我们自己的样例跑一遍增强，讲清**看什么指标判断是真还原细节还是模型编的**（边缘、纹理、文字、五官）。
- 硬边界：不评价 Aiarty 的产品质量（没有实测就不能说好坏），只评价「评测方法论」。

**② Xbox Series X/S 与 ROG Ally X 将获 AMD FSR 4.1 升频**
- 新闻：Video Games Chronicle，2026-10-21，`score 14`，簇 video upscaling。
- 落点：`/image-upscaler`；目标词：fsr 4.1 upscaling / xbox upscaling / console upscaling。
- 切角：主机靠升频补性能，但玩家截图/录屏反而全是压过的；讲「升频发生在游戏管线里」和「压缩发生在分享链路里」是两件事，用一张真实截图做压缩 vs 增强的对比。
- 硬边界：不能用 Xbox/FSR 官方图或游戏截图；不预测主机实际帧数；不宣称我们做了什么游戏内升频。

**③ Adobe Lightroom 移动版「睁眼」AI 修图**
- 新闻：新浪（手机版），2026-10-20，`score 13`，簇 AI 修图。
- 落点：`/unblur-image`（与①不同 URL 角度，正文互相不重复）；目标词：lightroom ai open eyes / ai fix closed eyes / ai photo restore。
- 切角：「修闭眼」是**生成**不是还原——写一篇「什么时候该用生成、什么时候只该还原」，给读者一个判断清单，并用我们的重绘样例说明边界（我们不承诺修五官）。
- 硬边界：不贬损产品、不编价格、不用 Adobe 官方素材；不暗示我们能修复人脸五官。

## 2 交付与验收

1. 三篇都做完后，跑 `node ~/code/shou/artifacts/content-library/check-articles.mjs`，把**完整输出的最后 15 行**贴回来（王胜侧闸门也要能过 0 failing）。
2. 不发布任何东西（发布节奏另定）。
3. 不改站点代码。
4. 回报 ≤10 行：三个目录路径 + 每篇词数/字数 + 图数 + 闸门判定 + 哪篇你觉得最能带人（一句话，别吹）。

如果某一篇写不出真实素材（图或可复现步骤），**宁可不写**，在回报里说明并只交另外两篇。


## Re-anchored 2026-10-23

服务 R1、R2、R3、R5；素材原有边界按 R4 保留。依据仅为 [CORE-POSITIONING.md](CORE-POSITIONING.md) 与 [AGENTS.md](../AGENTS.md)，本节记录执行结果，不另定义或改写定位规则。

七篇按主题实质均为 `entry-point`。十四份中英文稿都增加 tier，并在第一个 H2 前加入以下过渡；三篇新稿保留原落点，why_this_brings_people 已标明入口线话题。逐段比对确认原 H2 后的正文、图、引用、结论没有删改，Aiarty 与 Lightroom 的非厂商实测声明完整保留。存在的 article.md 中文副本同步。

### Adobe / Topaz

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-16-adobe-topaz-acquisition-image-upscaling/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/comparisons（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：DLSS 5 Studio centers on style conversion: turning an existing image into a DLSS 5-style visual reference, with the desktop app as the product handover. This acquisition-related check covers only a limited entry point for poor-quality existing pictures; the [workflow comparisons](https://www.dlss5nvidia.com/comparisons) return to the core redraw work.
- 中文新增：看收购新闻时，也要分清我们交付的产品：DLSS 5 Studio 桌面版围绕风格转换与神经渲染重绘，把已有画面变成 DLSS 5 风格的视觉参考。本文对已有图片质量问题的检查只是附带入口；想了解主线，可以接着看[转换流程比较](https://www.dlss5nvidia.com/comparisons)。
- 闸门：PASS。

### NVIDIA Broadcast 2.3

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-16-broadcast-2-3-upscaling/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/download（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：Our main workflow is style conversion into DLSS 5-style visual references, delivered through the [DLSS 5 Studio desktop app](https://www.dlss5nvidia.com/download). The image-quality inspection prompted by this Broadcast report covers only a limited entry point for poor-quality existing pictures; it does not define the product or demonstrate its style-conversion capability.
- 中文新增：我们要交付的是 [DLSS 5 Studio 桌面版](https://www.dlss5nvidia.com/download)，主线是将已有画面按目标风格重绘成 DLSS 5 风格的视觉参考。Broadcast 新闻在这里引出的，只是已有图片质量不足时的附带检查入口，不代表产品身份，也不能充当风格转换的效果证明。
- 闸门：PASS。

### RTX Video / ComfyUI

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-16-rtx-video-comfyui-open-pipeline/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/before-after（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：The core work in DLSS 5 Studio is a style-guided redraw into a DLSS 5-style visual reference, with the desktop app as the handover. This pipeline article covers the limited entry point of inspecting poor-quality existing pictures; follow the [before-and-after cases](https://www.dlss5nvidia.com/before-after) for the style-conversion story rather than treating upscaling as the product.
- 中文新增：DLSS 5 Studio 的主线，是把已有画面按风格要求重绘成 DLSS 5 风格的视觉参考，并通过桌面版交付。本文借管线话题检查已有图片的质量问题，范围只到这条附带入口；[前后案例](https://www.dlss5nvidia.com/before-after)承接的是风格转换主线，不能把两类任务混称为放大产品。
- 闸门：PASS。

### Tesla Roadster

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-16-tesla-roadster-compressed-image/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/before-after（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：DLSS 5 Studio is built around style conversion and neural-render redraw, taking an existing image toward a DLSS 5-style visual reference and delivering the desktop app. Examining a poor-quality shared picture is a limited entry point, not the product identity; the [before-and-after gallery](https://www.dlss5nvidia.com/before-after) returns to the conversion story without making claims about the car.
- 中文新增：从一张已有图片出发，按目标风格重绘成 DLSS 5 风格的视觉参考，再交到 Studio 桌面版，这才是我们的产品主线。本文只处理已有图片质量差这一条附带入口；继续看[风格转换前后案例](https://www.dlss5nvidia.com/before-after)，可以回到创作任务，而不把压缩检查当成产品身份或车辆评价。
- 闸门：PASS。

### Aiarty

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-23-aiarty-review-reproducible-check/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/interior-design（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：DLSS 5 Studio turns existing images into DLSS 5-style visual references through style conversion and neural-render redraw, with the desktop app as the handover. This review-method article covers only a limited entry point for poor-quality existing pictures; its kitchen example leads back to [room style conversion](https://www.dlss5nvidia.com/interior-design), not a claim that sharpening is the product.
- 中文新增：厨房样张连接的是[空间风格转换](https://www.dlss5nvidia.com/interior-design)：把已有空间画面按目标风格重绘成 DLSS 5 风格的视觉参考，再由 Studio 桌面版承接创作。本文的评测检查方法只覆盖已有图片质量差这一条附带入口，不把清晰化当作产品主线。
- 闸门：PASS。

### Xbox / FSR 4.1

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-23-fsr-41-sharing-compression/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/game-character-style（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：For our product, a saved game frame is the starting point for [character style conversion](https://www.dlss5nvidia.com/game-character-style) into a DLSS 5-style visual reference, delivered through DLSS 5 Studio. Checking poor-quality shared pictures is only a limited entry point here; it does not define the product, and the style-redraw workflow is separate from in-game FSR upscaling.
- 中文新增：一张保存下来的游戏画面，可以进入[角色风格转换](https://www.dlss5nvidia.com/game-character-style)，按目标风格重绘成 DLSS 5 风格的视觉参考，并由 DLSS 5 Studio 桌面版交付。本文检查分享图片质量差的问题，只覆盖这条附带入口；它既不是产品主线，也不把风格重绘等同于游戏内 FSR 升频。
- 闸门：PASS。

### Lightroom 睁眼

- 目录：`/Users/wangsheng/code/shou/artifacts/content-library/2026-10-23-lightroom-open-eyes-generation/`。
- tier：`entry-point`；主线页：https://www.dlss5nvidia.com/interior-design（本次 curl 跟随跳转后 HTTP 200）。
- 英文新增：The bedroom example belongs to our core [room style-conversion workflow](https://www.dlss5nvidia.com/interior-design): a style-guided redraw into a DLSS 5-style visual reference, with DLSS 5 Studio as the desktop handover. This article covers only the limited entry point of assessing poor-quality existing pictures; the Open Eyes discussion marks the boundary with generated content, not a face-repair product promise.
- 中文新增：这里的卧室样张来自[空间风格转换主线](https://www.dlss5nvidia.com/interior-design)：已有空间画面经过风格重绘，成为 DLSS 5 风格的视觉参考，交付物是 Studio 桌面版。本文只覆盖已有图片质量差的附带入口；借睁眼话题划清生成内容的边界，不把五官补全当作我们的产品承诺。
- 闸门：PASS。

### 验收与提交记录

执行目录：`/Users/wangsheng/code/shou/artifacts/content-library`；命令：`node check-articles.mjs`；退出码 0。完整原文：

```text
PASS  2026-10-16-adobe-topaz-acquisition-image-upscaling  (en 1467w / zh 1668字 / img 4 / h2 12)
PASS  2026-10-16-broadcast-2-3-upscaling  (en 1989w / zh 2164字 / img 4 / h2 14)
PASS  2026-10-16-rtx-video-comfyui-open-pipeline  (en 1498w / zh 1671字 / img 4 / h2 12)
PASS  2026-10-16-tesla-roadster-compressed-image  (en 1509w / zh 1685字 / img 4 / h2 12)
PASS  2026-10-23-aiarty-review-reproducible-check  (en 1878w / zh 2672字 / img 3 / h2 9)
PASS  2026-10-23-fsr-41-sharing-compression  (en 1735w / zh 2487字 / img 2 / h2 9)
PASS  2026-10-23-lightroom-open-eyes-generation  (en 1836w / zh 2679字 / img 2 / h2 8)

7 articles, 0 failing  (shared-line limit 35%)
```

仅改内容与工单，没有修改站点代码。尝试运行给定的 `tenx-20261011/check-flagship-pages.mjs` 时，当前站点仓库不存在该脚本；在站点和相邻 artifacts 中也未找到三份所列站点脚本，因此没有将站点闸门记为通过。本次以完整内容库闸门通过作为交付验收，不推送、不部署。

内容库原先未纳入 Git 跟踪，隶属 `/Users/wangsheng/code`，站点是独立嵌套仓库，不能组成同一个 Git commit。内容库七篇及其现有素材和本次闸门日志已一并纳入提交 `dffac3e11d84b102ec656c70ca9af98af75af7c3`；站点随后以相同主题提交两份用户提供的规则文件和本工单。未修改 CORE-POSITIONING.md、AGENTS.md 或 check-articles.mjs 的字节内容；既有其他暂存与未提交文件不纳入站点提交。
