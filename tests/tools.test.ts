/**
 * Assertions for the studio's intake limits, which are now enforced in three places: the browser
 * that picks the file, the upload API that signs it and the job API that spends a credit. All three
 * read the same numbers, so what these tests pin down is that they keep reading the same numbers —
 * and that the sentence a caller gets is the one the studio shows, not a provider's 413 text.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  MAX_UPLOAD_BYTES, MAX_UPLOAD_MIB, STUDIO_MAX_PIXELS, failureNote, inputLimitNote, maxPixelsForMode,
  modeForModel, oversizeNote, pixelCheckNote,
} from '../src/config/tools';
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
 */
const publicFile = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
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
