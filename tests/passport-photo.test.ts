import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { MICRO_TOOLS } from '../src/content/microTools';
import { PASSPORT_PHOTO_PATHS, PASSPORT_PHOTO_SPEC_SLUGS } from '../src/content/passportPhoto';
import { publishableSpecs } from '../src/lib/spec/specs';
import { layoutSheet, specPixels } from '../src/lib/spec/geometry';
import { test } from './harness';

const publicFile = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
const homepage = () => readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('passport photo routes expose only verified specifications', () => {
  const specs = publishableSpecs();
  assert.equal(MICRO_TOOLS[0].path, '/tools/passport-photo');
  assert.equal(new Set(PASSPORT_PHOTO_PATHS).size, PASSPORT_PHOTO_PATHS.length);
  assert.equal(specs.length, Object.keys(PASSPORT_PHOTO_SPEC_SLUGS).length);
  for (const spec of specs) {
    assert.equal(spec.status, 'verified');
    assert.match(PASSPORT_PHOTO_SPEC_SLUGS[spec.id], /^[a-z0-9-]+$/);
    assert.ok(specPixels(spec, spec.minDpi).width > 0 && specPixels(spec, spec.minDpi).height > 0);
    for (const sheet of spec.sheets) assert.ok(layoutSheet(spec, sheet).count > 0, `${spec.id} must fit on ${sheet}`);
  }
});

test('passport photo pages are discoverable from crawler files and the static homepage', () => {
  const sitemap = publicFile('sitemap.xml');
  const llms = publicFile('llms.txt');
  const html = homepage();
  const block = html.match(/<!-- begin:microTools -->[\s\S]*?<!-- end:microTools -->/)?.[0] ?? '';
  assert.ok(block, 'the homepage has no micro-tools block');
  for (const path of PASSPORT_PHOTO_PATHS) {
    assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${path}</loc>`), `${path} is missing from sitemap.xml`);
    assert.ok(block.includes(`href="${path}"`), `${path} is not linked from the static homepage`);
  }
  assert.ok(llms.includes('https://www.dlss5nvidia.com/tools/passport-photo'), 'llms.txt is missing the passport photo tool');
});
