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
    id: 'portrait-upscale', title: 'Portrait detail recovery', titleZh: '人像细节恢复', category: 'portrait-id', categoryZh: '人像与证件',
    before: '/examples/case-portrait-low.jpg', after: '/examples/case-portrait.jpg', beforeLabel: '320 × 400 input', afterLabel: '1200 × 1500 reference output', beforeSize: '320 × 400 px', afterSize: '1200 × 1500 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve facial identity and expression; recover natural hair and skin texture; do not change age or face shape.',
    description: 'The same portrait moves from 320 × 400 to 1200 × 1500 (3.75× on each edge). Compare eyes, jawline and hair before treating added texture as factual.',
    descriptionZh: '同一张人像从 320 × 400 变为 1200 × 1500（长宽各 3.75 倍）。先对照眼睛、下颌线和头发，再判断新增纹理。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; this card is a visual reference, not a benchmark.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；本卡只作视觉参考，不是基准测试。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 0.8,
  },
  {
    id: 'product-upscale', title: 'Product edge and material detail', titleZh: '商品轮廓与材质细节', category: 'product', categoryZh: '商品',
    before: '/examples/case-product-low.jpg', after: '/examples/case-product.jpg', beforeLabel: '320 × 213 input', afterLabel: '1200 × 800 reference output', beforeSize: '320 × 213 px', afterSize: '1200 × 800 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve product silhouette, label placement and colour; recover material texture; do not invent text.',
    description: 'The product pair uses the same 3.75× edge scale (320 × 213 to 1200 × 800). Check the silhouette, label placement and straight edges at 100%.',
    descriptionZh: '商品图同样按边长 3.75 倍处理（320 × 213 到 1200 × 800）。请按 100% 检查轮廓、标签位置和直线。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; inspect labels and logos instead of assuming they were recovered.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；标签和标识要逐项核对，不能默认已恢复。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 1.502,
  },
  {
    id: 'architecture-upscale', title: 'Architecture lines and render texture', titleZh: '建筑直线与渲染材质', category: 'architecture-interior', categoryZh: '建筑与室内',
    before: '/examples/case-architecture-low.jpg', after: '/examples/case-architecture.jpg', beforeLabel: 'Low-resolution render', afterLabel: 'Reference output', beforeSize: '320 × 213 px', afterSize: '1200 × 800 px', outputType: 'upscale',
    prompt: 'Upscale 3.75×; preserve straight architectural lines and window geometry; sharpen edges without halos; keep perspective and materials.',
    description: 'The architecture pair keeps the source and output ratio aligned. Inspect window spacing, facade lines and repeated geometry instead of judging only the thumbnail.',
    descriptionZh: '建筑图输入输出比例一致。请检查窗间距、立面直线和重复几何结构，不要只看缩略图。',
    limit: 'The asset ledger has dimensions but no per-run model/parameter record; straight lines remain a review point, not a guarantee.', limitZh: '资产台账记录了尺寸，但没有逐次模型/参数记录；直线仍需人工复核，不是保证。',
    record: 'Asset dimensions checked 2026-10-11; per-run model and parameter ledger not attached.', recordZh: '尺寸于 2026-10-11 复核；逐次模型与参数台账尚未附在素材旁。', aspectRatio: 1.502,
  },
  {
    id: 'retouch-natural', title: 'Portrait retouch at the natural level', titleZh: '自然级人像修复', category: 'portrait-id', categoryZh: '人像与证件',
    before: '/examples/portrait-source.jpg', after: '/examples/retouch-after.jpg', beforeLabel: 'Portrait source', afterLabel: 'Retouched reference', beforeSize: '600 × 900 px', afterSize: '600 × 900 px', outputType: 'same-size',
    prompt: 'Level: natural. Preserve facial identity and expression; even skin tone and texture without changing face shape.',
    description: 'This is a same-size retouch, not an upscale: 600 × 900 in and 600 × 900 out. The measured run kept the face, hair, jacket and street recognisable.',
    descriptionZh: '这是同尺寸修复，不是放大：输入输出均为 600 × 900。实测运行保持了脸部、头发、外套和街景的可识别性。',
    limit: 'Retouching can still change uncertain pixels. Keep the source beside the result and review eyes, jawline, expression and skin grain.', limitZh: '修复仍可能改变不确定像素。请保留原图，对照眼睛、下颌线、表情和皮肤纹理。',
    record: 'Measured case: natural level, 59 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：natural 级别，用时 59 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 2 / 3,
  },
  {
    id: 'cutout-teapot', title: 'Background removal with pixel size kept', titleZh: '保持像素尺寸的抠图', category: 'object-cutout', categoryZh: '对象与背景',
    before: '/examples/cutout-teapot.jpg', after: '/examples/cutout-teapot-after.jpg', beforeLabel: 'Photo input', afterLabel: 'Transparent cutout preview', beforeSize: '1024 × 1024 px', afterSize: '1024 × 1024 px', outputType: 'edit',
    prompt: 'Fixed cutout instruction; keep the teapot and remove the background to alpha transparency.',
    description: 'The cutout keeps 1024 × 1024 pixels. The real deliverable is a PNG with alpha; the shown result is flattened on a contrasting background.',
    descriptionZh: '抠图保持 1024 × 1024 像素。实际交付是带透明通道的 PNG，页面示例会铺在对比背景上。',
    limit: 'Loose hair, glass and motion blur can retain some background; inspect the edge before publishing.', limitZh: '飘发、玻璃和运动模糊可能残留背景；发布前请检查边缘。',
    record: 'Measured case: fixed cutout, 2 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：固定抠图流程，用时 2 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 1,
  },
  {
    id: 'erase-spoon', title: 'Object erased and the table rebuilt', titleZh: '擦除对象并重建桌面', category: 'object-cutout', categoryZh: '对象与背景',
    before: '/examples/erase-spoon.jpg', after: '/examples/erase-spoon-after.jpg', beforeLabel: 'Photo input', afterLabel: 'Erased-object reference', beforeSize: '1024 × 1024 px', afterSize: '1024 × 1024 px', outputType: 'edit',
    prompt: 'Remove the spoon from the table and rebuild the wooden surface behind it; keep the mug, napkin and lighting.',
    description: 'A 1024 × 1024 erase run rebuilds the surface under the spoon while leaving the mug, napkin and light direction as review anchors.',
    descriptionZh: '一次 1024 × 1024 擦除运行重建勺子下面的桌面，同时把杯子、餐巾和光线方向作为对照锚点。',
    limit: 'The full frame is re-rendered, so fine text elsewhere can drift. Do not use it as pixel-exact restoration.', limitZh: '整张图会重新渲染，其他位置的小字可能漂移；不要把它当作像素级恢复。',
    record: 'Measured case: fixed erase prompt, 60 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：固定擦除提示词，用时 60 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 1,
  },
  {
    id: 'tryon-top', title: 'A garment reference placed on a person', titleZh: '把服装参考穿到人物上', category: 'two-reference', categoryZh: '双参考',
    before: '/examples/tryon-person.jpg', after: '/examples/tryon-after.jpg', beforeLabel: 'Person reference', afterLabel: 'Try-on reference', beforeSize: 'Person photo', afterSize: '768 × 1024 px output', outputType: 'edit',
    prompt: 'Garment: a top. References: person first, garment second. Keep face, pose and background stable.',
    description: 'The person image is the slider input; a second garment photo drives the jacket. Compare face, hands, hem, logos and folds before use.',
    descriptionZh: '滑块左侧是人物图，第二张服装图驱动夹克变化。使用前检查脸部、手部、下摆、标识和褶皱。',
    limit: 'One garment per run. The result is a preview and can drift around hands, hems and logos.', limitZh: '每次只处理一件服装。这是预览，手部、下摆和标识附近可能发生漂移。',
    record: 'Measured case: top garment, 58 s wall clock, run recorded 2026-09-25 by the DLSS5NVIDIA team.', recordZh: '实测案例：top 服装，用时 58 秒，DLSS5NVIDIA 团队于 2026-09-25 记录。', aspectRatio: 0.75, extraInput: '/examples/tryon-garment.jpg',
  },
];

