R1/R2/R3/R5：只暴露页面既有事实，不制造 FAQ、来源、数字或新能力；入口线不替代风格转换与 Studio 主线。

# 全站结构化核验 · 2026-10-23

## 扫描口径纠正

上线前实际逐条 curl sitemap 的全部90条 URL，均200。仅匹配字面 `<script type="application/ld+json">` 得到77条“零”，但该表达式漏掉合法的 `data-rh="true"` 标签。兼容任意属性顺序/单双引号且 JSON.parse 的扫描，真实零结构化只有2条：

- /marketing/reddit/dlss5-reddit-comparisons.html
- /marketing/reddit/dlss5-studio-kit.html

其余88条本来已有可解析 JSON-LD，不能计作本轮新增覆盖。扫描器 scripts/audit-structured-data.py 保留 exactTagZero 作错误口径诊断，正式指标使用 scripts 与可解析 types。运行：`python3 scripts/audit-structured-data.py /tmp/schema-audit`。

## A/B：已有数据校验与最小图

逐条校验以下页面 schema 问题/答案与静态可见原文一致，去除脚本后才匹配正文，避免拿 schema 自证；没有新增 FAQ 文案。

| 页面 | 既有可见 FAQ 条数 | 本轮 |
|---|---|---|
| /game-character-style | 0 | 保留原问答；补/合并 WebPage 与 dateModified |
| /interior-design | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /portrait-retouch | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /virtual-try-on | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /virtual-makeup | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /ai-headshot | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /image-to-svg | 5 | 保留原问答；补/合并 WebPage 与 dateModified |
| /remove-background | 4 | 保留原问答；补/合并 WebPage 与 dateModified |
| /erase-object | 4 | 保留原问答；补/合并 WebPage 与 dateModified |
| /old-photo-restoration | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /video-upscaler | 3 | 保留原问答；补/合并 WebPage 与 dateModified |
| /video-downloader | 5 | 保留原问答；补/合并 WebPage 与 dateModified |

/game-character-style 没有可见 FAQ，因此不加 FAQPage。B 列出的 before-after/comparisons 本来有真实 FAQ，保留并验证；pricing/models/blog/about/docs/enterprise/zh/download 等只补/合并最小页面图与修改日期。现有面包屑节点保留，不为没有可见面包屑的页面捏造路径。英文 /blog/ 全部文章补页面图，原 TechArticle 事实保留。

/zh 原 head FAQ 与静态正文不对应，删除该 FAQ 节点，仅保留有效页面图，没有新增正文。两个 marketing 页面从既有可见 H1 提取 name，补 WebPage/dateModified；没有添加 FAQ、数字、视频或性能节点。

共用 schemaReview.ts 只更新页面元数据，不生成问答；静态输出与 React SEO 共用。head 注入改为显式 </head> 并断言边界存在，避免依赖可被压缩删除的注释；这不是此次77条漏报的原因。

## C：红线优先

两篇英文源文 what-is-dlss-5-neural-rendering-guide 与 dlss-5-online-image-upscaler-guide 均为说明性文章，没有成对可见 FAQ。不能将段落改编成不存在的问题，也不能将别页 PAA 塞进 head。本轮只加 WebPage/dateModified，并在 </article> 后追加 Last checked: 2026-10-23；原正文不改，不加 FAQPage。浏览器加载 JS 后日期仍在且 FAQPage 为0。日期表示本轮页面核对，不是新硬件实测或厂商发布日。

## D：llms-full.txt

新增 public/llms-full.txt，按 llms.txt 的标题/引用说明/分节/关键链接风格，整理现有页面的身份、主线、入口线、上传与恢复边界、Studio申请、独立性与文档路径；不写新性能数字。没有改 robots 或 sitemap。以现有页面为准，未改变任何能力。

## 推送前验收

- FLAGSHIP-PAGES: fails=0 verdict=PASS
- 判定: PASS — 没有无来源的数字/引语/技术名
- PROTECTION: changed=0 down=0 verdict=FROZEN-OK
- npx tsc --noEmit：exit=0；npm run build：exit=0
- 109/109 passed

全站旧构建与候选构建比较：所有 title/H1/canonical/hreflang/robots/description 一致；只移除获准日期行，即恢复所有原正文逐字一致（只排除构建资源哈希）。旧保护基线仅两篇获准文章 words/bodyHash 变化，各增加日期行3词。实施前已声明外部 CHANGE-LOG；旧基线备份后 capture，复跑 FROZEN-OK。没有其他保护正文差异。

证据：/tmp/roi-layer3-20261023/；before-scan 保存90份原始HTML与解析结果；faq-parity.json、verify.log、scope.log、闸门日志及protection-before.json。部署后全量结果保存 after-scan/，五页抽查 excerpt.json，IndexNow 保存 indexnow.log；真实线上结果另回填外部 CHANGE-LOG。
