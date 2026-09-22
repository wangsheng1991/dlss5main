/**
 * Assertions for the specification engine: that the table is honest, and that the geometry puts a
 * head where the document asked for it.
 *
 * The point of these tests is not coverage. It is that a passport photo has a right answer, and if
 * the answer is written down anywhere it should be here, where a stranger can change a number and
 * watch the suite object.
 */

import assert from 'node:assert/strict';

import { cropPlan, layoutSheet, midpoint, mmToPx, sheet, sourceToOutput, specPixels } from '../src/lib/spec/geometry';
import { PHOTO_SPECS, findSpec, publishableSpecs } from '../src/lib/spec/specs';
import { checkSpecSources, curlReader, normalizeQuote, quoteFoundIn } from '../src/lib/spec/source-check';
import type { PhotoSpec } from '../src/lib/spec/types';

import { test } from './harness';

const EPSILON = 1e-9;

function closeTo(actual: number, expected: number, tolerance: number, what: string): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${what}: got ${actual}, expected ${expected} ± ${tolerance}`,
  );
}

function hostOf(url: string): string {
  return new URL(url).host;
}

/** A specification that is not in the table, for exercising the geometry in isolation. */
function fixtureSpec(overrides: Partial<PhotoSpec> = {}): PhotoSpec {
  return {
    id: 'fixture',
    label: 'Fixture',
    locale: 'en',
    purpose: 'Test only',
    sizeMm: { width: 30, height: 40 },
    headHeightMm: { min: 26, max: 26 },
    headroomMm: { min: 3, max: 3 },
    background: '#FFFFFF',
    minDpi: 300,
    sheets: ['a4'],
    status: 'single-source',
    sources: [{ url: 'https://example.test/spec', quote: 'a quotation long enough to pass the shape check', retrievedAt: '2026-09-22' }],
    ...overrides,
  };
}

// --- millimetres to pixels ---------------------------------------------------

test('mmToPx agrees with the printed sizes a shop actually measures', () => {
  // 30 × 40 mm at 300 dpi is the classic 3 × 4 photo, and 600 dpi is what the Russian source asks.
  assert.equal(mmToPx(30, 300), 354);
  assert.equal(mmToPx(40, 300), 472);
  assert.equal(mmToPx(35, 300), 413);
  assert.equal(mmToPx(45, 300), 531);
  assert.equal(mmToPx(30, 600), 709);
  assert.equal(mmToPx(40, 600), 945);
});

test('mmToPx refuses a length or resolution that cannot be printed', () => {
  assert.throws(() => mmToPx(0, 300), /positive/);
  assert.throws(() => mmToPx(-5, 300), /positive/);
  assert.throws(() => mmToPx(30, 0), /positive/);
  assert.throws(() => mmToPx(Number.NaN, 300), /positive/);
});

test('specPixels is exactly the specification, at any resolution', () => {
  const spec = findSpec('ru-doc-3x4');
  assert.deepEqual(specPixels(spec, 300), { width: 354, height: 472 });
  assert.deepEqual(specPixels(spec, 600), { width: 709, height: 945 });
});

test('every named sheet is a real paper size', () => {
  assert.deepEqual(sheet('4x6in').widthMm, 101.6);
  assert.deepEqual(sheet('4x6in').heightMm, 152.4);
  assert.deepEqual(sheet('10x15cm').widthMm, 100);
  assert.deepEqual(sheet('a4').heightMm, 297);
  assert.throws(() => sheet('a3' as never), /unknown sheet/);
});

// --- tiling on paper ---------------------------------------------------------

test('a 30 × 40 tile fills the sheets a visitor can actually buy', () => {
  const spec = findSpec('ru-doc-3x4');
  assert.equal(layoutSheet(spec, '10x15cm').count, 6); // 2 × 3
  assert.equal(layoutSheet(spec, '4x6in').count, 6);
  assert.equal(layoutSheet(spec, 'a4').count, 36); // 6 × 6
});

test('no two photos overlap, and none is closer to the edge than the margin', () => {
  for (const spec of PHOTO_SPECS) {
    for (const sheetId of spec.sheets) {
      const layout = layoutSheet(spec, sheetId);
      const { widthMm, heightMm } = layout.sheet;
      for (const cell of layout.cells) {
        assert.ok(cell.xMm >= layout.marginMm - EPSILON, `${spec.id}/${sheetId}: cell starts left of the margin`);
        assert.ok(cell.yMm >= layout.marginMm - EPSILON, `${spec.id}/${sheetId}: cell starts above the margin`);
        assert.ok(cell.xMm + cell.widthMm <= widthMm - layout.marginMm + EPSILON, `${spec.id}/${sheetId}: cell runs off the right edge`);
        assert.ok(cell.yMm + cell.heightMm <= heightMm - layout.marginMm + EPSILON, `${spec.id}/${sheetId}: cell runs off the bottom edge`);
      }
      for (let i = 0; i < layout.cells.length; i += 1) {
        for (let j = i + 1; j < layout.cells.length; j += 1) {
          const a = layout.cells[i];
          const b = layout.cells[j];
          const overlaps = a.xMm < b.xMm + b.widthMm && b.xMm < a.xMm + a.widthMm && a.yMm < b.yMm + b.heightMm && b.yMm < a.yMm + a.heightMm;
          assert.ok(!overlaps, `${spec.id}/${sheetId}: cells ${i} and ${j} overlap`);
        }
      }
    }
  }
});

test('cut marks stay on the paper and out of the neighbouring photo', () => {
  const spec = findSpec('ru-doc-3x4');
  for (const sheetId of spec.sheets) {
    const layout = layoutSheet(spec, sheetId);
    for (const mark of layout.cutMarks) {
      for (const [x, y] of [[mark.x1Mm, mark.y1Mm], [mark.x2Mm, mark.y2Mm]]) {
        assert.ok(x >= -EPSILON && x <= layout.sheet.widthMm + EPSILON, `${sheetId}: cut mark leaves the paper horizontally`);
        assert.ok(y >= -EPSILON && y <= layout.sheet.heightMm + EPSILON, `${sheetId}: cut mark leaves the paper vertically`);
      }
      for (const cell of layout.cells) {
        const insideX = mark.x1Mm > cell.xMm + EPSILON && mark.x1Mm < cell.xMm + cell.widthMm - EPSILON;
        const insideY = mark.y1Mm > cell.yMm + EPSILON && mark.y1Mm < cell.yMm + cell.heightMm - EPSILON;
        assert.ok(!(insideX && insideY), `${sheetId}: a cut mark is drawn across a photo`);
      }
    }
  }
});

test('the block is centred, so a cut sheet keeps its rows straight', () => {
  const layout = layoutSheet(findSpec('ru-doc-3x4'), 'a4');
  const left = layout.cells[0].xMm;
  const right = layout.sheet.widthMm - (layout.cells[layout.columns - 1].xMm + layout.cellWidthMm);
  closeTo(left, right, EPSILON, 'side margins');
});

test('a photo larger than the paper is refused rather than cropped silently', () => {
  const tooBig = fixtureSpec({ sizeMm: { width: 200, height: 400 } });
  assert.throws(() => layoutSheet(tooBig, '4x6in'), /does not fit/);
});

// --- framing a head ----------------------------------------------------------

test('the head ends up the size and height the document asks for', () => {
  const spec = findSpec('ru-doc-3x4');
  const plan = cropPlan({ width: 1600, height: 2000 }, spec, { dpi: 300, head: { top: 400, bottom: 500, centerX: 800 } });

  assert.deepEqual(plan.output, { width: 354, height: 472 });
  assert.equal(plan.insufficient, false);

  // Measured back through the plan, not read out of it: the crown sits one headroom below the top
  // edge and the chin one head height below that.
  const crown = sourceToOutput(plan, { x: 0, y: 400 });
  const chin = sourceToOutput(plan, { x: 0, y: 500 });
  closeTo(crown.y, mmToPx(plan.headroomMm, 300), 1, 'headroom in the output');
  closeTo(chin.y - crown.y, mmToPx(plan.headMm, 300), 1, 'head height in the output');
  assert.ok(chin.y <= plan.output.height, 'the chin must stay inside the frame');
});

test('the same input always produces the same plan', () => {
  const spec = findSpec('ru-passport-35x45');
  const options = { dpi: 300, head: { top: 120, bottom: 300, centerX: 500 } };
  assert.deepEqual(
    cropPlan({ width: 1200, height: 1600 }, spec, options),
    cropPlan({ width: 1200, height: 1600 }, spec, options),
  );
});

test('a source too small for the frame is flagged instead of upscaled quietly', () => {
  const spec = findSpec('ru-doc-3x4');
  const plan = cropPlan({ width: 100, height: 100 }, spec, { dpi: 600, head: { top: 0, bottom: 100, centerX: 50 } });
  assert.equal(plan.insufficient, true);
  assert.ok(plan.warnings.length > 0, 'an impossible frame must say so');
  assert.deepEqual(plan.output, { width: 709, height: 945 });
});

test('framing at the edge of the source is allowed, but warns', () => {
  const plan = cropPlan({ width: 1600, height: 2000 }, findSpec('ru-doc-3x4'), { dpi: 300, head: { top: 2, bottom: 102, centerX: 800 } });
  assert.equal(plan.rect.y, 0);
  assert.ok(plan.warnings.some((warning) => /could not be placed/.test(warning)), 'the head moved, so the plan is not compliant');
});

test('framing an empty head box, or a spec with no head height, throws', () => {
  const spec = findSpec('ru-doc-3x4');
  assert.throws(() => cropPlan({ width: 800, height: 800 }, spec, { dpi: 300, head: { top: 10, bottom: 10, centerX: 400 } }), /empty/);
  assert.throws(
    () => cropPlan({ width: 800, height: 800 }, fixtureSpec({ headHeightMm: null }), { dpi: 300, head: { top: 10, bottom: 110, centerX: 400 } }),
    /no head height/,
  );
});

// --- the table is honest -----------------------------------------------------

test('spec ids are unique and URL-safe', () => {
  const ids = PHOTO_SPECS.map((spec) => spec.id);
  assert.equal(new Set(ids).size, ids.length, 'two rows share an id');
  for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `id ${id} is not a slug`);
});

test('every row carries a source, a quotation and a date it was read', () => {
  for (const spec of PHOTO_SPECS) {
    assert.ok(spec.sources.length > 0, `${spec.id} has no sources`);
    for (const source of spec.sources) {
      assert.match(source.url, /^https:\/\/[^\s]+$/, `${spec.id}: source ${source.url} is not an absolute https URL`);
      assert.ok(source.quote.trim().length >= 12, `${spec.id}: the quotation from ${source.url} is too short to be evidence`);
      assert.match(source.retrievedAt, /^\d{4}-\d{2}-\d{2}$/, `${spec.id}: ${source.retrievedAt} is not an ISO date`);
    }
  }
});

test('every row states a printable size, a background and a floor for resolution', () => {
  for (const spec of PHOTO_SPECS) {
    for (const [edge, value] of Object.entries(spec.sizeMm)) {
      assert.ok(value > 0 && value <= 300, `${spec.id}: ${edge} is ${value} mm`);
    }
    assert.match(spec.background, /^#[0-9A-F]{6}$/i, `${spec.id}: background ${spec.background} is not a hex colour`);
    assert.ok(spec.minDpi >= 300, `${spec.id}: ${spec.minDpi} dpi is below what a printer needs`);
    assert.ok(spec.sheets.length > 0, `${spec.id} names no paper`);
    assert.ok(spec.label.trim() && spec.purpose.trim(), `${spec.id} is missing a label or a purpose`);
  }
});

test('head and headroom are ordered, and both fit inside the frame', () => {
  for (const spec of PHOTO_SPECS) {
    for (const [field, range] of [['headHeightMm', spec.headHeightMm], ['headroomMm', spec.headroomMm]] as const) {
      if (!range) continue;
      assert.ok(range.min > 0 && range.min <= range.max, `${spec.id}: ${field} is ${range.min}–${range.max}`);
    }
    if (spec.headHeightMm && spec.headroomMm) {
      assert.ok(
        spec.headHeightMm.max + spec.headroomMm.min <= spec.sizeMm.height,
        `${spec.id}: a ${spec.headHeightMm.max} mm head plus a ${spec.headroomMm.min} mm gap does not fit in ${spec.sizeMm.height} mm`,
      );
    }
  }
});

test('a head is a plausible share of the frame, which is what caught the rejected figure', () => {
  for (const spec of PHOTO_SPECS) {
    if (!spec.headHeightMm) continue;
    const ratio = midpoint(spec.headHeightMm) / spec.sizeMm.height;
    assert.ok(ratio > 0.5 && ratio < 0.9, `${spec.id}: a head of ${(ratio * 100).toFixed(0)}% of the frame is not a document photo`);
  }
});

test('a verified row has two hosts and has resolved every disagreement', () => {
  for (const spec of PHOTO_SPECS) {
    const hosts = new Set(spec.sources.map((source) => hostOf(source.url)));
    if (spec.status === 'verified') {
      assert.ok(hosts.size >= 2, `${spec.id} is verified on ${hosts.size} host, which is one opinion`);
    }
    if (spec.status === 'single-source') {
      assert.ok(hosts.size === 1, `${spec.id} is marked single-source but cites ${hosts.size} hosts`);
    }
    for (const conflict of spec.conflicts ?? []) {
      const cited = spec.sources.some((source) => source.url === conflict.source);
      assert.ok(cited, `${spec.id}: the conflict on ${conflict.field} cites ${conflict.source}, which is not among this row's sources`);
      assert.ok(
        typeof conflict.resolution === 'string' && conflict.resolution.trim().length >= 30,
        `${spec.id}: the conflict on ${conflict.field} has no resolution explaining why one figure was preferred`,
      );
    }
  }
});

