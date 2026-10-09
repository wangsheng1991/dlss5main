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
 * TODO(DATA)：示例条目的 `status` 刻意全部留成 `'unknown'`，就是不让任何人凭印象填数据。
 * 开工时按这个顺序取证据（每填一条就填一条的 `sources` 和 `lastVerified`）：
 *   - NVIDIA 新闻室 DLSS 5 发布稿（支持哪些卡、哪些游戏）
 *   - GeForce 驱动发布说明（哪个驱动版本引入支持）
 *   - NVIDIA DLSS 5 技术页 / 官方 FAQ
 * 详细需求见 `docs/DLSS5-CHECKER-REQUIREMENTS-20261010.md`。
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
  sources: SourceRef[];
  /** YYYY-MM-DD。 */
  lastVerified?: string;
  conflicts?: string[];
};

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

/**
 * 首批要覆盖的卡。`status` 一律先留 `'unknown'`：有官方依据再改成 confirmed/planned/unsupported。
 * `aliases` 已按浏览器会吐出的字符串写好，检测时直接用，不需要你改。
 */
export const GPU_ENTRIES: GpuEntry[] = [
  {
    slug: 'rtx-5090',
    vendor: 'nvidia',
    name: 'GeForce RTX 5090',
    aliases: ['NVIDIA GeForce RTX 5090', 'RTX 5090', 'GB202'],
    generation: 'Blackwell',
    vramGb: 32,
    status: 'unknown',
    localSoftware: OURS_SUPPORTED,
    sources: [],
  },
  {
    slug: 'rtx-5080',
    vendor: 'nvidia',
    name: 'GeForce RTX 5080',
    aliases: ['NVIDIA GeForce RTX 5080', 'RTX 5080', 'GB203'],
    generation: 'Blackwell',
    vramGb: 16,
    status: 'unknown',
    localSoftware: OURS_SUPPORTED,
    sources: [],
  },
  {
    slug: 'rtx-4090',
    vendor: 'nvidia',
    name: 'GeForce RTX 4090',
    aliases: ['NVIDIA GeForce RTX 4090', 'RTX 4090', 'AD102'],
    generation: 'Ada Lovelace',
    vramGb: 24,
    status: 'unknown',
    localSoftware: OURS_MEASURED,
    sources: [],
  },
  {
    slug: 'rtx-4070',
    vendor: 'nvidia',
    name: 'GeForce RTX 4070',
    aliases: ['NVIDIA GeForce RTX 4070', 'RTX 4070', 'AD104'],
    generation: 'Ada Lovelace',
    vramGb: 12,
    status: 'unknown',
    localSoftware: OURS_SUPPORTED,
    sources: [],
  },
  {
    slug: 'rtx-3060',
    vendor: 'nvidia',
    name: 'GeForce RTX 3060',
    aliases: ['NVIDIA GeForce RTX 3060', 'RTX 3060', 'GA106'],
    generation: 'Ampere',
    vramGb: 12,
    status: 'unknown',
    localSoftware: OURS_SUPPORTED,
    sources: [],
  },
  {
    slug: 'gtx-1060',
    vendor: 'nvidia',
    name: 'GeForce GTX 1060',
    aliases: ['NVIDIA GeForce GTX 1060', 'GTX 1060', 'GP106'],
    generation: 'Pascal',
    vramGb: 6,
    status: 'unknown',
    localSoftware: OURS_BELOW_MINIMUM,
    sources: [],
  },
];

/** 竞品有卡表而我们没有的雷区：AMD / Intel 是他们的空白，先占位，数据同样要有来源。 */
export const GPU_ENTRIES_PLANNED_SLUGS = [
  'rx-9070-xt', 'rx-7900-xtx', 'rx-7800-xt', 'arc-b580', 'arc-a770',
] as const;

/** 游戏页：只在官方明确给出支持时生成，别为凑页面数填。 */
export const GAME_ENTRIES: GameEntry[] = [];

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
