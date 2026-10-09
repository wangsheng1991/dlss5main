/**
 * DLSS 5 兼容性检测器的单一事实源。
 *
 * 规矩（写死在类型和 `verdict.ts` 的守卫里，不是口头约定）：
 *   1. 任何兼容性结论只能写在这个文件里，别处不许再写一份。
 *   2. `status` 不是 `'unknown'` 的条目，必须有非空 `sources` 和 `lastVerified`。
 *      拿不到官方来源就老老实实写 `'unknown'` —— 检测器宁可说「还没有结论」。
 *   3. `sources[].checkedAt` 是你**亲自打开那个链接看到结论**的日期，不是抓取日期。
 *   4. 官方来源互相矛盾时，写进 `conflicts`，不要挑一个好看的当唯一真相。
 *
 * TODO(DATA)：下面的示例条目刻意全部留成 `'unknown'`，就是不让任何人凭印象填数据。
 * 开工时按这个顺序取证据（每填一条就填一条的 `sources` 和 `lastVerified`）：
 *   - NVIDIA 新闻室 DLSS 5 发布稿（支持哪些卡、哪些游戏）
 *   - GeForce 驱动发布说明（哪个驱动版本引入支持）
 *   - NVIDIA DLSS 5 技术页 / 官方 FAQ
 * 详细需求见 `docs/DLSS5-CHECKER-REQUIREMENTS-20261010.md`。
 */

export type GpuStatus = 'confirmed' | 'planned' | 'unsupported' | 'unknown';

/** 我们自己的产品在这块卡上的可行度（竞品不会有的字段）。 */
export type WorkflowFit = 'good' | 'ok' | 'slow' | 'cloud-only';

export type SourceRef = {
  label: string;
  url: string;
  /** YYYY-MM-DD，人工核对日期。 */
  checkedAt: string;
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
    sources: [],
  },
];

/** 竞品有卡表而我们没有的雷区：AMD / Intel 是他们的空白，先占位，数据同样要有来源。 */
export const GPU_ENTRIES_PLANNED_SLUGS = [
  'rx-9070-xt', 'rx-7900-xtx', 'rx-7800-xt', 'arc-b580', 'arc-a770',
] as const;

/** 游戏页：只在官方明确给出支持时生成，别为凑页面数填。 */
export const GAME_ENTRIES: GameEntry[] = [];

/** 页面文案。检测区、结果区、「你能跑什么」区都从这里取词。 */
export const CHECKER_COPY = {
  path: '/dlss-checker',
  title: 'DLSS 5 GPU Compatibility Checker — detect your card',
  description:
    'Detect the GPU in your machine and see whether it runs DLSS 5, with the official source and the date we last verified it. Independent, not affiliated with NVIDIA.',
  heading: 'DLSS 5 GPU Checker',
  intro:
    'Read the graphics card in this machine, then tell you whether DLSS 5 runs on it — with the evidence and the date behind every answer.',
  detectCta: 'Detect my GPU',
  detectHint: 'Runs in your browser. Nothing about your hardware leaves this page.',
  unknownNotice:
    'No verified conclusion for this card yet. We publish a verdict only when an official source supports it.',
  /** TODO(王胜)：FAQ 要写成真实问答，并把同样的内容喂给 FAQPage 结构化数据。 */
  faqs: [
    {
      question: 'Does this page need a plugin or an installer?',
      answer: 'No. The detection runs in your browser through WebGPU, with a WebGL fallback.',
    },
  ],
} as const;

export function gpuEntryBySlug(slug: string): GpuEntry | undefined {
  return GPU_ENTRIES.find((entry) => entry.slug === slug);
}
