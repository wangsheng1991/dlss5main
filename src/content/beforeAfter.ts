import { SITE_URL } from '../config/site';

export type BeforeAfterCase = {
  id: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  beforeSize: string;
  afterSize: string;
  outputType: 'upscale' | 'same-size' | 'edit';
  prompt: string;
  description: string;
  descriptionZh: string;
  limit: string;
  limitZh: string;
  record: string;
  recordZh: string;
  aspectRatio: number;
  extraInput?: string;
};

/**
 * The flagship gallery is deliberately explicit about provenance. The three low/high pairs have
 * verified file dimensions, but their old asset export did not carry a per-run model ledger; they
 * are therefore labelled as visual references rather than benchmark measurements. The remaining
 * cards use the measured case book and retain the exact control/date record.
 */
export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'portrait-upscale', title: 'Portrait detail recovery', titleZh: '人像细节恢复', category: 'Upscale reference', categoryZh: '放大参考',
    before: '/examples/case-portrait-low.jpg', after: '/examples/case-portrait.jpg', beforeLabel: '320 × 400 input', afterLabel: '1200 × 1500 reference output', beforeSize: '320 × 400 px', afterSize: '1200 × 1500 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve facial identity and expression; recover natural hair and skin texture; do not change age or face shape.',
    description: 'The same portrait moves from 320 × 400 to 1200 × 1500 (3.75× on each edge). Compare eyes, jawline and hair before treating added texture as factual.',
    descriptionZh: '同一张人像从 320 × 400 变为 1200 × 1500（长宽各 3.75 倍）。先对照眼睛、下颌线和头发，再判断新增纹理。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; this card is a visual reference, not a benchmark.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；本卡只作视觉参考，不是基准测试。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 0.8,
  },
  {
    id: 'product-upscale', title: 'Product edge and material detail', titleZh: '商品轮廓与材质细节', category: 'Upscale reference', categoryZh: '放大参考',
    before: '/examples/case-product-low.jpg', after: '/examples/case-product.jpg', beforeLabel: '320 × 213 input', afterLabel: '1200 × 800 reference output', beforeSize: '320 × 213 px', afterSize: '1200 × 800 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve product silhouette, label placement and colour; recover material texture; do not invent text.',
    description: 'The product pair uses the same 3.75× edge scale (320 × 213 to 1200 × 800). Check the silhouette, label placement and straight edges at 100%.',
    descriptionZh: '商品图同样按边长 3.75 倍处理（320 × 213 到 1200 × 800）。请按 100% 检查轮廓、标签位置和直线。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; inspect labels and logos instead of assuming they were recovered.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；标签和标识要逐项核对，不能默认已恢复。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 1.502,
  },
  {
    id: 'architecture-upscale', title: 'Architecture lines and render texture', titleZh: '建筑直线与渲染材质', category: 'Architecture reference', categoryZh: '建筑参考',
    before: '/examples/case-architecture-low.jpg', after: '/examples/case-architecture.jpg', beforeLabel: 'Low-resolution render', afterLabel: 'Reference output', beforeSize: '320 × 213 px', afterSize: '1200 × 800 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve straight architectural lines and window geometry; sharpen edges without halos; keep perspective and materials.',
    description: 'The architecture pair keeps the source and output ratio aligned. Inspect window spacing, facade lines and repeated geometry instead of judging only the thumbnail.',
    descriptionZh: '建筑图输入输出比例一致。请检查窗间距、立面直线和重复几何结构，不要只看缩略图。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; straight lines remain a review point, not a guarantee.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；直线仍需人工复核，不是保证。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 1.502,
  },
  {
    id: 'retouch-natural', title: 'Portrait retouch at the natural level', titleZh: '自然级人像修复', category: 'Same-size edit', categoryZh: '同尺寸编辑',
    before: '/examples/portrait-source.jpg', after: '/examples/retouch-after.jpg', beforeLabel: 'Portrait source', afterLabel: 'Retouched reference', beforeSize: '600 × 900 px', afterSize: '600 × 900 px', outputType: 'same-size',
    prompt: 'Level: natural. Preserve facial identity and expression; even skin tone and texture without changing face shape.',
    description: 'This is a same-size retouch, not an upscale: 600 × 900 in and 600 × 900 out. The measured run kept the face, hair, jacket and street recognisable.',
    descriptionZh: '这是同尺寸修复，不是放大：输入输出均为 600 × 900。实测运行保持了脸部、头发、外套和街景的可识别性。',
    limit: 'Retouching can still change uncertain pixels. Keep the source beside the result and review eyes, jawline, expression and skin grain.', limitZh: '修复仍可能改变不确定像素。请保留原图，对照眼睛、下颌线、表情和皮肤纹理。',
    record: 'Measured case: natural level, 59 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：natural 级别，用时 59 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 2 / 3,
  },
  {
    id: 'cutout-teapot', title: 'Background removal with pixel size kept', titleZh: '保持像素尺寸的抠图', category: 'Object workflow', categoryZh: '对象处理',
    before: '/examples/cutout-teapot.jpg', after: '/examples/cutout-teapot-after.jpg', beforeLabel: 'Photo input', afterLabel: 'Transparent cutout preview', beforeSize: '1024 × 1024 px', afterSize: '1024 × 1024 px', outputType: 'edit',
    prompt: 'Fixed cutout instruction; keep the teapot and remove the background to alpha transparency.',
    description: 'The cutout keeps 1024 × 1024 pixels. The real deliverable is a PNG with alpha; the shown result is flattened on a contrasting background.',
    descriptionZh: '抠图保持 1024 × 1024 像素。实际交付是带透明通道的 PNG，页面示例会铺在对比背景上。',
    limit: 'Loose hair, glass and motion blur can retain some background; inspect the edge before publishing.', limitZh: '飘发、玻璃和运动模糊可能残留背景；发布前请检查边缘。',
    record: 'Measured case: fixed cutout, 2 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：固定抠图流程，用时 2 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 1,
  },
  {
    id: 'erase-spoon', title: 'Object erased and the table rebuilt', titleZh: '擦除对象并重建桌面', category: 'Generative edit', categoryZh: '生成式编辑',
    before: '/examples/erase-spoon.jpg', after: '/examples/erase-spoon-after.jpg', beforeLabel: 'Photo input', afterLabel: 'Erased-object reference', beforeSize: '1024 × 1024 px', afterSize: '1024 × 1024 px', outputType: 'edit',
    prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, napkin and lighting.',
    description: 'A 1024 × 1024 erase run rebuilds the surface under the spoon while leaving the mug, napkin and light direction as review anchors.',
    descriptionZh: '一次 1024 × 1024 擦除运行重建勺子下面的桌面，同时把杯子、餐巾和光线方向作为对照锚点。',
    limit: 'The full frame is re-rendered, so fine text elsewhere can drift. Do not use it as pixel-exact restoration.', limitZh: '整张图会重新渲染，其他位置的小字可能漂移；不要把它当作像素级恢复。',
    record: 'Measured case: fixed erase prompt, 60 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：固定擦除提示词，用时 60 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 1,
  },
  {
    id: 'tryon-top', title: 'A garment reference placed on a person', titleZh: '把服装参考穿到人物上', category: 'Two-reference edit', categoryZh: '双参考编辑',
    before: '/examples/tryon-person.jpg', after: '/examples/tryon-after.jpg', beforeLabel: 'Person reference', afterLabel: 'Try-on reference', beforeSize: 'Person photo', afterSize: '768 × 1024 px output', outputType: 'edit',
    prompt: 'Garment: a top. References: person first, garment second. Keep face, pose and background stable.',
    description: 'The person image is the slider input; a second garment photo drives the jacket. Compare face, hands, hem, logos and folds before use.',
    descriptionZh: '滑块左侧是人物图，第二张服装图驱动夹克变化。使用前检查脸部、手部、下摆、标识和褶皱。',
    limit: 'One garment per run. The result is a preview and can drift around hands, hems and logos.', limitZh: '每次只处理一件服装。这是预览，手部、下摆和标识附近可能发生漂移。',
    record: 'Measured case: top garment, 58 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：top 服装，用时 58 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 0.75, extraInput: '/examples/tryon-garment.jpg',
  },
];

