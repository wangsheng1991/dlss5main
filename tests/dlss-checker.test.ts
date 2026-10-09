/**
 * DLSS 5 checker — the parts that must not silently rot.
 *
 * Four things are guarded here, in order of how much damage a failure would do:
 *   1. `localSoftware` strings must stay identical to the published `/download` requirements, or the
 *      checker would tell visitors something the site does not honour.
 *   2. A verdict needs a source and a date — including a verdict derived from a rule.
 *   3. The two axes stay independent (a card can be "unknown" in games and "supported" locally).
 *   4. Matching keeps working on real browser strings.
 */

import { test } from './harness';
import { GPU_ENTRIES, GAME_ENTRIES, CHECKER_COPY, LOCAL_SOFTWARE, gpuEntryBySlug } from '../src/content/dlssChecker';
import { STUDIO_COPY } from '../src/content/studioPage';
import { canConclude, localSoftwareVerdict, matchGpu, normalizeGpuName, reconcile, verdictFor } from '../src/features/dlssChecker/verdict';
import { cleanWebglRenderer } from '../src/features/dlssChecker/detect';
import { deriveFromRules, EVIDENCE_TIERS, SUPPORT_RULES, type SupportRule } from '../src/features/dlssChecker/rules';

test('checker: normalizeGpuName strips vendor noise and API suffixes', () => {
  const normalized = normalizeGpuName('ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)');
  if (normalized.includes('nvidia') || normalized.includes('angle')) {
    throw new Error(`vendor noise survived normalization: ${normalized}`);
  }
  if (!normalized.includes('4070')) {
    throw new Error(`model number was lost: ${normalized}`);
  }
});

test('checker: matchGpu finds the card from a real browser string', () => {
  const raw = 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)';
  const matched = matchGpu(raw, GPU_ENTRIES);
  if (!matched || matched.slug !== 'rtx-4070') {
    throw new Error(`expected rtx-4070, got ${matched?.slug ?? 'nothing'}`);
  }

  const unknown = matchGpu('Intel(R) UHD Graphics 630', GPU_ENTRIES);
  if (unknown) throw new Error(`an untracked card matched ${unknown.slug}`);
});

test('checker: cleanWebglRenderer keeps the model, drops the ANGLE wrapper', () => {
  const cleaned = cleanWebglRenderer('ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)');
  if (cleaned.includes('ANGLE') || !cleaned.includes('3060')) {
    throw new Error(`unexpected cleaned renderer: ${cleaned}`);
  }
});

test('checker: a verdict needs a source and a date', () => {
  const bare = { status: 'confirmed' as const, sources: [], lastVerified: '2026-10-10' };
  if (canConclude(bare)) throw new Error('a status with no sources was allowed to conclude');
  if (verdictFor({ slug: 'x', vendor: 'nvidia', name: 'X', aliases: [], generation: 'X', ...bare }).status !== 'unknown') {
    throw new Error('verdictFor published a conclusion without sources');
  }

  const sourced = { status: 'confirmed' as const, sources: [{ label: 'NVIDIA', url: 'https://example.com', checkedAt: '2026-10-10' }], lastVerified: '2026-10-10' };
  if (!canConclude(sourced)) throw new Error('a properly sourced entry was refused');
});

test('checker: a rule without a source may not publish a verdict', () => {
  const unsourced: SupportRule = { id: 'draft', architectures: ['Blackwell'], verdict: 'confirmed', rationale: 'draft only', sources: [] };
  const card = { generation: 'Blackwell' };

  const draft = deriveFromRules(card, [unsourced]);
  if (!draft) throw new Error('the rule did not match its architecture');
  if (draft.sourced || draft.status !== 'unknown') throw new Error('an unsourced rule published a verdict');

  const sourced: SupportRule = {
    id: 'blackwell-native',
    architectures: ['Blackwell'],
    verdict: 'confirmed',
    rationale: 'NVIDIA lists the RTX 50 series as launch hardware.',
    sources: [{ label: 'NVIDIA newsroom', url: 'https://example.com/news', checkedAt: '2026-10-10' }],
  };
  const published = deriveFromRules(card, [sourced]);
  if (!published?.sourced || published.status !== 'confirmed') throw new Error('a sourced rule failed to publish');

  // 手工条目与规则冲突时要被识别出来，不能两边都发。
  const entry = { slug: 'rtx-5090', vendor: 'nvidia' as const, name: 'GeForce RTX 5090', aliases: [], generation: 'Blackwell', status: 'unsupported' as const, sources: [{ label: 'X', url: 'https://example.com', checkedAt: '2026-10-10' }], lastVerified: '2026-10-10' };
  const outcome = reconcile(entry, [sourced]);
  if (outcome.agreement !== 'conflict') throw new Error(`expected a conflict, got ${outcome.agreement}`);
  if (outcome.published !== 'source') throw new Error('a sourced manual entry should win over a derived one');
  if (!verdictFor(entry, [sourced]).reasons.some((reason) => reason.includes('disagree'))) {
    throw new Error('the conflict was not surfaced to the reader');
  }
});

