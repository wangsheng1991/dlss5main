/**
 * Assertions for the studio's intake limits, which are now enforced in three places: the browser
 * that picks the file, the upload API that signs it and the job API that spends a credit. All three
 * read the same numbers, so what these tests pin down is that they keep reading the same numbers —
 * and that the sentence a caller gets is the one the studio shows, not a provider's 413 text.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  MAX_UPLOAD_BYTES, MAX_UPLOAD_MIB, STUDIO_MAX_PIXELS, buildToolTask, clampSteps, clampVectorizeEdge,
  failureNote, inputLimitNote, maxPixelsForMode, modeForModel, oversizeNote, pixelCheckNote,
  VECTORIZE_MAX_EDGE,
} from '../src/config/tools';
import { ENHANCE_FACTORS, ENHANCE_MAX_EDGE, enhanceOutput, enhancePrompt, isEnhanceFactor, preserveOutput, roundTo16 } from '../src/config/enhance';
import { GUEST_SAMPLE_IDS, SAMPLES, SAMPLE_IDS } from '../src/config/samples';
import { TOOL_LANDINGS } from '../src/content/toolLandings';

import { test } from './harness';

/** A 48 MP phone photo: 8000 × 6000, and at quality 90 only about 15 MiB, so the byte check lets it through. */
const PHONE_48MP = { width: 8000, height: 6000 };
/** The 3:2 frame a 16 MP camera produces; it is why the ceiling is 2^24 and not sixteen million. */
const CAMERA_16MP = { width: 4928, height: 3264 };

test('every provider model maps back to the mode it was uploaded for', () => {
  assert.equal(modeForModel('flux-klein'), 'edit');
  assert.equal(modeForModel('cutout-fast'), 'cutout');
  assert.equal(modeForModel('vectorize-fast'), 'vectorize');
  assert.equal(modeForModel('erase-quality'), 'erase');
  // An unknown model never reaches the provider from the upload API, but the check must still pick
  // the strictest ceiling rather than none.
  assert.equal(maxPixelsForMode(modeForModel('something-else')), STUDIO_MAX_PIXELS);
});

test('the upload check refuses a 48 MP photo under every mode that has a ceiling', () => {
  for (const model of ['flux-klein', 'cutout-fast', 'vectorize-fast']) {
    const note = pixelCheckNote(PHONE_48MP.width, PHONE_48MP.height, modeForModel(model));
    assert.equal(note, oversizeNote(PHONE_48MP.width, PHONE_48MP.height, modeForModel(model)), `${model}: the API and the browser must say the same thing`);
    assert.match(note, /8000 × 6000 \(48 MP\)/, `${model}: the caller is told the size it sent`);
    assert.match(note, /up to 16 MP/, `${model}: and the ceiling it broke`);
    assert.match(note, /shrink it and try again/i, `${model}: and what to do about it`);
  }
});

test('the check passes what the studio already accepts', () => {
  // 4096² is the ceiling exactly; a hair over it is not.
  assert.equal(pixelCheckNote(4096, 4096, 'edit'), '');
  assert.equal(pixelCheckNote(4097, 4096, 'edit'), oversizeNote(4097, 4096, 'edit'));
  // A 16 MP camera frame is 16.08 MP and must survive, or every 3:2 photo would be refused.
  assert.equal(pixelCheckNote(CAMERA_16MP.width, CAMERA_16MP.height, 'edit'), '');
  assert.ok(CAMERA_16MP.width * CAMERA_16MP.height > 16_000_000);
});

test('the eraser has no pixel ceiling, and the file ceiling still applies to it', () => {
  assert.equal(maxPixelsForMode('erase'), null);
  assert.equal(pixelCheckNote(12_000, 9_000, modeForModel('erase-quality')), '');
  assert.equal(oversizeNote(12_000, 9_000, 'erase'), '');
  assert.equal(inputLimitNote('erase'), `any pixel size, file up to ${MAX_UPLOAD_MIB} MiB`);
  // The bytes are a separate ceiling, and the upload API checks them before any pixel check.
  assert.equal(MAX_UPLOAD_BYTES, 10 * 1024 * 1024);
  assert.equal(MAX_UPLOAD_MIB, 10);
});

test('a caller that reports no size is not blocked, and a reported size over the edge is', () => {
  // The server never sees the bytes — they go straight to the provider's upload URL — so a request
  // without a usable pair is left to the browser check rather than refused on a guess.
  for (const [width, height] of [[undefined, undefined], [null, null], ['', ''], ['wide', 6000], [0, 6000], [-1, -1], [8000.5, 6000]]) {
    assert.equal(pixelCheckNote(width, height, 'edit'), '', `width/height ${String(width)}×${String(height)} must not be refused`);
  }
  // A string pair is what a form-encoded or hand-rolled request sends, and it is read as numbers.
  assert.match(pixelCheckNote('8000', '6000', 'edit'), /48 MP/);
});

