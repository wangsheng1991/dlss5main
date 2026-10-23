# 2026-10-23：三篇入口稿上线与四篇旧稿纠错

服务 R2、R5：三篇入口稿保留原文自我降级、主线链接、边界和独立性声明；四篇旧稿仅在内容库纠错，不发布。

## 本轮站点范围

Aiarty、FSR sharing、Lightroom 三篇各 /blog 与 /zh/blog，共六个 URL；slug 分别为 `aiarty-review-reproducible-check`、`fsr-41-sharing-compression`、`lightroom-open-eyes-generation`。

复用现有文章数据/Markdown 渲染器/Blog 页面/prerender/sitemap；增加 entry-point 类型，保留正文原文，末尾仅追加主线稿与工具页两个相关链接。自有图、图注及来源 README 原样复制；正文引用的输入、输出、请求记录与复现文件一并提供。新封面尺寸读取实际图片。Lightroom 的四组既有问答输出 FAQPage，其余两篇不造问答。dateModified 和可见 Last checked 均为 2026-10-23；中英 canonical 各自独立，hreflang 配对。retention 未动。

本地六页已通过 HTTP 200、Article、日期、hreflang、图片 HTTP 200、原文前缀和图注逐项检查。sitemap 为 102 条，中英博客索引均含三篇。103 份既有 HTML 仅 /blog 与 /zh/blog 自动增加卡片，原有可见文本无删改，冻结字段不变。先更新外部工作区 additive-20261012/CHANGE-LOG.md，再 capture 并复跑保护闸门。

## 四篇内容库纠错（不上站）

- Adobe–Topaz：英文/中文的 MIT CLI 声明改为不提供命令行工具；中文标题及英文拼接修正。video/README.md 为 Origin: site-recording，两个现存视频作为同一篇稿的横/竖版素材保留，未误当作两篇文章。
- Broadcast：去除不存在的录屏交付和“短录屏”表述；改正 CLI 声明；专题清单三份留一份，重复前缀合并；中文标题及英文拼接修正。图对仍不承担性能承诺，不隐藏比较条件。
- RTX Video/ComfyUI：去除不存在的录屏交付和“短录屏”表述；改正 CLI 声明；中文标题及英文拼接修正。
- Tesla Roadster：去除不存在的录屏交付和“短录屏”表述；改正 CLI 声明；中文标题及英文拼接修正。

R2 段落、素材图注和来源 URL 已做保留比对。旧稿仍位于内容库，不在本次文章数组/public 新稿目录中。补丁及原始闸门输出留档。

```text
10 articles, 0 failing  (shared-line limit 35%)
FLAGSHIP-PAGES: fails=0 verdict=PASS
判定: PASS — 没有无来源的数字/引语/技术名
PROTECTION: changed=0 down=0 verdict=FROZEN-OK
npx tsc --noEmit && npm run build: exit 0
```

[本地验收](entry-publish-20261023/local-verification.json)、[素材哈希](entry-publish-20261023/asset-manifest.json)、[旧稿纠错补丁](entry-publish-20261023/library-corrections.patch)、[内容库闸门](entry-publish-20261023/library-gate-final.log)。上线后 HTTP、IndexNow 与 GSC 真实回执输出到 `/tmp/entry-publish-20261023/`；未收到回执前不声称收录成功。
