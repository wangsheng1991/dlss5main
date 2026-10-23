# 2026-10-23：四篇已纠错入口稿上线

服务 R2、R5：保留入口定位、主线链接、原文边界与独立性声明，复用既有文章机制。

四篇 Adobe–Topaz、Broadcast、RTX Video/ComfyUI、Tesla 的中英原稿原样接入，末尾各追加一篇主线稿和一个工具页链接；图片、图注、来源 README 保留。没有成对问答，不造 FAQPage。Article/dateModified/Last checked 为 2026-10-23，中英 canonical 自指、hreflang 配对。sitemap 实测 110 条，中英博客索引均含四篇。

Adobe 的 video/README.md 为 Origin: site-recording、Page: https://www.dlss5nvidia.com/visual-enhancer、Recorded: 2026-10-17，与抽帧可见的本站免登录缓存示例一致；沿用既有视频组件、VideoObject 与视频 sitemap。横版 ffprobe 实测 11 秒、1440×810、275 帧、365296 字节；每 0.5 秒抽帧，尾部相同帧持续 0 秒。缩略图取首帧；声明这是历史缓存示例，不是厂商产品演示或性能测试。竖版仅随原始来源记录归档，不嵌入。

112 个既有 HTML 对比：仅 /blog、/zh/blog 自动新增卡片；旧可见文本均保留，canonical/hreflang/robots 不变，未改 retention。先写外部 additive-20261012/CHANGE-LOG.md，再 capture 并复跑。四个浏览器样本 h1=1、main=1，图注渲染正常。

```text
10 articles, 0 failing  (shared-line limit 35%)
FLAGSHIP-PAGES: fails=0 verdict=PASS
判定: PASS — 没有无来源的数字/引语/技术名
PROTECTION: changed=0 down=0 verdict=FROZEN-OK
npx tsc --noEmit && npm run build: exit 0
```

[验收记录](entry-old-publish-20261023/local-verification.json)。部署后八页 HTTP、IndexNow 与 GSC 实际回执写入 /tmp/entry-old-publish-20261023/；GSC 遇配额即停、不重试中文 Lightroom。未获得回执前不声称 Google 请求成功或已收录。
