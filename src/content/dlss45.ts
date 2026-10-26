import { SITE_URL } from '../config/site';
export const DLSS45 = {
  path: '/dlss-4-5',
  title: 'DLSS 4.5：超分、Dynamic MFG 与 6X 的状态边界',
  intro: 'DLSS 4.5＝第二代 transformer 超分＋Dynamic/6X 多帧生成；两者可用状态不同。',
  source: 'https://www.nvidia.com/en-us/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/',
  checked: '2026-10-26',
  attribution: 'NVIDIA · 2026-01-06 · 核对 2026-10-26',
  boundary: '本页只记录 2026-01-06 原文与核对日；我们未复核该文之后的官方更新，因此不推断今天的最新版本状态。本站没有游戏运行时，不做游戏帧率实测。',
} as const;
export const DLSS45_ROWS = [
  {
    "component": "DLSS 4.5 Super Resolution（第二代 transformer）",
    "quote": "introducing a 2nd generation transformer model for DLSS Super Resolution, delivering state-of-the-art image quality for all GeForce RTX GPUs in over 400 games and apps",
    "gpu": "所有 GeForce RTX",
    "status": "原文称已可用，可通过 NVIDIA app 升级。"
  },
  {
    "component": "Dynamic Multi Frame Generation + 6X MFG",
    "quote": "This Spring, NVIDIA DLSS 4.5 Dynamic Multi Frame Generation and 6X Multi Frame Generation will be released for GeForce RTX 50 Series GPUs",
    "gpu": "GeForce RTX 50 系",
    "status": "原文仅承诺今年春季推出的窗口；未复核后续更新，不确认今天是否已上线。"
  },
  {
    "component": "FP8 推理吞吐",
    "quote": "DLSS 4.5 Super Resolution takes full advantage of GeForce RTX 40 and 50 Series GPUs, which benefit from faster, more advanced Tensor Cores in our latest architectures. By leveraging FP8 precision capabilities, the hardware doubles inference throughput",
    "gpu": "RTX 40 / 50 系",
    "status": "原文称硬件层面推理吞吐翻倍，相对第一代有轻微性能代价；不是本站测量。"
  },
  {
    "component": "4X → 6X 的帧率",
    "quote": "increases 4K frame rates in path-traced titles by up to 35%",
    "gpu": "RTX 50 系、4K、路径追踪；从 4X 到 6X Multi Frame Generation",
    "status": "原文称上述条件下最高 35%；不是游戏快 6 倍，也不是本站游戏实测。"
  }
];
export const DLSS45_FAQ = [
  {
    "q": "DLSS 4.5 现在能用吗？",
    "a": "需要分部件看。2026-01-06 原文称 Super Resolution 已可用，可通过 NVIDIA app 升级；Dynamic Multi Frame Generation 与 6X MFG 仅承诺春季窗口。我们未复核后续官方更新，不推断今天的最新状态。"
  },
  {
    "q": "6X 是画质还是帧率？",
    "a": "它是每个原生帧最多生成 5 个额外帧的倍率口径，不是画质或延迟结论，也不能直接说游戏快 6 倍。"
  },
  {
    "q": "RTX 30 / 20 系能用吗？",
    "a": "该文将 Super Resolution 的范围写为所有 GeForce RTX，而 Dynamic MFG / 6X MFG 的范围写为 RTX 50 系；不能由超分范围推导老卡支持 6X MFG。"
  },
  {
    "q": "它和 DLSS 5 是什么关系？",
    "a": "本页整理的是 DLSS 4.5 的超分与多帧生成部件，不把这些范围当成 DLSS 5 的兼容性结论。可前往对比页和硬件检测器分别核对；本站独立 Studio 图像工作流也不是游戏运行时。"
  },
  {
    "q": "最高 35% 是什么条件下的数？",
    "a": "这是 NVIDIA 对 RTX 50 系在 4K 路径追踪游戏中从 4X 到 6X Multi Frame Generation 的说法，不是通用提升，也不是本站观测。"
  }
];
export function dlss45Schema(locale: 'en' | 'zh' = 'en') {
  const { page: DLSS45, faq: DLSS45_FAQ } = dlss45Copy(locale);
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebPage',name:DLSS45.title,description:DLSS45.intro,url:SITE_URL+DLSS45.path,inLanguage:locale === 'zh' ? 'zh-CN' : 'en-US',dateModified:DLSS45.checked,citation:DLSS45.source},
    {'@type':'FAQPage',mainEntity:DLSS45_FAQ.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
  ]};
}