export const BEFORE_AFTER_FAQ = [
  { question: 'Are these NVIDIA DLSS 5 runtime screenshots?', answer: 'No. These are independent before-and-after references from the DLSS5NVIDIA image pipeline. They are not NVIDIA captures and do not prove an in-game DLSS runtime result.' },
  { question: 'What does “before and after” mean here?', answer: 'Each card keeps the input beside one output from the named workflow. The three low/high pairs show verified file dimensions; the retouch, cutout, erase and try-on cards show measured workflow runs with their controls and date.' },
  { question: 'Does upscaling recover factual detail?', answer: 'No. It estimates a more usable visual result from the input. Faces, labels, numbers, thin geometry and repeated patterns can change, so compare them at 100% and keep the original.' },
  { question: 'Can I try the converter without an RTX GPU?', answer: 'Yes. The browser workflow runs on the site service, so a modern browser is enough for a cached example or an account workflow. The separate DLSS5 Studio request page is a Windows RTX product and is still being developed.' },
  { question: 'Why is the retouch card not labelled as an upscale?', answer: 'Its input and output are both 600 × 900. It is a same-size portrait retouch case, included to show the difference between restoring an existing image and enlarging it.' },
  { question: 'What inputs usually fail?', answer: 'Extremely small or heavily compressed images, tiny text, multiple faces and scenes with motion blur are hard cases. Start with the largest original file, then inspect the result before sharing or publishing it.' },
];

