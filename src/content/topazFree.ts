import { SUPPORT_EMAIL } from '../config/site';

/**
 * The pre-announcement for the free Topaz-shaped window, and its email list.
 *
 * Written to the same rule the 2026-11-12 announcement follows: every lane carries a status you can
 * check by opening its page. The one thing this page deliberately does not carry is a number — the
 * free allowance, the open date and any comparison against Topaz are published when they exist, not
 * before, and the page says so in its own copy.
 */

const LANES = [
  {
    name_en: 'Image upscaling',
    name_cn: '图片放大',
    detail_en: '2× and 4× targets, 1536 px per edge, 1 credit per task. A 320 × 213 input → 1280 × 848 in 21.5 s.',
    detail_cn: '2× 与 4× 目标，每边 1536 像素上限，一次任务 1 额度。320 × 213 的输入 → 1280 × 848，21.5 秒。',
    status: 'live' as const,
    href: '/image-upscaler',
  },
  {
    name_en: 'Detail restoration',
    name_cn: '细节还原',
    detail_en: 'Same input, clearer, same size — 14.2 s for that file. The unblur and old-photo pages run this same lane.',
    detail_cn: '同一张输入，变清楚，尺寸不变——同一个文件 14.2 秒。去模糊页和老照片页跑的就是这条线。',
    status: 'live' as const,
    href: '/image-quality-enhancer',
  },
  {
    name_en: 'Portrait retouching',
    name_cn: '人像修图',
    detail_en: 'Skin and face refinement on the same studio, with the untouched original kept beside the result.',
    detail_cn: '皮肤与五官的收敛，和原图留在同一处，方便你自己比。',
    status: 'live' as const,
    href: '/portrait-retouch',
  },
  {
    name_en: 'Cutout and object erase',
    name_cn: '抠图与物体擦除',
    detail_en: 'A cutout with an alpha channel, and an erased object with the background rebuilt.',
    detail_cn: '带透明通道的抠图，以及擦掉物体后重建背景。',
    status: 'live' as const,
    href: '/remove-background',
  },
  {
    name_en: 'Style conversion',
    name_cn: '风格转换',
    detail_en: 'The spine of this site: a game frame, character or room redrawn toward a target style, original kept.',
    detail_cn: '本站的主线：把游戏帧、人物或房间按目标风格重绘，原图一直留着。',
    status: 'live' as const,
    href: '/game-character-style',
  },
  {
    name_en: 'Video super-resolution',
    name_cn: '视频超分',
    detail_en: 'The page exists and says its own limit: the public workspace still processes still frames while the video adapter is being connected.',
    detail_cn: '页面已经有了，也写着自己的限制：公开工作室目前处理静态帧，视频适配器还在接。',
    status: 'building' as const,
    href: '/video-upscaler',
  },
  {
    name_en: 'Frame interpolation',
    name_cn: '视频补帧',
    detail_en: 'Intent only. Generating frames means inventing motion, and inventing it badly is worse than a low frame rate.',
    detail_cn: '目前只有意图。生成帧就是发明运动，发明得不好，比帧率低更难看。',
    status: 'building' as const,
    href: '/video-upscaler',
  },
];

const FAQ_EN: Array<[string, string]> = [
  ['What exactly is free?', 'Two things are free and stay free: the cached examples run without an account, and every registered account gets its monthly free allowance. This campaign adds a larger free window for the people on the list, and the amount is published on the open day rather than promised here.'],
  ['When does it open?', 'No date is set, and this page will not invent one. Everyone on the list is mailed before it goes public, so being on the list is what makes the timing matter.'],
  ['How do I join?', 'Send one email to the address on this page with the subject line shown in the box. There is no form, no password and no account required to join — one email is the whole signup.'],
  ['Will you use my address for anything else?', 'It is used to tell you about this window. If the window changes or is cancelled, that is also what the same email is for. Nothing is sold or shared.'],
  ['Is this the same thing as Topaz?', 'No. This site is independent, not affiliated with Topaz Labs or NVIDIA, and no Topaz product, preset, model or screenshot is involved. The lanes are our own browser workflows.'],
  ['Do you claim it beats Topaz?', 'Not yet, and not on this page. A head-to-head needs the same input run on both sides with the settings recorded; until that exists, the honest sentence is that five lanes run here today and two are still being built.'],
];