test('the upstream 413 is translated, so a failure still reads like advice', () => {
  const note = failureNote('backend_413: image exceeds 20000000 pixels', 'edit');
  assert.match(note, /10 MiB/);
  assert.match(note, /16 MP/);
  assert.doesNotMatch(note, /413/);
  // Anything the provider says that is not about size is kept as it is.
  assert.equal(failureNote('prompt was rejected by the safety filter', 'edit'), 'prompt was rejected by the safety filter');
});

/**
 * The tool pages are the site's traffic entry points, and three files have to agree about them: the
 * router and the menu read TOOL_LANDINGS, the crawler-facing homepage lists the same paths, and the
 * sitemap is where a crawler finds them without a link. A page added to one and forgotten in the
 * others is a page nobody reaches, which is what these read.
 */const publicFile = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
const homepage = () => readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('every tool page has its own path, and its related links stay inside the set', () => {
  const paths = TOOL_LANDINGS.map(tool => tool.path);
  assert.equal(new Set(paths).size, paths.length, 'two tool pages share a path, so one overwrites the other');
  for (const tool of TOOL_LANDINGS) {
    assert.match(tool.path, /^\/[a-z0-9/-]+$/, `${tool.path} is not a plain path`);
    for (const field of ['title', 'description', 'heading', 'intro', 'cta'] as const) {
      assert.ok(tool[field].trim().length > 0, `${tool.path} has an empty ${field}`);
    }
  }
  const known = new Set(paths);
  for (const tool of TOOL_LANDINGS) {
    for (const related of tool.related) {
      assert.ok(known.has(related.path), `${tool.path} links to ${related.path}, which is not a tool page`);
    }
  }
});