test('only verified rows reach a page, and there is at least one', () => {
  const publishable = publishableSpecs();
  assert.ok(publishable.length > 0, 'nothing could be published');
  for (const spec of publishable) assert.equal(spec.status, 'verified');
  assert.equal(publishable.length, PHOTO_SPECS.filter((spec) => spec.status === 'verified').length);
});

test('the table names at least one row per sheet, so every page has a printable deliverable', () => {
  const sheets = new Set(PHOTO_SPECS.flatMap((spec) => spec.sheets));
  for (const id of ['10x15cm', '4x6in', 'a4'] as const) {
    assert.ok(sheets.has(id), `no specification offers ${id}`);
  }
});

// --- re-reading the sources --------------------------------------------------

const FIXTURE_PAGE = [
  '<html><head><title>Требования</title></head><body>',
  '<script>var x = "Размер головы: 99 мм";</script>',
  '<div class="a">Размер&nbsp;головы:</div><div class="b">не&nbsp;менее</div><div class="c">70-80% от общего размера фотографии</div>',
  '<style>.b { color: red }</style>',
  '</body></html>',
].join('\n');

test('a quotation is found across the elements a page renders it in', () => {
  assert.ok(quoteFoundIn(FIXTURE_PAGE, 'Размер головы: не менее 70-80% от общего размера фотографии'));
});

