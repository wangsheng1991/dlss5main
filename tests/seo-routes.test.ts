/** Routing guarantees that cannot be inferred from a React route table alone. */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from './harness';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  redirects?: Array<{ source: string; destination: string; statusCode?: number }>;
  rewrites?: Array<{ source: string; destination: string }>;
};
const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const duplicateRoutes = [
  {
    deprecated: '/en/blog',
    selected: '/blog',
  },
  {
    deprecated: '/en/blog/dlss-5-online-image-upscaler-guide',
    selected: '/blog/dlss-5-online-image-upscaler-guide',
  },
  {
    deprecated: '/en/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026',
    selected: '/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026',
  },
  {
    deprecated: '/en/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026',
    selected: '/blog/dlss5-vs-dlss4-vs-fsr4-comparison-2026',
  },
  {
    deprecated: '/en/blog/seedance-2-5-video-super-resolution-cost-guide-2026',
    selected: '/blog/seedance-2-5-video-super-resolution-cost-guide-2026',
  },
  {
    deprecated: '/en/blog/dlss-5-latest-news-september-2026',
    selected: '/blog/dlss-5-latest-news-september-2026',
  },
  {
    deprecated: '/en/blog/what-is-dlss-5-neural-rendering-guide',
    selected: '/blog/what-is-dlss-5-neural-rendering-guide',
  },
  {
    deprecated: '/en/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026',
    selected: '/blog/crimson-desert-pc-optimization-dlss-fsr-guide-2026',
  },
  {
    deprecated: '/en/blog/best-ai-image-upscaler-2026-comparison',
    selected: '/blog/best-ai-image-upscaler-2026-comparison',
  },
  {
    deprecated: '/en/blog/dlss5-artistic-vision-debate-honest-assessment',
    selected: '/blog/dlss5-artistic-vision-debate-honest-assessment',
  },
];

test('duplicate English article URLs have one 301 hop to the selected article', () => {
  for (const { deprecated, selected } of duplicateRoutes) {
    const redirect = vercel.redirects?.find((rule) => rule.source === deprecated);
    assert.deepEqual(redirect, { source: deprecated, destination: selected, statusCode: 301 });
    assert.equal(vercel.redirects?.filter((rule) => rule.source === deprecated).length, 1);
  }
});

test('the sitemap and SPA fallback do not advertise or serve the deprecated duplicate', () => {
  for (const { deprecated, selected } of duplicateRoutes) {
    assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${selected}</loc>`));
    assert.equal(sitemap.includes(`<loc>https://www.dlss5nvidia.com${deprecated}</loc>`), false);
  }
  assert.equal(vercel.rewrites?.some((rule) => rule.source === '/(.*)'), false);
});