test('every tool page is in the sitemap, so a crawler finds it without a link', () => {
  const sitemap = publicFile('sitemap.xml');
  for (const tool of TOOL_LANDINGS) {
    assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${tool.path}</loc>`), `${tool.path} is missing from the sitemap`);
  }
});

test('the served homepage links every tool page, for the crawler and for the visitor who runs no scripts', () => {
  const html = homepage();
  const block = html.match(/<!-- begin:tools -->[\s\S]*?<!-- end:tools -->/)?.[0] ?? '';
  assert.ok(block, 'the homepage has no tools block to drop on a deployment that publishes none');
  for (const tool of TOOL_LANDINGS) {
    assert.ok(block.includes(`href="${tool.path}"`), `${tool.path} is not linked from the homepage`);
  }
});

/**
 * What each tool asks the provider for. These sizes were measured against the live endpoint, so the
 * tests pin the numbers rather than the arithmetic: 4× on a 1024 px input comes back 1536 × 1536
 * because that is the model's ceiling, an upscale of a 4000 × 3000 photo comes back 1536 × 1152, and
 * both edges are always multiples of 16 because the model refuses anything else with a 422.
 */
const multiplesOf16 = (value: number) => value % 16 === 0 && value >= 16;

test('the enhancer asks for the factor it can actually get, and never over the ceiling', () => {
  const doubled = enhanceOutput(512, 512, 2);
  assert.deepEqual(doubled, { width: 1024, height: 1024, factor: 2, clamped: false });
  // A 4× request on a 1024 px photo is answered at 1536 — the measured ceiling, not 4096.
  const ceiling = enhanceOutput(1024, 1024, 4);
  assert.deepEqual(ceiling, { width: 1536, height: 1536, factor: 1.5, clamped: true });
  const landscape = enhanceOutput(4000, 3000, 2);
  assert.deepEqual(landscape, { width: 1536, height: 1152, factor: 0.38, clamped: true });

  for (const [width, height] of [[4000, 3000], [3000, 4000], [1024, 1024], [160, 90], [4928, 3264], [16, 16]]) {
    for (const factor of ENHANCE_FACTORS) {
      const out = enhanceOutput(width, height, factor);
      assert.ok(out.width <= ENHANCE_MAX_EDGE && out.height <= ENHANCE_MAX_EDGE, `${width}×${height} at ${factor}× exceeds ${ENHANCE_MAX_EDGE}`);
      assert.ok(multiplesOf16(out.width) && multiplesOf16(out.height), `${width}×${height} at ${factor}× → ${out.width}×${out.height} is not a multiple of 16`);
      assert.ok(out.clamped === (out.factor < factor), 'clamped must say whether the factor was reduced');
    }
  }
  assert.ok(isEnhanceFactor(2) && isEnhanceFactor(4) && !isEnhanceFactor(3));
});

test('a normal edit keeps the source shape and only shrinks what is over the ceiling', () => {
  // 600 is not a multiple of 16, so the edge is snapped up to 608 — the model refuses any other size
  // with a 422, which means an input whose edges are not multiples of 16 comes back within 8 px of
  // its own aspect ratio rather than exactly on it. That is the provider's contract, not our choice.
  assert.deepEqual(preserveOutput(800, 600), { width: 800, height: 608 });
  assert.deepEqual(preserveOutput(1024, 1024), { width: 1024, height: 1024 });
  // The same aspect ratio within the rounding to 16, which is all the model allows.
  const large = preserveOutput(4000, 3000);
  assert.deepEqual(large, { width: 1536, height: 1152 });
  assert.ok(Math.abs(large.width / large.height - 4 / 3) < 0.01, 'the aspect ratio moved more than the rounding allows');
  const huge = preserveOutput(8000, 6000);
  assert.deepEqual(huge, { width: 1536, height: 1152 });
  assert.equal(roundTo16(1), 16);
  assert.equal(roundTo16(1536.4), 1536);
});

test('the tool parameters are clamped into the range the services accept', () => {
  assert.equal(clampSteps(8), 8);
  assert.equal(clampSteps(4), 4);
  assert.equal(clampSteps(20), 20);
  assert.equal(clampSteps(99), 20);
  assert.equal(clampSteps(0), 4);
  assert.equal(clampSteps('twelve'), 8);
  assert.equal(clampVectorizeEdge(1024), 1024);
  assert.equal(clampVectorizeEdge(64), VECTORIZE_MAX_EDGE.min);
  assert.equal(clampVectorizeEdge(99999), VECTORIZE_MAX_EDGE.max);
  assert.equal(clampVectorizeEdge(undefined), VECTORIZE_MAX_EDGE.default);
});

test('each tool sends the fields its own service accepts, and no size or format', () => {
  const cutout = buildToolTask('cutout', { imageIds: ['file-1'] });
  assert.deepEqual(cutout, { model: 'cutout-fast', image_ids: ['file-1'] });
  const vectorize = buildToolTask('vectorize', { imageIds: ['file-1'], preset: 'logo', maxEdge: 4096 });
  assert.deepEqual(vectorize, { model: 'vectorize-fast', image_ids: ['file-1'], preset: 'logo', max_edge: VECTORIZE_MAX_EDGE.max });
  const erase = buildToolTask('erase', { imageIds: ['file-1'], prompt: '  remove the spoon  ', steps: 50, seed: 7 });
  assert.deepEqual(erase, { model: 'erase-quality', image_ids: ['file-1'], prompt: 'remove the spoon', num_inference_steps: 20, seed: 7 });
  // The tools own their output geometry: asking for a size or a format is refused upstream, not
  // ignored, so a stray field would turn into a failed task.
  for (const task of [cutout, vectorize, erase]) {
    for (const field of ['width', 'height', 'output_format']) {
      assert.ok(!(field in task), `${task.model} must not send ${field}`);
    }
  }
  // A seed that is not an integer is left out rather than sent as NaN.
  assert.ok(!('seed' in buildToolTask('erase', { imageIds: ['file-1'], prompt: 'x', seed: 1.5 })));
});

test('the enhancement prompt names the size that was actually requested', () => {
  const prompt = enhancePrompt(1536, 1152);
  assert.match(prompt, /1536 × 1152 pixels/);
  assert.match(prompt, /keeping the composition, framing, lighting and colors identical/);
});

/**
 * The free example path, which is where a visitor meets a tool without signing up. Every catalog
 * example is offered to them except the eraser: that one re-renders the whole frame in about two
 * minutes, which outlives the function that would collect the result, so warming it spends a real
 * provider run and caches nothing. The route has to agree with the list — the list on its own is
 * only a client-side suggestion.
 */
test('the free examples are the catalog minus the eraser, and nothing else', () => {
  assert.ok(GUEST_SAMPLE_IDS.length > 0, 'an empty guest list would leave the tool pages nothing to run');
  for (const id of SAMPLE_IDS) {
    assert.equal(
      (GUEST_SAMPLE_IDS as readonly string[]).includes(id),
      SAMPLES[id].tool !== 'erase',
      `${id} is on the wrong side of the guest list`,
    );
  }
});

test('the samples route refuses an example that is not on the guest list', () => {
  const route = readFileSync(new URL('../api/image-edit/samples.ts', import.meta.url), 'utf8');
  assert.match(route, /GUEST_SAMPLE_IDS[^\n]*includes\(sampleId\)/, 'the route imports the guest list but has to guard with it');
});