// These additional cards use files already shipped in public/examples/generated. Their
// dimensions were checked on 2026-10-13; no per-run model/parameter ledger is attached.
const ADDITIONAL_CASES: BeforeAfterCase[] = [
  ...[
    ['game-cyber-1', 'Cyberpunk game frame 1', '赛博游戏帧 1', '269 × 179 px', '768 × 512 px'],
    ['game-cyber-2', 'Cyberpunk game frame 2', '赛博游戏帧 2', '269 × 179 px', '768 × 512 px'],
    ['game-fantasy-1', 'Fantasy game frame', '幻想游戏帧', '240 × 200 px', '687 × 572 px'],
    ['game-sci-fi-1', 'Sci-fi game frame', '科幻游戏帧', '269 × 179 px', '768 × 512 px'],
    ['game-modern-1', 'Modern game frame', '现代游戏帧', '269 × 179 px', '768 × 512 px'],
    ['game-anime-1', 'Anime game frame', '动漫游戏帧', '269 × 179 px', '768 × 512 px'],
  ].map(([id, title, titleZh, beforeSize, afterSize]) => ({
    id, title, titleZh, category: 'game-frames', categoryZh: '游戏帧',
    before: `/examples/generated/${id}-before.jpg`, after: `/examples/generated/${id}-after.jpg`,
    beforeLabel: `${beforeSize} input`, afterLabel: `${afterSize} reference output`, beforeSize, afterSize, outputType: 'edit' as const,
    prompt: 'Convert the supplied game frame while keeping the character silhouette, pose, lighting and scene layout available for review.',
    description: 'A game-scene visual reference. Inspect silhouette, thin geometry, foliage and small text at 100%; it is not a game-runtime or frame-rate result.',
    descriptionZh: '游戏场景视觉参考。请按 100% 检查轮廓、细线几何、植被和小字；它不是游戏运行时或帧率结果。',
    limit: 'The reference can alter texture, text and small geometry; it does not establish in-game DLSS behavior.',
    limitZh: '参考结果可能改变纹理、小字和细部几何；它不能证明游戏内 DLSS 行为。',
    record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.',
    recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.5,
  } as BeforeAfterCase)),
  ...[
    ['product-1', 'Product square detail 1', '商品方图细节 1', '219 × 219 px', '627 × 627 px'],
    ['product-2', 'Product square detail 2', '商品方图细节 2', '219 × 219 px', '627 × 627 px'],
  ].map(([id, title, titleZh, beforeSize, afterSize]) => ({
    id, title, titleZh, category: 'product', categoryZh: '商品',
    before: `/examples/generated/${id}-before.jpg`, after: `/examples/generated/${id}-after.jpg`,
    beforeLabel: `${beforeSize} input`, afterLabel: `${afterSize} reference output`, beforeSize, afterSize, outputType: 'upscale' as const,
    prompt: 'Preserve the product silhouette, label placement and material edges while enlarging the supplied product image.',
    description: 'A square product reference for checking logos, labels, silhouette and material edges at 100%.',
    descriptionZh: '方形商品参考，用于按 100% 检查标识、标签、轮廓和材质边缘。',
    limit: 'Generated lettering and fine logos require manual comparison with the source.', limitZh: '生成的小字和细小标识必须与原图人工对照。',
    record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.',
    recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1,
  } as BeforeAfterCase)),
  {
    id: 'vectorize-badge', title: 'Badge bitmap to vector reference', titleZh: '徽章位图转矢量参考', category: 'product', categoryZh: '商品',
    before: '/examples/vectorize-badge.png', after: '/examples/vectorize-badge-after.png', beforeLabel: '1024 × 1024 px bitmap', afterLabel: '1024 × 1024 px preview', beforeSize: '1024 × 1024 px', afterSize: '1024 × 1024 px', outputType: 'edit',
    prompt: 'Convert the supplied badge bitmap into a clean vector-style result while keeping the visible emblem geometry.',
    description: 'A same-size badge reference for checking edges, holes and emblem geometry after vector-oriented conversion.', descriptionZh: '同尺寸徽章参考，用于检查矢量化转换后的边缘、镂空和图形几何。',
    limit: 'Small lettering and ambiguous edges still need source comparison; this is not a guaranteed production SVG.', limitZh: '小字和不清晰边缘仍需与原图对照；这不是保证可直接生产的 SVG。',
    record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1,
  },
  ...[
    ['architecture-lines-2', 'Architecture line reference 2', '建筑直线参考 2'],
    ['architecture-lines-3', 'Architecture line reference 3', '建筑直线参考 3'],
  ].map(([id, title, titleZh]) => ({
    id, title, titleZh, category: 'architecture-interior', categoryZh: '建筑与室内', before: `/examples/generated/${id.replace('architecture-lines-', 'architecture-')}-before.jpg`, after: `/examples/generated/${id.replace('architecture-lines-', 'architecture-')}-after.jpg`, beforeLabel: '253 × 190 px input', afterLabel: '724 × 543 px reference output', beforeSize: '253 × 190 px', afterSize: '724 × 543 px', outputType: 'edit' as const,
    prompt: 'Convert the architectural reference while retaining perspective, window spacing and facade lines for inspection.', description: 'An architectural reference for checking repeated windows, facade lines and perspective.', descriptionZh: '建筑参考，用于检查重复窗格、立面直线和透视关系。', limit: 'Straight lines and repeated geometry can drift; inspect the source and output together.', limitZh: '直线和重复几何可能漂移；请并排检查原图与输出。', record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.331,
  } as BeforeAfterCase)),
  {
    id: 'interior-style', title: 'Interior style conversion reference', titleZh: '室内风格转换参考', category: 'architecture-interior', categoryZh: '建筑与室内', before: '/examples/interior-style-ref.jpg', after: '/examples/interior-ref-after.jpg', beforeLabel: '900 × 900 reference input', afterLabel: '1100 × 733 reference output', beforeSize: '900 × 900 px', afterSize: '1100 × 733 px', outputType: 'edit', prompt: 'Use the supplied interior reference to guide materials, lighting and room composition.', description: 'A room-style reference for checking materials, lighting and large structural lines.', descriptionZh: '室内风格参考，用于检查材质、光照和大尺度结构线。', limit: 'A style conversion can change small objects and proportions; review the room layout before use.', limitZh: '风格转换可能改变小物件和比例；使用前请检查房间布局。', record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.5,
  },
  ...[
    ['creative-1', 'Creative object redraw 1', '创意对象重绘 1'],
    ['creative-2', 'Creative object redraw 2', '创意对象重绘 2'],
  ].map(([id, title, titleZh]) => ({
    id, title, titleZh, category: 'object-cutout', categoryZh: '对象与背景', before: `/examples/generated/${id}-before.jpg`, after: `/examples/generated/${id}-after.jpg`, beforeLabel: '269 × 179 px input', afterLabel: '768 × 512 px reference output', beforeSize: '269 × 179 px', afterSize: '768 × 512 px', outputType: 'edit' as const, prompt: 'Redraw the selected object and surrounding context while keeping the main visual subject available for review.', description: 'A creative redraw reference for checking object edges, background continuity and lighting.', descriptionZh: '创意重绘参考，用于检查对象边缘、背景连续性和光照。', limit: 'The surrounding scene may be regenerated; do not treat small text or exact geometry as preserved.', limitZh: '周围场景可能被重新生成；不要把小字或精确几何当作保留结果。', record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.5,
  } as BeforeAfterCase)),
  {
    id: 'makeup-ref', title: 'Makeup guided by a second reference', titleZh: '第二张参考引导妆容', category: 'two-reference', categoryZh: '双参考', before: '/examples/makeup-ref-source.jpg', after: '/examples/makeup-ref-after.jpg', beforeLabel: '700 × 466 source', afterLabel: '800 × 800 reference output', beforeSize: '700 × 466 px', afterSize: '800 × 800 px', outputType: 'edit', prompt: 'Use the source portrait and a second makeup reference to guide color and placement while keeping identity reviewable.', description: 'A two-reference makeup case; compare identity, eye area, skin texture and color placement.', descriptionZh: '双参考妆容案例；请对照身份、眼部、皮肤纹理和色彩位置。', limit: 'Makeup placement can drift with pose and lighting; it is a visual reference, not a cosmetic guarantee.', limitZh: '妆容位置会受姿态和光照影响；这是视觉参考，不是妆效保证。', record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.2, extraInput: '/examples/makeup-after.jpg',
  },
  ...[
    ['nature-1', 'Natural scene conversion 1', '自然场景转换 1'],
    ['nature-2', 'Natural scene conversion 2', '自然场景转换 2'],
  ].map(([id, title, titleZh]) => ({
    id, title, titleZh, category: 'nature', categoryZh: '自然与风景', before: `/examples/generated/${id}-before.jpg`, after: `/examples/generated/${id}-after.jpg`, beforeLabel: '269 × 179 px input', afterLabel: '768 × 512 px reference output', beforeSize: '269 × 179 px', afterSize: '768 × 512 px', outputType: 'edit' as const, prompt: 'Convert the natural scene while keeping the main light direction, horizon and large shapes available for comparison.', description: 'A natural-scene reference for checking light direction, horizon and broad texture.', descriptionZh: '自然场景参考，用于检查光照方向、地平线和大范围纹理。', limit: 'Fine foliage and distant detail can be invented or softened; compare against the input before sharing.', limitZh: '细小植被和远处细节可能被生成或弱化；分享前请与输入对照。', record: 'Asset dimensions checked 2026-10-13; per-run model and parameter ledger not attached; visual reference only.', recordZh: '素材与尺寸于 2026-10-13 复核；未附逐次模型/参数台账，本卡作视觉参考，不作基准。', aspectRatio: 1.5,
  } as BeforeAfterCase)),
];

