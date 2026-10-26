/**
 * DLSS 5 兼容性检测器的单一事实源。
 *
 * 规矩（写死在类型和 `verdict.ts` / `rules.ts` 的守卫里，不是口头约定）：
 *   1. 任何兼容性结论只能写在这个文件里，别处不许再写一份。
 *   2. `status` 不是 `'unknown'` 的条目，必须有非空 `sources` 和 `lastVerified`。
 *      拿不到官方来源就老老实实写 `'unknown'` —— 检测器宁可说「还没有结论」。
 *   3. `sources[].checkedAt` 是你**亲自打开那个链接看到结论**的日期，不是抓取日期。
 *   4. 官方来源互相矛盾时，写进 `conflicts`，不要挑一个好看的当唯一真相。
 *
 * 我们有**两条结论轴**，这是竞品只有一条的地方：
 *   - `status`        游戏里的 DLSS 5 支不支持（他们那根轴，我们照做）
 *   - `localSoftware` 我们自己的本地软件在这张卡上能不能跑、跑得怎么样（他们没有）
 * 两条轴分开写，因为答案常常不一样：一张 RTX 2060 游戏里可能还没有 DLSS 5，但我们的
 * 本地软件是支持的。
 *
 * GPU 功能表核对日期：2026-10-26。当前只发布 NVIDIA 官方明确支持或计划支持的结论；
 * 没有针对型号或架构的官方原文仍然保持 `'unknown'`。
 * 取证顺序：
 *   - NVIDIA 新闻室 DLSS 5 发布稿（支持哪些卡、哪些游戏）
 *   - GeForce 驱动发布说明（哪个驱动版本引入支持）
 *   - NVIDIA DLSS 5 技术页 / 官方 FAQ
 * 详细证据表见 `docs/DLSS5-CHECKER-EVIDENCE-20261010.md`。
 */

import { SITE_URL } from '../config/site';

export type GpuStatus = 'confirmed' | 'planned' | 'unsupported' | 'unknown';

/** 我们自己的产品在这块卡上的可行度（竞品不会有的字段）。 */
export type WorkflowFit = 'good' | 'ok' | 'slow' | 'cloud-only';

export type SourceRef = {
  label: string;
  url: string;
  /** YYYY-MM-DD，人工核对日期。 */
  checkedAt: string;
};

/** 本地软件的第二根轴。`measured` = 我们在这块卡上真跑过并留了数字。 */
export type LocalStudioFit = 'measured' | 'supported' | 'below-minimum' | 'unknown';

export type LocalSoftwareState = {
  fit: LocalStudioFit;
  /** 为什么是这个结论，会原样显示在结果页上。 */
  reason: string;
  /** 实测数字（有就填，它比形容词值钱）。 */
  evidence?: { machine: string; result: string };
};

export type GpuEntry = {
  /** URL 用，全小写连字符：`rtx-4070`。结果页是 `/dlss-checker/<slug>`。 */
  slug: string;
  vendor: 'nvidia' | 'amd' | 'intel';
  /** 展示名：`GeForce RTX 4070`。 */
  name: string;
  /** 浏览器检测字符串里可能出现的写法，用于模糊匹配。 */
  aliases: string[];
  generation: string;
  vramGb?: number;
  status: GpuStatus;
  /** 一句话结论，会直接出现在结果页 H1 下面。 */
  note?: string;
  ourWorkflows?: { upscale?: WorkflowFit; restore?: WorkflowFit };
  /** 第二根轴：我们的本地软件。 */
  localSoftware?: LocalSoftwareState;
  workflowTier?: WorkflowFit;
  features?: Record<GpuFeature, FeatureEvidence>;
  sources: SourceRef[];
  /** YYYY-MM-DD。 */
  lastVerified?: string;
  conflicts?: string[];
};

