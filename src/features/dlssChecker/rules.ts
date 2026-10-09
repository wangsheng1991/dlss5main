/**
 * 「理论」层：不手打每一张卡的结论，而是写**规则**，由规则推导结论。
 *
 * 这是我们和 dlss5.net 最本质的差别。他们是 64 张手工页面，每加一张卡就手写一遍；我们有
 * 一份可解释、可外推、可被测试守护的规则表 —— 加一个新架构只要加一条规则，全部卡自动跟上，
 * 而且每一条结论都能回答「凭什么」。
 *
 * 规矩和 `verdict.ts` 一致：**规则自己没有来源，推导出来的只能算 provisional，不许当结论发布。**
 * 有来源的规则才允许直接把结论写进页面。
 *
 * TODO(DATA)：`SUPPORT_RULES` 现在是空的（下面那份注释就是填写模板）。填之前先拿到
 * NVIDIA 官方对 DLSS 5 硬件范围的原文；没有原文就不要写规则 —— 空着比编一条好。
 */

import type { GpuEntry, GpuStatus, SourceRef } from '../../content/dlssChecker';

export type SupportRule = {
  id: string;
  /** 这条规则覆盖哪些架构（用 `GpuEntry.generation` 的写法：'Blackwell' / 'Ada Lovelace' / …）。 */
  architectures: string[];
  verdict: GpuStatus;
  /** 为什么这样推 —— 会原样出现在页面上，写成人话。 */
  rationale: string;
  /** 规则的来源。空数组 = 这条规则还不许得出结论，只能 provisional。 */
  sources: SourceRef[];
};

/**
 * 填写模板（拿到官方原文后照这个格式加一条，然后删掉这段注释里的示例）：
 *
 * {
 *   id: 'blackwell-native',
 *   architectures: ['Blackwell'],
 *   verdict: 'confirmed',
 *   rationale: 'NVIDIA lists the RTX 50 series as the hardware that runs DLSS 5 at launch.',
 *   sources: [{ label: 'NVIDIA newsroom', url: 'https://…', checkedAt: '2026-10-10' }],
 * }
 */
export const SUPPORT_RULES: SupportRule[] = [];

export type Derivation = {
  rule: SupportRule;
  status: GpuStatus;
  rationale: string;
  /** 规则有来源 = 可以作为结论发布；没有 = 只能说「按我们的规则推是 X，但还没有来源」。 */
  sourced: boolean;
};

/** 用规则推导一张卡。没有规则命中就返回 null —— 这时页面只认手工条目。 */
export function deriveFromRules(entry: Pick<GpuEntry, 'generation'>, rules: SupportRule[] = SUPPORT_RULES): Derivation | null {
  const rule = rules.find((candidate) => candidate.architectures.some((architecture) => architecture === entry.generation));
  if (!rule) return null;
  const sourced = rule.verdict !== 'unknown' && rule.sources.length > 0 && rule.sources.every((source) => Boolean(source.url) && Boolean(source.checkedAt));
  return { rule, status: sourced ? rule.verdict : 'unknown', rationale: rule.rationale, sourced };
}

/**
 * 页面上「我们怎么定的」那一段用的分级说明 —— 数据比对手强，要让人看得见强在哪。
 */
export const EVIDENCE_TIERS = [
  {
    id: 'official',
    label: 'Official source',
    note: 'NVIDIA’s own documentation, linked and dated on the card’s page. Only this tier can publish a verdict.',
  },
  {
    id: 'derived',
    label: 'Derived from a published rule',
    note: 'We publish the rule and the reasoning, so one new architecture updates every card it covers instead of 64 hand-written pages.',
  },
  {
    id: 'measured',
    label: 'Measured by us',
    note: 'Numbers from our own runs, with the machine and the result recorded — for example the local build’s throughput.',
  },
  {
    id: 'none',
    label: 'No verified conclusion yet',
    note: 'What we show when none of the above exists. A listed card is not a claimed verdict.',
  },
] as const;
