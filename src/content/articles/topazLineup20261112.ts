import type { Article } from './types';

/**
 * The "coming soon" announcement, written the only way this site is allowed to write one: every
 * lane carries a status you can check by opening its page, and the lanes that are not built say so.
 *
 * Nothing here promises a date, a price, or a quality number against Topaz's own. The comparison
 * that ships later is the one COMPARISON.md governs: every cell is either a linkable fact or a
 * measurement of ours — there is no third kind.
 */
export const TOPAZ_LINEUP_20261112: Article = {
  slug: 'topaz-lineup-coming-what-runs-today-2026',
  title_en: 'The Topaz Lineup, Coming Here: What Already Runs and What Does Not',
  title_cn: 'Topaz 那条产品线，我们要整条补齐：已经在跑的、还在路上的',
  tags: ['Topaz alternative', 'image upscaling', 'video super resolution', 'photo restoration', 'roadmap'],
  target_keywords_en: ['Topaz alternative', 'Topaz Video AI alternative', 'free image upscaler alternative', 'photo AI alternative browser', 'video super resolution browser'],
  target_keywords_cn: ['Topaz 替代', 'Topaz 平替', '免费图片放大', '视频超分 浏览器', '老照片修复 工具'],
  priority: 'P1',
  type: 'Product announcement with a status line per lane',
  lastUpdated: 'November 2026',
  readTime: '5 min read',
  coverCaption_en: 'Lane status on 12 November 2026 — each lane links to the page you can check it on. Drawn here; no third-party screenshot.',
  coverCaption_cn: '2026 年 11 月 12 日的功能线状态——每一条都链到自己那个可以当场验证的页面。图由本站绘制，没有第三方截图。',
  datePublished: '2026-11-12',
  description_en: 'We are closing the gap to the Topaz lineup lane by lane. Five of those lanes already run in the browser today, two are still being built, and this page says which is which — with the acceptance rule every one of them has to pass before it ships.',
  description_cn: '我们按功能线一条条补齐 Topaz 那一套：其中五条今天已经能在浏览器里跑，两条还在做。这篇把哪条是哪种、以及每条上线前必须过的验收标准写清楚。',
  sources: [
    { label: 'Image upscaler (live)', url: 'https://www.dlss5nvidia.com/image-upscaler' },
    { label: 'Image quality enhancer (live)', url: 'https://www.dlss5nvidia.com/image-quality-enhancer' },
    { label: 'Video upscaler page, and its stated limit', url: 'https://www.dlss5nvidia.com/video-upscaler' },
  ],
  content_en: `To be direct about it: we are going to close the gap to the Topaz lineup, lane by lane, and the first half of that sentence is already true today. This page is the teaser — and because this site does not publish a picture it did not take or a number it did not measure, the teaser is a status line per lane rather than a montage.

## What already runs, today, in a browser

**Image upscaling.** Live at the image upscaler: 2× and 4× targets capped at 1536 pixels per edge, one credit per task, and a guest example you can run without an account. Measured this week on a 320 × 213 input: a 1280 × 848 output in 21.5 seconds.

**Detail restoration.** Live at the image quality enhancer: the same input, clearer, at its own size — 14.2 seconds for that same file, and the size does not change. This is also the mode behind the unblur and old-photo pages; the site has said from the start that they share one capability rather than pretending to run a separate deblurring model.

**Portrait retouching, background removal, object erasing, style conversion.** All four run today on the same studio: skin and face refinement, a cutout with an alpha channel, an erased object with the background rebuilt, and the style-conversion lane that is the actual spine of this site.

That is five of the lanes people buy a Topaz licence for, and the honest sentence about them is: they run, they are cheaper here, and on the hardest cases they are not as good. A one-pass restoration will not out-detail a purpose-built denoiser on a very noisy frame, and we would rather write that here than have you find out after spending a credit.

## What is still being built

**Video super-resolution.** The page exists, and it says something uncomfortable in its own copy: the public workspace processes still frames, and the video super-resolution pass is planned. This is the lane we are finishing next — frame-exact, with the caveat that a frame-by-frame upscaler has no temporal model and therefore no flicker-free guarantee.

**Frame interpolation.** Nothing to announce yet beyond intent. It is the one Topaz Video AI feature with no honest shortcut: generating frames means inventing motion, and inventing motion badly is worse than a lower frame rate.

**Batch and the desktop package.** Batch is a studio feature, not a model feature; it ships when the queue does. The desktop client is in a limited beta and the download page states exactly what it does and does not include.

## The rule every lane has to pass

One rule, applied without exception: **every comparison we publish is our own run on our own input, or a fact we can link to.** No borrowed screenshots, no "up to 4× sharper" numbers without a file behind them, no before-and-after where the before was degraded on purpose to look worse. When a lane cannot meet that bar yet, it goes out with its limit printed on the page — which is why the video page currently tells you it handles still frames.

## What we are not promising

Not a date. Not a price. Not that any lane beats Topaz on any particular frame — that claim belongs to a test with the same input on both, and that test will be published when it is run, not before. And not a model name we have not licensed: the weights list is published alongside the code, and a model whose licence forbids commercial or server-side use does not enter the queue, no matter how good its demo reel looks.

If you want to see where the line already is, the free examples cost nothing and need no account. If you want the rest, the next lanes are closer than they were last month.

Topaz is a trademark of Topaz Labs. This site is independent and not affiliated with, endorsed by, or sponsored by Topaz Labs or NVIDIA.`,
  content_cn: `直说：我们要把 Topaz 那一整条产品线逐条补上，而这句的前半段今天已经成立。这一页是预告——但本站不发不是自己拍的图、不发不是自己测的数，所以预告也是「一条功能一行状态」，而不是一段剪好的拼贴。

## 今天就能在浏览器里跑的

**图片放大。** 在图像放大页：2× 和 4× 目标，每边上限 1536 像素，一次任务 1 额度，另有不用登录就能跑的免费示例。本周实测：320 × 213 的输入，21.5 秒出 1280 × 848。

**细节还原。** 在图像质量增强页：同一张输入，变清楚，尺寸不变——同一个文件 14.2 秒。去模糊页和老照片页跑的就是同一条通道；本站从一开始就写明它们共用一种能力，没有假装另有一个独立的去模糊模型。

**人像修图、抠图、物体擦除、风格转换。** 四条今天都在同一个工作室里跑：皮肤与五官的收敛、带透明通道的抠图、擦掉物体后重建背景，以及本站真正的主线——风格转换。

这五条，是多数人买 Topaz 授权时想要的那几条功能线。关于它们的实话是：它们能跑，这里更便宜，最难的那批素材上不如对方。一遍式的细节还原，在噪点极重的画面上做不过专用的降噪模型——这句话写在前面，比让你花完额度才发现要好。

## 还在做的

**视频超分。** 页面已经有了，而且页面自己在文案里写了一句不太体面的话：公开工作室目前处理的是静态帧，视频超分那一遍仍在计划中。这是下一条要完成的功能线，逐帧处理——同时把话说在前面：逐帧超分没有时序模型，因此不承诺无闪烁。

**视频补帧。** 目前只有意图，没有可宣布的东西。这是 Topaz Video AI 里唯一没有诚实捷径的一项：生成帧就是发明运动，发明得不好，比帧率低更难看。

**批量与桌面端。** 批量是工作室功能而不是模型功能，跟着队列一起上。桌面客户端还在小范围内测，下载页写清了它包含什么、不包含什么。

## 每一条都要过的验收

只有一条规则，没有例外：**我们发布的每一组对比，要么是自己在自己素材上跑出来的，要么是可以给出链接的事实。** 不借别人的截图，不写没有文件支撑的「最多提升 4 倍」，不做把「之前」故意压糊的对比。哪条线还达不到这个标准，它上线时就把自己的限制印在页面上——所以视频那页至今写着它只处理静态帧。

## 我们不承诺什么

不给日期，不给价格，不承诺任何一条在某一帧上赢过 Topaz——那种结论属于「同一输入两边各跑一次」的测试，测试跑完才发布，不是反过来。也不承诺还没谈妥许可证的模型：权重清单随代码一起公开，凡是许可证不允许商用或不允许服务端调用的模型，演示再好看也不进队列。

想先看看这条线今天到哪了：那几个免费示例不花钱、也不用账号。想要剩下的部分——它比上个月更近了。

Topaz 是 Topaz Labs 的商标。本站独立运营，与 Topaz Labs、NVIDIA 均无隶属、背书或赞助关系。`,
};
