/**
 * 判定引擎：把「检测到的字符串」变成「一个敢写在页面上的结论」。
 *
 * 这里唯一的硬规矩：**没有来源、没有核对日期，就不许给结论。**
 * `canConclude()` 是守卫，`verdictFor()` 会把它压回 `'unknown'` —— 就算有人在数据文件里
 * 手滑写了 `status: 'confirmed'` 却没填 `sources`，页面也只会显示「还没有结论」。
 *
 * TODO(王胜)：
 *   - `planned` 要带时间窗口（官方说「未来支持」时，写清是哪一版驱动/哪一季）
 *   - 冲突来源的加权（官方 > 媒体 > 社区），并如实把 `conflicts` 展示出来
 *   - 置信度：同一结论有几个独立官方来源
 */

import type { GpuEntry, GpuStatus } from '../../content/dlssChecker';

export type Verdict = {
  status: GpuStatus;
  /** 页面上的徽章文字。 */
  label: string;
  /** 给样式用的语气，不是给用户看的。 */
  tone: 'positive' | 'neutral' | 'negative' | 'muted';
  /** 为什么是这个结论（页面会把这些行显示在结论下面）。 */
  reasons: string[];
};

const LABELS: Record<GpuStatus, { label: string; tone: Verdict['tone'] }> = {
  confirmed: { label: 'Runs DLSS 5', tone: 'positive' },
  planned: { label: 'Support announced, not shipped', tone: 'neutral' },
  unsupported: { label: 'Not supported', tone: 'negative' },
  unknown: { label: 'No verified conclusion yet', tone: 'muted' },
};

/** 把浏览器吐出来的显卡串归一化：去掉厂商名、API 后缀、括号和多余空格。 */
export function normalizeGpuName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(r\)|\(tm\)|\(c\)/g, ' ')
    .replace(/angle|direct3d\d*|opengl|vulkan|metal|d3d\d*|vs_\d_\d|ps_\d_\d|shader model [\d.]+/g, ' ')
    .replace(/nvidia|geforce|amd|ati|radeon|intel|graphics|corporation|inc\.?/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 压成可比较的紧致串：`rtx4070`。空格差异不该影响匹配。 */
function compact(value: string): string {
  return normalizeGpuName(value).replace(/\s+/g, '');
}

/**
 * 用检测到的原始字符串找数据条目。先精确（slug / 别名 / 展示名），再按紧致串包含关系，
 * 最后按「词全在」兜底 —— 三层都命中不了就返回 undefined，交给页面显示手动选择。
 */
export function matchGpu(raw: string, entries: GpuEntry[]): GpuEntry | undefined {
  if (!raw.trim()) return undefined;
  const target = compact(raw);

  for (const entry of entries) {
    if (compact(entry.slug) === target) return entry;
  }
  for (const entry of entries) {
    const candidates = [entry.name, ...entry.aliases].map(compact);
    if (candidates.some((candidate) => candidate && candidate === target)) return entry;
  }
  for (const entry of entries) {
    const candidates = [entry.name, ...entry.aliases].map(compact);
    if (candidates.some((candidate) => candidate && (target.includes(candidate) || candidate.includes(target)))) return entry;
  }
  for (const entry of entries) {
    const words = normalizeGpuName(entry.name).split(' ').filter((word) => word.length > 2);
    if (words.length && words.every((word) => target.includes(word))) return entry;
  }
  return undefined;
}

/** 守卫：结论能不能发。 */
export function canConclude(entry: Pick<GpuEntry, 'status' | 'sources' | 'lastVerified'>): boolean {
  if (entry.status === 'unknown') return false;
  if (!entry.sources.length) return false;
  if (!entry.lastVerified) return false;
  return entry.sources.every((source) => Boolean(source.url) && Boolean(source.checkedAt));
}

/** 把条目变成页面能直接渲染的结论。`undefined` 表示没匹配到卡。 */
export function verdictFor(entry: GpuEntry | undefined): Verdict {
  if (!entry) {
    return {
      status: 'unknown',
      ...LABELS.unknown,
      reasons: ['We could not match the detected card to an entry in our table.'],
    };
  }

  if (!canConclude(entry)) {
    return {
      status: 'unknown',
      ...LABELS.unknown,
      reasons: ['This card is in our table, but no official source has been recorded for it yet.'],
    };
  }

  const reasons = [`Checked ${entry.lastVerified}`, ...entry.sources.map((source) => `${source.label} — ${source.url}`)];
  if (entry.conflicts?.length) reasons.push(...entry.conflicts.map((conflict) => `Sources disagree: ${conflict}`));

  return { status: entry.status, ...LABELS[entry.status], reasons };
}
