# 2026-10-23：真实录屏去除冻结尾段与补齐两条示例

服务 R1 / R4 / R5：围绕风格转换，素材真实，历史样张不冒充新推理。

## CHANGE-LOG（改动前已在保护工作台登记）

仅六篇 core 文章的视频块、VideoObject 与 sitemap 视频条目更新；title/H1/canonical/robots/hreflang 与原正文不变。三个视频共用于中英六篇，保护名单无差异，因此不拍新基线。
角色视频以 `ffmpeg -t 19` 裁掉冻结尾段；删除全部旧 31.96s 公共资产。室内视频展示免登录历史源图/参考图/结果，再拖动参考图与结果对比；不声称双参考任务实际运行。检查视频使用真实浏览器缩放、滚动和拖动，未修改网页或加速。

## 实测与自检

| 视频 | 秒 | 尺寸 | 帧 | 字节 | 末尾相同画面秒 | 阈值秒 |
|---|---:|---|---:|---:|---:|---:|
| 角色（裁后） | 19 | 1280×900 | 475 | 862180 | 2 | 3.8 |
| 室内历史样张 | 18.32 | 1440×1000 | 458 | 1868598 | 0.32 | 3.664 |
| 重绘检查 | 20.12 | 1440×1000 | 503 | 1189784 | 0.12 | 4.024 |

ffprobe 与操作时间戳、首帧缩略图、抽帧哈希见 `public/videos/`。运行 `python3 scripts/check-video-held-tail.py public/videos/*.mp4`，每秒抽一帧并容忍少量编码噪声，三条 PASS；对旧资产回归检查为 FAIL：12.96 秒 > 6.392 秒。角色尾段另满足本次裁剪要求的 ≤2 秒。两次未成功的触控缩放尝试未发布，证据保留在 `/tmp/core-video-fix-20261023/review-failed-pinch*`；最终使用实际浏览器 viewport 缩放并确认缩放比例改变。

## 验收

- FLAGSHIP-PAGES: fails=0 verdict=PASS
- 判定: PASS — 没有无来源的数字/引语/技术名
- PROTECTION: changed=0 down=0 verdict=FROZEN-OK
- `npx tsc --noEmit` 与 `npm run build`：exit 0。
- 对构建前后 HTML 移除脚本、构建资源标签和获准视频块后，全站剩余 HTML 差异为零。
- 本地逐条验证 MP4 字节、MIME、缩略图与六篇 VideoObject；旧文件 404；sitemap 96 URL / 6 video 条目。
- 原始日志：`/tmp/core-video-fix-20261023/`。线上与 IndexNow 回执在部署后保存在该目录，未将本地结果冒充上线验证。

# GSC sitemap 重提交结果（2026-10-23）

账号：wustwangsheng@gmail.com
资源：sc-domain:dlss5nvidia.com
操作：仅重提交既有 https://www.dlss5nvidia.com/sitemap.xml 一次；未重提六条URL，未改设置、资源或验证方式。
记录时间（UTC）：2026-10-23T09:30:59.359Z

## 提交最终回执（界面原文）

> 已成功提交站点地图
> Google 会定期处理该站点地图，看看是否有任何更改。日后，如果该站点地图出现任何问题，我们会通知您。

## 关闭成功弹窗后的列表（界面原文）

| 项目 | 原文值 |
|---|---|
| 站点地图 | https://www.dlss5nvidia.com/sitemap.xml |
| 提交日期所在列 | 2026年10月23日 |
| 上次读取时间 | 2026年10月23日 |
| 状态 | 成功 |
| 已发现的网页 | 96 |
| 已发现的视频 | 2 |

提交前列表：上次读取时间「2026年10月15日」、状态「成功」、已发现的网页「90」、已发现的视频「0」。提交后上述日期与数量是在关闭成功弹窗后实际读取列表得到，并非从“提交成功”推断。界面仅显示日期，没有显示读取的具体时分秒；本次不宣称六条URL已编入索引。

## 证据路径

- 提交前文字：/tmp/core-video-fix-20261023/gsc-sitemap-before.txt
- 成功回执截图：/tmp/core-video-fix-20261023/gsc-sitemap-submitted.png
- 成功回执原文：/tmp/core-video-fix-20261023/gsc-sitemap-submitted.txt
- 提交后列表截图：/tmp/core-video-fix-20261023/gsc-sitemap-after.png
- 提交后列表原文：/tmp/core-video-fix-20261023/gsc-sitemap-after.txt
