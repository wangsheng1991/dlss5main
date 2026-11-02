import type { Article } from './types';

/**
 * Two posts written on 2026-11-02 from what the news actually said and from what we actually ran.
 * Every borrowed number names its outlet and date; every measured number comes from a job we ran
 * today and is reproducible from the parameters in the body.
 */
export const NEWS_20261102: Article[] = [
  {
    slug: 'dlss-5-on-non-nvidia-cards-mod-boundary-2026',
    title_en: 'DLSS 5 on a Non-NVIDIA Card: What the Mods Claim and What Support Actually Means (2026)',
    title_cn: '没有 N 卡也能跑 DLSS 5？2026 这波 mod 的真实边界',
    tags: ['dlss 5 mod', 'dlss 5 amd', 'dlss 5 supported gpus', 'borderless gaming', 'amdnnr', 'phantom blade zero'],
    target_keywords_en: [
      'dlss 5 on amd card', 'dlss 5 non nvidia gpu', 'dlss 5 mod', 'dlss 5 supported gpus',
      'borderless gaming dlss 5', 'phantom blade zero dlss 5 mod',
    ],
    target_keywords_cn: ['DLSS 5 能用 A 卡吗', 'DLSS 5 mod', 'DLSS 5 支持显卡', 'DLSS 5 非 N 卡', '影之刃零 DLSS 5'],
    priority: 'P1',
    type: 'News check + support-boundary explainer',
    lastUpdated: 'November 2026',
    readTime: '7 min read',
    description_en: 'Mods put DLSS 5 on Radeon cards and inside unsupported games within days of launch. What is media-reported, what NVIDIA supports, and how to check your own GPU.',
    description_cn: '上线没几天，mod 就把 DLSS 5 搬到了 Radeon 卡和不支持的游戏里。哪些是媒体报道、哪些是官方支持范围、你自己的卡怎么查。',
    datePublished: '2026-11-02',
    sources: [
      { label: 'VideoCardz (2026-10-31): Phantom Blade Zero gets an unofficial DLSS 5 mod less than 24 hours after launch', url: 'https://videocardz.com/' },
      { label: 'GameGPU (2026-10-31): DLSS ray reconstruction and frame generation on Radeon RX 9070 XT via a community mod', url: 'https://gamegpu.tech/' },
      { label: 'eTeknix (2026-10-30): Borderless Gaming brings DLSS 5 and frame generation to non-NVIDIA GPUs', url: 'https://www.eteknix.com/' },
      { label: 'eTeknix (2026-11-01): modders make DLSS 5 faster and bring it to unsupported games', url: 'https://www.eteknix.com/' },
      { label: 'Our own support table and dataset', url: 'https://www.dlss5nvidia.com/dlss-checker' },
      { label: 'DLSS5 GPU compatibility dataset (21 cards, sourced and dated)', url: 'https://huggingface.co/datasets/shi9214/dlss5-gpu-compatibility' },
    ],
    content_en: `Within a week of Phantom Blade Zero shipping, the modding scene did what it always does: it took a feature NVIDIA ships inside supported games and moved it somewhere NVIDIA does not support. Three things happened, and they are easy to mix up.

**One.** VideoCardz reported on 2026-10-31 that an unofficial DLSS 5 mod for Phantom Blade Zero appeared less than 24 hours after launch. **Two.** GameGPU reported the same day that DLSS ray reconstruction and 4x frame generation were running on a Radeon RX 9070 XT through a community mod. **Three.** eTeknix reported on 2026-10-30 that Borderless Gaming brings DLSS 5 and frame generation to non-NVIDIA GPUs, and on 2026-11-01 that modders had made DLSS 5 faster and brought it to games NVIDIA does not list.

We did not reproduce any of these three. They are reported facts with dates, not our measurements, and nothing below should be read as us vouching for the numbers those outlets printed.

## "It runs" and "it is supported" are different sentences

An official support claim has three parts: a game NVIDIA lists, a GPU generation NVIDIA lists, and a driver and runtime NVIDIA ships. A mod can satisfy the first two and still fail the third, because it replaces or injects the runtime on its own. That is exactly what a mod is for — and it is why a working mod does not move a card from "unsupported" to "supported" on anyone's list, including ours.

The practical consequence is boring but important: if a mod breaks, no vendor owes you a fix, and the picture quality you see is not what the official pathway was tuned for. A community build that makes a game look convincing on a Radeon card is a genuine achievement and a bad basis for a purchase decision.

## Frame-rate numbers need an owner

Several headlines from the weekend carry performance percentages. They come from the outlet that measured them, on that machine, with that mod build. We publish performance claims only when we can attribute them to a measurement we ran ourselves, so this page does not quote a single frame rate: read the original article for the number and its test setup.

What we will say is what a reader should ask: which game, which resolution, which upscaling preset, which driver, and whether the comparison was the same scene. A "40% faster" headline without those five answers is a mood, not a measurement.

## How to check your own card instead of trusting a headline

Our public support table lists cards with the source and the date each row was checked, and the machine-readable version is a dataset you can diff. It answers one question: does NVIDIA's documentation cover this card for this feature, as of the date on the row. It deliberately does not answer "will a mod work on it" — nobody can promise that, because it depends on the game, the mod build and the driver.

If you are deciding whether to try a mod, treat it as an experiment on a machine you can reinstall: back up saves, keep a system restore point, and expect the game's anti-cheat to have opinions. If you are deciding whether to buy a card, use the support table, not the experiment.

## Why we still cover this

Our own product is a browser-based visual enhancer and a separate desktop window — independent tools that convert and enhance images, not an NVIDIA runtime and not a game injector. We have no horse in the mod race. We cover it because the same question keeps arriving in search: "can I get DLSS 5 on this card". The honest answer has not changed: on cards NVIDIA documents, yes; everywhere else, you are running somebody's experiment.`,
    content_cn: `《影之刃零》上线还不到一周，mod 圈就做了它一直会做的事：把 NVIDIA 只在支持游戏里提供的功能，搬到 NVIDIA 不支持的地方。周末发生了三件事，很容易被混为一谈。

**第一**，VideoCardz 2026-10-31 报道，《影之刃零》上线不到 24 小时就出现了非官方 DLSS 5 mod。**第二**，GameGPU 同一天报道，有人在 Radeon RX 9070 XT 上通过社区 mod 跑起了 DLSS 光线重建和 4 倍帧生成。**第三**，eTeknix 2026-10-30 报道 Borderless Gaming 把 DLSS 5 和帧生成带到了非 NVIDIA 显卡上，2026-11-01 又报道 mod 让 DLSS 5 变快，并进入了官方名单之外的游戏。

这三件事我们一件都没有复现。它们是带日期的媒体报道，不是我们的实测，下面任何一句话都不代表我们为媒体给出的数字背书。

## 「能跑」和「受支持」是两句话

官方的支持声明由三部分组成：NVIDIA 列出的游戏、NVIDIA 列出的显卡世代、以及 NVIDIA 提供的驱动与运行时。mod 可以满足前两条却绕开第三条，因为它自己替换或注入了运行时。这正是 mod 存在的理由，也是为什么一个能跑起来的 mod 不会把任何一张卡从「不支持」推进到「支持」——包括我们的表格。

由此得到一个很朴素但对钱包重要的结论：mod 出问题，没有厂商欠你一个修复；你看到的效果也不是官方通路调校出来的。让一块 Radeon 卡把游戏跑得像样，是很了不起的工程；但它不是买卡依据。

## 帧率数字要问归属

周末有一批标题带着性能百分比。那些数字属于做出测量的媒体、那台机器、那个 mod 版本。本站只在能追溯到我们自己做过的测量时才发布性能数字，所以这篇文章一个帧率都不引用：数字请回原文看，连同它的测试环境。

我们愿意说的是，读者应该继续问五件事：哪款游戏、什么分辨率、哪种超分预设、哪个驱动、比较的是不是同一个场景。一条「快 40%」的标题如果这五个都不给，那是一种情绪，不是测量。

## 与其信标题，不如查自己的卡

我们的公开支持表为每一行标了来源和核对日期，机器可读版本是一个可以直接 diff 的数据集。它只回答一个问题：按 NVIDIA 官方文档，这张卡在这个功能上有没有被覆盖，截至那一行标注的日期。它刻意不回答「mod 能不能在你卡上跑」，这没人能保证——取决于游戏、mod 版本和驱动。

如果你只是想试一次 mod，就把它当成一次可以重装的实验：备份存档、留一个系统还原点、并预期反作弊会有意见。如果你是在决定买哪张卡，看支持表，不要看实验。

## 我们为什么仍然写这个

我们自己的产品是浏览器里的视觉增强器和独立的桌面窗口——独立的图像转换与增强工具，不是 NVIDIA 运行时，也不是游戏注入器。mod 的输赢与我们无关。写它是因为同一个搜索问题反复出现：「我的卡能不能用上 DLSS 5」。诚实的答案没有变：NVIDIA 文档覆盖的卡，可以；其他情况，你跑的是别人的实验。`,
  },
  {
    slug: 'one-low-res-image-two-pipelines-ours-vs-flux-klein-2026-11',
    title_en: 'One 320×213 Image Through Two AI Pipelines: Ours and FLUX.2 [klein] (Measured 2026-11-02)',
    title_cn: '同一张 320×213 的图，两条 AI 管线：我们的与 FLUX.2 [klein]（2026-11-02 实测）',
    tags: ['flux 2 klein', 'image to image', 'ai image enhancement', 'workers ai', 'comparison', 'measurement'],
    target_keywords_en: [
      'flux 2 klein image to image', 'flux klein vs ai enhancer', 'flux klein edit test',
      'workers ai flux klein', 'ai image enhancement comparison measured',
    ],
    target_keywords_cn: ['FLUX 2 klein 图生图', 'FLUX klein 对比', '图像增强实测', 'FLUX 编辑实测'],
    priority: 'P1',
    type: 'Reproducible measurement note',
    lastUpdated: 'November 2026',
    readTime: '6 min read',
    description_en: 'The same 320×213 JPEG, the same prompt, two routes: our own pipeline and Cloudflare Workers AI running FLUX.2 [klein] 4B. What came back, with sizes, hashes and one honest caveat.',
    description_cn: '同一张 320×213 的 JPEG、同一句提示词、两条路线：我们自己的管线和 Cloudflare Workers AI 上的 FLUX.2 [klein] 4B。返回了什么，带字节数、哈希，以及一条必须说清的保留意见。',
    datePublished: '2026-11-02',
    sources: [
      { label: 'FLUX.3 [klein] model repository (2026-10-16, 5.5B parameters, gated access)', url: 'https://huggingface.co/black-forest-labs/flux-3-image-klein' },
      { label: 'FLUX.2 [klein] 4B on Cloudflare Workers AI', url: 'https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b' },
      { label: 'Our own free example the input came from', url: 'https://www.dlss5nvidia.com/visual-enhancer' },
    ],
    content_en: `Comparisons are cheap to write and expensive to trust. This one is short on purpose: one input, one prompt, two routes, and every number below came out of a job run on 2026-11-02.

## The input

A 320×213 JPEG, 12,287 bytes, SHA-256 starting \`901bb72b4750\`. It is one of the low-resolution examples our own site serves, a pile of book covers with heavy compression on the spine text.

![Input: 320×213 JPEG, 12,287 bytes, heavy JPEG artifacts on small lettering](/examples/compare-20261102/input-lowres.jpg)

## Route A — our pipeline

Model \`flux-klein\`, four inference steps, seed 42, WebP output, no width or height forced. The prompt asked to keep the subject, framing, colours and lighting and to rebuild texture without adding objects.

Result: a 1024×1024 WebP of 309,502 bytes, SHA-256 starting \`0fd398414935\`.

![Our output: 1024×1024 WebP, 309,502 bytes — the scene survives, small lettering does not](/examples/compare-20261102/ours.webp)

Look at the spines. The scene, the colour blocking and the pile survive; the Chinese and English titles do not. The model did not read them, it drew something that looks like lettering. This is the caveat we print next to every example on the site, and here it is visible in one image: **enhancement is reconstruction, not recovery.** If the picture has information you must preserve — a serial number, a price tag, a face — check it at 100% before you ship anything.

## Route B — FLUX.2 [klein] 4B on Workers AI

Same prompt, same 320×213 input, sent as a multipart request to \`@cf/black-forest-labs/flux-2-klein-4b\` with the original JPEG in \`input_image\`. The endpoint answered in about two seconds with a 1024×1024 JPEG of 614,235 bytes.

![What the flux-2-klein-4b call returned: a grey cylinder, unrelated to the input](/examples/compare-20261102/flux2-klein-4b.jpg)

That is not the book pile. The response is a clean studio photograph of a grey cylindrical container — it is what a text-to-image call produces from "restore this compressed product photo…", and it bears no relation to the input pixels. So the call we made did not execute image-to-image. We are not publishing it as "what FLUX klein does": it is what **that endpoint did with that request**, and the useful half of it is the lesson.

**Check that the model actually consumed your input.** Send one image, look at the output, and if it is unrelated to the input, your request was treated as text-to-image and every conclusion you were about to draw about "editing quality" would have been wrong. This is not a verdict on FLUX.2 [klein]'s editing ability; it is a verdict on one call.

## Why we did not run FLUX.3 [klein]

FLUX.3 [klein] exists: the repository was published on 2026-10-16 and reports 5,548,681,984 parameters in BF16, gated access, and a licence marked "other". We have no GPU on this machine and no granted access to the repository, so we could not run it, and a comparison without a run would be fiction. If you have a card that fits 5.5B weights, the shape of the test above is the test to repeat.

## What this comparison does and does not say

It says: on this input, our pipeline kept the scene and rewrote the lettering; a Workers AI call to the 4B klein build returned an unrelated image and therefore was not an edit at all.

It does not say that one model is better than another, it is not a benchmark, and it is not a quality ranking. Two routes, one image, one prompt, all parameters published, all hashes published. Repeat it and you should be able to reach the same two files.

The free example on our site runs the same pipeline, with the same caveat printed on the page — try it before you upload anything of your own.`,
    content_cn: `对比文章写起来便宜，可信起来很贵。这篇故意写短：一张输入、一句提示词、两条路线，下面每个数字都来自 2026-11-02 真跑的一次任务。

## 输入

一张 320×213 的 JPEG，12,287 字节，SHA-256 前 12 位 \`901bb72b4750\`。这是我们自己站点上的一张低分辨率示例图：一摞书封，书脊小字被 JPEG 压得很花。

![输入：320×213 JPEG，12,287 字节，小字部分压缩痕迹很重](/examples/compare-20261102/input-lowres.jpg)

## 路线 A —— 我们自己的管线

模型 \`flux-klein\`，4 步推理，seed 42，输出 WebP，不强制宽高。提示词要求保持主体、构图、颜色和光照，重建纹理，不加物体。

结果：1024×1024 的 WebP，309,502 字节，SHA-256 前 12 位 \`0fd398414935\`。

![我们的输出：1024×1024 WebP，309,502 字节——场景保住了，小字没保住](/examples/compare-20261102/ours.webp)

看那些书脊。场景、色块、整摞书的形态都还在；中文和英文书名不在了。模型没有「读」那些字，它画的是一种看起来像文字的东西。这正是我们每个示例旁边都印着的那句保留意见，这里用一张图就能看见：**增强是重建，不是还原。** 如果图里有必须保住的信息——编号、价签、人脸——发出前请放大到 100% 逐一核对。

## 路线 B —— Workers AI 上的 FLUX.2 [klein] 4B

同一句提示词、同一张 320×213 输入，用 multipart 请求发给 \`@cf/black-forest-labs/flux-2-klein-4b\`，原始 JPEG 放在 \`input_image\` 里。接口大约两秒返回一张 1024×1024 的 JPEG，614,235 字节。

![flux-2-klein-4b 这次返回的东西：一个与输入无关的灰色圆柱](/examples/compare-20261102/flux2-klein-4b.jpg)

这不是那摞书。返回的是一张干净的影棚照，一个灰色圆柱形容器——这是「restore this compressed product photo…」这句提示词按文生图跑出来的东西，和输入的像素毫无关系。也就是说，我们这次调用**没有**按图生图执行。我们不会把它当作「FLUX klein 的效果」发布：它是**那个接口对那次请求的回应**，而其中真正有用的一半是教训。

**先确认模型真的吃了你的输入。** 发一张图，看输出；如果输出和输入无关，说明这次请求被当成了文生图，你接下来关于「编辑质量」的所有结论都会是错的。这不是对 FLUX.2 [klein] 编辑能力的判决，只是对一次调用的判决。

## 我们为什么没跑 FLUX.3 [klein]

FLUX.3 [klein] 是存在的：仓库 2026-10-16 发布，标称 5,548,681,984 个参数、BF16、需要授权访问，许可证标为「other」。我们这台机器没有 GPU，也没有拿到仓库授权，所以跑不了；没跑就写的对比只能是编的。如果你有能放下 5.5B 权重的卡，上面那套测试就是该复现的测试。

## 这次对比说明了什么、没说明什么

它说明：在这张输入上，我们的管线保住了场景、重写了小字；而一次发往 4B klein 的 Workers AI 调用返回了无关图像，因此根本不是一次编辑。

它没有说明谁比谁强，不是基准测试，也不是画质排名。两条路线、一张图、一句提示词，参数与哈希全部公开，你重复一遍应该能得到同样的两个文件。

站上的免费示例跑的就是同一条管线，页面上也印着同一句保留意见——上传你自己的图之前，先跑一次看看。`,
  },
];