test('checker: the local-build axis is independent and evidence-backed', () => {
  const rtx4070 = gpuEntryBySlug('rtx-4070');
  const gtx1060 = gpuEntryBySlug('gtx-1060');

  if (localSoftwareVerdict(rtx4070).state.fit !== 'supported') throw new Error('an RTX 20-series-or-newer card should support the local build');
  if (localSoftwareVerdict(gtx1060).state.fit !== 'below-minimum') throw new Error('a GTX 10-series card should be below the local build minimum');

  // 轴一仍是 unknown，轴二已支持 —— 两根轴必须能给出不同答案。
  if (verdictFor(rtx4070).status !== 'unknown') throw new Error('the in-game axis should still be unknown here');
  if (localSoftwareVerdict(rtx4070).label === verdictFor(rtx4070).label) throw new Error('the two axes collapsed into one');

  const missingReason = GPU_ENTRIES.filter((entry) => entry.localSoftware && !entry.localSoftware.reason.trim()).map((entry) => entry.slug);
  if (missingReason.length) throw new Error(`local-build state without a reason: ${missingReason.join(', ')}`);
  if (GPU_ENTRIES.filter((entry) => entry.localSoftware?.fit === 'measured').some((entry) => !entry.localSoftware?.evidence)) {
    throw new Error('a "measured" card has no measurement attached');
  }
});

test('checker: the local-build requirements match the published /download page', () => {
  const en = STUDIO_COPY['en-US'] as Record<string, string>;
  const pairs: Array<[string, string]> = [
    [LOCAL_SOFTWARE.os, en['req.os.d']],
    [LOCAL_SOFTWARE.gpu, en['req.gpu.d']],
    [LOCAL_SOFTWARE.driver, en['req.driver.d']],
    [LOCAL_SOFTWARE.memory, en['req.ram.d']],
    [LOCAL_SOFTWARE.disk, en['req.disk.d']],
    [LOCAL_SOFTWARE.engine, en['req.engine.d']],
  ];
  const drifted = pairs.filter(([checker, published]) => checker !== published);
  if (drifted.length) {
    throw new Error(`the checker states requirements the /download page does not:\n${drifted.map(([a, b]) => `    checker: ${a}\n    published: ${b}`).join('\n')}`);
  }
});

test('checker: every published entry in the table carries its evidence', () => {
  const offenders = [...GPU_ENTRIES, ...GAME_ENTRIES]
    .filter((entry) => entry.status !== 'unknown' && !canConclude(entry))
    .map((entry) => entry.slug);
  if (offenders.length) {
    throw new Error(`entries claim a status without sources or a date: ${offenders.join(', ')}`);
  }
});

test('checker: slugs are unique and the page copy points at the checker route', () => {
  const slugs = GPU_ENTRIES.map((entry) => entry.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('duplicate GPU slug');
  if (GPU_ENTRIES.some((entry) => entry.slug !== entry.slug.toLowerCase())) throw new Error('slug must be lowercase');
  if (!CHECKER_COPY.path.startsWith('/')) throw new Error('checker path must be absolute');
  if (gpuEntryBySlug('rtx-4070')?.name !== 'GeForce RTX 4070') throw new Error('gpuEntryBySlug is not reading the table');
  if (!SUPPORT_RULES.every((rule) => rule.rationale.trim())) throw new Error('a support rule has no rationale');
  if (!EVIDENCE_TIERS.some((tier) => tier.id === 'official')) throw new Error('the evidence tiers lost their official tier');
});
