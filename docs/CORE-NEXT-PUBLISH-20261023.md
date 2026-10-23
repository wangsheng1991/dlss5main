# 2026-10-23：三篇 A 线稿上站

服务 R1、R3、R4：角色一致性、具名室内风格、参考图选择承接主线搜索意图。

三篇中英正文与已审核内容库原文逐字一致，图注和历史样张声明保留；素材与来源/SHA-256 记录复制至 public 对应 slug。三篇各自已含主线文章与工具页内链，不重复追加。无成对问答，不生成 FAQPage；Article/dateModified/Last checked 为 2026-10-23，canonical 自指，hreflang 配对。

/game-character-style 只新增角色一致性稿链接；/interior-design 只新增具名风格稿链接。复用现有内链位置，prerender 与客户端一致。120 个既有 HTML 比对只允许这两页与中英博客索引加法；冻结字段与旧正文保留，retention 未改。先写外部 additive-20261012/CHANGE-LOG.md，再 capture 并复跑。

本地六页 HTTP、Article、日期、hreflang、图均通过；sitemap 116 条，中英 /blog 索引包含三篇。浏览器抽验 h1=1、main=1。

```text
13 articles, 0 failing  (shared-line limit 35%)
FLAGSHIP-PAGES: fails=0 verdict=PASS
判定: PASS — 没有无来源的数字/引语/技术名
PROTECTION: changed=0 down=0 verdict=FROZEN-OK
npx tsc --noEmit && npm run build: exit 0
```

原始验收见 core-next-publish-20261023/。docs/GSC-PENDING-URLS.md 仅列尚未成功请求的 URL，部署前为此前 9 条加本次 6 条。新六条待部署后请求；首次配额用尽即停，不重试以前的九条，不改已有一次性任务。真实线上与 GSC 回执记录在 /tmp/core-next-publish-20261023/，成功项须从 pending 删除。
