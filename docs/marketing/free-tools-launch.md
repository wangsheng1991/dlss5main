# 免费工具宣传包

日期：2026-09-24 ｜ 配套：`reddit-dlss5-launch.md`（已有的 Reddit 包，负责「AI 增强效果对比」那条线）

## 0. 结论先行

| 问题 | 判断 |
|---|---|
| Reddit 还要再写稿吗？ | **不要。** 已经有 7 个版本（A–G）+ 3 张合成图 + 20 组官方参考图板 + 发布规则。现在卡的是「发」，不是「写」，再写第 8 版没有边际收益 |
| 那缺什么？ | **免费工具一个字都没宣传过。** 那 7 个版本全在讲「增强效果好不好」，没有一个提到 `/tools/passport-photo`、`/remove-background`、`/erase-object`、`/image-to-svg` |
| 最值得单独讲的是哪个？ | **证件照工具。** 它是唯一一个**不上传、不需要账号、不调模型**的 —— 照片在浏览器里裁完直接导出，服务器收不到。这是能自己站住的新闻点，而广告味为零 |
| 渠道呢？ | 现有文案全指向 Reddit。`content-engine` 的 Dev.to 和 Bluesky 发布器早就通了，一直没用在这上面 |

**一句话**：不是「要不要发宣传稿」，是**只在免费工具上写一条**，其余渠道别再灌了。

---

## 1. 为什么挑证件照工具

三条，都能自己核：

1. **隐私是事实，不是话术。** `src/pages/PassportPhoto.tsx` 全文没有一处 `fetch`、没有上传、不碰 `/api`。图片经 `FileReader` 进 canvas，`canvas.toBlob` 直接下载 —— **断网也能用**。
2. **规格是核过的。** 每个尺寸带逐字来源（`src/lib/spec/`），不是拍的脑袋。俄语 `фото 3 на 4 / 35×45` 是我们测出来唯一没人占的位置。
3. **它有真实搜索需求，且已经在线上。** `/tools/passport-photo`、`/tools/passport-photo/3-na-4`、`/tools/passport-photo/35x45-ru` 三个页面都 200。

> ⚠️ **一条硬前提**：「不上传」这句话必须一直是真的。以后谁给它加任何服务端处理，这份文案要同步改 —— 一旦被扒出来是假的，代价比不发帖大得多。

---

## 2. Show HN（主推）

**标题**

```
Show HN: A passport photo tool that never uploads your photo
```

**正文**

```
I built a passport / document photo maker that runs entirely in the browser. You pick a
verified size (3×4 cm, 35×45 mm, and a few others), align the head-height guide, and it
exports a printable sheet — drawn on a canvas, with no upload and no account.

Why local: a document photo is the one image where the privacy stakes are obvious, so I
wanted a path with no server component at all. Open the page, go offline, it still works.
The file never leaves the tab.

The part I spent the most time on is the specs, because "passport photo" means something
different in every country — 35×45 mm with 32–36 mm of head height in Russia, 2×2 in the
US, and so on. Each size is a row carrying a verbatim quotation from its source and a link
back, rather than a number I typed in. Sizes where I cannot find two independent sources
do not get published.

Limitations, which matter more than the feature list:

- It does not detect or crop your face. You position the guide; it draws the head-height
  lines so you can check them yourself.
- The background is replaced with a flat colour, not segmented hair by hair.
- It will happily produce a photo that gets rejected for reasons it cannot see —
  expression, glasses, shadows, glare. It is a layout tool, not a compliance oracle.

Happy to answer anything about the spec table or the canvas geometry.
```

**第一条评论（发完立刻自己发）**

```
On the name, since it invites the question: this is an independent project, not affiliated
with or endorsed by NVIDIA. The passport tool has nothing to do with DLSS or upscaling —
it is the free-tool wing of a larger image site.

On the specs: the Russian 35×45 mm row (head height 32–36 mm, 4–6 mm of headroom above it)
rests on three independent sources that agree. Where they disagreed, the losing figure is
still in the table with the reason it lost, and a format that only one page describes is
not published at all. Cheapest way to check the geometry is to print at 100% and measure —
that is how I checked it.
```

> **这段免责声明不是客套，是必需品。** 域名里有 NVIDIA 和 DLSS，不问自答比等着被质问好。同时它也是很好的第一句——先把自己最容易被攻击的点说清楚，评论区会去聊技术。

---

## 3. Bluesky（已发）

```
Your ID photo is the one image you shouldn't have to upload to a website just to crop it.

Every number in our table carries the sentence it came from. One contradicted three others — it stays in, with the reason it lost.

https://wangsheng1991.github.io/content-engine/topics/passport-photo/
```

已发（`content publish --bluesky passport-photo`，发出后回读确认）：
https://bsky.app/profile/wangsheng199.bsky.social/post/3mwaacg4nbr2a

> 初稿那条 318 字符，超了 Bluesky 的 300 上限 —— 发之前一定先 `--dry-run` 数字数。上面这条 292/300。

---

## 4. Reddit 这条线，免费工具不要硬塞

设计版、摄影版对免费工具的容忍度比 HN 低得多 —— 那边已经有一套「先给对比和限制」的打法在工作，硬塞一个工具链接会把那个号的信誉一次性用掉。

**真要发，只有一个位置合适**：`r/webdev` 的 Showoff Saturday，或者 `r/SideProject`，用和第 2 节**同一份稿子**，别改写成第二版 —— 一份稿子发一个地方，间隔拉长。

---

## 5. 不建议做的

1. **不要批量生产「宣传稿」。** 现在缺的是执行（发帖、回评论），不是文案数量。
2. **不要在标题里贴 NVIDIA / DLSS 5 的关系。** 域名本身已经在踩线了，文案再往上靠是把风险放大。
3. **不要同一天跨社区发同一份正文。** 这条 `reddit-dlss5-launch.md` 里已经写了，免费工具同样适用。
4. **不要promise「符合签证要求」。** 工具做的是排版，不是合规判断 —— 这句话一旦说出口，第一个被拒签的人就会来找你。
5. **不要在文案里说「免费」却把人引到要积分的流程上。** 证件照工具是真的不需要账号；增强那条线才走积分。两者不要混在一句里说。

---

## 6. content-engine 主题（2026-09-24 已做完并发出）

已交付：

- 主题源码 `content-engine/topics/passport-photo/` —— 11 条 claim，`content verify --online --strict` 逐字命中 11/11；
- 长文（中英） https://wangsheng1991.github.io/content-engine/topics/passport-photo/
- Dev.to https://dev.to/dlss/an-id-photo-spec-table-where-every-number-carries-the-sentence-it-came-from-2map
- Bluesky https://bsky.app/profile/wangsheng199.bsky.social/post/3mwaacg4nbr2a
- 小红书 / Reddit / X / 知乎仍停在 `dist/drafts/passport-photo/`，等人工确认。

当初选它的理由：

- 每条 claim 都要带能在源头逐字找到的引文，`content verify --online --strict` 卡着 —— 规格数字这种东西最需要这个闸门；
- 一次产出中英文长文 + 站点页 + RSS + Dev.to / Bluesky 草稿；
- 上线后 `content feedback` 就能开始回收数据（Dev.to 是唯一给浏览量的平台）。

这比再写一份独立文案有价值，因为它同时建了页面、内容资产和数据回路。
