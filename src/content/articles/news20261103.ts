import type { Article } from './types';

/**
 * Written 2026-11-03 from three items that were circulating the same week and were all called
 * "DLSS 5": one real unannounced release, one community mod, one Reddit demonstration.
 * Every borrowed claim names its outlet and date. Nothing here was benchmarked by us.
 */
export const NEWS_20261103: Article[] = [
  {
    slug: 'three-dlss-5-screenshots-one-release-2026-11',
    title_en: 'Three DLSS 5 screenshots went around this week. Only one of them was a release.',
    title_cn: '这周流传的三张「DLSS 5 截图」，只有一张是真的上线',
    tags: ['dlss 5', 'dlss 5 metro 2033 redux', 'phantom blade zero dlss 5 mod', 'dlss 5 mod', 'neural rendering'],
    target_keywords_en: [
      'dlss 5 metro 2033 redux', 'phantom blade zero dlss 5 mod', 'dlss 5 screenshot',
      'metro exodus dlss 5', 'dlss 5 neural rendering games',
    ],
    target_keywords_cn: [
      '影之刃零 DLSS 5 截图', '地铁2033 DLSS 5', 'DLSS 5 mod', 'DLSS 5 神经渲染 游戏', 'DLSS 5 截图',
    ],
    priority: 'P1',
    type: 'News check + how to read a screenshot claim',
    lastUpdated: 'November 2026',
    readTime: '7 min read',
    description_en: 'Metro 2033 Redux shipped DLSS 5 without an announcement, Phantom Blade Zero got it as a mod within 24 hours, and a Metro Exodus thread was labelled DLSS 5. How to tell the three apart from one screenshot.',
    description_cn: '地铁2033 Redux 悄悄上线了 DLSS 5，影之刃零上线 24 小时就被 mod 打通，另一条地铁增强版的帖子被贴上了 DLSS 5 标签。三张图怎么分清。',
    datePublished: '2026-11-03',
    sources: [
      { label: 'VideoCardz (2026-10-23): Metro 2033 Redux becomes the second official game with DLSS 5', url: 'https://videocardz.com/newz/metro-2033-redux-becomes-the-second-official-game-with-dlss-5' },
      { label: 'VideoCardz (2026-10-31): Phantom Blade Zero gets an unofficial DLSS 5 mod less than 24 hours after launch', url: 'https://videocardz.com/' },
      { label: 'GameGPU (2026-11-02): Metro Exodus Enhanced Edition showcases DLSS 5 capabilities at ultra settings', url: 'https://en.gamegpu.com/news/igry/metro-exodus-enhanced-edition-demonstriruet-vozmozhnosti-dlss-5-na-ultra-nastrojkakh' },
      { label: 'NVIDIA GeForce (2026-10-13): DLSS 5 comes to Hogwarts Legacy and RTX Spark, with the RTX Remix date in the article body', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-faster-ai-model-hogwarts-legacy-rtx-spark-laptops/' },
      { label: 'NVIDIA GeForce (2026-10-28): Phantom Blade Zero launches with path tracing and DLSS 4.5', url: 'https://www.nvidia.com/en-us/geforce/news/phantom-blade-zero-path-tracing-dlss-4-5-ray-reconstruction/' },
      { label: 'Our RTX Remix guide, re-checked the same day', url: 'https://www.dlss5nvidia.com/guides/rtx-remix-dlss-5' },
      { label: 'Our Phantom Blade Zero page, with the launch build and the mod kept apart', url: 'https://www.dlss5nvidia.com/games/phantom-blade-zero' },
    ],
    content_en: `Three images circulated this week and all three were called DLSS 5. One of them is a released feature, one is a community mod, and one is a Reddit thread someone labelled. The difference is not academic: only the first one tells you anything about what NVIDIA ships.

## The real one: Metro 2033 Redux, October 22

Metro 2033 Redux received native DLSS 5 Neural Rendering through its Next-Gen Update on 2026-10-22, which makes it the second game to carry the technology after NBA 2K27. VideoCardz reported it on 2026-10-23 and recorded the details that make the claim checkable: the game's DLSS 5 DLL matches the version used in NBA 2K27, the graphics settings gained a DLSS-NR (Neural Rendering) option, and the same update reportedly brings Neural Rendering to Metro: Last Light Redux as well. GeForce RTX 50 Series and RTX Spark are the named hardware scope. The update is free for existing owners on Steam, Epic Games Store and GOG, with console and Windows Store versions dated 2026-10-29.

The part worth repeating is what did not happen. 4A Games did not mention DLSS 5 in its patch notes, and NVIDIA's own rollout article never names Metro 2033 Redux. So the honest sentence is: this build appears to ship DLSS 5, and nobody at the vendor or the studio said so in public copy. That is different from "NVIDIA announced Metro 2033 Redux", and different again from "Metro Exodus got DLSS 5".

VideoCardz also records early player reports of a substantial performance cost when Neural Rendering is on. We have not run the game and we publish no frame figures.

## The mod: Phantom Blade Zero, October 28

Phantom Blade Zero launched on 2026-10-28 with a documented DLSS 4.5 suite plus ray tracing and PC path tracing. NVIDIA's launch post for the title never presents it as a DLSS 5 game, and VideoCardz reported on 2026-10-31 that the game does not include DLSS 5 Neural Rendering — while also reporting that a community package appeared less than 24 hours after launch, redirecting the game's existing DLSS calls through a DXGI proxy.

Chinese-language coverage of the same days is a useful warning label. On 2026-10-30, QQ News ran a headline reading "Phantom Blade Zero DLSS 5 screenshots — next-generation effect fully upgraded", 3DM the same day wrote about a "DLSS 5 mod that improves lighting but adds performance cost", and 驱动之家 followed on 2026-11-02 with "a DLSS 5 patch on launch day that force-enables it on 40 and 50 series cards". Every one of those describes the mod; the screenshot in the first headline is real, but what it shows is a redirected library, not an integration the developer shipped.

If a headline about this title says DLSS 5 and does not say mod, assume mod until you see the patch notes.

## The thread: Metro Exodus Enhanced Edition, November 2

GameGPU reported on 2026-11-02 on a Reddit thread in r/DLSS, started by a user demonstrating Metro Exodus Enhanced Edition at 3440x1440 on ultra settings. Read the piece closely and the evidence is a person's own recording plus a discussion in the comments about naming and about the future of upscalers. There are no patch notes, no vendor statement, and no version detail of the kind that settled the Metro 2033 Redux case.

NVIDIA has never listed Metro Exodus Enhanced Edition in a DLSS 5 rollout article. Whatever that build was doing, the responsible reading is a screenshot of a running configuration, not a feature the game documents. It is the same shape of claim as the Phantom Blade Zero headline and it should get the same treatment.

## RTX Remix: the date is now vendor-confirmed

We had recorded the RTX Remix 1.6 release in October as press reports only, because we could not match the version to NVIDIA's own copy. That gap is now closed for the date, though not for the version: NVIDIA's 2026-10-13 article body states that "October 23rd sees the addition of DLSS 5 to RTX Remix". That is the vendor confirming the date and the addition in its own words. The "1.6" version number and the 6X Multi Frame Generation detail still come from Wccftech (2026-10-23) and TweakTown (2026-10-25), not from NVIDIA.

Our RTX Remix guide has been updated to say exactly that, and its status for individual games stays "announced" — a platform update is not a compatibility list.

## Five checks that settle a "DLSS 5 screenshot"

1. **Which DLL.** A Neural Rendering library whose version matches a known shipped build is stronger evidence than any menu photo. This is what made the Metro 2033 Redux report checkable.
2. **A settings entry.** DLSS-NR appearing as its own option, reproduced by more than one player, is the next best signal.
3. **The patch notes.** Did the developer say it? For Metro 2033 Redux, no. Silence does not disprove the DLL, but it does mean the claim rests on players.
4. **The vendor list.** Does NVIDIA's rollout article name the game? For Metro Exodus Enhanced Edition, no.
5. **The hardware.** RTX 50 Series and RTX Spark are the named scope. A frame rendered on another card needs its own explanation, not a caption.

None of these five is a benchmark. A screenshot can show that a feature is present and still tell you nothing about image quality, stability or frame cost.

## Where our game table stands

Our DLSS 5 status table follows vendor article bodies only, on purpose: a news excerpt, a preview demonstration or an elapsed planned date does not turn into a release row. That rule is why Metro 2033 Redux is not in the table this week even though we find the VideoCardz report credible, and why Metro Exodus Enhanced Edition is nowhere near it. The table answers "what has the vendor confirmed", and an article like this one is where the player-side evidence lives.

## Where our own tool sits

If what you actually want is to see how a different lighting and material direction reads on your own frame, our style conversion produces a visual reference from an image you own. It does not run, benchmark or imitate NVIDIA's rendering runtime, it cannot tell you what a game will look like in motion, and it does not make a claim about frame cost. For frames you are allowed to use, that is the honest scope: a redraw you can inspect, next to the source you supplied.

## Boundaries and independence

This article records what three outlets published on three dates and one line from NVIDIA's own article. We did not install DLSS 5, we did not run Metro 2033 Redux, Phantom Blade Zero or Metro Exodus Enhanced Edition, and we publish no frame-rate figures. No third-party screenshot or artwork is reproduced here. We operate the linked site and are independent of NVIDIA, 4A Games, S-GAME and the mod authors named by the outlets above.`,
    content_cn: `这周有三张图在传，三张都被叫作 DLSS 5。一张是真的已上线功能，一张是社区 mod，还有一张只是有人在论坛帖子里贴的标签。这个区别并不学术：只有第一张能告诉你 NVIDIA 到底发了什么。

## 真的那一张：地铁2033 Redux，10 月 22 日

《地铁2033 Redux》在 2026-10-22 的 Next-Gen 更新中获得了原生 DLSS 5 神经渲染，成为继 NBA 2K27 之后第二款带这项技术的游戏。VideoCardz 在 2026-10-23 报道了这件事，并给出了可以用来核对的细节：游戏的 DLSS 5 DLL 与 NBA 2K27 用的是同一版本，画面设置里新增了 DLSS-NR（神经渲染）选项，同一更新据报也让《地铁：最后的曙光 Redux》获得神经渲染。官方点名的硬件范围是 GeForce RTX 50 系列与 RTX Spark。更新对 Steam、Epic 与 GOG 的老玩家免费，主机版和 Windows 商店版定在 2026-10-29。

更值得重复的是没发生的那部分。4A Games 的补丁说明没有提 DLSS 5，NVIDIA 自己的推广文章也从未点名《地铁2033 Redux》。所以诚实的一句话是：这个版本看起来已经带了 DLSS 5，但厂商和工作室的公开文案都没有这么说。这和「NVIDIA 宣布了地铁2033 Redux」不是一回事，和「地铁离乡有了 DLSS 5」更不是一回事。

VideoCardz 同时记录，早期玩家反馈开启神经渲染后有明显的性能开销。我们没有运行这款游戏，本文不出任何帧数。

## 是 mod 的那一张：影之刃零，10 月 28 日

《影之刃零》于 2026-10-28 上线，官方文档写明它带 DLSS 4.5 全套、光线追踪与 PC 路径追踪。NVIDIA 为本作发的上线文章从未把它称作 DLSS 5 游戏；VideoCardz 在 2026-10-31 报道本作不含 DLSS 5 神经渲染，同时也报道：上线不到 24 小时就出现了社区包，通过 DXGI 代理把游戏原有的 DLSS 调用重定向。

同几天的中文报道正好是一张警示牌。2026-10-30，QQ 新闻的标题是《〈影之刃零〉DLSS 5 截图！次世代效果全面升级》；同一天 3DM 写的是「DLSS5 模组改善光影 但增加性能开销」；驱动之家在 2026-11-02 写的是「首发即迎大力水手5补丁：支持 40/50 系显卡强开」。这三条说的都是那个 mod：第一张截图是真的，但它展示的是被重定向的库，不是开发方发布的功能。

看到这款游戏的标题里有 DLSS 5 却没写 mod，请先按 mod 理解，直到看见补丁说明为止。

## 只是帖子的那一张：地铁离乡 增强版，11 月 2 日

GameGPU 在 2026-11-02 报道了 r/DLSS 版块的一个帖子：一位用户在 3440×1440、极高画质下演示《地铁离乡 增强版》。细读那篇报道，证据就是这个人自己的录屏加上评论区的讨论——讨论命名、讨论超分技术的走向。那里没有补丁说明，没有厂商表态，也没有像地铁2033 Redux 那样能定位版本的细节。

NVIDIA 从未把《地铁离乡 增强版》列进任何一份 DLSS 5 推广名单。不管那个版本在跑什么，负责任的读法是「一张显示某种运行配置的截图」，而不是游戏文档里的功能。它和影之刃零那条标题是同一种形状的说法，也该用同一种方式对待。

## RTX Remix：日期现在有厂商口径了

十月那次 RTX Remix 1.6，我们此前只记成媒体口径，因为没能把版本号对到 NVIDIA 自己的文案上。这个缺口现在补上了日期，但没补版本号：NVIDIA 2026-10-13 那篇文章的正文写着「October 23rd sees the addition of DLSS 5 to RTX Remix」。日期和「加入 DLSS 5」这件事是厂商用自己的话确认的；「1.6」这个版本号以及 6X 多帧生成的细节，仍然来自 Wccftech（2026-10-23）与 TweakTown（2026-10-25），不是 NVIDIA 说的。

我们的 RTX Remix 指南页已经按这个口径更新；单款游戏的状态仍然留在「已宣布」——平台更新不是兼容性清单。

## 五个动作，判断一张「DLSS 5 截图」

1. **看 DLL。** 神经渲染库的版本能和已知的已发版本对上，比任何设置菜单照片都有力。地铁2033 Redux 那条报道之所以可核对，就靠这一条。
2. **看设置项。** DLSS-NR 作为独立选项出现，并且不止一个人复现。
3. **看补丁说明。** 开发方说了没有？地铁2033 Redux 没说。沉默不能推翻 DLL，但意味着这个说法来自玩家一侧。
4. **看厂商名单。** NVIDIA 的推广文章点没点这款游戏？地铁离乡 增强版没有被点名。
5. **看硬件。** 点名范围是 RTX 50 系列与 RTX Spark；在别的卡上跑出来的画面需要自己的解释，而不是一句图注。

这五条都不是跑分。截图能证明功能在场，仍然说明不了画质、稳定性或性能开销。

## 我们的游戏状态表怎么站

我们的 DLSS 5 状态表只看厂商文章正文，这是刻意的：新闻摘要、预览演示、已经过去的计划日期，都不会变成一行「已上线」。这条规矩正是为什么本周《地铁2033 Redux》没有进表——尽管我们认为 VideoCardz 的报道可信——以及为什么《地铁离乡 增强版》离那张表更远。那张表回答「厂商确认了什么」，而玩家一侧的证据，应该像本文这样单独记录。

## 我们自己的工具在哪一段

如果你真正想要的是「我自己这张画面换一种光照和材质会怎样」，我们的风格转换会基于你拥有的图片给出一张视觉参考。它不运行、不评测、也不模仿 NVIDIA 的渲染运行时；它不能告诉你游戏动起来是什么样，也不对性能开销作任何声明。在你有权使用的画面上，这就是诚实的边界：一张可以对照原图检查的重绘。

## 边界与独立性

本文记录的是三家媒体在三个日期发布的内容，以及 NVIDIA 那篇文章里的一句话。我们没有安装 DLSS 5，没有运行《地铁2033 Redux》《影之刃零》或《地铁离乡 增强版》，也不发布任何帧率数字。本文没有转载第三方截图或美术素材。本站运营所链接的产品页面，与 NVIDIA、4A Games、S-GAME 及上文媒体提到的 mod 作者均无隶属关系。`,
  },
];