export const BEFORE_AFTER_COPY = {
  en: {
    title: 'DLSS 5 Before and After — Independent Image Conversion Examples',
    description: 'Compare independent DLSS 5-style image conversion examples: same-input upscales, portrait retouch, object removal and game-ready visual references with dimensions, controls and honest limits.',
    heading: 'DLSS 5 before and after: inspect the conversion, not the promise',
    answer: 'Every card below pairs an input with one output from our own image pipeline. The file dimensions, controls and provenance are shown beside the image; these are independent references, not NVIDIA screenshots or runtime benchmarks.',
  },
  zh: {
    title: 'DLSS 5 前后对比 — 独立图像转换案例',
    description: '查看独立的 DLSS 5 风格图像转换案例：同输入放大、人像修复、对象擦除和游戏视觉参考，逐组标注尺寸、参数与边界。',
    heading: 'DLSS 5 前后对比：看清转换结果，而不是只看宣传',
    answer: '下面每组都把输入与我们自己的图像管线输出放在一起。图片旁会标注尺寸、控制项和来源；这些是独立参考，不是 NVIDIA 截图，也不是运行时基准。',
  },
} as const;

export function beforeAfterSchema(baseUrl = SITE_URL) {
  const absolute = (path: string) => path.startsWith('http') ? path : `${baseUrl}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${baseUrl}/before-after#webpage`, name: BEFORE_AFTER_COPY.en.heading, url: `${baseUrl}/before-after`, dateModified: '2026-10-11', inLanguage: 'en-US' },
      ...BEFORE_AFTER_CASES.flatMap((item) => [
        { '@type': 'ImageObject', '@id': `${baseUrl}/before-after#${item.id}-before`, contentUrl: absolute(item.before), name: `${item.title} input`, caption: `${item.beforeLabel}; ${item.beforeSize}` },
        { '@type': 'ImageObject', '@id': `${baseUrl}/before-after#${item.id}-after`, contentUrl: absolute(item.after), name: `${item.title} output`, caption: `${item.afterLabel}; ${item.afterSize}` },
      ]),
      { '@type': 'FAQPage', '@id': `${baseUrl}/before-after#faq`, mainEntity: BEFORE_AFTER_FAQ.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
      { '@type': 'VideoObject', name: 'Independent image upscaling before-and-after demo', description: 'Six-second silent reference video showing a source frame transition.', contentUrl: absolute('/examples/dlss5-upscale-before-after-demo.mp4'), thumbnailUrl: absolute('/examples/generated/architecture-1-after.jpg'), duration: 'PT6S', uploadDate: '2026-10-11' },
      { '@type': 'VideoObject', name: 'Game character style conversion reference', description: 'Six-second silent reference video showing a game character style transition.', contentUrl: absolute('/examples/dlss5-game-style-transition.mp4'), thumbnailUrl: absolute('/examples/generated/game-cyber-1-after.jpg'), duration: 'PT6S', uploadDate: '2026-10-11' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${baseUrl}/` }, { '@type': 'ListItem', position: 2, name: BEFORE_AFTER_COPY.en.heading, item: `${baseUrl}/before-after` }] },
    ],
  };
}
