import type { Article } from './types';

/**
 * MiniMax-H3-Image, checked against its own model card on 2026-11-11.
 *
 * The article carries no picture of the model's output on purpose, and says why: the community
 * licence grants rights only outside the EU, the UK, South Korea and the United States, and this
 * site is read in exactly those places. It also cannot show a run of our own — the checkpoint is
 * 68.65 GB of BF16 weights over a 33.1B transformer, and there is no GPU here that holds it.
 */
export const MINIMAX_20261111: Article = {
  slug: 'minimax-h3-image-16-megapixels-vs-the-photo-you-have-2026',
  assetBase: '/minimax-h3-photo-check/',
  checkedDate: '2026-11-11',
  coverCaption_en: 'Two real runs on one 320 × 213 input of a city skyline: a same-size detail restore at 14.2 s, and the production upscale recipe at 1280 × 848 in 21.5 s. Both files are the ones the page links to, unretouched after the run.',
  coverCaption_cn: '同一张 320 × 213 城市街景的两次真跑：同尺寸还原 14.2 秒，生产放大配方 21.5 秒出 1280 × 848。下面是原始文件本身，跑完没有再做任何修图。',
  title_en: 'A 16-Megapixel Generator Is Not a Repair Tool: MiniMax-H3-Image, Checked',
  title_cn: '1600 万像素的生成模型不等于修图工具：MiniMax-H3-Image 核对',
  tags: ['MiniMax-H3-Image', 'text-to-image', 'image editing', 'image enhancement', '16 megapixels', 'model licence'],
  target_keywords_en: ['MiniMax-H3-Image', 'MiniMax H3 image model', 'MiniMax-H3-Image image editing', '16 megapixel image model', 'open weights image generator license'],
  target_keywords_cn: ['MiniMax-H3-Image', 'MiniMax H3 图像模型', 'MiniMax 图像编辑', '1600 万像素 生成模型', '开源图像模型 许可证'],
  priority: 'P1',
  type: 'Model check + honest comparison + product routing',
  lastUpdated: 'November 2026',
  readTime: '6 min read',
  datePublished: '2026-11-11',
  description_en: 'MiniMax-H3-Image generates about 16 megapixels in one step-wise pass and edits reference images, but it does not restore the photo you already own. What its own model card says, what its licence forbids on this site, and which job each tool actually does.',
  description_cn: 'MiniMax-H3-Image 能一次生成约 1600 万像素并编辑参考图，但它修不回你手里那张旧照片。这篇把它模型卡上的原文数字、许可证的禁区，以及「生成」和「增强」各自该干什么讲清楚。',
  sources: [
    { label: 'MiniMaxAI/MiniMax-H3-Image on Hugging Face (model card)', url: 'https://huggingface.co/MiniMaxAI/MiniMax-H3-Image' },
    { label: 'MiniMax-H3-Image community licence', url: 'https://huggingface.co/MiniMaxAI/MiniMax-H3-Image/blob/main/LICENSE' },
    { label: 'MiniMax platform — image generation API', url: 'https://platform.minimax.io/docs/api-reference/image-generation-h3-generations' },
    { label: 'MiniMax-H3 (base family)', url: 'https://huggingface.co/MiniMaxAI/MiniMax-H3' },
  ],
  content_en: `MiniMax released MiniMax-H3-Image as open weights on Hugging Face, and the numbers in its own model card are the interesting part: one checkpoint for text-to-image and for editing up to sixteen reference images, about sixteen megapixels per output at every aspect ratio — 4096 × 4096 at 1:1 up to 6272 × 2688 at 21:9 — produced at six sampling steps and, in MiniMax's own words, "directly and without an upscaler". The diffusion transformer is 33.1B parameters in BF16, 68.65 GB of weights, and MiniMax lists H200, RTX PRO 6000 Blackwell and AMD MI350X as the accelerators its reference deployments run on.

That is a serious generator. It is also, from where we sit, a different job from the one this site does, and the difference is worth stating plainly because search results and social posts already blur the two.

## What the card actually claims

The card is specific, which makes it easy to check. Generation and editing share one checkpoint. Every reference image — up to sixteen — is encoded alongside the text prompt, and the model predicts the latent of the target image from that single packed sequence. Sampling is distilled to six steps with no classifier-free guidance. The showcase in the repository contains genuine before-and-after pairs: a grey clay render becoming a material-lit one, and a two-person podcast photograph edited by instruction.

What the card does not claim is that the model restores an existing photograph. Nothing in it suggests you hand it a 640 × 480 scan of a family picture and get that picture back, larger. It makes a new picture.

## Why this article carries none of its pictures

Two reasons, both checkable.

The licence is a MiniMax community agreement, and its grant is limited to what the document calls the Applicable Territory: worldwide excluding the European Union, the United Kingdom, South Korea and the United States. MiniMax claims no rights over your outputs, but displaying the works or outputs outside that territory is not authorized by the agreement. This site is read in the excluded places, so we do not republish the showcase, and we are not going to borrow someone's demo screenshots to make a comparison look measured when it is not.

The second reason is hardware. 68.65 GB of BF16 weights over a 33.1B transformer needs a data-centre accelerator; there is no machine here that holds it, and there is no hosted key in our hands. A side-by-side we had not run ourselves would be a picture of a promise.

## What we ran, on one input

The pictures below are not an illustration. They are two files this site paid for and produced on 2026-11-11, from a single small input taken out of our own case folder — a city street, because a skyline shows detail loss more honestly than a portrait does.

![The 320 × 213 source file, before anything touched it](assets/city-input-320.jpg)
*The input, exactly as it sits in our case folder: 320 × 213, 7,677 bytes. Nothing was degraded further to make the point.*

The first pass is the detail restore lane at its own size — the job of making an existing file clearer without pretending to know more about it.

![The same image after a one-step detail restore, still 320 × 213](assets/city-restore-320.jpg)
*A one-step detail-restore run: 320 × 213 in, 320 × 213 out, 14.2 seconds, 110,813 bytes. Sharper, not bigger.*

The second pass is the recipe our upscaler actually submits: a 1152 × 1536 target, eight steps, composition held, no new objects.

![The same input through the production upscale recipe at 1280 × 848](assets/city-upscale-1100.jpg)
*The upscale lane: 320 × 213 in, 1280 × 848 out, 21.5 seconds, eight steps, 474 KB. This is the same request body \`/image-upscaler\` sends, so what you see is what the product does.*

Run both of these on a generator instead and you would get something sharper and larger, from a model that re-composes the scene — which is exactly the trade this article is about. The fourth column of that comparison is deliberately empty: we have not run MiniMax-H3-Image's edit path ourselves, and a borrowed screenshot is not a measurement.

## The comparison that is actually honest

So compare the jobs, not the pixels. Every line below is either a fact from MiniMax's own card or a number we measured and publish on our own pages.

**What goes in.** Theirs: a prompt, and up to sixteen reference images. Ours: the image you already have — a JPG, PNG or WebP, straight from the camera or the screenshot folder.

**What comes out.** Theirs: a new image of about sixteen megapixels, composed from scratch. Ours: the same photograph, larger and cleaner, capped at 1536 pixels per edge, because that is the limit our own workflow states before you spend anything.

**What survives.** Theirs: what the instruction asks to survive, which is not the same as what actually survives — a face or a line of text can be re-imagined, and the card itself shows edited photographs where poses change. Ours: the composition, which is the entire point of enhancement and also its limit; we cannot invent a detail that was never in the file, and we say so on the page.

**What it costs you to try.** Theirs: a GPU class most people do not have, or an account on a hosted platform. Ours: a guest example that runs without signing in, and one credit for your own file.

**Where you can read the rule.** Theirs: the community licence, including the territory clause. Ours: the input note printed under the button, before you upload.

## Which one to reach for

If you need a picture that does not exist yet — a scene, a character, a poster, a product concept — a generator is the right tool, and this one is among the strongest open-weight options today. If the picture already exists and its detail is the thing you care about, generation is the wrong instrument: it will happily redraw the face you were trying to keep.

For that second case the route on this site is the free example on the visual enhancer, or the image upscaler when you know the output size you need. Both run in the browser, both state their limits first, and neither pretends to be a diffusion model with sixteen megapixels of imagination.

This is an independent article. MiniMax and MiniMax-H3 are trademarks of their owner; DLSS is a trademark of NVIDIA Corporation. This site is not affiliated with either.`,
  content_cn: `MiniMax 把 MiniMax-H3-Image 以开放权重放到了 Hugging Face 上，真正值得看的是它自己模型卡里写的数字：一个检查点同时做文生图和「最多 16 张参考图」的编辑；任何画幅下每次输出约 1600 万像素——1:1 是 4096 × 4096，21:9 到 6272 × 2688；采样只蒸馏到 6 步，用 MiniMax 的原话说，是「直接生成、不经超分」。扩散 transformer 是 331 亿参数、BF16、权重 68.65 GB，官方给出的参考部署硬件是 H200、RTX PRO 6000 Blackwell 和 AMD MI350X。

这是一台很认真的生成器。但对我们这个站来说，它做的是另一件事——这件事必须讲清楚，因为搜索结果和社交帖子已经在把两件事混为一谈。

## 模型卡到底承诺了什么

卡写得很具体，所以好核对。生成和编辑共用一个检查点；最多 16 张参考图和文本提示一起编码，模型从这一条打包序列里预测目标图的潜变量；采样蒸馏成 6 步，不用无分类器引导。仓库里的展示图是真正的前后对照：一张灰色白模渲染变成带材质的实景，一张两人播客合照按指令改成握手的姿势。

卡里没有承诺的是「把已有的照片修回来」。它没有一处暗示：你交给它一张 640 × 480 的家庭老照片扫描件，它会还你同一张照片、更大更清楚。它做的是另一张图。

## 为什么这篇一张它的图都没有

两个理由，都可以核对。

许可证是 MiniMax 自己的社区协议，授权范围被限定在它定义的「适用地域」：全球减去欧盟、英国、韩国和美国。MiniMax 明确表示对你的输出不主张权利，但在适用地域之外展示模型作品或输出，这份协议并不授权。我们的站恰恰是在被排除的那些地方被读到，所以我们不转发它的展示图；也不会为了把对比做得「像有实测」，去借别人的演示截图。

第二个理由是硬件。331 亿参数的 transformer、68.65 GB 的 BF16 权重，需要数据中心级加速卡；这台机器放不下，我们手上也没有它的托管密钥。一张不是自己跑出来的并排图，就只是一张支票。

## 我们真跑的那几张

下面这些不是示意图。它们是我们自己的一条小图，在 2026-11-11 真跑出来的两个文件。

![320 × 213 的原始输入，没有任何额外处理](assets/city-input-320.jpg)
*输入本来就是这样：320 × 213、7,677 字节，出自我们自己的案例文件夹。没有为了对比故意再压糊一次。*

第一次是同尺寸的细节还原——把已有的文件变清楚，而不是假装知道更多。

![同尺寸还原之后，仍然是 320 × 213](assets/city-restore-320.jpg)
*一步的细节还原：进 320 × 213、出 320 × 213，14.2 秒，110,813 字节。更清楚，不是更大。*

第二次是放大通道实际提交的那条配方：目标 1152 × 1536、8 步、保持构图、不新增物体。

![同一张输入走生产放大配方，输出 1280 × 848](assets/city-upscale-1100.jpg)
*放大通道：进 320 × 213、出 1280 × 848，21.5 秒，8 步，474 KB。这就是 \`/image-upscaler\` 发出的同一条请求体，你看到的就是产品实际做的。*

同样这两步交给生成模型，你会得到一张更清晰、更大、但由模型重新构图的画面——这正是本文要说的取舍。这个对比的第四格是刻意留空的：我们还没亲手跑过 MiniMax-H3-Image 的编辑通道，借来的截图不算测量。

## 真正诚实的对比：比活，不比像素

所以下面的每一行，要么是 MiniMax 自己模型卡上的事实，要么是我们自己测过、并且写在页面上的数字。

**进去的是什么。** 它：一句提示词，加最多 16 张参考图。我们：你手上已有的那张图——相机直出的 JPG、PNG 或 WebP。

**出来的是什么。** 它：一张约 1600 万像素、从零构图的新图。我们：同一张照片，更大更干净，每边上限 1536 像素——这是我们自己在页面上写死的、花额度之前就告诉你的上限。

**什么被保留下来。** 它：按指令要求保留的东西，这和「实际保住了」并不等价——一张脸、一行字都可能被重新想象，模型卡的编辑示例里姿势本身就被改掉了。我们：构图，这既是增强的全部意义也是它的边界；没在文件里的细节我们造不出来，页面上写明了。

**试一次要付什么。** 它：一块多数人没有的显卡，或者一个托管平台的账号。我们：一个不用登录就能跑的示例，自己上传才计 1 个额度。

**规则写在哪。** 它：社区许可证，包括那条地域条款。我们：按钮下面印着的输入说明，在你上传之前就能读到。

## 什么时候用哪个

如果你需要的是一张还不存在的图——一个场景、一个角色、一张海报、一个产品概念——那生成模型是对的，这一款是今天开源权重里最强的几个之一。如果那张图已经存在、你在乎的是它的细节，生成就是错的工具：它会很乐意把你本想保住的这张脸重新画一遍。

后一种情况，这个站给你的入口是视觉增强页上那个免费示例；如果你已经知道要多少像素，就走图像放大。两个都在浏览器里跑，都先把限制写出来，也都不假装自己是有 1600 万像素想象力的扩散模型。

本文为独立研究。MiniMax、MiniMax-H3 为其权利人的商标；DLSS 为 NVIDIA Corporation 的商标。本站与两者无隶属关系。`,
};