const EN_TEXT: Record<string, string> = {
  "DLSS 4.5：超分、Dynamic MFG 与 6X 的状态边界": "DLSS 4.5: Super Resolution, Dynamic MFG and 6X status limits",
  "DLSS 4.5＝第二代 transformer 超分＋Dynamic/6X 多帧生成；两者可用状态不同。": "DLSS 4.5 combines second-generation transformer Super Resolution with Dynamic/6X Multi Frame Generation; their availability is separate.",
  "NVIDIA · 2026-01-06 · 核对 2026-10-26": "NVIDIA · 2026-01-06 · Checked 2026-10-26",
  "本页只记录 2026-01-06 原文与核对日；我们未复核该文之后的官方更新，因此不推断今天的最新版本状态。本站没有游戏运行时，不做游戏帧率实测。": "This page records only the 2026-01-06 article and our check date. We have not reviewed subsequent official updates, so we do not infer today's latest version status. This site has no game runtime and does not measure in-game frame rates.",
  "DLSS 4.5 Super Resolution（第二代 transformer）": "DLSS 4.5 Super Resolution (second-generation transformer)",
  "所有 GeForce RTX": "All GeForce RTX",
  "原文称已可用，可通过 NVIDIA app 升级。": "The article says it is available and can be upgraded through the NVIDIA app.",
  "GeForce RTX 50 系": "GeForce RTX 50 Series",
  "原文仅承诺今年春季推出的窗口；未复核后续更新，不确认今天是否已上线。": "The article promises only a spring release window; subsequent updates were not reviewed, so availability today is not confirmed.",
  "FP8 推理吞吐": "FP8 inference throughput",
  "RTX 40 / 50 系": "RTX 40 / 50 Series",
  "原文称硬件层面推理吞吐翻倍，相对第一代有轻微性能代价；不是本站测量。": "The article describes doubled hardware inference throughput and a slight performance cost relative to the first generation; this is not our measurement.",
  "4X → 6X 的帧率": "Frame rates from 4X → 6X",
  "RTX 50 系、4K、路径追踪；从 4X 到 6X Multi Frame Generation": "RTX 50 Series, 4K, path tracing; from 4X to 6X Multi Frame Generation",
  "原文称上述条件下最高 35%；不是游戏快 6 倍，也不是本站游戏实测。": "The article claims up to 35% under those conditions; this does not mean games run 6 times faster and is not our in-game measurement.",
  "DLSS 4.5 现在能用吗？": "Is DLSS 4.5 available now?",
  "需要分部件看。2026-01-06 原文称 Super Resolution 已可用，可通过 NVIDIA app 升级；Dynamic Multi Frame Generation 与 6X MFG 仅承诺春季窗口。我们未复核后续官方更新，不推断今天的最新状态。": "It depends on the component. The 2026-01-06 article says Super Resolution is available through an NVIDIA app upgrade; Dynamic Multi Frame Generation and 6X MFG are only promised for spring. We have not reviewed later official updates and do not infer today's latest status.",
  "6X 是画质还是帧率？": "Does 6X describe image quality or frame rates?",
  "它是每个原生帧最多生成 5 个额外帧的倍率口径，不是画质或延迟结论，也不能直接说游戏快 6 倍。": "It means generating up to 5 additional frames per native frame. It is not an image-quality or latency conclusion and does not directly mean games run 6 times faster.",
  "RTX 30 / 20 系能用吗？": "Can RTX 30 / 20 Series use it?",
  "该文将 Super Resolution 的范围写为所有 GeForce RTX，而 Dynamic MFG / 6X MFG 的范围写为 RTX 50 系；不能由超分范围推导老卡支持 6X MFG。": "The article lists all GeForce RTX for Super Resolution, but RTX 50 Series for Dynamic MFG / 6X MFG. Super Resolution coverage does not establish 6X MFG support for older cards.",
  "它和 DLSS 5 是什么关系？": "How does this relate to DLSS 5?",
  "本页整理的是 DLSS 4.5 的超分与多帧生成部件，不把这些范围当成 DLSS 5 的兼容性结论。可前往对比页和硬件检测器分别核对；本站独立 Studio 图像工作流也不是游戏运行时。": "This page covers DLSS 4.5 Super Resolution and Multi Frame Generation, not DLSS 5 compatibility conclusions. Check the comparison page and hardware checker separately; our independent Studio image workflow is not a game runtime either.",
  "最高 35% 是什么条件下的数？": "What conditions apply to the up to 35% figure?",
  "这是 NVIDIA 对 RTX 50 系在 4K 路径追踪游戏中从 4X 到 6X Multi Frame Generation 的说法，不是通用提升，也不是本站观测。": "This is NVIDIA's statement about RTX 50 Series at 4K in path-traced games when moving from 4X to 6X Multi Frame Generation. It is not a universal improvement or our observation.",
  "原文日期、部件、显卡与状态分开看": "Separate the source date, component, GPU and status",
  "以下为 NVIDIA 的说法，我们没有在游戏里复现。唯一来源：": "The following are NVIDIA's statements; we have not reproduced them in games. Sole source: ",
  "NVIDIA 的 DLSS 4.5 公告": "NVIDIA's DLSS 4.5 announcement",
  "，署名 Henry Lin &amp; Andrew Burnes，January 06, 2026；核对日 ": ", by Henry Lin & Andrew Burnes, January 06, 2026; checked ",
  "。英文栏保留原文，中文栏仅作解释。": ". The quotation column preserves the original wording; the other columns explain its scope.",
  "倍率、时间与本站工作流的边界": "Multiplier, timing and our workflow boundaries",
  "6X 是每个原生帧最多生成 5 个额外帧的倍率口径，不是画质或延迟结论。": "6X means generating up to 5 additional frames per native frame; it is not an image-quality or latency conclusion.",
  "本站的游戏人物风格转换与 Studio 图像工作流独立于 NVIDIA 游戏运行时。浏览器图片结果和本地批处理都不能证明游戏内的功能或性能。": "Our game-character style conversion and Studio image workflow are independent of NVIDIA's game runtime. Browser image results and local batch processing do not establish in-game functionality or performance.",
  "DLSS 5 与 DLSS 4.5 差别": "Differences between DLSS 5 and DLSS 4.5",
  "DLSS 兼容性检测：显卡范围与我们的软件分开核对": "DLSS compatibility checker: GPU scope and our software checked separately",
  "DLSS 下载路径与独立 Studio": "DLSS download paths and independent Studio",
  "DLSS 支持游戏与公告状态": "DLSS supported games and announcement status",
  "常见问题": "Frequently asked questions",
  "部件": "Component",
  "原文怎么说（英文）": "Original wording (English)",
  "适用显卡": "GPU scope",
  "状态（按 2026-01-06 原文）": "Status according to the 2026-01-06 article",
  "相关资料": "Related references"
};
export function dlss45Text(locale: 'en' | 'zh', text: string): string {
  if (locale === 'zh') return text.replaceAll('&amp;', '&');
  if (EN_TEXT[text] !== undefined) return EN_TEXT[text];
  if (/[\u4e00-\u9fff]/.test(text)) throw new Error('Missing dlss45 translation: ' + text);
  return text;
}
function translateValue<T>(value: T, locale: 'en' | 'zh'): T {
  if (typeof value === 'string') return dlss45Text(locale, value) as T;
  if (Array.isArray(value)) return value.map(v => translateValue(v, locale)) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, translateValue(v, locale)])) as T;
  return value;
}
export function dlss45Copy(locale: 'en' | 'zh' = 'en') {
  return { page: {...translateValue(DLSS45, locale), path: (locale === 'zh' ? '/zh' : '') + DLSS45.path}, rows: translateValue(DLSS45_ROWS, locale), faq: translateValue(DLSS45_FAQ, locale) };
}
export const DLSS45_ALTERNATES = [{hrefLang:'en',href:SITE_URL+DLSS45.path},{hrefLang:'zh-CN',href:SITE_URL+'/zh'+DLSS45.path},{hrefLang:'x-default',href:SITE_URL+DLSS45.path}];
