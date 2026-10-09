/**
 * DLSS 5 checker — the parts that must not silently rot.
 *
 * The last case is the important one: it is the guard that keeps the compatibility table honest.
 * If it fails, someone wrote a verdict without an official source, and the page would be claiming
 * something it cannot back up.
 */

import { test } from './harness';
import { GPU_ENTRIES, GAME_ENTRIES, CHECKER_COPY, gpuEntryBySlug } from '../src/content/dlssChecker';
import { canConclude, matchGpu, normalizeGpuName, verdictFor } from '../src/features/dlssChecker/verdict';
import { cleanWebglRenderer } from '../src/features/dlssChecker/detect';

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
  // The seed data is intentionally all "unknown"; this asserts the guard, not the data.
  const bare = { status: 'confirmed' as const, sources: [], lastVerified: '2026-10-10' };
  if (canConclude(bare)) throw new Error('a status with no sources was allowed to conclude');
  if (verdictFor({ slug: 'x', vendor: 'nvidia', name: 'X', aliases: [], generation: 'X', ...bare }).status !== 'unknown') {
    throw new Error('verdictFor published a conclusion without sources');
  }

  const sourced = { status: 'confirmed' as const, sources: [{ label: 'NVIDIA', url: 'https://example.com', checkedAt: '2026-10-10' }], lastVerified: '2026-10-10' };
  if (!canConclude(sourced)) throw new Error('a properly sourced entry was refused');
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
});