test('a quotation is found whatever the case, but never with a number changed', () => {
  assert.ok(quoteFoundIn(FIXTURE_PAGE, 'размер головы: не менее 70-80% от общего размера фотографии'), 'case must not matter');
  assert.ok(!quoteFoundIn(FIXTURE_PAGE, 'Размер головы: не менее 75-80% от общего размера фотографии'), 'a changed figure is a different sentence');
  assert.ok(!quoteFoundIn(FIXTURE_PAGE, 'от общего размера фотографии не менее 70-80%'), 'words in a different order are a different sentence');
});

test('text inside a script is not evidence', () => {
  assert.ok(!quoteFoundIn(FIXTURE_PAGE, 'Размер головы: 99 мм'), 'a figure that only exists in JavaScript is not on the page');
});

test('an empty quotation never counts as a match', () => {
  assert.ok(!quoteFoundIn(FIXTURE_PAGE, '   '));
  assert.equal(normalizeQuote('Уф 45 мм'), 'уф45мм');
});

test('each page is fetched once however many numbers came from it', () => {
  const spec = fixtureSpec({
    sources: [
      { url: 'https://example.test/a', quote: 'first quotation from the page', retrievedAt: '2026-09-22' },
      { url: 'https://example.test/a', quote: 'second quotation from the page', retrievedAt: '2026-09-22' },
      { url: 'https://example.test/b', quote: 'first quotation from the page', retrievedAt: '2026-09-22' },
    ],
  });
  const asked: string[] = [];
  const checks = checkSpecSources([spec], (url) => {
    asked.push(url);
    return '<p>first quotation from the page</p>';
  });
  assert.deepEqual(asked, ['https://example.test/a', 'https://example.test/b'], 'a page must be fetched once, however many numbers came from it');
  assert.deepEqual(checks.map((check) => check.found), [true, false, true], 'each quotation is checked against its own page');
  assert.equal(checks[2].note, undefined, 'a quotation that simply is not on the page is not a fetch error');
});

test('a page that cannot be read is reported, not thrown', () => {
  const checks = checkSpecSources([fixtureSpec()], () => {
    throw new Error('curl: (35) SSL connect error');
  });
  assert.equal(checks.length, 1);
  assert.equal(checks[0].found, false);
  assert.match(String(checks[0].note), /SSL connect error/);
});

// --- against the live pages (opt-in: the network is not a build dependency) ---

if (process.env.SPEC_ONLINE === '1') {
  test('every quotation in specs.ts still exists on the page it came from', () => {
    const checks = checkSpecSources(PHOTO_SPECS, curlReader());
    const missing = checks.filter((check) => !check.found);
    assert.deepEqual(
      missing.map((check) => `${check.specId} @ ${check.url}: ${check.note ?? `"${check.quote.slice(0, 60)}…" is gone`}`),
      [],
    );
  });
}