const FAQ_ZH: Array<[string, string]> = [
  ['免费的是哪些？', '两件事本来就免费，而且会一直免费：免登录的示例可以直接跑；注册账号每月有免费额度。这次活动是给名单上的人开一个更大的免费窗口，具体多少在开放当天公布，不在这里先许诺。'],
  ['什么时候开放？', '没有定日期，这页也不会编一个。名单上的人会在对外公开之前先收到邮件——所以「先进名单」才有意义。'],
  ['怎么进名单？', '照页面上那个主题，给下面的邮箱发一封邮件就行。没有表单、不用设密码、也不用先注册账号，一封邮件就是全部登记。'],
  ['地址会被拿去做别的吗？', '只用来通知这个窗口。窗口改期或取消，也是同一封邮件通知。不转卖、不共享。'],
  ['这跟 Topaz 是同一个东西吗？', '不是。本站独立运营，与 Topaz Labs、NVIDIA 都没有隶属关系，也不涉及任何 Topaz 的产品、预设、模型或截图。这几条是我们自己的浏览器工作流。'],
  ['你们说效果比 Topaz 更好吗？', '现在不说，这页也不说。要比就得同一输入两边各跑一次、设置都记下来；在那之前，诚实的说法只有一句：今天能跑五条，两条还在做。'],
];

