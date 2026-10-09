/**
 * 判定引擎：把「检测到的字符串」变成「一个敢写在页面上的结论」。
 *
 * 两条结论轴，分开判：
 *   - 游戏内 DLSS 5：手工条目（有来源才发）→ 规则推导（有来源的规则才发）
 *   - 我们的本地软件：来自我们**自己已发布**的要求页，属于自证结论
 *
 * 唯一的硬规矩：**没有来源、没有核对日期，就不许给结论。**
 * `canConclude()` 是守卫，`verdictFor()` 会把它压回 `'unknown'` —— 就算有人在数据文件里
 * 手滑写了 `status: 'confirmed'` 却没填 `sources`，页面也只会显示「还没有结论」。
 */

import type { GpuEntry, GpuStatus, LocalSoftwareState } from '../../content/dlssChecker';
import { deriveFromRules, type Derivation } from './rules';

export type Verdict = {
  status: GpuStatus;
  /** 页面上的徽章文字。 */
  label: string;
  /** 给样式用的语气，不是给用户看的。 */
  tone: 'positive' | 'neutral' | 'negative' | 'muted';
  /** 为什么是这个结论（页面会把这些行显示在结论下面）。 */
  reasons: string[];
  /** 结论是哪来的：手工来源 / 规则推导 / 都没有。 */
  origin: 'source' | 'derived' | 'none';
};

const LABELS: Record<GpuStatus, { label: string; tone: Verdict['tone'] }> = {
  confirmed: { label: 'Runs DLSS 5', tone: 'positive' },
  planned: { label: 'Support announced, not shipped', tone: 'neutral' },
  unsupported: { label: 'Not supported', tone: 'negative' },
  unknown: { label: 'No verified conclusion yet', tone: 'muted' },
};

const LOCAL_LABELS: Record<LocalSoftwareState['fit'], { label: string; tone: Verdict['tone'] }> = {
  measured: { label: 'Runs our local build — measured here', tone: 'positive' },
  supported: { label: 'Runs our local build', tone: 'positive' },
  'below-minimum': { label: 'Below our local build’s minimum', tone: 'neutral' },
  unknown: { label: 'Local build: not determined yet', tone: 'muted' },
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

/**
 * 手工条目与规则推导对账。
 * `conflict` 是给维护者看的信号 —— 手工写着 supported、规则推出来 unsupported，页面照发有来源的那个，
 * 但维护端必须消解，不能两边都留着。
 */
export function reconcile(entry: GpuEntry, rules?: Parameters<typeof deriveFromRules>[1]): {
  published: Verdict['origin'];
  status: GpuStatus;
  derivation: Derivation | null;
  agreement: 'source-only' | 'derived-only' | 'agree' | 'conflict' | 'none';
} {
  const derivation = deriveFromRules(entry, rules);
  const manual = canConclude(entry);

  if (manual && derivation?.sourced) {
    return { published: 'source', status: entry.status, derivation, agreement: entry.status === derivation.status ? 'agree' : 'conflict' };
  }
  if (manual) return { published: 'source', status: entry.status, derivation, agreement: 'source-only' };
  if (derivation?.sourced) return { published: 'derived', status: derivation.status, derivation, agreement: 'derived-only' };
  return { published: 'none', status: 'unknown', derivation, agreement: 'none' };
}

/**
 * 把条目变成页面能直接渲染的结论。`undefined` 表示没匹配到卡。
 * `rules` 默认用已发布的规则表；测试会传入临时规则来验证冲突分支。
 */
export function verdictFor(entry: GpuEntry | undefined, rules?: Parameters<typeof deriveFromRules>[1]): Verdict {
  if (!entry) {
    return { status: 'unknown', ...LABELS.unknown, origin: 'none', reasons: ['We could not match the detected card to an entry in our table.'] };
  }

  const outcome = reconcile(entry, rules);
  if (outcome.published === 'none') {
    const reasons = ['This card is in our table, but no official source and no sourced rule covers it yet.'];
    if (outcome.derivation) reasons.push(`Our rule says: ${outcome.derivation.rationale} (no source attached yet, so it is not published as a verdict).`);
    return { status: 'unknown', ...LABELS.unknown, origin: 'none', reasons };
  }

  const reasons =
    outcome.published === 'derived'
      ? [`Derived from our rule “${outcome.derivation?.rule.id}”: ${outcome.derivation?.rationale}`, ...(outcome.derivation?.rule.sources ?? []).map(formatSource)]
      : [`Checked ${entry.lastVerified}`, ...entry.sources.map(formatSource)];

  if (outcome.agreement === 'conflict') reasons.push('Our rule and our sourced entry disagree — we are publishing the sourced entry and will reconcile them.');
  if (entry.conflicts?.length) reasons.push(...entry.conflicts.map((conflict) => `Sources disagree: ${conflict}`));

  return { status: outcome.status, ...LABELS[outcome.status], origin: outcome.published, reasons };
}

function formatSource(source: { label: string; url: string }): string {
  return `${source.label} — ${source.url}`;
}

/** 本地软件那根轴的结论。没有条目就直说不知道，不要假设。 */
export function localSoftwareVerdict(entry: GpuEntry | undefined): { state: LocalSoftwareState; label: string; tone: Verdict['tone'] } {
  const state: LocalSoftwareState = entry?.localSoftware ?? { fit: 'unknown', reason: 'No local-build note recorded for this card yet.' };
  return { state, ...LOCAL_LABELS[state.fit] };
}