export type GpuFeature = 'neural' | 'superResolution' | 'frameGeneration' | 'multiFrameGeneration';
export type FeatureEvidence = { status: GpuStatus; note: string; sources: SourceRef[]; lastVerified: string };
export const GPU_CHECKED = '2026-10-26';
export const GPU_FEATURE_LABELS: Record<GpuFeature, string> = { neural: 'DLSS 5 neural rendering', superResolution: 'Super Resolution', frameGeneration: 'Frame Generation', multiFrameGeneration: 'Multi Frame Generation' };
export const GPU_SOURCES = {
  hardware: {label: 'NVIDIA supported hardware table', url: 'https://www.nvidia.com/en-us/geforce/technologies/dlss/', checkedAt: GPU_CHECKED},
  faq: {label: 'NVIDIA staff FAQ: RTX 40 future plan', url: 'https://www.nvidia.com/en-us/geforce/forums/nvidia-app/129/583738/dlss-5-faq-932026/', checkedAt: GPU_CHECKED},
  october: {label: 'NVIDIA October announcement: RTX Spark laptop scope', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-faster-ai-model-hogwarts-legacy-rtx-spark-laptops/', checkedAt: GPU_CHECKED},
  launch: {label: 'NVIDIA launch scope: NBA 2K27', url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/', checkedAt: GPU_CHECKED},
  cloud: {label: 'NVIDIA GeForce NOW system requirements', url: 'https://www.nvidia.com/en-us/geforce-now/system-reqs/', checkedAt: GPU_CHECKED},
} satisfies Record<string, SourceRef>;

export type GameEntry = {
  slug: string;
  title: string;
  status: GpuStatus;
  /** 哪些卡能跑到什么程度，自由文本，别编。 */
  evidence?: string;
  releaseDate?: string;
  sources: SourceRef[];
  lastVerified?: string;
};

/**
 * 本地软件 DLSS5 Studio 的硬要求。
 *
 * 这些字符串是**照抄我们自己已发布的 `/download` 要求页**（`src/content/studioPage.ts` 的
 * `req.*` 键）。改那边就要同步这里，否则检测器会对用户说假话 —— 见
 * `tests/dlss-checker.test.ts` 里的一致性用例。
 */
export const LOCAL_SOFTWARE = {
  name: 'DLSS5 Studio',
  summary: 'Our own local build: the whole pipeline runs on your machine, nothing is uploaded.',
  // 下面六行必须与 `studioPage.ts` 的 req.* 逐字一致 —— 有测试盯着（tests/dlss-checker.test.ts）。
  os: 'Windows 10 (1909 or newer, 64-bit) or Windows 11',
  gpu: 'An NVIDIA RTX GPU — RTX 20 series or newer',
  driver: '610 or newer for hardware NVENC encoding. On an older driver the encoder falls back to a software codec automatically and says so in the job message.',
  memory: '8 GB minimum; 16 GB recommended for 1080p and 4K video',
  disk: 'About 3 GB free — the portable folder is roughly 1.1 GB unpacked',
  engine: 'The NVIDIA Visual Enhancer release package. Studio drives it — it is not bundled inside this download.',
  onlineLane: 'If the local build does not fit this machine, the online converter runs the same pipeline in the browser.',
  /** 我们自己的实测数字，直接引，别改。 */
  measured: {
    machine: 'Windows 11 Pro, RTX 4090 24 GB, driver 591.86',
    result: '720p source → 2560×1440 H.264 MP4 in 87.4 s (2.43 s/frame; software encode on that driver)',
  },
  source: {
    label: 'DLSS5 Studio requirements (our own published page)',
    url: `${SITE_URL}/download`,
    checkedAt: '2026-10-10',
  } satisfies SourceRef,
} as const;

/** 我们有的两条交付路径；结论页永远要给出至少一条能走的。 */
export const DELIVERY_LANES = ['local-studio', 'online-converter'] as const;

/** 有一条来源可查的自证结论：RTX 20 系及以上可跑我们的本地软件。 */
const OURS_SUPPORTED: LocalSoftwareState = {
  fit: 'supported',
  reason: LOCAL_SOFTWARE.gpu,
};
const OURS_MEASURED: LocalSoftwareState = {
  fit: 'measured',
  reason: 'We ran it on this card ourselves and kept the numbers.',
  evidence: { machine: LOCAL_SOFTWARE.measured.machine, result: LOCAL_SOFTWARE.measured.result },
};
const OURS_BELOW_MINIMUM: LocalSoftwareState = {
  fit: 'below-minimum',
  reason: 'Below our published minimum (an NVIDIA RTX GPU, RTX 20 series or newer) — use the online converter instead.',
};

/** Series scope is explicitly named by NVIDIA, not inferred from model price or position.
 * Unknown means the reviewed table does not establish a conclusion for that vendor/model.
 */
function feature(status: GpuStatus, note: string, sources: SourceRef[] = [GPU_SOURCES.hardware]): FeatureEvidence {
  return { status, note, sources, lastVerified: GPU_CHECKED };
}
const outside = 'Not in the current published hardware range. This is not a claim about all future releases.';
const unknownFeature = () => feature('unknown', 'The reviewed NVIDIA table does not establish model-level support here; no unsupported verdict is inferred from omission.');
function nvidiaCard(model: string, series: '50' | '40' | '30' | '20'): GpuEntry {
  const neural = series === '50'
    ? feature('confirmed', 'NVIDIA names all RTX 50 Series GPUs; the checked launch game is NBA 2K27. A compatible GPU alone does not enable every game.', [GPU_SOURCES.hardware, GPU_SOURCES.launch])
    : series === '40'
      ? feature('planned', 'NVIDIA staff plan to work on RTX 40 support after RTX 50 tuning. No release date is promised; the current hardware table still shows a dash.', [GPU_SOURCES.faq, GPU_SOURCES.hardware])
      : feature('unsupported', outside);
  return {
    slug: `rtx-${model.toLowerCase().replaceAll(' ', '-')}`, vendor: 'nvidia', name: `GeForce RTX ${model}`,
    aliases: [`NVIDIA GeForce RTX ${model}`, `RTX ${model}`], generation: `GeForce RTX ${series} Series`,
    status: neural.status, note: neural.note, sources: neural.sources, lastVerified: GPU_CHECKED,
    localSoftware: model === '4090' ? OURS_MEASURED : { ...OURS_SUPPORTED, reason: 'Inference from our published RTX 20-series-or-newer minimum, not a test of this model. Other OS, memory, driver and engine requirements still apply.' },
    workflowTier: model === '4090' ? 'good' : 'ok',
    features: {
      neural,
      superResolution: feature('confirmed', 'Supported hardware family; the game must integrate this feature.'),
      frameGeneration: feature(series === '50' || series === '40' ? 'confirmed' : 'unsupported', series === '50' || series === '40' ? 'Supported hardware family; game integration is still required.' : outside),
      multiFrameGeneration: feature(series === '50' ? 'confirmed' : 'unsupported', series === '50' ? 'The official table lists Dynamic Multi Frame Generation for RTX 50. This does not assert every game or mode is available.' : outside),
    },
  };
}
export const GPU_ENTRIES_PLANNED_SLUGS = ['rx-9070-xt', 'rx-7900-xtx', 'rx-7800-xt', 'arc-b580', 'arc-a770'] as const;
export const GPU_ENTRIES: GpuEntry[] = [
  ...['5090', '5080', '5070 Ti', '5070', '5060'].map(model => nvidiaCard(model, '50')),
  ...['4090', '4080', '4070', '4060'].map(model => nvidiaCard(model, '40')),
  ...['3090', '3080', '3070', '3060'].map(model => nvidiaCard(model, '30')),
  ...['2080', '2060'].map(model => nvidiaCard(model, '20')),
  ...GPU_ENTRIES_PLANNED_SLUGS.map((slug): GpuEntry => ({
    slug, vendor: slug.startsWith('rx-') ? 'amd' : 'intel',
    name: slug.startsWith('rx-') ? `Radeon ${slug.toUpperCase().replaceAll('-', ' ')}` : `Intel Arc ${slug.slice(4).toUpperCase()}`,
    aliases: [slug.replaceAll('-', ' ')], generation: slug.startsWith('rx-') ? 'AMD Radeon' : 'Intel Arc', status: 'unknown',
    note: 'No model-level NVIDIA DLSS conclusion in the reviewed sources. A remote cloud session is a separate path.',
    sources: [GPU_SOURCES.hardware], lastVerified: GPU_CHECKED,
    localSoftware: {...OURS_BELOW_MINIMUM, reason: 'Inference: this is not an NVIDIA RTX GPU, so it does not meet our published local-build GPU requirement. The independent browser workflow is a separate option.'}, workflowTier: 'cloud-only',
    features: { neural: unknownFeature(), superResolution: unknownFeature(), frameGeneration: unknownFeature(), multiFrameGeneration: unknownFeature() },
  })),
  {slug: 'gtx-1060', vendor: 'nvidia', name: 'GeForce GTX 1060', aliases: ['GTX 1060'], generation: 'GeForce GTX 10 Series', status: 'unknown', sources: [GPU_SOURCES.hardware], lastVerified: GPU_CHECKED,
    localSoftware: {...OURS_BELOW_MINIMUM, reason: 'Inference from the published RTX minimum; this GTX card is outside that requirement, not a measured speed result.'}, workflowTier: 'cloud-only',
    features: {neural: unknownFeature(), superResolution: unknownFeature(), frameGeneration: unknownFeature(), multiFrameGeneration: unknownFeature()}},
];

/** 游戏页：只在官方明确给出支持时生成，别为凑页面数填。 */
export const GAME_ENTRIES: GameEntry[] = [
  {
    slug: 'nba-2k27',
    title: 'NBA 2K27',
    status: 'confirmed',
    evidence: 'NVIDIA says the PC version enables DLSS 5 on GeForce RTX 50 Series GPUs and laptops; GeForce NOW Ultimate streams it from NVIDIA RTX 5080-powered rigs. The in-game setting is called “DLSS Neural Rendering”.',
    releaseDate: '2026-09-03',
    sources: [
      {
        label: 'NVIDIA DLSS 5 launch article',
        url: 'https://www.nvidia.com/en-us/geforce/news/dlss-5-3d-guided-neural-rendering/',
        checkedAt: '2026-10-10',
      },
      {
        label: 'NVIDIA GeForce Game Ready Driver 616.64 article',
        url: 'https://www.nvidia.com/en-us/geforce/news/nba-2k27-dlss-5-3d-guided-neural-rendering-geforce-game-ready-driver/',
        checkedAt: '2026-10-10',
      },
    ],
    lastVerified: '2026-10-10',
  },
];

/** 页面文案。检测区、结果区、「你能跑什么」区、方法论区都从这里取词。 */
export const CHECKER_COPY = {
  path: '/dlss-checker',
  title: 'DLSS 5 GPU Compatibility Checker — detect your card',
  description:
    'Detect the GPU in your machine and see two answers: whether DLSS 5 runs in games, and whether our own local build runs on it — each with its source and the date we last verified it. Independent, not affiliated with NVIDIA.',
  heading: 'DLSS 5 GPU Checker',
  intro:
    'Read the graphics card in this machine, then answer two separate questions — does DLSS 5 run in games, and does our local build run here — with the evidence and the date behind every answer.',
  detectCta: 'Detect my GPU',
  detectHint: 'Runs in your browser. Nothing about your hardware leaves this page.',
  unknownNotice:
    'No verified conclusion for this card yet. We publish a verdict only when an official source supports it.',
  localHeading: 'What you can run on this machine',
  methodHeading: 'How we decide',
  methodBody:
    'Every answer on this page comes from one of three places: an official source we link to, a rule we publish and derive from, or a measurement we made ourselves. Anything else stays "no verified conclusion yet" — including cards we list but have not sourced.',
  /** TODO(王胜)：FAQ 要写成真实问答，并把同样的内容喂给 FAQPage 结构化数据。 */
  faqs: [
    {
      question: 'Does this page need a plugin or an installer?',
      answer: 'No. The detection runs in your browser through WebGPU, with a WebGL fallback.',
    },
    {
      question: 'Why do the two answers sometimes disagree?',
      answer:
        'In-game DLSS 5 support and our local build have different requirements. A card can run our build while the game-side feature is not available yet, and the reverse.',
    },
  ],
} as const;

export function gpuEntryBySlug(slug: string): GpuEntry | undefined {
  return GPU_ENTRIES.find((entry) => entry.slug === slug);
}

export type CheckerPage = { slug: string; path: string; keyword: string; heading: string; intro: string; cards: GpuEntry[]; faqs: {question: string; answer: string}[] };
const familySpecs = [
  ['rtx-50', 'dlss 5 rtx 50 series', 'DLSS 5 on RTX 50 Series', 'RTX 50 is in NVIDIA’s published neural-rendering range. Check the game separately; Studio eligibility below is an independent product question.'],
  ['rtx-40', 'dlss 5 rtx 40 series', 'DLSS 5 on RTX 40 Series', 'RTX 40 neural rendering is a future plan, not current support. Super Resolution and Frame Generation have their own published hardware scope.'],
  ['rtx-30', 'will DLSS 5 work on older GPUs RTX 30', 'Will DLSS 5 work on older GPUs? RTX 30', 'RTX 30 is outside the current neural-rendering hardware table, while Super Resolution is listed. Our Studio minimum is a separate requirement.'],
  ['rtx-20', 'will DLSS 5 work on older GPUs RTX 20', 'Will DLSS 5 work on older GPUs? RTX 20', 'RTX 20 is outside the current neural-rendering hardware table. Super Resolution support does not imply neural rendering, Frame Generation or MFG support.'],
  ['amd', 'dlss 5 on AMD', 'DLSS 5 on AMD: local, cloud and demos', 'The reviewed NVIDIA sources do not confirm native DLSS 5 on these AMD models. Cloud streaming and third-party demonstrations do not establish local GPU support.'],
] as const;
export const AMD_PATHS = [
  {name: 'Native game runtime', detail: 'Unconfirmed for the listed AMD models in our reviewed NVIDIA sources.', source: GPU_SOURCES.hardware},
  {name: 'Cloud streaming', detail: 'Separate service path: server-side rendering does not prove native AMD support. Check provider, plan, client and game requirements.', source: GPU_SOURCES.cloud},
  {name: 'Third-party demonstrations', detail: 'A demonstration is not official model-level support evidence; no third-party binary is supplied or validated here.', source: GPU_SOURCES.hardware},
];
const commonFaqs = [
  ...CHECKER_COPY.faqs,
  {question: 'Does a hardware check prove support in every game?', answer: 'No. The hardware table describes feature eligibility. A game must integrate the relevant feature; the checked DLSS 5 launch source names NBA 2K27.'},
  {question: 'What does the Studio tier mean?', answer: 'The local axis concerns our independent game-character style conversion / neural-render redraw workflow. Except for the labelled historical RTX 4090 record, tiers are inferences from our published minimum, not speed measurements or NVIDIA feature claims.'},
];
function checkerPage(slug: string, keyword: string, heading: string, intro: string, cards: GpuEntry[]): CheckerPage {
  return {slug, path: `/dlss-checker${slug ? `/${slug}` : ''}`, keyword, heading, intro, cards, faqs: [
    ...(slug === 'rtx-40' || slug === 'rtx-4090' ? [{question: 'Will the RTX 40 series get DLSS 5?', answer: 'NVIDIA staff say they plan to work on RTX 40 support after RTX 50 performance tuning. That is a plan without a promised date; the current supported-hardware table still marks neural rendering unavailable for RTX 40.'}] : []),
    ...(slug === 'rtx-50' ? [{question: 'Does this table cover laptops and RTX Spark?', answer: 'NVIDIA’s launch source includes RTX 50 Series GPUs and laptops. Our rows and Studio measurements are desktop-specific. The October article separately announced an RTX Spark laptop rollout; it does not make Spark a desktop model or prove laptop performance from a desktop test. Check the dated NVIDIA sources below for the exact scope.'}] : []),
    ...commonFaqs,
  ]};
}
export const CHECKER_PAGES: CheckerPage[] = [
  checkerPage('', 'dlss 5 supported cards', 'DLSS 5 supported cards', 'RTX 50 neural rendering is confirmed for the checked launch scope; RTX 40 has a future plan. Read each feature separately, then check whether our independent Studio workflow fits your card.', GPU_ENTRIES),
  ...familySpecs.map(([slug, keyword, heading, intro]) => checkerPage(slug, keyword, heading, intro, GPU_ENTRIES.filter(card => slug === 'amd' ? card.vendor === 'amd' : card.slug.startsWith(slug)))),
  // A model page requires a distinct deliverable, not a copy of its family row.
  ...GPU_ENTRIES.filter(card => card.status !== 'unknown' && card.localSoftware?.fit === 'measured' && card.localSoftware.evidence).map(card => checkerPage(card.slug, `will DLSS 5 run on a ${card.slug.slice(4)}`, `Will DLSS 5 run on a ${card.slug.slice(4)}?`, 'RTX 4090 game-side neural rendering remains planned, not currently supported. Our separate local Studio workflow has a historical run record on this card; it is not a game FPS benchmark.', [card])),
];
export function checkerSchema(page: CheckerPage) {
  return {'@context': 'https://schema.org', '@graph': [
    {'@type': 'WebPage', '@id': `${SITE_URL}${page.path}#webpage`, url: `${SITE_URL}${page.path}`, name: page.heading, description: page.intro, dateModified: GPU_CHECKED, inLanguage: 'en-US'},
    {'@type': 'FAQPage', '@id': `${SITE_URL}${page.path}#faq`, mainEntity: page.faqs.map(faq => ({'@type': 'Question', name: faq.question, acceptedAnswer: {'@type': 'Answer', text: faq.answer}}))},
  ]};
}
