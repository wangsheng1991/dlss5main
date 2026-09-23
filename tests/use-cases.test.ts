import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { TOOL_LANDINGS } from '../src/content/toolLandings';
import { USE_CASES } from '../src/content/useCases';
import { test } from './harness';

const publicFile = (name: string) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');
const homepage = () => readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('workflow guides are unique, substantive and point to real tools', () => {
  const paths = USE_CASES.map(item => item.path);
  assert.equal(new Set(paths).size, paths.length);
  const tools = new Set(TOOL_LANDINGS.map(item => item.path));
  for (const item of USE_CASES) {
    assert.match(item.path, /^\/use-cases\/[a-z0-9-]+$/);
    assert.ok(item.tldr.length > 80, `${item.path} needs a useful quick answer`);
    assert.ok(item.faqs.length >= 3, `${item.path} needs scenario FAQs`);
    assert.ok(tools.has(item.toolPath), `${item.path} points to a missing tool page`);
    for (const related of item.related) assert.ok(tools.has(related.path), `${item.path} links to a missing tool ${related.path}`);
  }
});

test('workflow guides are discoverable from crawler files and the static homepage', () => {
  const sitemap = publicFile('sitemap.xml');
  const llms = publicFile('llms.txt');
  const html = homepage();
  const block = html.match(/<!-- begin:useCases -->[\s\S]*?<!-- end:useCases -->/)?.[0] ?? '';
  assert.ok(block, 'the homepage has no workflow guide block');
  for (const item of USE_CASES) {
    assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${item.path}</loc>`), `${item.path} is missing from the sitemap`);
    assert.ok(llms.includes(`https://www.dlss5nvidia.com${item.path}`), `${item.path} is missing from llms.txt`);
    assert.ok(block.includes(`href="${item.path}"`), `${item.path} is not linked from the static homepage`);
  }
});