export const TOPAZ_FREE = {
  path: '/topaz-free',
  zhPath: '/zh/topaz-free',
  image: '/blog/topaz-lineup-cover.jpg',
  imageAlt_en: 'Status board: five of the seven Topaz-shaped lanes already run in a browser, video super-resolution and frame interpolation are still in the build queue',
  imageAlt_cn: '状态板：七条里五条已经能在浏览器里跑，视频超分与补帧还在队列里',
  email: SUPPORT_EMAIL,
  en: {
    title: 'Free Topaz-Shaped Lineup — Join the Email List Before It Opens | DLSS5NVIDIA',
    description:
      'A free window for the Topaz-shaped lineup is being prepared: five lanes already run in the browser today, two are still being built. Send one email to be told first — no date, no price and no head-to-head claim is invented here.',
    language: 'en-US',
    keywords: ['free topaz alternative', 'topaz free alternative email', 'free image upscaler list', 'topaz lineup free', 'dlss5nvidia free window'],
    eyebrow: 'Free window · pre-announcement',
    heading: 'The Topaz-shaped lineup, free — and the list opens by email',
    lead:
      'Five of the seven lanes people buy a Topaz licence for already run in a browser here: upscaling, detail restoration, portrait retouching, cutout and erase, and style conversion. Two are still being built — video super-resolution and frame interpolation — and both pages say so in their own copy. We are preparing a free window for these lanes. There is no form on this page: one email puts you on the list, and the list is told before anyone else.',
    statusLead: 'What runs today, checkable lane by lane',
    statusNote:
      'Every lane below links to the page it describes. Whatever the page says there — including its limits — outranks this announcement.',
    offerHeading: 'What the free window is',
    offer: [
      'The cached examples are free today and need no account.',
      'Every registered account keeps its monthly free allowance — 10 credits, 3 generations a day, on the plan the site already publishes.',
      'The window adds more on top for the people on this email list. How much, and for how long, is published on the open day — not guessed in advance on a page that would then have to walk it back.',
    ],
    offerNote:
      'No price is being changed by this announcement, and no plan is hidden: the plans and their numbers are on the pricing page and in the API the site reads.',
    joinHeading: 'Get on the list with one email',
    joinSteps: [
      'Send an email to the address below.',
      'Use the subject line exactly as shown — it is how the list is sorted.',
      'That is it. No form, no account, no password. A reply confirms you are on it.',
    ],
    subject: 'Topaz free lineup — add me',
    body:
      'Hi,\n\nAdd me to the list for the free Topaz-shaped lineup window.\n\nWhat I would use it for: \nWhich lane I want first (upscale / detail / portrait / cutout-erase / style / video): \n\nThanks.',
    mailLabel: 'Send the email',
    copyLabel: 'Copy address',
    copiedLabel: 'Copied',
    mailNote: 'The address is used to tell you about this window. Nothing is sold or shared.',
    promiseHeading: 'What we promise',
    promise: [
      'The five lanes that are live will keep the behaviour their own pages describe.',
      'Everyone on the list hears first — before the window appears anywhere else.',
      'If the window is delayed or cancelled, the same list is told, with the reason.',
    ],
    notPromise: [
      'No date. The open day is not decided, so this page does not print one.',
      'No number for the free allowance, because it is not decided either.',
      'No "better than Topaz" claim: that needs the same input run on both sides with the settings recorded, and that run has not been published.',
    ],
    faqHeading: 'Questions',
    relatedHeading: 'Related',
    related: [
      { path: '/blog/topaz-lineup-coming-what-runs-today-2026', label: 'The full announcement, lane by lane' },
      { path: '/pricing', label: 'Plans and the free allowance' },
      { path: '/image-upscaler', label: 'Open the upscaler' },
      { path: '/game-character-style', label: 'Open style conversion' },
    ],
    trademarkNote:
      'Topaz is a trademark of Topaz Labs. This site is independent and not affiliated with, endorsed by, or sponsored by Topaz Labs or NVIDIA.',
    legalNote: 'No purchase is needed to join the list. The window is a promotion, not a subscription.',
  },
  zh: {
    title: 'Topaz 那条线免费开放：先发一封邮件，开放当天先通知你 | DLSS5NVIDIA',
    description:
      '对标 Topaz 的那几条功能线正在准备一轮免费窗口：五条今天已经能在浏览器里跑，两条还在做。发一封邮件进名单，开放时先通知你——日期、额度、和 Topaz 的对比，都不在这页提前编。',
    language: 'zh-CN',
    keywords: ['Topaz 免费替代', 'Topaz 免费活动', '免费图片放大 名单', 'Topaz 平替 免费', 'dlss5nvidia 免费'],
    eyebrow: '免费窗口 · 预告',
    heading: 'Topaz 那条线，免费开放：名单靠一封邮件',
    lead:
      '多数人买 Topaz 授权时想要的那几条线，这里有五条今天已经能在浏览器里跑：放大、细节还原、人像修图、抠图与擦除、风格转换。视频超分和补帧还在做，这两条页面自己写着进度。我们正在准备一轮免费窗口。这页没有表单：发一封邮件就进名单，开放前名单上的人先收到通知。',
    statusLead: '今天已经能跑的，一条一条可以当场验证',
    statusNote: '下面每一条都链到它自己那页。那页上写的——包括它的限制——比这篇预告更有权威。',
    offerHeading: '这轮免费窗口是什么',
    offer: [
      '免登录的示例今天就是免费的，不用账号。',
      '注册账号每月有免费额度——10 额度、每天 3 次，就是站点现在就公开的那个套餐。',
      '这轮窗口给名单上的人再多给一些。给多少、给多久，开放当天公布，不在这页先猜一个然后回头改口。',
    ],
    offerNote: '这次预告不改价格，也不藏套餐：套餐和数字都在定价页上，也在站点自己读的那个接口里。',
    joinHeading: '一封邮件进名单',
    joinSteps: ['给下面这个邮箱发一封邮件。', '主题照抄页面上的那一行——名单是按主题分的。', '就这样。没有表单、不用注册账号、不用设密码。回一封确认就是进去了。'],
    subject: 'Topaz free lineup — add me',
    body:
      '你好，\n\n把我加到「Topaz 那条线免费窗口」的名单里。\n\n我打算用它做什么：\n我最想先用哪一条（放大 / 细节还原 / 人像 / 抠图擦除 / 风格转换 / 视频）：\n\n谢谢。',
    mailLabel: '直接发邮件',
    copyLabel: '复制邮箱',
    copiedLabel: '已复制',
    mailNote: '这个地址只用来通知这一轮窗口。不转卖、不共享。',
    promiseHeading: '我们承诺的部分',
    promise: ['已经能跑的五条，行为跟各自页面写的一致。', '名单上的人先知道——先于任何公开渠道。', '窗口延期或取消，也通知同一个名单，并说明原因。'],
    notPromise: [
      '不给日期：开放那天还没定，这页就不印一个。',
      '不给免费额度的数字：那个也还没定。',
      '不说「比 Topaz 更好」：那要同一输入两边各跑一次、设置都记下来，那次对比还没发布。',
    ],
    faqHeading: '常见问题',
    relatedHeading: '相关页面',
    related: [
      { path: '/zh/blog/topaz-lineup-coming-what-runs-today-2026', label: '完整的预告：一条一条写清楚' },
      { path: '/pricing', label: '套餐与免费额度' },
      { path: '/image-upscaler', label: '打开放大页' },
      { path: '/zh/game-character-together', label: '试试合影工具（中文页）' },
    ],
    trademarkNote: 'Topaz 是 Topaz Labs 的商标。本站独立运营，与 Topaz Labs、NVIDIA 均无隶属、背书或赞助关系。',
    legalNote: '进名单不需要购买任何东西。这是一次促销活动，不是订阅。',
  },
  lanes: LANES,
  faqs: { en: FAQ_EN, zh: FAQ_ZH },
} as const;

export type TopazFreeLocale = 'en' | 'zh';

export function topazFreeMailto(locale: TopazFreeLocale) {
  const copy = locale === 'zh' ? TOPAZ_FREE.zh : TOPAZ_FREE.en;
  return `mailto:${TOPAZ_FREE.email}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(copy.body)}`;
}

/** WebPage + BreadcrumbList + FAQPage in one @graph — the shape the new-page gate reads. */
export function topazFreeSchema(locale: TopazFreeLocale, baseUrl: string) {
  const copy = locale === 'zh' ? TOPAZ_FREE.zh : TOPAZ_FREE.en;
  const path = locale === 'zh' ? TOPAZ_FREE.zhPath : TOPAZ_FREE.path;
  const url = `${baseUrl}${path}`;
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
        mainEntity: TOPAZ_FREE.faqs[locale].map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };
}
