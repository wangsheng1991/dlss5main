# Search query intent snapshot — 2026-09-20

来源：用户提供的 Search Console 热门查询数据。CTR 按点击次数 ÷ 展示次数计算，四舍五入到一位小数。

| 查询 | 点击 | 展示 | CTR | 判断 | 页面动作 |
|---|---:|---:|---:|---|---|
| `dlss 5 image converter` | 30 | 163 | 18.4% | 高意图、已有点击 | 首页标题、描述和结构化数据覆盖 |
| `dlss 5 download` | 23 | 419 | 5.5% | 曝光大、下载意图强 | `/download` 明确“无独立下载包”，补在线替代方案 |
| `dlss 5 visual enhancer` | 17 | 595 | 2.9% | 曝光大、点击偏低 | 首页结果摘要直接使用 visual enhancer |
| `dlss 5 online` | 15 | 71 | 21.1% | 高 CTR、可扩大曝光 | 首页和博客索引覆盖 online intent |
| `dlss image upscaler` | 14 | 44 | 31.8% | 当前最强点击率 | 保留首页核心 upscaler 定位，扩大相关内容 |
| `dlss upscaler` | 13 | 241 | 5.4% | 通用词、竞争更宽 | 首页和 FAQ 保持自然出现 |
| `dlss 5 upscaler` | 10 | 115 | 8.7% | 产品型意图 | 首页标题和关键词覆盖 |
| `dlss5 upscaler` | 9 | 32 | 28.1% | 高 CTR、样本较小 | 保留无空格变体，避免单独堆词 |
| `dlss 5 upscaling` | 8 | 349 | 2.3% | 高曝光低 CTR | 首页摘要和博客页补 upscaling 语义 |
| `dlss 5 free download` | 7 | 46 | 15.2% | 强下载误解意图 | 下载页解释官方获取方式，避免诱导下载 |

## 已落地

- 首页 SEO title 改为 `DLSS 5 Image Upscaler & Converter Online — Free AI Visual Enhancer`。
- 首页 description、WebApplication JSON-LD 和英文/中文首屏副标题加入 converter、visual enhancer、online、upscaling 语义。
- 下载页 title/description 加入“无独立下载包”和在线替代方案，承接 `dlss 5 download` 与 `dlss 5 free download`。
- 博客索引和 `public/llms.txt` 增加 image converter、visual enhancer、online upscaler 术语。

## 后续判断

先观察 7–14 天的展示、点击和平均排名变化，再决定是否单独建立 `/image-converter` 入口。当前首页已经承接该意图，避免在数据不足时生成重复页面。
