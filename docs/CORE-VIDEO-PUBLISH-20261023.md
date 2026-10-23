# 2026-10-23：主线缓存示例真实录屏原型

服务 R1（风格转换主线）、R4（真实主线素材）、R5（保留缓存与能力边界）。

## 实际录制与文件

使用匿名新建 Playwright Chrome context，在生产 `/game-character-style` 点击现有 “Run this example · free”，等待真实接口返回，再拖动前后对比。没有登录、上传素材或发起自有图推理。实际响应为 HTTP 200、`SUCCEEDED`、`cached: true`。

Playwright CDP `Page.startScreencast` 连续采集真实网页帧，用 Chrome 时间戳保留动作与等待时间。MP4 编码为 25 fps，屏幕没有新帧时保持当前帧；编码终点按实际录制结束时间设置，避免编码器把最后一帧的时长额外延长。没有裁剪场景、重排、加速、配音、叠图或借用其他项目视频。首帧缩略图从最终 MP4 的第一帧直接解码。

实际录制起止：`2026-10-23T09:18:13.521Z` → `2026-10-23T09:18:45.523Z`。最终文件测量（ffprobe）：

- 文件：`public/videos/game-character-style-example-31.96s.mp4`
- `format.duration`: `31.960000`
- `format.size`: `1073945` bytes
- 视频流：`h264`，`1280 × 900`
- `creation_time`: `2026-10-23T09:18:13.000000Z`
- 缩略图：`public/videos/game-character-style-example-31.96s-first-frame.jpg`

来源 README、完整 ffprobe 输出、实际动作/响应/帧时间戳记录均保存在 `public/videos/`。原始捕获帧、执行脚本、浏览器截图和各闸门原文位于 `/tmp/core-video-20261023/`。

## 页面与 sitemap

只在 `/blog/core-game-frame-style-reference` 和 `/zh/blog/core-game-frame-style-reference` 正文区域追加真实播放器与双语缓存说明，保留全部原文。VideoObject 的 contentUrl/thumbnailUrl 指向上述真实文件，duration 为 `PT31.96S`，uploadDate 使用文件 creation_time 的实际日期 `2026-10-23`。播放器与 schema 共用一份元数据。

沿用既有 sitemap 构建流程，在两条文章 URL 下追加 video:video，使用 Google 视频 sitemap 命名空间；不新增页面 URL，仍为 96 条。省略可选的整数秒 video:duration，避免将实测小数时长取整冒充实测；VideoObject 保留实测小数秒。实现参考 [Google 视频 sitemap 文档](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps)。

已先记录既有 additive CHANGE-LOG。当前保护名单不包含这两篇新稿，完整保护检查没有差异，未覆盖旧基线。逐字比较去除新增播放器后的 main，与上版完全一致；title/H1/canonical/robots/hreflang 不变，其他页面静态 HTML 无变化（忽略构建资源文件名）。

## 部署前验收

- `npx tsc --noEmit` exit 0；`npm run build` exit 0。
- `FLAGSHIP-PAGES: fails=0 verdict=PASS`
- `判定: PASS — 没有无来源的数字/引语/技术名`
- `PROTECTION: changed=0 down=0 verdict=FROZEN-OK`
- 两页 VideoObject 可解析且与 ffprobe 一致；sitemap XML 可解析，96 URL、2 video:video。
- Chrome 播放器实播检查：duration=31.96，尺寸 1280×900，播放时间实际推进，未出现媒体错误。

GSC 请求的逐条界面状态另记在本任务证据目录 `gsc-results.md`，不把请求成功说成已收录。
