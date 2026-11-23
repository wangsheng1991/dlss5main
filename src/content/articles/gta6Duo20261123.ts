import type { Article } from './types';

export const GTA6_DUO_SLUG = 'gta-6-character-photo-fan-made-guide-2026';
export const gta6DuoArticlePath = (locale: 'en' | 'zh') =>
  `${locale === 'zh' ? '/zh' : ''}/blog/${GTA6_DUO_SLUG}`;

/**
 * The companion article to `/gta6-character-photo`.
 *
 * The page answers "can I do it"; this article answers "how do I get a result I am willing to post",
 * which is where most of these attempts fail: the screenshot has a HUD on it, the character is
 * turned away, or the two references were lit from different sides. Written for a console player who
 * has no PC build of the game and no editing skills, and it keeps the fan-made framing in the body
 * rather than in a footer.
 */
export const GTA6_DUO_ARTICLE: Article = {
  slug: GTA6_DUO_SLUG,
  tier: 'entry-point',
  assetBase: `/blog/${GTA6_DUO_SLUG}/`,
  checkedDate: '2026-11-23',
  coverCaption_en: 'The duo-portrait tool on this site, with the free sample run of our own two references.',
  coverCaption_cn: '本站的合影工具，右侧是免费示例用我们自己的两张参考图跑出来的结果。',
  title_en: 'How to make a GTA 6 character photo with yourself (fan-made, 2026)',
  title_cn: '怎么和 GTA6 的角色合一张影：用你自己的主机截图（同人图，2026）',
  description_en: 'GTA VI is out on consoles and there is no PC build yet, so your still is a console screenshot. Here is how to turn that screenshot plus a photo of yourself into one duo picture — and how to check it before you post.',
  description_cn: 'GTA6 已经在主机上线，PC 版还没有，所以你手里的画面就是主机截图。这篇讲：用这张截图加一张你自己的照片，怎么得到一张能发的同框图，以及发之前该核什么。',
  tags: ['GTA 6', 'game character photo', 'duo portrait', 'fan-made', 'game screenshot'],
  target_keywords_en: ['gta 6 character photo', 'gta 6 photo with character', 'photo with game character', 'gta vi fan photo', 'console screenshot to fan photo'],
  target_keywords_cn: ['和gta6角色合影', 'gta6 角色合照', '游戏角色合影', '主机截图 同人图', '两张照片合成一张'],
  priority: 'P1',
  type: 'Campaign guide — fan-made composite from a console screenshot',
  datePublished: '2026-11-23',
  lastUpdated: 'November 2026',
  readTime: '5 min read',
  sources: [
    { label: 'Rockstar Games — Grand Theft Auto VI', url: 'https://www.rockstargames.com/VI' },
    { label: 'Grand Theft Auto VI — release date and platforms (Wikipedia, checked 23 November 2026)', url: 'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI' },
    { label: 'The duo-portrait workflow used here', url: 'https://www.dlss5nvidia.com/game-character-together' },
  ],
  content_en: `GTA VI shipped on **19 November 2026** for **PlayStation 5 and Xbox Series X|S**. No PC version had been announced when this article was checked (23 November 2026), which leaves almost every player holding the same kind of still: a console screenshot.

That is also the exact input a two-reference image workflow takes. So the picture of you standing next to Lucia, Jason or anyone else in Leonida is two uploads away — one screenshot from your console, one photo of yourself. This guide is about getting a result you are actually willing to post, because most attempts fail on the inputs, not on the model.

## TL;DR

- **You need two stills**: a photo of yourself where your face is clear, and a screenshot where the character is large and facing the camera.
- **Turn the HUD off.** A screenshot with mission markers, compass and subtitles on it gives the model clutter instead of information.
- **The output is fan material.** It is a generated composite, not a game feature, and the character stays the property of its owner.
- **Check both faces, the hands and the join** before you share it. Everything between the two bodies is where a composite shows.

## 1. Export the screenshot properly

Both consoles let you save a screenshot to a phone or a USB drive. Do it from the console's media gallery rather than photographing the TV with your phone — a phone photo of a screen adds a colour cast and a photo of a bezel, and that is what the model will copy.

Three things make a screenshot usable as a reference:

1. **A large character.** A full-body figure standing in the middle of a wide street carries an outfit and a silhouette; a small figure at the edge of the frame carries almost nothing.
2. **A visible face.** A still where the character is turned away keeps the gear and the hair, and the face is designed by the model — usually not the face you wanted.
3. **Even light.** Backlit or deep-shadow stills come out with the lighting of the screenshot baked into the composition, which then fights your own photo's light.

## 2. Pick the pose, then stop touching it

The workflow takes four fixed poses — shaking hands, side by side, hugging, back to back — and each one is a server-side instruction. There is no prompt to write, and that is the point: the pose is the only decision, so a run that looks wrong is answered by a different pose or a different screenshot, not by rewriting a sentence.

For a game-poster feel, **side by side** or **back to back** reads best. The square frame suits a post; the portrait frame suits a wallpaper.

![The duo-portrait tool with our own two references and the free sample result](assets/tool-page-en.jpg)

*Figure 1. The tool on this site: the two references on the left, the single returned picture on the right. This is the free sample, run on our own photos — not a GTA VI screenshot.*

## 3. Check the picture before you post it

Do this at full size, next to both references, and in this order:

- **Your face** against your photo: features, hairline, the clothes you were wearing.
- **The character** against your screenshot: hair colour, outfit, gear, any signature prop.
- **The hands, and the join** between the two bodies. This is the first place a composite gives itself away.
- **The light.** One source, one direction of shadow, both figures lit the same way.

If one of those fails, run again rather than editing around it. One pose per run, one credit per picture, and the same pair of references can legitimately return two different results — the channel does not honour a seed, so a second run is a normal move, not a retry of a bug.

## 4. What it cannot do

It does not reproduce an exact character design on demand, and it does not keep a character consistent across several pictures. Faces drift, small props change, and the scale between the two figures is composed rather than measured. If you need the same character in three frames of a story, this workflow does not do that yet.

## 5. Where the fan-made line is

- The right to a character belongs to whoever owns it. Posting your own fan picture is one thing; selling a picture built around someone else's character is another, and this workflow grants nothing there.
- This site uses no official artwork, cover or logo, and does not claim any relationship with Rockstar Games, Take-Two Interactive or NVIDIA.
- If you are a rights holder and want something removed, ask and it comes down.

## Try it

- [The GTA VI page for this workflow](https://www.dlss5nvidia.com/gta6-character-photo) — what you have, and why a console screenshot is enough.
- [Run the free sample first](https://www.dlss5nvidia.com/dashboard?tool=together&sample=together) — our own two references, run once on the server, no account and no credits.
- [The duo-portrait tool itself](https://www.dlss5nvidia.com/game-character-together) — the poses, the frames and the limits in full.

*Grand Theft Auto, GTA and the names of its characters are trademarks of Take-Two Interactive Software and its subsidiaries. NVIDIA and DLSS are trademarks of NVIDIA Corporation. This site is independent and is not affiliated with or endorsed by either company.*`,
  content_cn: `GTA6 已经在 **2026 年 11 月 19 日**于 **PS5 和 Xbox Series X|S** 上线。本文核对时（2026 年 11 月 23 日）还没有 PC 版公布，所以几乎每个玩家手里的画面都是同一种东西：**主机截图**。

而这正好是「两张参考图」这条流程要的输入。你站到露西亚、杰森或里昂尼达任何一个角色旁边的那张图，离你只有两次上传——一张主机截图，一张你自己的照片。这篇不发感想，只讲怎么得到一张你自己愿意发出去的图：这类尝试失败，多数时候败在输入，不在模型。

## 先说结论

- **需要两张图**：一张脸清楚、光线均匀的自拍，一张角色占画面大、正脸朝向镜头的游戏截图。
- **把 HUD 关掉**。带任务标记、罗盘和字幕的截图，给模型的是杂物，不是信息。
- **输出按同人素材看待**。它是生成的合成图，不是游戏功能，角色的著作权属于原权利人。
- **发之前核两张脸、手和两人相接的位置**。合成图露馅，一般都在这几处。

## 1. 截图要导对

两台主机都能把截图存到手机或 U 盘。请在主机的媒体库里导出，不要拿手机对着电视拍——手机拍屏幕会带上一层色偏、边框和反光，而模型会把这些一起学过去。

一张能用的截图有三个条件：

1. **角色够大。** 站在街心、占掉画面三分之一的那个人物，能带出整套服装和轮廓；缩在画面角落的路人，什么也带不过去。
2. **看得到脸。** 背对镜头的截图会保住装备和发型，脸则交给模型自己设计——通常不是你想要的另一张脸。
3. **光匀。** 逆光、深阴影的截图会把那个光线写进构图，然后跟你自己照片的光打架。

## 2. 选姿势，然后不要再改

这条流程有四个写死的姿势：握手、并肩、拥抱、背靠背。每个姿势都是服务端的一条固定指令，你不需要写提示词——这也是重点：姿势是唯一要做的决定，所以一张图不对劲时，换姿势或换截图，而不是去改一句话。

想要游戏海报的感觉，**并肩**和**背靠背**最稳。方图发帖，竖图当壁纸。

![本站合影工具：左边是两张参考图，右边是跑出来的那一张](assets/tool-page-zh.jpg)

*图 1：本条流程的工具界面。右侧是免费示例的输出，用我们自己的两张照片跑的——不是 GTA6 的游戏截图。*

## 3. 发之前，按这个顺序核一遍

放在原尺寸下、两张参考图旁边看：

- **你自己的脸**：五官、发际线、当时穿的衣服。
- **角色**：发色、服装、装备、标志性的道具。
- **手，以及两个身体相接的位置**。合成图最先在这里露馅。
- **光**：一个光源、一个方向的影子，两个人被同一束光照着。

有一项不对，就重跑一次，别在图上修。一次一个姿势、一张图、1 额度；同一对参考图跑两次，本来就可能给你两张不同的结果——渠道不认 seed，所以第二次跑是正常操作，不是重试 bug。

## 4. 它做不到的部分

它不能按需复刻某个角色的精确造型，也不能让同一个角色在多张图之间保持一致。脸会漂，小道具会变，两个人之间的比例是构图出来的，不是量出来的。要做一个角色的连续三格剧情，现在这条流程还做不到。

## 5. 同人的边界

- 角色的著作权属于原权利人。发一张自己的同人图是一件事；把别人的角色做成图去售卖是另一件事，这条流程不授予后者任何许可。
- 本站不使用官方原画、封面或标志，也不声称与 Rockstar Games、Take-Two Interactive 或 NVIDIA 有任何关系。
- 如果你是权利人、希望撤下什么，写信给我们，我们会撤。

## 去试一下

- [这条流程的 GTA6 专页](https://www.dlss5nvidia.com/zh/gta6-character-photo)：你手里有什么，为什么主机截图就够。
- [先跑免费示例](https://www.dlss5nvidia.com/dashboard?tool=together&sample=together)：我们自己的两张参考图，服务端跑一次，不用账号、不扣额度。
- [合影工具本体](https://www.dlss5nvidia.com/zh/game-character-together)：四个姿势、三种画幅和全部限制。

*Grand Theft Auto、GTA 及其角色名称是 Take-Two Interactive Software 及其子公司的商标。NVIDIA 与 DLSS 是 NVIDIA Corporation 的商标。本站独立运营，与上述公司均无隶属关系，也未获其背书。*`,
};
