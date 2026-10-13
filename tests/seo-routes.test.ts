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

test('evidence-led expansion pages are published in both current site locales', () => {
  const paths = [
    '/guides',
    '/what-is-dlss-5',
    '/vs/dlss-5-vs-dlss-4-5',
    '/vs/dlss-5-vs-fsr-4',
    '/system-requirements',
    '/status',
    '/zh/guides',
    '/zh/what-is-dlss-5',
    '/zh/vs/dlss-5-vs-dlss-4-5',
    '/zh/vs/dlss-5-vs-fsr-4',
    '/zh/system-requirements',
    '/zh/status',
  ];
  for (const path of paths) assert.ok(sitemap.includes(`<loc>https://www.dlss5nvidia.com${path}</loc>`), path);
});

/**
 * The home page is the one pair a visitor reaches without any link: `/` for English and `/zh` for
 * Chinese. Both halves have to exist as documents of their own, and each has to name the other as a
 * translation, or a crawler reads the Chinese page as an uncanonical duplicate instead of a locale.
 */
test('the home page is published in both locales and the pair declares itself from both sides', () => {
  assert.ok(sitemap.includes('<loc>https://www.dlss5nvidia.com/zh</loc>'), '/zh is missing from the sitemap');
  assert.deepEqual(
    vercel.rewrites?.find((rule) => rule.source === '/zh'),
    { source: '/zh', destination: '/zh/index.html' },
  );

  const pair = [
    '<link rel="alternate" hreflang="en" href="https://www.dlss5nvidia.com/"',
    '<link rel="alternate" hreflang="zh-CN" href="https://www.dlss5nvidia.com/zh"',
    '<link rel="alternate" hreflang="x-default" href="https://www.dlss5nvidia.com/"',
  ];
  // The English edition is the shell Vite emits and states the origin absolutely; the Chinese one is
  // written by the prerender step, which resolves the origin at build time.
  const shell = readFileSync('index.html', 'utf8');
  for (const link of pair) assert.ok(shell.includes(link), `the English home does not declare ${link}`);

  const prerender = readFileSync('scripts/prerender-seo.ts', 'utf8');
  const chineseHome = prerender.split('function renderHomeZh')[1] || '';
  const chinesePair = [
    "hrefLang: 'en', href: `${BASE_URL}/`",
    "hrefLang: 'zh-CN', href: `${BASE_URL}/zh`",
    "hrefLang: 'x-default', href: `${BASE_URL}/`",
  ];
  for (const alternate of chinesePair) assert.ok(chineseHome.includes(alternate), `the Chinese home does not declare ${alternate}`);

  // Both editions are self-canonical: the Chinese document must not canonicalise to the English one.
  assert.ok(chineseHome.includes("canonicalPath: '/zh'"), 'the Chinese home does not canonicalise to /zh');
  assert.ok(readFileSync('src/App.tsx', 'utf8').includes('<Home locale="zh" />'), '/zh is not routed to the Chinese home');
});
