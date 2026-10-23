export const FEATURE_PICKER_MARKER = '[[which-feature-picker]]';
export const FEATURE_PICKER_SLUG = 'dlss5-vs-dlss4-vs-fsr4-comparison-2026';
export const REVIEWED = '2026-10-23';
export type PickerLocale = 'en' | 'zh';
export type Goal = 'speed' | 'quality' | 'lighting';
export type Gpu = '50' | '40' | '30' | 'earlier' | 'unknown';
export type Game = 'yes' | 'no' | 'unknown';
export type Support = 'supported' | 'unsupported' | 'unknown';
export const SOURCES = {
  launch: { label: 'NVIDIA DLSS 5', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/' },
  dlss4: { label: 'NVIDIA DLSS 4', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-4-multi-frame-generation-out-now/' },
  fsr: { label: 'AMD FSR', url: 'https://www.amd.com/en/products/graphics/technologies/fidelityfx/super-resolution.html' },
} as const;
export const FEATURES = {
  nr: { en: 'DLSS 5 · lighting and materials', zh: 'DLSS 5 · 光照与材质', source: 'launch' },
  sr: { en: 'DLSS Super Resolution', zh: 'DLSS 超分辨率', source: 'dlss4' },
  fg: { en: 'DLSS Frame Generation', zh: 'DLSS 帧生成', source: 'dlss4' },
  mfg: { en: 'DLSS Multi Frame Generation', zh: 'DLSS 多帧生成', source: 'dlss4' },
  rr: { en: 'DLSS Ray Reconstruction / DLAA', zh: 'DLSS 光线重建 / DLAA 抗锯齿', source: 'dlss4' },
  fsr: { en: 'FSR Upscaling', zh: 'FSR Upscaling 超分', source: 'fsr' },
} as const;
export type Feature = keyof typeof FEATURES;
export const GOALS: Record<Goal, Feature[]> = { speed: ['sr', 'fg', 'mfg'], quality: ['sr', 'rr', 'fsr'], lighting: ['nr'] };
export const PICKER_COPY = {
  en: {
    heading: 'Which feature should I look at?', intro: 'Choose your goal, GPU and game scope. No login, upload or model call.',
    scope: 'Checked DLSS 5 game list for this picker: NBA 2K27 only. “Yes” means this game, not any announced title. Local PC use only; cloud play is outside this check.',
    goal: 'Your goal', goals: { speed: 'Improve frame delivery', quality: 'Improve reconstruction and anti-aliasing', lighting: 'Improve lighting and materials' },
    gpu: 'Your GPU series', gpus: { '50': 'RTX 50', '40': 'RTX 40', '30': 'RTX 30', earlier: 'Earlier / other GPU', unknown: 'Not sure' },
    game: 'Is your game on this checked DLSS 5 list?', games: { yes: 'Yes — NBA 2K27', no: 'No — another game', unknown: 'Not sure' },
    status: { supported: 'Supported', unsupported: 'Not supported', unknown: 'Unknown' },
    result: 'Features to check', source: 'Source', reviewed: 'Reviewed', table: 'Static reference — readable without JavaScript', feature: 'Feature', evidence: 'Checked scope and limits',
    missingGpu: 'GPU is outside the checked range or not identified. This is not a hardware detection tool.',
    missingGame: 'Game is outside this checked list or not identified. Absence from our list does not mean unsupported.',
    confirmed: 'Confirmed for NBA 2K27 on RTX 50 by the launch source; a compatible game build and driver are still required.',
    excluded: 'This GPU series does not meet the documented hardware requirement for this feature.',
    incomplete: 'We have not verified this exact GPU, game and feature combination. DLSS 5 support alone does not confirm other features.',
    where: 'Confirm in the game’s video settings, then check the required driver in NVIDIA App. An App override is not proof of game integration.',
    whereFsr: 'Check the game’s FSR setting and AMD’s supported hardware/game information. This picker does not identify a Radeon model.',
    staticConfirmed: 'Supported: NBA 2K27 + RTX 50 for neural rendering, Super Resolution and frame generation. Other combinations remain unknown here.',
    staticHardware: 'Multi Frame Generation requires RTX 50; Frame Generation requires RTX 40 or RTX 50. A compatible GPU alone does not confirm a game.',
    staticUnknown: 'Unknown for this picker’s game/GPU combinations. Verify the feature separately; do not infer it from DLSS 5 support.',
  },
  zh: {
    heading: '该看哪个功能？', intro: '选择目标、显卡与游戏范围。无需登录、不上传、不调用模型。',
    scope: '本选择器已核对的 DLSS 5 游戏名单：仅 NBA 2K27。“是”只指这款游戏，不包括仅公布计划的游戏。本次只核对本地 PC，不判断云游戏。',
    goal: '你的目标', goals: { speed: '想提帧', quality: '想改善重建与抗锯齿', lighting: '想改善光照与材质' },
    gpu: '你的 GPU 系列', gpus: { '50': 'RTX 50', '40': 'RTX 40', '30': 'RTX 30', earlier: '更早 / 其他显卡', unknown: '不确定' },
    game: '游戏是否在本组件已核对的 DLSS 5 名单里？', games: { yes: '是 — NBA 2K27', no: '否 — 其他游戏', unknown: '不确定' },
    status: { supported: '支持', unsupported: '不支持', unknown: '未知' },
    result: '建议核对的功能', source: '来源', reviewed: '核对日期', table: '静态对照表 — 关闭 JavaScript 仍可阅读', feature: '功能', evidence: '已核对范围与边界',
    missingGpu: '显卡超出已核对范围或型号不确定。本组件不会自动检测硬件。',
    missingGame: '游戏不在已核对名单或不确定。不在我们的名单，不等于不支持。',
    confirmed: '发布来源已确认 NBA 2K27 在 RTX 50 上支持；仍需匹配的游戏版本与驱动。',
    excluded: '这个显卡系列不满足该功能已公布的硬件要求。',
    incomplete: '尚未核对这个显卡、游戏与功能的完整组合。支持 DLSS 5 不等于支持其他功能。',
    where: '到游戏视频设置确认开关，再在 NVIDIA App 核对所需驱动版本。App 覆盖设置不等于游戏已集成。',
    whereFsr: '核对游戏中的 FSR 开关，以及 AMD 的硬件与游戏支持资料。本组件没有识别 Radeon 具体型号。',
    staticConfirmed: '支持：NBA 2K27 + RTX 50 的神经渲染、超分及帧生成。其他组合在这里仍为未知。',
    staticHardware: '多帧生成要求 RTX 50；帧生成要求 RTX 40 或 RTX 50。仅显卡符合要求，不能证明游戏支持。',
    staticUnknown: '本组件未核对这些游戏与显卡组合，状态未知。需单独核实该功能，不从 DLSS 5 支持推断。',
  },
} as const;
export function featureVerdict(feature: Feature, gpu: Gpu, game: Game): { status: Support; reason: 'missingGpu' | 'missingGame' | 'confirmed' | 'excluded' | 'incomplete'; source: keyof typeof SOURCES } {
  const source = FEATURES[feature].source;
  if (!['50', '40', '30'].includes(gpu)) return { status: 'unknown', reason: 'missingGpu', source };
  if (game !== 'yes') return { status: 'unknown', reason: 'missingGame', source };
  if ((feature === 'mfg' && gpu !== '50') || (feature === 'fg' && gpu === '30')) return { status: 'unsupported', reason: 'excluded', source };
  if (gpu === '50' && ['nr', 'sr', 'fg', 'mfg'].includes(feature)) return { status: 'supported', reason: 'confirmed', source: 'launch' };
  return { status: 'unknown', reason: 'incomplete', source };
}
