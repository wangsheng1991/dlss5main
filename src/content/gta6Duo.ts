import { SITE_URL } from '../config/site';

/**
 * The GTA VI campaign page (`/gta6-character-photo`, `/zh/gta6-character-photo`).
 *
 * It exists for one moment: GTA VI shipped on 19 November 2026 for PlayStation 5 and Xbox Series X|S,
 * so the stills most players own are console screenshots — that is exactly the input the duo-portrait
 * workflow takes. The page sells that one job, and it says plainly what the picture is not: not a
 * game feature, not an official picture, and not endorsed by anyone who owns the character.
 *
 * Copy rules kept here on purpose: no sales figures, no "official", and the platform/date facts are
 * the only external claims — both checked on 23 November 2026 and named in the sources below.
 */

type Step = { name: string; text: string };

export const GTA6_DUO = {
  path: '/gta6-character-photo',
  zhPath: '/zh/gta6-character-photo',
  checkedDate: '2026-11-23',
  image: '/examples/together/promo-side.webp',
  imageAlt_en: 'A real duo-portrait run of this workflow: a person and a game character standing side by side in one frame',
  imageAlt_cn: '这条流程的一次真实输出：一个人和一个游戏角色并肩站在同一个画面里',
  imageCaption_en: 'One real run of this workflow on our own two references — not a GTA VI screenshot, and not a still from any game.',
  imageCaption_cn: '这条流程用我们自己的两张参考图实际跑出来的一次结果：不是 GTA6 的游戏截图，也不是任何一款游戏的画面。',
  sources: [
    { label: 'Rockstar Games — Grand Theft Auto VI', url: 'https://www.rockstargames.com/VI' },
    { label: 'Grand Theft Auto VI — release and platforms (Wikipedia, checked 23 November 2026)', url: 'https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI' },
  ],
  en: {
    language: 'en-US' as const,
    title: 'GTA 6 Character Photo: Put Yourself in the Shot (Fan-Made)',
    description: 'GTA VI shipped on PlayStation 5 and Xbox Series X|S on 19 November 2026, so the still you have is a console screenshot — and that is all this needs. Upload it with a photo of yourself, pick a pose, get one picture. Free sample first.',
    keywords: ['gta 6 character photo', 'gta 6 photo with character', 'photo with gta 6 character', 'gta vi duo portrait', 'gta 6 fan photo with me', 'game character photo composite'],
    eyebrow: 'Fan-made duo portrait',
    heading: 'Your Photo, Standing Next to a GTA VI Character',
    lead: 'GTA VI is out on PlayStation 5 and Xbox Series X|S. There is no announced PC version, so the still you can get of Lucia, Jason or anyone else in Leonida is a console screenshot — and a screenshot is exactly the input this workflow takes. Two pictures in, one picture out: you and the character in the same frame, in a pose you choose.',
    statusHeading: 'What you have, and why it is enough',
    status: [
      'The game shipped on 19 November 2026 for PlayStation 5 and Xbox Series X|S. A PC release had not been announced at the time we checked (23 November 2026), so most players only have the stills their console can export.',
      'Both consoles can save a screenshot to a phone or a USB drive. That file is a normal image, which means it can be handed to a model as a reference — no capture card, no PC, no mod.',
      'The workflow reads the character still for build, outfit and props. A still where the character is large, evenly lit and facing the camera carries the most of it.',
    ],
    stepsHeading: 'How the picture is made',
    steps: [
      { name: 'Export the still from your console', text: 'Open the screenshot on the console, hide the share overlay, and move it to your phone or a USB drive. A still without the HUD reads better than one with mission markers on it.' },
      { name: 'Upload two photos', text: 'Your own photo first, the character still second. The order is the meaning: the left figure is you, the right one is the character.' },
      { name: 'Choose how you meet', text: 'Shaking hands, standing side by side, hugging, or back to back. Each pose is a fixed server-side recipe, so there is no prompt to write and no wording to get wrong.' },
      { name: 'Check it before you post it', text: 'Compare both faces, the hands and the join between the two bodies with the references at full size. Run another pose rather than posting one you are unsure about.' },
    ],
    checksHeading: 'What to look at in the result',
    checks: [
      'Your own face against your photo: features, hairline, the clothes you were wearing.',
      'The character against your screenshot: hair colour, outfit, gear, any signature prop.',
      'The hands, and the place where the two bodies meet — that is where a composite usually shows.',
      'The light: one source, one direction of shadow, both figures lit the same way.',
    ],
    limitsHeading: 'What it will not do',
    limits: [
      'It is a generated composite, so faces drift. Hair, expression, small props and scale can all differ from both references.',
      'One pose per run, one picture per credit, a 1024 px long edge. Running the same pair twice can return two different pictures — the channel does not honour a seed.',
      'It does not reproduce an exact character design on demand. The character stays the property of its rights holder, and the picture you get is fan material.',
      'If the two references have very different lighting or the character is turned away, expect less of the character to come through.',
    ],
    fanHeading: 'The fan-made line this page stays on',
    fan: [
      'No official artwork, cover or logo is used here, and no still from the game is published on this page. The demo picture was made from our own references.',
      'We do not sell a product named after the game, and we do not claim any relationship with Rockstar Games, Take-Two Interactive or NVIDIA. This page is not affiliated with them.',
      'The copyright in a character belongs to whoever owns it. Treat the output as fan material: it is fine to post your own, and it is not a licence to sell a character you did not create.',
      'If you are the rights holder and want something here taken down, write to us and it comes down.',
    ],
    sampleHeading: 'Run the free sample first',
    sampleLead: 'The sample runs the same workflow on our own two reference photos, once, on the server — so it costs nothing and needs no account. Look at what a real run returns before you spend a credit on your own pair.',
    cta: 'Make the picture',
    ctaNote: 'Two images required · you first, the character second · 15–30 seconds · 1 credit per run · 1024 px long edge',
    sampleRun: 'Run the free sample',
    faqHeading: 'Questions people ask',
    relatedHeading: 'Related',
    related: [
      { path: '/game-character-together', label: 'The duo-portrait tool this page uses (English)' },
      { path: '/zh/game-character-together', label: '合影工具（中文）' },
      { path: '/game-character-style', label: 'Style conversion for a game frame' },
      { path: '/before-after', label: 'Before-and-after evidence with run records' },
    ],
    trademarkNote: 'Grand Theft Auto, GTA and the names of its characters are trademarks of Take-Two Interactive Software and its subsidiaries. NVIDIA and DLSS are trademarks of NVIDIA Corporation. This site is independent and unaffiliated with either.',
  },
  zh: {
    language: 'zh-CN' as const,
    title: '和 GTA6 角色合一张影：用你自己的主机截图（同人图）',
    description: 'GTA6 已于 2026 年 11 月 19 日在 PS5 与 Xbox Series X|S 上线，所以你手里能有的就是主机截图——这刚好是这条流程要的输入。截图上角色 + 一张你自己的照片，选个姿势，得到一张同框图。示例免费先跑。',
    keywords: ['和gta6角色合影', 'gta6 合影', 'gta6 角色合照', '和自己的照片合成一张', '游戏角色合影', '同人图 生成'],
    eyebrow: '同人双人合影',
    heading: '把你的照片，站到 GTA6 的画面里',
    lead: 'GTA6 已经在 PS5 和 Xbox Series X|S 上线。PC 版还没有公布，所以你手里的露西亚、杰森或者里昂尼达任何一个角色的画面，都来自主机截图——而截图正是这条流程要的输入。两张图进去，一张出来：你和角色站在同一个画面里，姿势由你选。',
    statusHeading: '你手里有什么，为什么够用',
    status: [
      '游戏于 2026 年 11 月 19 日在 PS5 与 Xbox Series X|S 上线。我们核对时（2026 年 11 月 23 日）尚无 PC 版公布，因此大多数玩家手里的画面就是主机导出的截图。',
      '两台主机都能把截图存到手机或 U 盘。存出来就是一张普通的图片，可以当参考图交给模型——不需要采集卡、不需要电脑、不需要打模组。',
      '这条流程从角色截图里读的是身形、服装和道具。角色占画面大、光打得匀、正脸朝向镜头的那一张，能带过来的信息最多。',
    ],
    stepsHeading: '这张图怎么做出来',
    steps: [
      { name: '先把截图导出到手机', text: '在主机上打开截图，关掉分享面板，再存到手机或 U 盘。没有 HUD、没有任务标记的那一张，出来会干净很多。' },
      { name: '上传两张照片', text: '先上传你自己的照片，再上传角色截图。顺序就是含义：左边是你，右边是角色。' },
      { name: '选你们怎么见', text: '握手、并肩、拥抱，或者背靠背。四个姿势都是服务端写死的配方，你不用写提示词，也没有措辞可以写错。' },
      { name: '发之前先核对', text: '把两张脸、手、以及两个人相接的位置按原尺寸比一遍。不满意就换个姿势重跑，别发一张自己都不确定的图。' },
    ],
    checksHeading: '出来后核这四项',
    checks: [
      '和你自己的照片比脸：五官、发际线、当时穿的衣服。',
      '和你导出的截图比角色：发色、服装、装备、标志性的道具。',
      '看手，以及两个身体相接的位置——合成图最容易在这里露馅。',
      '看光：一个光源、一个方向的影子，两个人被同一束光照着。',
    ],
    limitsHeading: '它做不到的部分',
    limits: [
      '它是生成的合成图，脸会漂。头发、表情、小道具和比例都可能与两张参考图不同。',
      '一次只出一个姿势、一张图、1 额度，长边 1024 px。同一对参考图跑两次，可能给你两张不同的图——渠道不认 seed。',
      '它不能按需复刻某个角色的精确造型。角色的著作权属于原权利人，你得到的图按同人素材看待。',
      '两张参考图的光线差得太多，或者角色是背对镜头的，能带过来的部分就会更少。',
    ],
    fanHeading: '这条同人的边界',
    fan: [
      '本页不使用官方原画、封面或标志，也不发布任何游戏内截图。页面上这张演示图是用我们自己的两张参考图跑出来的。',
      '我们不以游戏的名字命名售卖的产品，也不声称与 Rockstar Games、Take-Two Interactive 或 NVIDIA 有任何关系。本页与它们无关。',
      '角色的著作权属于原权利人。输出按同人素材看待：发自己那张没问题，但它不是「可以卖别人角色的授权」。',
      '如果你是权利人，希望这里撤下什么，写信给我们，我们会撤。',
    ],
    sampleHeading: '先跑一次免费示例',
    sampleLead: '示例用我们自己的两张参考照片在服务端跑一次同一条流程，不用登录也不扣额度。先看看真实的一次输出长什么样，再决定要不要为你们俩花一个额度。',
    cta: '去做这张图',
    ctaNote: '需要两张图 · 你在前、角色在后 · 15–30 秒 · 每次 1 额度 · 长边 1024 px',
    sampleRun: '运行免费示例',
    faqHeading: '常见问题',
    relatedHeading: '相关页面',
    related: [
      { path: '/zh/game-character-together', label: '这条流程用的合影工具（中文页）' },
      { path: '/game-character-together', label: 'The duo-portrait tool (English)' },
      { path: '/game-character-style', label: '游戏画面的风格转换' },
      { path: '/before-after', label: '带运行记录的前后对照' },
    ],
    trademarkNote: 'Grand Theft Auto、GTA 及其角色名称是 Take-Two Interactive Software 及其子公司的商标。NVIDIA 与 DLSS 是 NVIDIA Corporation 的商标。本站独立运营，与上述公司均无隶属关系。',
  },
  faqs: {
    en: [
      ['Is this an official GTA VI or Rockstar feature?', 'No. It is an independent generative composite built with a general image model on our own service. It is not a game feature, not endorsed by Rockstar Games or Take-Two, and not connected to NVIDIA.'],
      ['I only have a PlayStation or Xbox screenshot. Is that good enough?', 'Yes — that is the intended input. Export the still without the HUD and upload it as the character reference. A screenshot is a normal image file, so nothing else is needed.'],
      ['Will the character look exactly right?', 'The design usually carries over as a direction rather than a guarantee. Outfit, hair colour, gear and props can drift, and faces the model cannot see in the still are invented. Check the result before you post it.'],
      ['Can I use this picture commercially?', 'Treat it as fan material. We sell the run, not the character, and the copyright in the character belongs to its owner. Selling a picture that is built around someone else\'s character is a decision for you and a lawyer, not something this page grants.'],
      ['Why only one pose per picture?', 'Each pose is its own server-side instruction and the model composes the frame for that pose. Asking for two poses in one picture produces a crowded, inconsistent result, so the tool keeps one pose and one credit per picture.'],
      ['What does a run cost?', 'One credit per picture, and the free sample on this page costs nothing and needs no account. The dashboard shows the balance before you submit.'],
    ],
    zh: [
      ['这是 GTA6 或 Rockstar 的官方功能吗？', '不是。它是在我们自己的服务上，用通用图像模型做出来的独立合成图。它不是游戏功能，没有 Rockstar Games、Take-Two 的背书，也与 NVIDIA 无关。'],
      ['我只有 PS5 或 Xbox 的截图，够吗？', '够，这就是这条流程设计的输入。把没有 HUD 的那张截图导出来当角色参考图即可。截图就是普通图片文件，不需要别的东西。'],
      ['角色会做得和原作完全一致吗？', '造型通常作为一个方向被带过来，而不是保证。服装、发色、装备和道具会漂，截图里看不到的脸由模型自己设计。发之前自己核一遍。'],
      ['这张图能商用吗？', '按同人素材看待。我们卖的是这一次生成，不是角色本身；角色的著作权属于原权利人。把一个别人的角色做成图片去售卖，那是你与律师之间要决定的事，本页不授予这种许可。'],
      ['为什么一次只能出一个姿势？', '每个姿势都是一条独立的服务端指令，模型会按那条指令重新构图。一张图里塞两个姿势会得到拥挤又不一致的画面，所以工具固定一个姿势、一个额度。'],
      ['跑一次多少钱？', '一张图 1 额度；本页的免费示例不扣额度、也不需要账号。提交前，面板上会显示余额。'],
    ],
  },
} as const;

export type Gta6DuoLocale = 'en' | 'zh';

export const gta6DuoPath = (locale: Gta6DuoLocale) => (locale === 'zh' ? GTA6_DUO.zhPath : GTA6_DUO.path);

/** WebPage + BreadcrumbList + FAQPage in one @graph, the shape the page gate reads. */
export function gta6DuoSchema(locale: Gta6DuoLocale, baseUrl = SITE_URL) {
  const copy = GTA6_DUO[locale];
  const url = `${baseUrl}${gta6DuoPath(locale)}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: copy.title,
        description: copy.description,
        inLanguage: copy.language,
        dateModified: GTA6_DUO.checkedDate,
        isPartOf: { '@type': 'WebSite', name: 'DLSS5NVIDIA', url: baseUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: locale === 'zh' ? '首页' : 'Home', item: `${baseUrl}${locale === 'zh' ? '/zh' : '/'}` },
          { '@type': 'ListItem', position: 2, name: copy.heading, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: GTA6_DUO.faqs[locale].map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