BEFORE_AFTER_CASES.push(...ADDITIONAL_CASES);

export const BEFORE_AFTER_FAQ = [
  { question: 'Are these NVIDIA DLSS 5 runtime screenshots?', answer: 'No. These are independent before-and-after references from the DLSS5NVIDIA image pipeline. They are not NVIDIA captures and do not prove an in-game DLSS runtime result.' },
  { question: 'What does “before and after” mean here?', answer: 'Each card keeps the input beside one output from the named workflow. The three low/high pairs show verified file dimensions; the retouch, cutout, erase and try-on cards show measured workflow runs with their controls and date.' },
  { question: 'Does upscaling recover factual detail?', answer: 'No. It estimates a more usable visual result from the input. Faces, labels, numbers, thin geometry and repeated patterns can change, so compare them at 100% and keep the original.' },
  { question: 'Can I try the converter without an RTX GPU?', answer: 'Yes. The browser workflow runs on the site service, so a modern browser is enough for a cached example or an account workflow. The separate DLSS5 Studio request page is a Windows RTX product and is still being developed.' },
  { question: 'Why is the retouch card not labelled as an upscale?', answer: 'Its input and output are both 600 × 900. It is a same-size portrait retouch case, included to show the difference between restoring an existing image and enlarging it.' },
  { question: 'What inputs usually fail?', answer: 'Extremely small or heavily compressed images, tiny text, multiple faces and scenes with motion blur are hard cases. Start with the largest original file, then inspect the result before sharing or publishing it.' },
  { question: 'How is this page different from the benchmark center?', answer: 'This page is a visual gallery: it pairs existing inputs and outputs so you can inspect edges, faces and composition. The benchmark center defines measurement fields and separates recorded runs from visual references.' },
  { question: 'Can I reproduce one of these cases?', answer: 'Yes. Open the linked tool on a comparable input, use the control shown on the card, and record the original file, output size, model or preset, hardware, driver, date and elapsed time. Results may vary between runs.' },
  { question: 'Why does this page not use NVIDIA screenshots?', answer: 'The gallery documents our own image pipeline. Keeping independent assets separate from NVIDIA material makes the provenance clear and avoids presenting a visual reference as an official runtime capture.' },
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

// 工作类型要逐案说清楚：卡片和总表都不许把什么都写成「编辑 / 转换」。
// 这份标签按 id 显式给出，React 页与预渲染模板共用（2026-10-13）。
export const WORKFLOW_LABELS: Record<string, { en: string; zh: string }> = {
  'portrait-upscale': { en: 'Upscale 3.75×', zh: '放大 3.75×' },
  'product-upscale': { en: 'Upscale 3.75×', zh: '放大 3.75×' },
  'architecture-upscale': { en: 'Upscale 3.75×', zh: '放大 3.75×' },
  'retouch-natural': { en: 'Same-size retouch', zh: '同尺寸修复' },
  'cutout-teapot': { en: 'Background cutout', zh: '抠图' },
  'erase-spoon': { en: 'Generative erase', zh: '生成式擦除' },
  'tryon-top': { en: 'Try-on · two references', zh: '试穿 · 双参考' },
  'vectorize-badge': { en: 'Bitmap to vector', zh: '位图转矢量' },
  'interior-style': { en: 'Style conversion', zh: '风格转换' },
  'makeup-ref': { en: 'Makeup · two references', zh: '妆容 · 双参考' },
  'game-cyber-1': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'game-cyber-2': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'game-fantasy-1': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'game-sci-fi-1': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'game-modern-1': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'game-anime-1': { en: 'Game-frame style conversion', zh: '游戏帧风格转换' },
  'product-1': { en: 'Upscale 2.86×', zh: '放大 2.86×' },
  'product-2': { en: 'Upscale 2.86×', zh: '放大 2.86×' },
  'architecture-lines-2': { en: 'Style conversion', zh: '风格转换' },
  'architecture-lines-3': { en: 'Style conversion', zh: '风格转换' },
  'creative-1': { en: 'Object redraw', zh: '对象重绘' },
  'creative-2': { en: 'Object redraw', zh: '对象重绘' },
  'nature-1': { en: 'Look conversion', zh: '光照与风格转换' },
  'nature-2': { en: 'Look conversion', zh: '光照与风格转换' },
};

export function workflowLabel(item: { id: string; outputType: BeforeAfterCase['outputType'] }, isZh: boolean): string {
  const known = WORKFLOW_LABELS[item.id];
  if (known) return isZh ? known.zh : known.en;
  if (item.outputType === 'upscale') return isZh ? '放大' : 'Upscale';
  if (item.outputType === 'same-size') return isZh ? '同尺寸修复' : 'Same-size retouch';
  return isZh ? '编辑 / 转换' : 'Edit / conversion';
}

// 总表里的「记录」列只放摘要，完整句子留在卡片里 —— 否则 20 行重复同一句会把表读成噪声。
const LEDGER_MISSING = /Asset dimensions checked (20\d\d-\d\d-\d\d);[\s\S]*$/;
export function recordSummary(record: string, isZh: boolean): string {
  const missing = LEDGER_MISSING.exec(record);
  if (missing) return isZh ? `尺寸 ${missing[1]} 复核 · 无逐次台账` : `checked ${missing[1]} · no run ledger`;
  return record.replace(/^Measured case:\s*/, isZh ? '实测：' : 'Measured: ');
}

export function beforeAfterSchema(baseUrl = SITE_URL) {
  const absolute = (path: string) => path.startsWith('http') ? path : `${baseUrl}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${baseUrl}/before-after#webpage`, name: BEFORE_AFTER_COPY.en.heading, url: `${baseUrl}/before-after`, dateModified: '2026-10-13', inLanguage: 'en-US' },
      ...BEFORE_AFTER_CASES.flatMap((item) => [
        { '@type': 'ImageObject', '@id': `${baseUrl}/before-after#${item.id}-before`, contentUrl: absolute(item.before), name: `${item.title} input`, caption: `${item.beforeLabel}; ${item.beforeSize}` },
        { '@type': 'ImageObject', '@id': `${baseUrl}/before-after#${item.id}-after`, contentUrl: absolute(item.after), name: `${item.title} output`, caption: `${item.afterLabel}; ${item.afterSize}` },
      ]),
      { '@type': 'ItemList', '@id': `${baseUrl}/before-after#cases`, name: 'Before-and-after case gallery', numberOfItems: BEFORE_AFTER_CASES.length, itemListElement: BEFORE_AFTER_CASES.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.title, url: `${baseUrl}/before-after#${item.id}` })) },
      { '@type': 'FAQPage', '@id': `${baseUrl}/before-after#faq`, mainEntity: BEFORE_AFTER_FAQ.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
      { '@type': 'VideoObject', name: 'Independent image upscaling before-and-after demo', description: 'Six-second silent reference video showing a source frame transition.', contentUrl: absolute('/examples/dlss5-upscale-before-after-demo.mp4'), thumbnailUrl: absolute('/examples/generated/architecture-1-after.jpg'), duration: 'PT6S', uploadDate: '2026-10-11' },
      { '@type': 'VideoObject', name: 'Game character style conversion reference', description: 'Six-second silent reference video showing a game character style transition.', contentUrl: absolute('/examples/dlss5-game-style-transition.mp4'), thumbnailUrl: absolute('/examples/generated/game-cyber-1-after.jpg'), duration: 'PT6S', uploadDate: '2026-10-11' },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: `${baseUrl}/` }, { '@type': 'ListItem', position: 2, name: BEFORE_AFTER_COPY.en.heading, item: `${baseUrl}/before-after` }] },
    ],
  };
}
