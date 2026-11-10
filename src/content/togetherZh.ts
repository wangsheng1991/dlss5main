import { SITE_URL } from '../config/site';

/**
 * The Chinese edition of `/game-character-together`.
 *
 * The English page is generated from the tool's own contract (`TOOL_LANDINGS`), and its paragraphs
 * are English sentences built around English keywords. Machine-copying those into Chinese produces
 * a page that reads like a translation, so the Chinese edition is written once, here, and both the
 * React page and the prerendered document read their text from this object — one content source,
 * two renderings, no drift.
 */
export type TogetherZhCopy = typeof TOGETHER_ZH;

const OUTPUT_EDGE = 1024;

export const TOGETHER_ZH = {
  path: '/zh/game-character-together',
  language: 'zh-CN' as const,
  title: '和游戏角色拍一张合照 — 两张照片，一张同框',
  description: '上传一张你自己的照片和一张游戏角色截图，选一个姿势——握手、并肩、拥抱或背靠背，得到一张你们俩同框的图。示例免登录可跑，每次 1 额度。',
  keywords: ['和游戏角色合影', '我和游戏角色合照', '游戏角色合影 ai', '两张照片合成一张', '游戏人物 合影', 'ai 双人合影'],
  eyebrow: 'AI 双人合影',
  heading: '和游戏角色拍一张合照',
  lead: '两张照片进去，一张出来：你和角色站在同一个地方，摆你选的姿势。这就是"游戏要是肯让我们见一面"会拍到的那张照片，而它的起点是你手机里已有的两张图，不是一段你要自己写的提示词。',
  cta: '上传你的两张照片',
  ctaNote: `需要两张图 · 你在前、角色在后 · 15–30 秒 · 方图 / 竖图 / 横图 · 长边 ${OUTPUT_EDGE} px · 每次 1 额度`,
  sampleHeading: '先跑一次免费示例',
  sampleIntro: '不用登录，也不用先上传：这就是工作室里同一个缓存示例，服务器只算一次，所以免费。',
  sampleRun: '运行这个示例 · 免费',
  sampleNote: '示例结果来自我们自己的两张参考图，下面写清了它哪里对、哪里没对上。',
  stepsHeading: '这张照片怎么来',
  steps: [
    { name: '挑好两张图', text: '先上传你自己的照片，再上传角色截图。两张都只作参考，不会被当成要修改的画布，所以脸正、光匀的那一对效果最好。' },
    { name: '选你们怎么见', text: '握手、并肩、拥抱，或者背靠背。每个姿势都是服务端固定配方，你不用写提示词，也没有措辞可以写错。' },
    { name: '选画幅', text: `发帖用方图，手机壁纸或打印用竖图，横图当横幅。长边固定 ${OUTPUT_EDGE} px。` },
    { name: '发之前先核对', text: '把两张脸、手、以及两个人相接的地方按原尺寸比一遍。不满意就换个姿势或画幅重跑，别发一张自己都不确定的图。' },
  ],
  checksHeading: '图出来以后核这四项',
  checks: [
    '和你自己的照片比脸：五官、发际线、当时穿的衣服。',
    '和你上传的角色截图比：发色、服装、装备、标志性的道具。',
    '看手，以及两个身体相接的位置——合成图最容易在这里露馅。',
    '看光：一个光源、一个方向的影子，两个人被同一束光照着。',
  ],
  fitHeading: '它适合什么',
  fit: [
    '玩了多年、想留一张纸面合影的角色',
    '同人帖、头像、资料页要用的同框图',
    '送给正好主玩这个角色的朋友的一张意外惊喜',
    'cos、模组、同人企划的概念图',
  ],
  whatHeading: '它是什么，不是什么',
  whatIs: `它是把两张静态图交给一个通用图像模型，用固定配方让"左是你、右是角色"同处一帧的双人合成。四个姿势各自是一句写死的指令，尺寸由服务端决定，所以浏览器里没有可以写坏的地方。`,
  whatIsNot: '它不是游戏里的功能，不是 NVIDIA DLSS 5 的功能，也不是任何一家工作室做的功能；它是一个独立生成的合成图，角色的著作权始终属于原权利人。',
  limits: [
    '不承诺"脸 100% 一致"。脸部通常能带过来，但这是生成结果，不是抠图拼贴：头发、表情、衣服和手都可能漂移。',
    '同一个输入跑两次，可能给你两张不同的图。渠道不认 seed，seed 只是请求、不是契约，所以一次跑歪了重跑一次是正常操作。',
    '参考图里角色的脸如果是背对镜头，模型只拿得到发型与装备，脸和场景是它自己设计的——我们那个示例里，红发回来变成了深棕。',
    '一次只出一个姿势、一张图、1 额度。两个姿势塞进一张图会得到一个拥挤又不一致的画面，所以我们干脆不做。',
  ],
  galleryHeading: '三个姿势，三次真跑',
  galleryIntro: '同一个人、同一张角色截图，一次一个姿势，事后没有修图。跑歪了就是跑歪了——这一页唯一不承诺的，就是这个角色原有的那张脸，所以回来的那张图，是你发之前自己核对过的那张。',
  gallery: [
    { src: '/examples/together/promo-hug.webp', label: '两个人抱着', pose: '姿势：拥抱 · 1024 × 1024', note: '两张脸分别来自各自的参考图，角色截图里的雨成了整场的布光。', width: OUTPUT_EDGE, height: OUTPUT_EDGE },
    { src: '/examples/together/promo-side.webp', label: '并肩站着', pose: '姿势：并肩 · 1024 × 1024', note: '一只手搭在肩上，两个人一起看镜头——要当头像就用这个姿势。', width: OUTPUT_EDGE, height: OUTPUT_EDGE },
    { src: '/examples/together/promo-back.webp', label: '背靠背，抱着手臂', pose: '姿势：背靠背 · 1024 × 1024', note: '游戏海报的站姿：两个人一起看向镜头，盔甲和毛衣落在同一束光里。', width: OUTPUT_EDGE, height: OUTPUT_EDGE },
  ],
  demo: {
    before: '/examples/together/references.jpg',
    after: '/examples/together/handshake-guest.webp',
    beforeLabel: '这一跑用的两张参考图',
    afterLabel: '免费那次跑出来的结果',
    caption: '这就是这个流程的一次真跑，用的免费示例里字节原样存下来的那张结果：两张参考图（这里并排放），和回来的那一张图，姿势"握手"、方图、1024 × 1024。角色的截图里她是侧背对着镜头，所以模型保住了体型和深色装备，自己设计了脸、盔甲和街道——她原本的红发回来变成了棕色。一张正脸朝前的截图能带过来更多。',
  },
  priceHeading: '额度和交付',
  price: '额度在提交前就显示，一次任务 1 额度、一张图；免费示例不花额度，因为它跑的是服务器上已经算好的那一份。生成失败由账号流程按计费政策处理。',
  reviewHeading: '发之前的一遍核对',
  review: '先看整体站位和两个人的比例，再按原尺寸看两张脸；看手和相接处；看光是不是一个方向；最后问自己一句：这张图如果被这个角色的粉丝看到，会不会觉得在冒充官方画面？会，就别配"官方"两个字发出去。',
  related: [
    { path: '/game-character-style', label: '游戏角色风格转换（英文页）' },
    { path: '/zh/visual-enhancer', label: '视觉增强器' },
    { path: '/zh/games', label: '游戏支持状态' },
  ],
  faqs: [
    {
      question: '和游戏角色的合影是怎么做出来的？',
      answer: '你上传两张图：一张你自己的照片，一张角色的截图。工作室把两张一起交给模型，配一句写死的指令，指明哪张是"这个人"、哪张是"这个角色"，于是左边那张脸来自你的照片，右边那个形象来自角色截图。姿势从四个预设里选，不用你写。',
    },
    {
      question: '出来的图会和我长得一模一样吗？',
      answer: '脸通常能带过来，但这是生成结果，不是复制粘贴，也不保证。头发、表情、衣服和手都可能漂移，尤其当两张参考图的光线和尺寸差很多时。发之前看一眼，跑歪了就重跑一次。',
    },
    {
      question: '为什么一次只能出一个姿势？',
      answer: '每个姿势是各自的一句指令，模型是照着那句指令从零构图。让它在一张图里做两个姿势，会得到一个拥挤、前后不一致的画面，所以一次一个姿势、一张图、1 额度。',
    },
    {
      question: '不注册能不能先跑一次？',
      answer: '能。页面顶部的示例用的是我们自己的两张参考图，跑的是同一套流程，展示的是真实输出。上传你自己的照片才需要账号，并按提交前显示的额度计费。',
    },
    {
      question: '游戏里或者 NVIDIA DLSS 5 有这个功能吗？',
      answer: '没有。它是我们用自己的算力通道、用通用图像模型做出的独立合成结果，与 NVIDIA、任何游戏工作室或发行商都没有关系，也不代表他们的立场；角色本身仍是权利人的财产。用角色图做参考之前，请确认你有权使用那张图，并把结果当成同人素材，而不是官方画面。',
    },
  ],
};

export function togetherZhSchema() {
  const url = `${SITE_URL}${TOGETHER_ZH.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: TOGETHER_ZH.heading,
        description: TOGETHER_ZH.description,
        inLanguage: 'zh-CN',
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#application`,
        name: TOGETHER_ZH.heading,
        url,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        description: TOGETHER_ZH.description,
        inLanguage: 'zh-CN',
        featureList: ['两张参考图一次合成', '四个固定姿势', `方图 / 竖图 / 横图，长边 ${OUTPUT_EDGE} px`, '免登录可跑一个示例'],
        provider: { '@type': 'Organization', name: 'DLSS5NVIDIA', url: SITE_URL },
      },
      {
        '@type': 'HowTo',
        name: TOGETHER_ZH.heading,
        description: TOGETHER_ZH.lead,
        inLanguage: 'zh-CN',
        step: TOGETHER_ZH.steps.map(step => ({ '@type': 'HowToStep', name: step.name, text: step.text })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: TOGETHER_ZH.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${SITE_URL}/zh` },
          { '@type': 'ListItem', position: 2, name: TOGETHER_ZH.heading, item: url },
        ],
      },
    ],
  };
}
