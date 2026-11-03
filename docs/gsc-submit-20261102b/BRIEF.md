# GSC 请求编入索引：新工具页「我和游戏角色合影」

属性：`sc-domain:dlss5nvidia.com`（走界面，不用 API）。

## 要提交的 URL（只有一条）

1. `https://www.dlss5nvidia.com/game-character-together`

这是一页新的工具落地页（2026-11-02 上线）：两张图（真人 + 游戏角色）合成一张合影，四个姿势预设。页面已在 sitemap 里、canonical 自指、`index,follow`。

## 每一步要抄回的界面原文

1. 打开「网址检查」，输入上面的 URL，点回车。
2. 抄回测试结果的整句（例如 `网址在 Google 上` / `网址不在 Google 上` / `已抓取，目前尚未编入索引`）以及「网页编入索引」那一行的状态文字。
3. 点「请求编入索引」，抄回弹出的确认文字（例如 `已请求编入索引` / `已将网址添加到优先抓取队列`），以及它附带的时间（若有）。
4. 打开「站点地图」，抄回：
   - `sitemap.xml` 那一行的「状态」（应当仍是 `成功`）；
   - 「上次读取时间」的原文；
   - 「已发现的网页数」的数字。
5. 如果出现任何配额提示（例如 `已达到每日配额上限` / `Quota exceeded` / 按钮变灰并给出原因），**立刻停止**，把提示原文抄回，不要重试、不要换别的 URL 凑数。

## 结果落到哪里

- `docs/gsc-submit-20261102b/submit.json`：

```json
{
  "url": "https://www.dlss5nvidia.com/game-character-together",
  "checked_at": "<界面上的时间或抓取时间>",
  "coverage_state": "<第 2 条的原文>",
  "request_result": "<第 3 条的原文>",
  "sitemap": { "status": "<原文>", "last_read": "<原文>", "discovered_urls": "<数字>" },
  "quota_note": "<出现配额时的原文，没有就留空>"
}
```

- 截图存到同一目录（`index-request.png`、`sitemap.png`）。

## 约束

- 只提交这一条 URL。GSC 每日配额有限，别顺手把别的页面也点一遍。
- 不要用 API、不要猜结果；界面上没写的内容就在 json 里留空字符串。
- 不要修改仓库里除 `docs/gsc-submit-20261102b/` 以外的任何文件。
