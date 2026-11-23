# 素材出处 · GTA VI 同人合影（2026-11-23）

这十一个文件全部由 `docs/gta6-duo-campaign-20261123/render-promo-assets.mjs` 排版生成，**画里的每一个像素都来自站内已有文件**，没有任何一张是重新生成的：

| 用途 | 文件 | 来源 |
| --- | --- | --- |
| 参考图 ① | `public/examples/together/you.jpg` | 我们自己的人像参考（1200×1500） |
| 参考图 ② | `public/examples/together/character.jpg` | 我们自己的角色截图（1280×720，背对镜头——这正是教程里要讲的坑） |
| 结果 | `public/examples/together/promo-side.webp` | 合影流程一次真实运行的存储结果（1024×1024，未修未放大） |
| 另外两个姿势 | `promo-hug.webp`、`promo-back.webp` | 同一对参考图的真实运行结果 |

## 生成方式

- 用系统 Chrome（Playwright）按版面渲染 HTML，`deviceScaleFactor: 2` 截图，再用 `sips` 降到投放尺寸；
- 排版里**只加文字与外框**：标题、标签、箭头、网址、结论行；
- 不做放大、不做重绘、不做磨皮；裁切图（`detail-*`）是同一张结果的 1:1 像素区域（脸 / 搭肩的手 / 手），用 `background-position` 取景，不拉伸；
- 尺度和来源写在 `manifest.json` 里，`npm run assets:check` 会逐条核对：文件在不在、真实像素尺寸与清单是否一致、`sources` 指到的文件是否存在、许可是否在白名单（own / CC0 / PD / CC-BY）。

## 许可与红线

- 许可：全部 `own`（站内自有素材）。
- 不含任何 GTA VI 官方原画、截图、封面或标志；不含任何游戏 logo；不含真实演员肖像。
- 角色截图是我们自己的参考素材，不是任何一款游戏的官方资产。

## 列表

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `card-zh-1080x1440.png` | 1080×1440 | 小红书竖版投放卡（中文） |
| `card-en-1080x1440.png` | 1080×1440 | 竖版投放卡（英文） |
| `compare-zh-1600x900.png` | 1600×900 | 页面主图 / 横版对照（中文） |
| `compare-en-1600x900.png` | 1600×900 | 页面主图 / 横版对照（英文） |
| `compare-plain-1600x900.png` | 1600×900 | 无文字对照，文章封面与通用预览 |
| `og-zh-1200x630.png` | 1200×630 | 中文页 OG / 社交卡片 |
| `og-en-1200x630.png` | 1200×630 | 英文页 OG / 社交卡片 |
| `poses-zh-1600x600.png` | 1600×600 | 同一对人三个姿势（中文） |
| `poses-en-1600x600.png` | 1600×600 | 同一对人三个姿势（英文） |
| `detail-zh-1080x1080.png` | 1080×1080 | 脸 / 相接处 / 手的 1:1 裁切（中文） |
| `detail-en-1080x1080.png` | 1080×1080 | 同上（英文） |

## 已接进站点的位置

- `/gta6-character-photo` 与 `/zh/gta6-character-photo`：正文主图 = `compare-{locale}`，`og:image` = `og-{locale}`；
- 教程页：封面 = `compare-plain`，正文第一张 = `compare-{locale}`（副本在 `public/blog/gta-6-character-photo-fan-made-guide-2026/assets/`，JPEG q86），第二张 = 工具页真实截图。
