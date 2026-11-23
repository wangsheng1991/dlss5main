# 素材出处 · 双人合影（平光参考，2026-11-23）

这十一个文件全部由 `docs/duo-neutral-20261123/render-promo-assets.mjs` 排版生成，**画里的每一个像素都来自站内已有文件**，没有一张是重新生成的：

| 用途 | 文件 | 来源 |
| --- | --- | --- |
| 参考图 ① | `public/examples/together/you-neutral.jpg` | 站内自有平光正脸人像（600×900） |
| 参考图 ② | `public/examples/together/character.jpg` | 站内自有角色截图（1280×720，脸背对镜头） |
| 结果（主图） | `public/examples/together/duo-neutral-back-to-back.webp` | 2026-11-23 一次真实运行（背靠背，1024×1024，未修未放大） |
| 另外两个姿势 | `duo-neutral-hug.webp`、`duo-neutral-side-by-side.webp` | 同一对参考图的另外两次真实运行 |

## 为什么换参考图

2026-11-23 的实测（`docs/third-reference-20261123/RESULT.md`）：旧参考 `you.jpg`（蓝紫打光、黑高领）16 次里只保住 3 次，多数被换成男性；换成这张平光正脸后 9 次全部保住。所以示例与推广素材改用这一张。

## 版式规则

- 系统 Chrome（Playwright）按版面渲染 HTML，`deviceScaleFactor: 2` 截图，再用 `sips` 降到投放尺寸；
- 只加文字与外框：标题、标签、箭头、网址、结论行；
- 不放大、不重绘、不磨皮；`detail-*` 是同一张结果的 1:1 像素区域（① 号位的脸 / 两人相接处 / ② 号位的脸），用 `background-position` 取景；
- 尺寸与来源写在 `manifest.json`，`npm run assets:check -- public/marketing/duo-neutral-20261123` 逐条核对。

## 许可与红线

- 许可：全部 `own`。
- 不含任何游戏官方原画、截图、封面或标志；② 号参考图是我们自己的素材，不是任何一款游戏的官方资产。
- **不承诺「脸会被保持」**：这一套里 ① 号位保住了，② 号位的脸是模型给的——成品的文案与教程都按这个口径写。
