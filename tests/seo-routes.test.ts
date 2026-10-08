/** Routing guarantees that cannot be inferred from a React route table alone. */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from './harness';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  redirects?: Array<{ source: string; destination: string; statusCode?: number }>;
  rewrites?: Array<{ source: string; destination: string }>;
};
const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const deprecated = '/en/blog/dlss-5-online-image-upscaler-guide';
const selected = '/blog/dlss-5-online-image-upscaler-guide';

test('the duplicate English upscaler URL has one 301 hop to the selected article', () => {
  const redirect = vercel.redirects?.find((rule) => rule.source === deprecated);
  assert.deepEqual(redirect, {
    source: deprecated,
    destination: selected,
    statusCode: 301,
    preserveQueryParams: true,
  });
  assert.equal(vercel.redirects?.filter((rule) => rule.source === deprecated).length, 1);
});

test('the sitemap and SPA fallback do not advertise or serve the deprecated duplicate', () => {
  assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${selected}</loc>`));
  assert.equal(sitemap.includes(`<loc>https://www.dlss5nvidia.com${deprecated}</loc>`), false);
  assert.equal(vercel.rewrites?.some((rule) => rule.source === '/(.*)'), false);
});
