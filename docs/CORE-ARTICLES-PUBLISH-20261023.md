# 2026-10-23：A 线三篇原稿接入站点

服务规则：R1（风格转换主线）、R3（core 落点）、R4（自有风格素材）、R5（边界与证据）。

## 发布范围

沿用 `src/content/articles/`、Blog 页面和 prerender；新增以下 slug 的 `/blog/` 与 `/zh/blog/` 两版：

- `core-game-frame-style-reference`
- `core-two-reference-room-workflow`
- `core-redraw-review-checklist`

正文取自内容库同名 `2026-10-23-` 目录的 `article.en.md`、`article.zh.md`，只把 frontmatter 与 H1 分离为文章元数据，段落不改写。原 Markdown 和完整素材记录同时保存在 `public/<slug>/`；`assets/README.md` 原样保留。正文相对素材路径 `assets/...` 通过文章 assetBase 解析到 `/<slug>/assets/...`。渲染组件仅用于本批文章，支持原稿图注、代码块及列表，旧稿渲染不变。

三篇均使用 Article、dateModified 与可见 Last checked（2026-10-23）、自指 canonical 和中英 hreflang。英文双参考稿明确的问题标题 “If text and reference disagree, what wins?” 与紧接原文回答输出 FAQPage；其余稿件没有明确问答对，不另造 FAQ。中文双参考原稿对应段落是陈述式标题，保持原样。

双参考图注明确保留“历史样张，不是新排队任务输出”；角色样例保留 cached retrieval、并非新推理以及保留失败；重绘清单保留历史任务与不能证明几何/身份忠实的边界。没有新增实验。

## 加法内链与保护名单

先在既有 `additive-20261012/CHANGE-LOG.md` 声明，再实施：

- `/game-character-style` → 游戏帧稿。
- `/interior-design` → 双参考稿。
- `/before-after` → 重绘检查稿。
- `/vs/dlss-5-vs-dlss-4-5` → 游戏帧稿。
- `/vs/dlss-5-vs-fsr-4` → 重绘检查稿。

五页均只追加一个描述性链接；删除新增链接并归一构建文件名后，HTML 与修改前逐字一致。中英博客索引按原数组追加三篇卡片，不改变旧稿排序，旧稿 related reading 也不变。既有静态页面只有这五页与两份博客索引发生内容变化。首页、download、旧文章正文和冻结 head 字段不变。sitemap 在构建时根据本批文章记录自动补齐六条含 lastmod 的 URL。

## 验证记录

证据目录：`/tmp/core-publish-20261023/`。

- 内容库：`10 articles, 0 failing  (shared-line limit 35%)`。
- 两个 BFL 原稿来源均实取 HTTP 200，未新增来源。
- 六页逐项验证 Article、dateModified、Last checked、自指 canonical、中英 hreflang、博客索引与 sitemap；全部通过。
- 稿内图片逐个比对源文件字节、alt 与原图注；通过。
- Chrome 390px 移动端逐页复核：六页均有原图注、日期、正确中英 H1，无横向溢出、无页面运行异常。本批文章显式绑定 URL 语言，避免继承浏览器语言；既有文章行为不变。
- `npx tsc --noEmit` exit 0；`npm run build` exit 0。
- `FLAGSHIP-PAGES: fails=0 verdict=PASS`。
- `判定: PASS — 没有无来源的数字/引语/技术名`。
- 保护名单先备份、检查仅已声明索引变化，再 capture；`PROTECTION: changed=0 down=0 verdict=FROZEN-OK`。

闸门对最终 dist 通过本地 fetch 映射运行，保留生产 canonical；301 与既有 Cloudflare 首页邮箱处理按已有验证脚本模拟。部署后的 curl 与 IndexNow 记录保存在同一证据目录，未把提交接收当作搜索引擎收录保证。
