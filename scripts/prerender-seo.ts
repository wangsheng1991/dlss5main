import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ARTICLE_COVERS } from '../src/content/articles/covers';
import { ARTICLES, type Article } from '../src/content/articles/types';
import { TOOL_LANDINGS, toolAlternates, toolLongForm, toolSchema, toolSteps, type ToolLanding } from '../src/content/toolLandings';
import { USE_CASES, useCaseSchema, type UseCase } from '../src/content/useCases';
import { publishableSpecs } from '../src/lib/spec/specs';
import type { PhotoSpec } from '../src/lib/spec/types';
import { PASSPORT_PHOTO_LONG_FORM, PASSPORT_PHOTO_SPEC_SLUGS, passportPhotoSeoCopy } from '../src/content/passportPhoto';
import { GAME_STYLE_LANDING, GAME_STYLE_LONG_FORM, gameStyleLandingSchema } from '../src/content/gameStyleLanding';
import { VIDEO_LANDING, VIDEO_LONG_FORM, videoLandingSchema } from '../src/content/videoLanding';
import { AI_OVERVIEW_DEFINITION } from '../src/content/seoDefinitions';
import { DEFAULT_SITE_URL, DEFAULT_SUPPORT_EMAIL, resolveSiteUrl, resolveSupportEmail } from '../src/config/site-url';
import { SITE_PROFILE, SITE_SECTIONS, brandCopy, isPublishedPath, profileHas } from '../src/config/profile';
import { LEGAL } from '../src/config/legal';
import {
  API_BASE_URL, API_CATALOG_JSON, API_FLOW, API_MAX_UPLOAD_MIB, API_PRICE, API_RESULT_TTL_SECONDS,
  ASPECT_SIZES, CATALOG, CATALOG_UPDATED, CATALOG_VERSION, apiCatalogDocument, apiModelJson,
} from '../src/config/apiCatalog';

/** Each deployment states its own origin through `VITE_SITE_URL`; see `src/config/site-url.ts`. */
const BASE_URL = resolveSiteUrl(process.env.VITE_SITE_URL);
const SUPPORT_EMAIL = resolveSupportEmail(process.env.VITE_SUPPORT_EMAIL);
const DIST = resolve(process.cwd(), 'dist');
/**
 * The static shell Vite emitted still names the default storefront, so it is rewritten here before
 * it is copied into every prerendered route — and written back below for the routes that are not
 * prerendered at all.
 */
const TEMPLATE = readFileSync(resolve(DIST, 'index.html'), 'utf8')
  .replaceAll(DEFAULT_SITE_URL, BASE_URL)
  .replaceAll(DEFAULT_SUPPORT_EMAIL, SUPPORT_EMAIL);

/**
 * The shell's JSON-LD graph describes the homepage. `withHead` already replaces the route-agnostic
 * head tags with the route's own, and the graph has to go with them: left in place, every
 * prerendered page also claimed the homepage's WebApplication, its two videos and its FAQ. Only the
 * Organization is true of every URL, so it is the one node carried into each route's head — read
 * from the shell rather than repeated here, so the two can never disagree.
 */
const SITE_ORGANIZATION = (() => {
  const graph = TEMPLATE.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!graph) return '';
  try {
    const nodes = (JSON.parse(graph) as { '@graph'?: Array<{ '@type'?: string }> })['@graph'];
    const organization = nodes?.find((node) => node['@type'] === 'Organization');
    if (!organization) return '';
    return `<script type="application/ld+json" data-rh="true">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization] }).replaceAll('<', '\\u003c')}</script>`;
  } catch {
    return '';
  }
})();

/**
 * Everything a generated file has to agree on: the origin it points at (done above), the brand it
 * names, and the sections this deployment actually serves. A section that is not published would
 * otherwise leave dead links in the shell and in every page copied from it.
 *
 * The `<!-- begin:x -->` / `<!-- end:x -->` markers exist only for this step; they are stripped for
 * every profile, the default one included, so a deployment that serves everything comes out exactly
 * as it would without them.
 *
 * Whitespace around a marker is handled line by line: a marker alone on its line takes that line's
 * indentation and newline with it, while one used mid-sentence takes nothing, so the space that
 * separates the block from the text around it has to sit outside the markers — before `begin` and
 * after `end`, never just inside `end`, which is the one place the removal also eats.
 */
function forThisDeployment(html: string): string {
  const hidden = [...SITE_SECTIONS.filter((section) => !profileHas(section)), ...(SITE_PROFILE.dropBlocks ?? [])];
  const withoutHidden = hidden.reduce(
    (acc, name) => acc.replace(new RegExp(`(?:^[ \\t]*)?<!-- begin:${name} -->[\\s\\S]*?<!-- end:${name} -->[ \\t]*\\n?`, 'gm'), ''),
    html,
  );
  const unmarked = withoutHidden
    .replace(/[ \t]*<!-- site-profile:[\s\S]*?-->\n?/g, '')
    .replace(/(?:^[ \t]*)?<!-- (?:begin|end):[a-z-]+ -->(?:[ \t]*\n)?/gm, '');
  return brandCopy(unmarked);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inlineMarkdown(value: string): string {
  let html = escapeHtml(value);
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return html;
}

function renderTable(rows: string[][]): string {
  if (rows.length < 2) return rows.map(row => `<p>${row.map(inlineMarkdown).join(' · ')}</p>`).join('');
  const cells = (row: string[], tag: 'th' | 'td') => row.map(cell => `<${tag}>${inlineMarkdown(cell)}</${tag}>`).join('');
  const bodyRows = rows.slice(2).map(row => `<tr>${cells(row, 'td')}</tr>`).join('');
  return `<div class="overflow-x-auto"><table><thead><tr>${cells(rows[0], 'th')}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
}

/** Render the article source into crawlable HTML without pulling React into the build script. */
function renderMarkdown(source: string): string {
  const output: string[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    output.push(`<${listType}>${listItems.map(item => `<li>${inlineMarkdown(item)}</li>`).join('')}</${listType}>`);
    listItems = [];
    listType = null;
  };
  const flushTable = () => {
    if (tableRows.length === 0) return;
    output.push(renderTable(tableRows));
    tableRows = [];
  };

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      tableRows.push(line.split('|').slice(1, -1).map(cell => cell.trim()));
      continue;
    }
    flushTable();
    if (!line) {
      flushList();
      continue;
    }
    if (line === '---' || line === '***' || /^[-| :]+$/.test(line)) continue;
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      const nextType = ordered ? 'ol' : 'ul';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push((unordered || ordered)![1]);
      continue;
    }
    flushList();
    if (/^\*[^*].*\*$/.test(line)) {
      output.push(`<p><em>${inlineMarkdown(line.slice(1, -1))}</em></p>`);
    } else {
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }
  flushList();
  flushTable();
  return output.join('\n');
}

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
}

function articlePath(slug: string, locale?: 'en' | 'zh'): string {
  return `${locale ? `/${locale}` : ''}/blog/${slug}`;
}

function pageHead(options: {
  title: string;
  description: string;
  canonicalPath: string;
  language: 'en-US' | 'zh-CN' | 'es-ES';
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: object;
  alternates?: Array<{ hrefLang: string; href: string }>;
}): string {
  const image = absoluteUrl(options.image || '/blog/dlss5-neural-rendering.png');
  const canonical = absoluteUrl(options.canonicalPath);
  const baseBlogPath = options.canonicalPath.replace(/^\/(en|zh)(?=\/)/, '');
  const englishBlogPath = options.canonicalPath.startsWith('/en/')
    ? options.canonicalPath
    : options.canonicalPath.startsWith('/zh/')
      ? options.canonicalPath.replace(/^\/zh/, '/en')
      : `/en${options.canonicalPath}`;
  const chineseBlogPath = options.canonicalPath.startsWith('/zh/')
    ? options.canonicalPath
    : options.canonicalPath.startsWith('/en/')
      ? options.canonicalPath.replace(/^\/en/, '/zh')
      : `/zh${options.canonicalPath}`;
  const blogAlternates = options.canonicalPath.includes('/blog')
    ? [
        `<link rel="alternate" hreflang="en" href="${BASE_URL}${englishBlogPath}" data-rh="true" />`,
        `<link rel="alternate" hreflang="zh-CN" href="${BASE_URL}${chineseBlogPath}" data-rh="true" />`,
        `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${baseBlogPath}" data-rh="true" />`,
      ].join('\n    ')
    : '';
  const localeAlternates = options.alternates?.map(alternate => `<link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}" data-rh="true" />`).join('\n    ') || '';
  const jsonLd = options.structuredData
    ? `<script type="application/ld+json" data-rh="true">${JSON.stringify(options.structuredData).replaceAll('<', '\\u003c')}</script>`
    : '';
  const headTags = [
    SITE_ORGANIZATION,
    `<meta name="robots" content="${options.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}" data-rh="true" />`,
    `<link rel="canonical" href="${canonical}" data-rh="true" />`,
    `<meta property="og:type" content="${options.type || 'website'}" data-rh="true" />`,
    `<meta property="og:title" content="${escapeHtml(options.title)}" data-rh="true" />`,
    `<meta property="og:description" content="${escapeHtml(options.description)}" data-rh="true" />`,
    `<meta property="og:url" content="${canonical}" data-rh="true" />`,
    `<meta property="og:image" content="${image}" data-rh="true" />`,
    `<meta property="og:site_name" content="DLSS5NVIDIA" data-rh="true" />`,
    `<meta property="og:locale" content="${options.language.replace('-', '_')}" data-rh="true" />`,
    `<meta name="twitter:card" content="summary_large_image" data-rh="true" />`,
    `<meta name="twitter:title" content="${escapeHtml(options.title)}" data-rh="true" />`,
    `<meta name="twitter:description" content="${escapeHtml(options.description)}" data-rh="true" />`,
    `<meta name="twitter:image" content="${image}" data-rh="true" />`,
    blogAlternates,
    localeAlternates,
    jsonLd,
  ].filter(Boolean).join('\n    ');
  return headTags;
}

function withHead(template: string, options: Parameters<typeof pageHead>[0]): string {
  let html = template.replace('<html lang="en">', `<html lang="${options.language}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(options.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(options.description)}" data-rh="true" />`);
  html = html.replace(/<meta name="keywords" content="[^"]*"\s*\/>/, `<meta name="keywords" content="${escapeHtml((options.keywords || []).join(', '))}" data-rh="true" />`);
  // The shell carries homepage metadata for a no-JavaScript visit. Remove those route-agnostic
  // tags before adding the route-specific head, otherwise every prerendered page would expose two
  // canonicals (and crawlers could keep the homepage URL). The homepage graph goes with them; the
  // Organization node `pageHead` writes in its place is the only part that is true of every route.
  html = html
    .replace(/^\s*<meta name="robots"[^>]*>\s*$/gm, '')
    .replace(/^\s*<link rel="canonical"[^>]*>\s*$/gm, '')
    .replace(/<meta property="og:[^"]+"[^>]*\/?>\s*/g, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*\/?>\s*/g, '')
    .replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>[ \t]*\n?/, '');
  const marker = '    <!-- Paint the theme colour';
  return html.replace(marker, `    ${pageHead(options)}\n${marker}`);
}

function withRoot(template: string, rootHtml: string): string {
  const rootStart = template.indexOf('<div id="root">');
  const noscriptStart = template.indexOf('\n    <noscript>', rootStart);
  if (rootStart < 0 || noscriptStart < 0) throw new Error('Unable to locate the static root in dist/index.html');
  return `${template.slice(0, rootStart)}<div id="root">${rootHtml}</div>${template.slice(noscriptStart)}`;
}

/**
 * Drops sitemap entries and prose lines that point at sections this deployment does not serve, so a
 * crawler reading these files is never sent to a page that only redirects home.
 */
function withoutHiddenUrls(text: string): string {
  const published = (url: string) => {
    try {
      return isPublishedPath(new URL(url).pathname);
    } catch {
      return true;
    }
  };
  if (text.includes('<url>')) {
    return text.replace(/[ \t]*<url>[\s\S]*?<\/url>\n?/g, (block) => {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      return !loc || published(loc) ? block : '';
    });
  }
  return text
    .split('\n')
    .filter((line) => (line.match(/https?:\/\/[^\s"'<>)]+/g) || []).every(published))
    .join('\n');
}

function writeRoute(route: string, html: string): void {
  const output = resolve(DIST, route.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, forThisDeployment(html));
}

function coverFor(article: Article) {
  return ARTICLE_COVERS[article.slug] || { src: '/examples/sample1.jpg', alt: article.title_en };
}

function renderArticle(article: Article, locale?: 'en' | 'zh'): { html: string; title: string } {
  const isChinese = locale === 'zh';
  const title = isChinese ? article.title_cn : article.title_en;
  const description = isChinese ? article.description_cn || article.title_cn : article.description_en || article.title_en;
  const content = isChinese ? article.content_cn : article.content_en;
  const cover = coverFor(article);
  const canonicalPath = articlePath(article.slug, locale);
  const relatedArticles = ARTICLES.filter(candidate => candidate.slug !== article.slug).slice(0, 3);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    inLanguage: isChinese ? 'zh-CN' : 'en-US',
    image: absoluteUrl(cover.ogSrc || cover.src),
    dateModified: article.datePublished,
    datePublished: article.datePublished,
    author: { '@type': 'Organization', name: 'DLSS5 Independent Research Desk' },
    publisher: { '@type': 'Organization', name: 'DLSS5 Independent Research Desk', url: BASE_URL },
    mainEntityOfPage: absoluteUrl(canonicalPath),
    citation: article.sources?.map(source => source.url),
  };
  const root = `<main class="pt-32 pb-24 px-6 max-w-[900px] mx-auto">
    <nav class="mb-8"><a href="${locale ? `/${locale}/blog` : '/blog'}" class="text-zinc-400">← ${isChinese ? '返回博客' : 'Back to Blog'}</a></nav>
    <article>
      <header class="mb-8">
        <p class="text-xs uppercase tracking-widest text-primary">${escapeHtml(article.priority)} · ${escapeHtml(article.readTime)} · ${escapeHtml(article.lastUpdated)}</p>
        <h1 class="text-3xl md:text-4xl font-headline font-bold text-white mb-6 leading-tight">${escapeHtml(title)}</h1>
        <p class="text-lg text-zinc-400 leading-relaxed">${escapeHtml(description)}</p>
        <p class="text-sm text-zinc-500 mt-4">${article.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join(' · ')}</p>
      </header>
      <figure class="rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-low mb-10">
        <img src="${escapeHtml(cover.src)}" alt="${escapeHtml(cover.alt)}" width="1600" height="700" fetchpriority="high" class="w-full object-cover" />
        <figcaption class="px-5 py-3 text-xs text-zinc-400">${isChinese ? '技术简报 · 来源驱动内容' : 'Technical briefing · source-led coverage'}</figcaption>
      </figure>
      <div class="prose prose-invert prose-zinc max-w-none">${renderMarkdown(content)}</div>
      ${article.sources?.length ? `<aside class="mt-10 rounded-xl border border-outline-variant/20 bg-surface-low p-5"><h2>${isChinese ? '资料与来源' : 'Sources and methodology'}</h2><ul>${article.sources.map(source => `<li><a href="${escapeHtml(source.url)}" rel="noreferrer">${escapeHtml(source.label)}</a></li>`).join('')}</ul></aside>` : ''}
      <aside class="mt-12" aria-labelledby="related-articles-heading"><h2 id="related-articles-heading">${isChinese ? '继续阅读' : 'Related reading'}</h2><div class="grid grid-cols-1 sm:grid-cols-3 gap-4">${relatedArticles.map(related => { const relatedCover = coverFor(related); return `<a href="${articlePath(related.slug, locale)}"><img src="${escapeHtml(relatedCover.src)}" alt="${escapeHtml(relatedCover.alt)}" width="1600" height="700" loading="lazy" /><span>${escapeHtml(isChinese ? related.title_cn : related.title_en)}</span></a>`; }).join('')}</div></aside>
      <p class="mt-12 text-center"><a href="/dashboard" class="text-primary">${isChinese ? '立即试用免费工具' : 'Try the free AI image tool'}</a></p>
    </article>
  </main>`;
  const html = withRoot(withHead(TEMPLATE, {
    title: `${title} — DLSS 5 Blog`,
    description,
    canonicalPath,
    language: isChinese ? 'zh-CN' : 'en-US',
    image: cover.ogSrc || cover.src,
    keywords: isChinese ? article.target_keywords_cn : article.target_keywords_en,
    type: 'article',
    structuredData,
  }), root);
  return { html, title };
}

function renderBlogIndex(locale?: 'en' | 'zh'): string {
  const isChinese = locale === 'zh';
  const blogPath = `${locale ? `/${locale}` : ''}/blog`;
  const title = isChinese ? 'DLSS 5 博客' : 'DLSS 5 Blog';
  const description = isChinese
    ? '一手资料驱动的 DLSS 5 新闻、神经渲染解析、GPT-6 工作流和实用 AI 图像研究。'
    : 'Source-led DLSS 5 news, neural rendering explainers, GPT-6 workflows, and practical AI image research.';
  const cards = [...ARTICLES]
    .sort((a, b) => Number(Boolean(b.datePublished)) - Number(Boolean(a.datePublished)))
    .map(article => {
      const cover = coverFor(article);
      const articleTitle = isChinese ? article.title_cn : article.title_en;
      const articleDescription = isChinese ? article.description_cn || article.type : article.description_en || article.type;
      return `<article class="bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden"><a href="${articlePath(article.slug, locale)}"><img src="${escapeHtml(cover.src)}" alt="${escapeHtml(cover.alt)}" width="1600" height="700" loading="lazy" class="w-full aspect-[16/7] object-cover" /><div class="p-6"><p class="text-xs uppercase tracking-widest text-primary">${escapeHtml(article.priority)} · ${escapeHtml(article.readTime)}</p><h2 class="text-xl font-headline font-bold text-white mt-3">${escapeHtml(articleTitle)}</h2><p class="text-sm text-zinc-400 leading-relaxed mt-3">${escapeHtml(articleDescription)}</p></div></a></article>`;
    }).join('');
  const root = `<main class="pt-32 pb-24 px-6 max-w-[1200px] mx-auto"><header class="mb-12"><h1 class="text-4xl font-headline font-bold text-white mb-4">${title}</h1><p class="text-zinc-400">${description}</p></header><div class="grid grid-cols-1 md:grid-cols-2 gap-6">${cards}</div></main>`;
  return withRoot(withHead(TEMPLATE, {
    title: `${title} — Neural Rendering News, GPT-6 Workflows & AI Upscaling`,
    description,
    canonicalPath: blogPath,
    language: isChinese ? 'zh-CN' : 'en-US',
    image: '/blog/dlss5-neural-rendering.png',
    keywords: ['dlss 5 latest news', 'dlss 5 image converter', 'dlss 5 visual enhancer', 'dlss 5 upscaling', 'dlss 5 online', 'dlss 5 gpt-6'],
  }), root);
}

type PublicGuideOptions = {
  path: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  keywords: string[];
  links?: Array<{ label: string; path: string }>;
  noindex?: boolean;
};

/** Keep the non-blog public routes crawlable before React loads the lazy page bundle. */
function renderPublicGuide(options: PublicGuideOptions): string {
  const links = options.links?.length
    ? `<nav class="mt-10 border-t border-outline-variant/20 pt-7" aria-label="Related pages"><h2 class="text-xl font-bold text-white">Continue exploring</h2><ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">${options.links.map(link => `<li><a class="text-primary" href="${escapeHtml(link.path)}">${escapeHtml(link.label)} →</a></li>`).join('')}</ul></nav>`
    : '';
  const root = `<main class="pt-32 pb-24 px-6 max-w-[1000px] mx-auto"><nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(options.heading)}</span></nav><header class="max-w-3xl"><p class="text-primary uppercase tracking-widest text-xs">DLSS5NVIDIA · independent guide</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">${escapeHtml(options.heading)}</h1><p class="text-lg leading-relaxed text-zinc-300 mt-5">${escapeHtml(options.lead)}</p></header><section class="mt-12 rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-2xl font-bold text-white">What this page covers</h2><p class="mt-4 leading-relaxed text-zinc-300">${escapeHtml(options.description)}</p></section>${links}</main>`;
  return withRoot(withHead(TEMPLATE, {
    title: options.title,
    description: options.description,
    canonicalPath: options.path,
    language: 'en-US',
    keywords: options.keywords,
    noindex: options.noindex,
  }), root);
}

type LegalDocument = 'terms' | 'privacy' | 'refund';

/** Keep the policy routes useful before React hydrates (payment reviewers and crawlers often do not run JS). */
function renderLegalPage(kind: LegalDocument): string {
  const documents: Record<LegalDocument, {
    title: string;
    description: string;
    keywords: string[];
    heading: string;
    intro: string;
    sections: Array<{ title: string; paragraphs?: string[]; bullets?: string[] }>;
  }> = {
    terms: {
      title: 'Terms of Service | DLSS 5 Image Upscaler',
      description: 'The terms that govern DLSS5NVIDIA accounts, subscriptions, credits, acceptable use and liability for the online AI image upscaling service.',
      keywords: ['terms of service', 'subscription terms', 'ai image upscaler terms'],
      heading: 'Terms of Service',
      intro: `These Terms are an agreement between you and ${LEGAL.operator}, which operates ${LEGAL.website} and the AI image tools offered on it. By creating an account or paying for a plan you accept them.`,
      sections: [
        { title: '1. The service', paragraphs: [`${LEGAL.operator} provides browser-based AI image tools: image upscaling and enhancement, image generation and editing, video super-resolution, and a web API for developers. Processing runs on our servers and on third-party model providers — you do not need a GPU or installed software.`, 'We may add, change or retire individual tools and models. We will not remove a paid feature in the middle of a period you have already paid for.'] },
        { title: '2. Your account', bullets: ['You must be at least 18 years old, or the age of majority where you live, to subscribe.', 'Keep your password and sign-in method secure; activity through your account is treated as done by you.', 'Give us an email address you read so we can send billing and service notices.', 'Do not share an account to avoid plan limits.'] },
        { title: '3. Plans, credits and billing', paragraphs: ['Paid plans renew monthly until cancelled. Current plans, prices, credit allowances and limits are shown on the Pricing page and at checkout.', 'Credits are consumed per generation and the cost is shown before a job runs. Monthly credits do not roll over; failed generations on our side are returned automatically.', `Payments are collected by payment processors in US dollars. We do not receive or store your full card number. Cancellation and refunds are described in the Refund & Cancellation Policy.`] },
        { title: '4. Acceptable use', bullets: ['Do not upload content you have no right to process or use the service for unlawful, hateful, harassing or deceptive content.', 'Do not bypass credit, rate or authentication limits, resell API access without an agreement, or overload the service.', 'We may suspend accounts that endanger the service, providers or other customers and will explain why where practical.'] },
        { title: '5. Your content', paragraphs: ['You keep rights to images you upload and results you generate. You grant only the limited licence needed to store, transmit and process files and return results.', `We do not claim ownership of your images or use them to train models. Ask ${LEGAL.contactEmail} if you want a file or account history deleted.`] },
        { title: '6. Our content and trademarks', paragraphs: ['The site, text, design and software are ours or our licensors\' and may not be copied or resold. This is an independent tool, not affiliated with, sponsored by or endorsed by NVIDIA Corporation. DLSS and NVIDIA are trademarks of NVIDIA Corporation.'] },
        { title: '7. Availability, changes and beta features', paragraphs: ['We work to keep the service available but provide no uptime guarantee unless a separate agreement says otherwise. Preview features may change, and third-party providers can be unavailable; failed generations are refunded in credits automatically.'] },
        { title: '8. Suspension and termination', paragraphs: ['You can cancel at any time. We may suspend or terminate material breaches, fraud or action required by law. If we terminate without cause, we refund the unused part of the paid period.'] },
        { title: '9. Disclaimers and limitation of liability', paragraphs: ['The service is provided “as is”. AI output may be inaccurate or unsuitable, so check results and keep your own copies. To the extent the law allows, total liability is limited to the amount paid in the three months before the event.'] },
        { title: '10. Governing law and disputes', paragraphs: [`These Terms are governed by the laws of ${LEGAL.governingLaw}. Before starting a formal dispute, write to ${LEGAL.contactEmail}.`] },
        { title: '11. Changes to these Terms', paragraphs: [`We may update these Terms as the service changes. The date at the bottom shows the current version; material changes are emailed to subscribers before they take effect.`] },
        { title: '12. Contact', paragraphs: [`${LEGAL.operator}, operating ${LEGAL.website}. Questions, notices and complaints: ${LEGAL.contactEmail}.`] },
      ],
    },
    privacy: {
      title: 'Privacy Policy | DLSS 5 Image Upscaler',
      description: 'What DLSS5NVIDIA collects, why it is collected, which processors handle it, how long it is kept, and how to have account data deleted.',
      keywords: ['privacy policy', 'data protection', 'ai image upscaler privacy'],
      heading: 'Privacy Policy',
      intro: `This policy explains what ${LEGAL.operator} collects when you use ${LEGAL.website}, why, and what you can ask us to do about it.`,
      sections: [
        { title: '1. What we collect', bullets: ['Account data: email, display name, sign-in provider and internal account identifier.', 'Billing data: plan, credit balance, subscription identifiers and processor status. Card numbers stay on the processor page.', 'Content you submit: uploaded images, prompts, generation settings and results.', 'Technical data: IP address, browser and language, pages opened and limited usage events.', `Support messages sent to ${LEGAL.contactEmail}.`] },
        { title: '2. Why we use it', bullets: ['To authenticate you, process images, keep history and balances correct.', 'To bill, grant and deduct credits, and prevent fraud.', 'To keep the service stable and secure through rate limiting, abuse detection and error diagnosis.', 'To improve features with aggregated analytics and send necessary service notices.'], paragraphs: ['We do not sell personal data or use images and prompts to train models.'] },
        { title: '3. Who processes it for us', bullets: ['Google Firebase for authentication and the account database.', 'PayPal, Stripe and Dodo Payments for payments and subscriptions.', 'Vercel for hosting and content delivery.', 'Model and storage providers for image jobs and temporary files.', 'Google Analytics for aggregated visitor statistics.'], paragraphs: ['These providers may process data outside your country under their own policies and our instructions.'] },
        { title: '4. Cookies and local storage', paragraphs: ['Necessary storage keeps you signed in and remembers your language. Analytics storage counts visits and feature use. You can block or clear storage in your browser.'] },
        { title: '5. How long we keep it', bullets: ['Account and billing records while the account exists and as long as tax, accounting or fraud rules require.', 'Uploaded files and results until deletion or account closure.', 'Server and error logs for a short operational window, then rolling deletion.', 'Analytics data according to the analytics tool retention setting.'] },
        { title: '6. Your rights', paragraphs: [`Write to ${LEGAL.contactEmail} from your account address to access, correct, export or delete data, or object to a use. We answer within 30 days. EU and UK residents can also complain to their data protection authority.`] },
        { title: '7. Security', paragraphs: ['Traffic is encrypted in transit, provider API keys stay on the server, and production access is restricted. If a breach affects your data, we will notify you and the competent authority without undue delay.'] },
        { title: '8. Children', paragraphs: ['The service is not intended for anyone under 18 or the local age of majority. We do not knowingly collect children’s data; tell us if you believe a child has an account.'] },
        { title: '9. Changes and contact', paragraphs: [`We update this policy when processing changes. Controller and contact: ${LEGAL.operator}, ${LEGAL.contactEmail}.`] },
      ],
    },
    refund: {
      title: 'Refund & Cancellation Policy | DLSS 5 Image Upscaler',
      description: 'How to cancel a DLSS5NVIDIA subscription, when a refund is available, how long it takes, and how plan changes are billed.',
      keywords: ['refund policy', 'cancel subscription', 'cancellation policy'],
      heading: 'Refund & Cancellation Policy',
      intro: `Subscriptions at ${LEGAL.operator} renew monthly and you can stop them whenever you like. This page explains how cancellation works, when we refund, and how long it takes.`,
      sections: [
        { title: '1. How to cancel', bullets: ['Card subscription (Stripe): open your dashboard and choose Manage billing.', 'PayPal subscription: cancel the recurring agreement in PayPal under Settings → Payments → Automatic payments.', `Email ${LEGAL.contactEmail} from your account address and we will cancel it for you.`] },
        { title: '2. What happens after you cancel', bullets: ['No further charges are made and cancellation is immediate.', 'You keep access and credits for the period already paid for.', 'At the end, the account drops to the Free plan; unused paid credits are not exchanged for money.'] },
        { title: '3. When we refund', bullets: [`Within ${LEGAL.refundWindowDays} days of a charge, if no credits were spent, we refund in full.`, `Within ${LEGAL.refundWindowDays} days with partial use, we normally refund the unused part and fully refund service failures.`, 'Duplicate or accidental charges are refunded in full.', 'A failed generation is returned as credits automatically, rather than a cash refund.'] },
        { title: '4. When we cannot refund', bullets: [`Periods older than ${LEGAL.refundWindowDays} days or whose credits were spent.`, 'Accounts closed for fraud, abuse or reselling API access.', 'Charges already disputed as a chargeback; contact us first so we can resolve it directly.'] },
        { title: '5. EU and UK consumers', paragraphs: ['EU and UK consumers may have a statutory 14-day withdrawal right for digital services. Using credits asks us to begin performance and ends the right for those credits; unspent credits can be refunded inside the window.'] },
        { title: '6. How refunds are paid and how long they take', bullets: [`Send the request from your account email to ${LEGAL.contactEmail}, including a PayPal transaction or subscription ID where relevant.`, 'We reply within 2 business days and issue an approved refund within 5 business days.', 'The original processor returns the money; banks and PayPal commonly show it within 5–10 business days.', 'Refunds use the original currency and amount charged.'] },
        { title: '7. Plan changes', paragraphs: ['Card plan changes are prorated from Manage billing. PayPal plan changes require cancelling and subscribing again; the already-paid period remains available.'] },
      ],
    },
  };
  const document = documents[kind];
  const sections = document.sections.map(section => `<section><h2>${escapeHtml(section.title)}</h2>${section.paragraphs?.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('') || ''}${section.bullets ? `<ul>${section.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}</section>`).join('');
  const root = `<main class="pt-32 pb-24 px-6 max-w-3xl mx-auto"><header class="mb-12"><span class="text-primary text-xs uppercase tracking-widest">Legal</span><h1 class="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">${escapeHtml(document.heading)}</h1><p class="text-zinc-400 leading-relaxed">${escapeHtml(document.intro)}</p></header><div class="space-y-9">${sections}</div><footer class="mt-14 pt-6 border-t border-outline-variant/10 text-zinc-600 text-xs">Last updated ${escapeHtml(LEGAL.updatedAt)}. Questions about this document: <a class="text-primary underline" href="mailto:${escapeHtml(LEGAL.contactEmail)}">${escapeHtml(LEGAL.contactEmail)}</a>.</footer></main>`;
  return withRoot(withHead(TEMPLATE, {
    title: document.title,
    description: document.description,
    canonicalPath: `/${kind}`,
    language: 'en-US',
    keywords: document.keywords,
  }), root);
}

function renderDashboard(): string {
  const root = `<main class="pt-32 pb-24 px-6 max-w-[900px] mx-auto"><h1 class="text-3xl font-headline font-bold text-white">AI Image Studio</h1><p class="text-zinc-400 mt-3">Sign in to use the private image editing workspace.</p><p class="mt-6"><a class="text-primary" href="/login">Sign in</a></p></main>`;
  return withRoot(withHead(TEMPLATE, {
    title: 'AI Image Studio — DLSS5NVIDIA',
    description: 'Private AI image editing workspace for signed-in DLSS5NVIDIA users.',
    canonicalPath: '/dashboard',
    language: 'en-US',
    noindex: true,
  }), root);
}

/**
 * A crawler-safe public storefront for payment-provider review. Keep this page entirely static:
 * it must explain the product, price, delivery and policies even when a reviewer does not run JS.
 */
function renderStore(): string {
  const root = `<main style="max-width:980px;margin:0 auto;padding:64px 24px 96px;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#f5f5f5">
    <header style="display:flex;justify-content:space-between;gap:24px;align-items:center;border-bottom:1px solid #303030;padding-bottom:24px">
      <a href="/" style="color:#b1fa50;font-size:24px;font-weight:800;text-decoration:none">DLSS5NVIDIA</a>
      <nav style="display:flex;gap:16px;flex-wrap:wrap;font-size:14px"><a href="/pricing" style="color:#b1fa50">Pricing</a>${profileHas('blog') ? '<a href="/blog" style="color:#aaa">Blog</a>' : ''}<a href="mailto:${SUPPORT_EMAIL}" style="color:#aaa">Contact</a></nav>
    </header>
    <section style="padding:64px 0 36px">
      <p style="color:#b1fa50;text-transform:uppercase;letter-spacing:.18em;font-size:12px">Online AI image enhancement service</p>
      <h1 style="font-size:clamp(36px,6vw,64px);line-height:1.05;margin:16px 0">Upscale and enhance images online</h1>
      <p style="font-size:20px;line-height:1.6;color:#b7b7b7;max-width:760px">DLSS5NVIDIA is an independent browser-based AI image upscaling service. Upload a JPG, PNG or WEBP image, use neural super-resolution to recover detail, and download the enhanced result in seconds.</p>
      <p style="margin-top:28px"><a href="/register" style="display:inline-block;background:#b1fa50;color:#111;padding:14px 22px;border-radius:8px;font-weight:700;text-decoration:none">Create a free account</a></p>
    </section>
    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:20px 0 56px">
      <article style="border:1px solid #303030;border-radius:12px;padding:22px"><h2 style="font-size:18px">What customers receive</h2><p style="color:#aaa;line-height:1.6">Immediate access to the web app, monthly processing credits, image upscaling and enhancement tools, and downloadable results.</p></article>
      <article style="border:1px solid #303030;border-radius:12px;padding:22px"><h2 style="font-size:18px">How delivery works</h2><p style="color:#aaa;line-height:1.6">After checkout, credits are added to the customer account. The customer signs in, uploads an image, and receives the generated result in the browser.</p></article>
      <article style="border:1px solid #303030;border-radius:12px;padding:22px"><h2 style="font-size:18px">Digital service</h2><p style="color:#aaa;line-height:1.6">There are no physical goods, shipping or manual fulfillment. Subscriptions renew monthly and can be cancelled at any time.</p></article>
    </section>
    <h2 style="font-size:30px;margin:0 0 18px">Plans</h2>
    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
      <article style="border:1px solid #303030;border-radius:12px;padding:24px"><h3 style="font-size:22px;margin:0">Free</h3><p style="font-size:30px;font-weight:800;margin:16px 0">$0</p><ul style="color:#aaa;line-height:1.8;padding-left:20px"><li>10 credits per month</li><li>3 generations per day</li><li>Browser access</li></ul><a href="/register" style="color:#b1fa50">Start free</a></article>
      <article style="border:1px solid #b1fa50;border-radius:12px;padding:24px"><h3 style="font-size:22px;margin:0">Pro</h3><p style="font-size:30px;font-weight:800;margin:16px 0">$19 <small style="font-size:14px;color:#aaa">/ month</small></p><ul style="color:#aaa;line-height:1.8;padding-left:20px"><li>500 credits per month</li><li>50 generations per day</li><li>Image upscaling and enhancement</li></ul><a href="/register" style="color:#b1fa50">Subscribe after sign-in</a></article>
      <article style="border:1px solid #303030;border-radius:12px;padding:24px"><h3 style="font-size:22px;margin:0">Team</h3><p style="font-size:30px;font-weight:800;margin:16px 0">$79 <small style="font-size:14px;color:#aaa">/ month</small></p><ul style="color:#aaa;line-height:1.8;padding-left:20px"><li>2,000 credits per month</li><li>200 generations per day</li><li>Higher-volume workflows</li></ul><a href="/register" style="color:#b1fa50">Subscribe after sign-in</a></article>
    </section>
    <section style="margin-top:56px;padding-top:28px;border-top:1px solid #303030;color:#aaa;line-height:1.7">
      <h2 style="color:#f5f5f5;font-size:24px">Policies and support</h2>
      <p>Questions about access, billing or refunds: <a href="mailto:${SUPPORT_EMAIL}" style="color:#b1fa50">${SUPPORT_EMAIL}</a></p>
      <p><a href="/terms" style="color:#b1fa50">Terms of Service</a> · <a href="/privacy" style="color:#b1fa50">Privacy Policy</a> · <a href="/refund" style="color:#b1fa50">Refund &amp; Cancellation Policy</a></p>
      <p style="font-size:13px">${SITE_PROFILE.legalName} is an independent tool and is not affiliated with or endorsed by NVIDIA Corporation. DLSS is a trademark of NVIDIA Corporation.</p>
    </section>
  </main>`;
  return withRoot(withHead(TEMPLATE, {
    title: 'DLSS5NVIDIA AI Image Upscaler — Plans and Online Service',
    description: 'Public storefront for DLSS5NVIDIA, an independent online AI image upscaling and enhancement service. View plans, delivery details and policies.',
    canonicalPath: '/store',
    language: 'en-US',
    image: '/examples/sample1.jpg',
    keywords: ['ai image upscaler', 'online image enhancer', '4k image upscaling', 'ai image enhancement pricing'],
  }), root);
}

function renderToolLanding(tool: ToolLanding): string {
  const isSpanish = tool.locale === 'es';
  const steps = toolSteps(tool);
  const longForm = toolLongForm(tool);
  const related = tool.related.map(item => `<a href="${item.path}">${escapeHtml(item.label)}</a>`).join(' · ');
  const faqs = tool.faqs.map(faq => `<article><h3>${escapeHtml(faq.question)}</h3><details><summary>Read the answer</summary><p>${escapeHtml(faq.answer)}</p></details></article>`).join('');
  const schema = toolSchema(tool);
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1200px] mx-auto">
    <nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(tool.heading)}</span></nav>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div><p class="text-primary uppercase tracking-widest text-xs">${escapeHtml(tool.eyebrow)}</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">${escapeHtml(tool.heading)}</h1><p class="text-lg text-zinc-300 leading-relaxed mt-5">${escapeHtml(tool.intro)}</p><p class="text-sm text-zinc-400 leading-relaxed mt-4">${escapeHtml(AI_OVERVIEW_DEFINITION)}</p><p class="mt-6"><a href="/dashboard?tool=${tool.dashboardTool}" class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold">${escapeHtml(tool.cta)} →</a></p><p class="text-xs text-zinc-500 mt-4">${escapeHtml(tool.ctaNote)}</p></div>
      ${tool.demo
        ? `<figure class="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low p-2"><img src="${tool.demo.after}" alt="${escapeHtml(`${tool.heading} — ${tool.demo.afterLabel}`)}" width="1024" height="1024" fetchpriority="high" class="w-full rounded-lg" /><img src="${tool.demo.before}" alt="${escapeHtml(`${tool.heading} — ${tool.demo.beforeLabel}`)}" width="1024" height="1024" class="w-full rounded-lg" /><figcaption class="p-3 text-xs text-zinc-400">${escapeHtml(tool.demo.caption)}</figcaption></figure>`
        : `<figure class="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low p-2"><img src="/examples/sample1-photo.webp" alt="${escapeHtml(isSpanish ? 'Comparación de mejora de imagen' : 'Image quality enhancement before and after example')}" width="1200" height="800" fetchpriority="high" class="w-full rounded-lg" /><figcaption class="p-3 text-xs text-zinc-400">${escapeHtml(isSpanish ? 'Ejemplo ilustrativo; el resultado depende de tu imagen original.' : 'Illustrative example; the result depends on your original image.')}</figcaption></figure>`}
    </section>
    <section class="mt-16 max-w-4xl space-y-7" aria-labelledby="definition-heading"><div><h2 id="definition-heading">What is ${escapeHtml(tool.heading)}?</h2><p>${escapeHtml(longForm.definition)}</p></div><div><h2>How the workflow works</h2><p>${escapeHtml(longForm.workflow)}</p></div><div><h2>Input, output and source quality</h2><p>${escapeHtml(longForm.inputs)}</p></div></section>
    <section class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">${isSpanish ? 'Cuándo usar esta herramienta' : 'When to use this tool'}</h2><ul>${tool.useCases.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">${isSpanish ? 'Cómo funciona' : 'How it works'}</h2><ol>${steps.map(step => `<li><strong>${escapeHtml(step.name)}</strong> — ${escapeHtml(step.text)}</li>`).join('')}</ol></article></section>
    <section class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2>When this workflow fits</h2><p>${escapeHtml(longForm.fit)}</p></article><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2>Limits and responsible use</h2><p>${escapeHtml(longForm.limits)}</p></article></section>
    <section class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="bg-primary/5 rounded-xl border border-primary/25 p-6"><h2>Credits and delivery</h2><p>${escapeHtml(longForm.cost)}</p></article><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2>A practical quality review</h2><p>${escapeHtml(longForm.review)}</p></article></section>
    <section class="mt-16 max-w-4xl" id="faq"><h2 class="text-3xl font-bold text-white">${isSpanish ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2><div class="mt-5">${faqs}</div></section>
    <section class="mt-16 border-t border-outline-variant/20 pt-8"><h2 class="text-xl font-bold text-white">${isSpanish ? 'Herramientas relacionadas' : 'Related tools'}</h2><p class="mt-4 text-primary">${related}</p>${profileHas('blog') ? `<p class="mt-6"><a href="/blog/dlss-5-online-image-upscaler-guide">${isSpanish ? 'Leer la guía de mejora de imágenes (inglés) →' : 'Read the online image enhancement guide →'}</a></p>` : ''}</section>
  </main>`;
  return withRoot(withHead(TEMPLATE, {
    title: tool.title,
    description: tool.description,
    canonicalPath: tool.path,
    language: tool.language,
    image: tool.demo?.social ?? tool.demo?.after ?? '/examples/sample1-photo.webp',
    keywords: tool.keywords,
    structuredData: schema,
    alternates: toolAlternates(tool),
  }), root);
}

function renderUseCaseLanding(item: UseCase): string {
  const related = item.related.map(relatedItem => `<a href="${relatedItem.path}">${escapeHtml(relatedItem.label)}</a>`).join(' · ');
  const faqs = item.faqs.map(faq => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join('');
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1200px] mx-auto">
    <nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(item.heading)}</span></nav>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div><p class="text-primary uppercase tracking-widest text-xs">${escapeHtml(item.eyebrow)}</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">${escapeHtml(item.heading)}</h1><p class="text-lg text-zinc-300 leading-relaxed mt-5">${escapeHtml(item.intro)}</p><aside class="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-5"><p class="text-xs uppercase tracking-widest text-primary mb-2">Quick answer</p><p class="text-sm leading-relaxed text-zinc-200">${escapeHtml(item.tldr)}</p></aside><p class="mt-6"><a href="/dashboard?tool=${item.dashboardTool}" class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold">Try this workflow →</a></p><p class="text-xs text-zinc-500 mt-4">JPG, PNG and WebP · sign in before processing · 1 credit per task</p></div>
      <figure class="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low p-2"><img src="${escapeHtml(item.after)}" alt="${escapeHtml(item.imageAlt)}" width="1200" height="800" fetchpriority="high" class="w-full rounded-lg" /><img src="${escapeHtml(item.before)}" alt="${escapeHtml(item.beforeLabel)}" width="1200" height="800" class="w-full rounded-lg" loading="lazy" /><figcaption class="p-3 text-xs text-zinc-400">${escapeHtml(item.caption)}</figcaption></figure>
    </section>
    <section class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">When this workflow helps</h2><ul>${item.useCases.map(useCase => `<li>${escapeHtml(useCase)}</li>`).join('')}</ul><p class="mt-5 text-sm leading-relaxed text-zinc-400">The result is an AI reconstruction. Keep the original file and inspect information-sensitive details before using the image commercially.</p></article><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">How to use it</h2><ol>${item.steps.map(step => `<li><strong>${escapeHtml(step.name)}</strong> — ${escapeHtml(step.text)}</li>`).join('')}</ol></article></section>
    <section class="mt-16 max-w-4xl" id="faq"><h2 class="text-3xl font-bold text-white">Frequently asked questions</h2><div class="mt-5">${faqs}</div></section>
    <section class="mt-16 border-t border-outline-variant/20 pt-8"><h2 class="text-xl font-bold text-white">Use the underlying tool</h2><p class="mt-4 text-primary">${related}</p><p class="mt-6"><a href="/blog/dlss-5-online-image-upscaler-guide">Read the image enhancement guide →</a></p></section>
  </main>`;
  return withRoot(withHead(TEMPLATE, {
    title: item.title,
    description: item.description,
    canonicalPath: item.path,
    language: 'en-US',
    image: item.after,
    keywords: item.keywords,
    structuredData: useCaseSchema(item),
  }), root);
}

function renderGameStyleLanding(): string {
  const cards = GAME_STYLE_LANDING.cases.map((item, index) => `<article class="rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden"><figure><img src="${escapeHtml(item.after)}" alt="${escapeHtml(`${item.title} style reference`)}" width="768" height="512" ${index < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} class="w-full aspect-[3/2] object-cover" /><img src="${escapeHtml(item.before)}" alt="${escapeHtml(`${item.title} base frame`)}" width="768" height="512" loading="lazy" class="w-full aspect-[3/2] object-cover" /><figcaption class="p-3 text-xs text-zinc-400">Base frame → style reference</figcaption></figure><div class="p-4"><p class="text-[10px] text-primary uppercase tracking-widest">${escapeHtml(item.style)}</p><h2 class="mt-2 text-base font-bold text-white">${escapeHtml(item.title)}</h2><p class="mt-2 text-xs leading-relaxed text-zinc-400">${escapeHtml(item.description)}</p><details class="mt-3 text-xs text-zinc-400"><summary class="cursor-pointer text-primary">View conversion prompt</summary><p class="mt-2 leading-relaxed">${escapeHtml(item.prompt)}</p></details></div></article>`).join('');
  const longForm = `<section class="mt-16 max-w-4xl space-y-7"><div><h2 class="text-2xl font-bold text-white">What game character style conversion means</h2><p class="mt-3 text-sm leading-relaxed text-zinc-300">${escapeHtml(GAME_STYLE_LONG_FORM.definition)}</p></div><div><h2 class="text-2xl font-bold text-white">Lock the identity before changing the style</h2><p class="mt-3 text-sm leading-relaxed text-zinc-300">${escapeHtml(GAME_STYLE_LONG_FORM.invariants)}</p></div><div><h2 class="text-2xl font-bold text-white">Change visual variables deliberately</h2><p class="mt-3 text-sm leading-relaxed text-zinc-300">${escapeHtml(GAME_STYLE_LONG_FORM.variables)}</p></div><div><h2 class="text-2xl font-bold text-white">How to review a conversion</h2><p class="mt-3 text-sm leading-relaxed text-zinc-300">${escapeHtml(GAME_STYLE_LONG_FORM.review)}</p></div></section>`;
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1280px] mx-auto"><nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(GAME_STYLE_LANDING.heading)}</span></nav><header class="max-w-4xl"><p class="text-primary uppercase tracking-widest text-xs">Game character style conversion</p><h1 class="text-4xl md:text-6xl font-bold text-white mt-4">${escapeHtml(GAME_STYLE_LANDING.heading)}</h1><p class="text-lg leading-relaxed text-zinc-300 mt-6">${escapeHtml(GAME_STYLE_LANDING.intro)}</p><aside class="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-5 text-sm leading-relaxed text-zinc-200"><strong class="text-primary">Asset note: </strong>These 20 pairs are original visual references for evaluating a conversion brief. They are not NVIDIA DLSS 5 captures and do not claim a DLSS 5 runtime integration.</aside><p class="mt-7"><a class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold" href="/dashboard?tool=game-character-style&amp;sample=characterStyle">Try your own character frame →</a> <a class="inline-block ml-3 text-primary" href="/video-upscaler">See the video enhancement workflow →</a></p><p class="mt-4 text-xs leading-relaxed text-zinc-500">One cyberpunk direction runs as a free cached example — no account needed.</p></header>${longForm}<section class="mt-16" aria-labelledby="case-gallery-heading"><h2 id="case-gallery-heading" class="text-3xl font-bold text-white">Drag to compare: base frame → style reference</h2><p class="mt-3 text-sm text-zinc-500">Check faces, hands, gear edges and cloth folds first.</p><div class="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">${cards}</div></section><section class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"><article class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-lg font-bold text-white">01 · Lock the character</h2><p class="mt-3 text-sm leading-relaxed text-zinc-400">State that silhouette, costume, pose, camera and identity must stay stable.</p></article><article class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-lg font-bold text-white">02 · Change the style</h2><p class="mt-3 text-sm leading-relaxed text-zinc-400">Use lighting, materials, color grade, environment and render direction as the variables.</p></article><article class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-lg font-bold text-white">03 · Review the result</h2><p class="mt-3 text-sm leading-relaxed text-zinc-400">Compare the face, hands, gear edges and temporal consistency at 100%.</p></article></section></main>`;
  return withRoot(withHead(TEMPLATE, {
    title: GAME_STYLE_LANDING.title,
    description: GAME_STYLE_LANDING.description,
    canonicalPath: GAME_STYLE_LANDING.path,
    language: 'en-US',
    image: '/examples/generated/game-cyber-1-after.jpg',
    keywords: [...GAME_STYLE_LANDING.keywords],
    structuredData: gameStyleLandingSchema(BASE_URL),
  }), root);
}

function renderVideoLanding(): string {
  const demos = VIDEO_LANDING.demos.map((demo) => `<figure class="rounded-2xl border border-primary/25 bg-surface-low overflow-hidden"><video class="w-full aspect-video object-cover bg-black" controls muted playsinline preload="metadata" poster="${escapeHtml(demo.poster)}" aria-label="${escapeHtml(demo.alt)}"><source src="${escapeHtml(demo.src)}" type="video/mp4" />Your browser does not support this video.</video><figcaption class="p-5"><h2 class="text-lg font-bold text-white">${escapeHtml(demo.name)}</h2><p class="mt-2 text-sm leading-relaxed text-zinc-400">${escapeHtml(demo.description)}</p></figcaption></figure>`).join('');
  const steps = [['01', 'Generate a preview', 'Use 480p or 720p to iterate on prompt, camera movement, references and timing before paying for a final finish.'], ['02', 'Inspect key frames', 'Check faces, hands, typography, thin geometry, fast motion and temporal consistency at 100%.'], ['03', 'Finish the approved shot', 'Run the selected video super-resolution pass for 1080p or 4K delivery, then keep the original beside the AI-enhanced result.']].map(([number, title, text]) => `<li class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><span class="text-primary font-mono text-sm">${number}</span><h2 class="mt-4 text-xl font-bold text-white">${title}</h2><p class="mt-3 text-sm leading-relaxed text-zinc-400">${text}</p></li>`).join('');
  const faqs = VIDEO_LANDING.faqs.map((faq) => `<article><h3>${escapeHtml(faq.question)}</h3><details><summary>Read the answer</summary><p>${escapeHtml(faq.answer)}</p></details></article>`).join('');
  const longForm = `<section class="mt-16 max-w-4xl space-y-7"><div><h2 class="text-2xl font-bold text-white">What AI video upscaling changes</h2><p>${escapeHtml(VIDEO_LONG_FORM.definition)}</p></div><div><h2 class="text-2xl font-bold text-white">Why preview resolution comes first</h2><p>${escapeHtml(VIDEO_LONG_FORM.preview)}</p></div><div><h2 class="text-2xl font-bold text-white">Review time, not only one frame</h2><p>${escapeHtml(VIDEO_LONG_FORM.checks)}</p></div><div><h2 class="text-2xl font-bold text-white">Document the final delivery</h2><p>${escapeHtml(VIDEO_LONG_FORM.delivery)}</p></div><div><h2 class="text-2xl font-bold text-white">Test the hardest scene</h2><p>${escapeHtml(VIDEO_LONG_FORM.sceneNotes)}</p></div><div><h2 class="text-2xl font-bold text-white">Compare the whole cost</h2><p>${escapeHtml(VIDEO_LONG_FORM.costNotes)}</p></div><div><h2 class="text-2xl font-bold text-white">Keep the handoff reproducible</h2><p>${escapeHtml(VIDEO_LONG_FORM.handoff)}</p></div><div><h2 class="text-2xl font-bold text-white">Use a final review checklist</h2><p>${escapeHtml(VIDEO_LONG_FORM.checklist)}</p></div></section>`;
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1200px] mx-auto"><nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(VIDEO_LANDING.heading)}</span></nav><header class="max-w-4xl"><p class="text-primary uppercase tracking-widest text-xs">Video super-resolution workflow</p><h1 class="text-4xl md:text-6xl font-bold text-white mt-4">${escapeHtml(VIDEO_LANDING.heading)}</h1><p class="text-lg leading-relaxed text-zinc-300 mt-6">${escapeHtml(VIDEO_LANDING.intro)}</p><p class="mt-7"><a class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold" href="/dashboard?tool=enhance">Try a representative frame →</a> <a class="inline-block ml-3 text-primary" href="/blog/seedance-2-5-video-super-resolution-cost-guide-2026">Read the Seedance 2.5 cost guide →</a></p><p class="mt-4 text-xs leading-relaxed text-zinc-500">The current public workspace processes still image frames. These clips are original silent reference demos for the planned video provider workflow.</p></header>${longForm}<section class="mt-16" aria-labelledby="video-demos-heading"><p class="text-xs uppercase tracking-widest text-primary">Original reference demos</p><h2 id="video-demos-heading" class="mt-2 text-3xl font-bold text-white">See the transition before you commit to a workflow</h2><div class="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6">${demos}</div></section><section class="mt-20" aria-labelledby="workflow-heading"><h2 id="workflow-heading" class="text-3xl font-bold text-white">A practical 3-step video enhancement workflow</h2><ol class="mt-7 grid grid-cols-1 md:grid-cols-3 gap-6">${steps}</ol></section><section class="mt-16 max-w-4xl" id="faq"><h2 class="text-3xl font-bold text-white">Frequently asked questions</h2><div class="mt-5">${faqs}</div></section><section class="mt-16 border-t border-outline-variant/20 pt-8"><h2 class="text-xl font-bold text-white">Continue with related workflows</h2><p class="mt-4"><a href="/game-character-style">20 game character cases</a> · <a href="/image-quality-enhancer">Image quality enhancer</a> · <a href="/comparisons">AI tools compared</a></p></section></main>`;
  return withRoot(withHead(TEMPLATE, {
    title: VIDEO_LANDING.title,
    description: VIDEO_LANDING.description,
    canonicalPath: VIDEO_LANDING.path,
    language: 'en-US',
    image: VIDEO_LANDING.demos[0].poster,
    keywords: [...VIDEO_LANDING.keywords],
    structuredData: videoLandingSchema(BASE_URL),
  }), root);
}

function renderPassportPhoto(spec?: PhotoSpec): string {
  const specs = publishableSpecs();
  const selected = spec || specs[0];
  const selectedSlug = PASSPORT_PHOTO_SPEC_SLUGS[selected.id];
  const canonicalPath = spec ? `/tools/passport-photo/${selectedSlug}` : '/tools/passport-photo';
  const seoCopy = passportPhotoSeoCopy(spec ? selected : undefined);
  const title = seoCopy.title;
  const description = seoCopy.description;
  const links = specs.map(item => `<li><a href="/tools/passport-photo/${PASSPORT_PHOTO_SPEC_SLUGS[item.id]}">${escapeHtml(item.label)}</a> — ${item.sizeMm.width} × ${item.sizeMm.height} mm, minimum ${item.minDpi} DPI</li>`).join('');
  const facts = spec ? `<dl><dt>Printed size</dt><dd>${selected.sizeMm.width} × ${selected.sizeMm.height} mm</dd><dt>Minimum resolution</dt><dd>${selected.minDpi} DPI</dd><dt>Background</dt><dd>${escapeHtml(selected.background)}</dd><dt>Head guide</dt><dd>${selected.headHeightMm ? `${selected.headHeightMm.min}–${selected.headHeightMm.max} mm` : 'Not stated'} with ${selected.headroomMm ? `${selected.headroomMm.min}–${selected.headroomMm.max} mm` : 'no stated'} headroom</dd></dl>` : `<p>Available verified formats:</p><ul>${links}</ul>`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Free Passport Photo Maker',
        url: absoluteUrl(canonicalPath),
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description,
      },
      {
        '@type': 'HowTo',
        name: `How to make ${selected.label}`,
        step: [
          { '@type': 'HowToStep', name: 'Upload a photo', text: 'Choose a clear photo. It stays in your browser.' },
          { '@type': 'HowToStep', name: 'Align the guide', text: 'Adjust the crop so the head fits the published size and headroom guide.' },
          { '@type': 'HowToStep', name: 'Download a print sheet', text: 'Export the exact photo pixels or a sheet with repeated copies and cut marks.' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Free Passport Photo Maker', item: absoluteUrl(canonicalPath) },
        ],
      },
    ],
  };
  const toolHref = `${canonicalPath}#tool`;
  const longForm = `<section class="mt-12 max-w-4xl space-y-7"><div><h2 class="text-2xl font-bold text-white">What a passport photo maker does</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.definition)}</p></div><div><h2 class="text-2xl font-bold text-white">A repeatable local workflow</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.workflow)}</p></div><div><h2 class="text-2xl font-bold text-white">Source quality still matters</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.quality)}</p></div><div><h2 class="text-2xl font-bold text-white">Check the receiving authority</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.verification)}</p></div><div><h2 class="text-2xl font-bold text-white">Why local processing matters</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.privacy)}</p></div><div><h2 class="text-2xl font-bold text-white">Troubleshoot before printing</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.troubleshooting)}</p></div><div><h2 class="text-2xl font-bold text-white">Know the limits</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.limitations)}</p></div><div><h2 class="text-2xl font-bold text-white">Print at the documented size</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.printNotes)}</p></div><div><h2 class="text-2xl font-bold text-white">Handle the downloaded file carefully</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.privacyNotes)}</p></div><div><h2 class="text-2xl font-bold text-white">Run the final checklist</h2><p>${escapeHtml(PASSPORT_PHOTO_LONG_FORM.checklist)}</p></div></section>`;
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1100px] mx-auto"><nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>Free Passport Photo Maker</span></nav><header class="max-w-3xl"><p class="text-primary uppercase tracking-widest text-xs">Free small tool · local processing</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">${escapeHtml(title.replace(' — Printable Passport Photo Maker', ''))}</h1><p class="text-lg leading-relaxed text-zinc-300 mt-5">${escapeHtml(description)}</p><p class="mt-6"><a class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold" href="${toolHref}">Open the free local photo tool →</a></p></header>${longForm}<section class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-2xl font-bold text-white">Published specification</h2><div class="mt-5 text-sm text-zinc-300">${facts}</div></article><article class="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-2xl font-bold text-white">How it works</h2><ol class="mt-5 space-y-3 text-sm text-zinc-300"><li><strong>1. Upload locally.</strong> Choose a JPG, PNG or WebP; the browser reads it without sending it to our server.</li><li><strong>2. Align the guide.</strong> Position the crown and chin inside the published head-height and headroom lines.</li><li><strong>3. Export.</strong> Download an exact-size PNG or a repeated print sheet with cut marks.</li></ol></article></section><section class="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6"><h2 class="text-2xl font-bold text-white">Before submitting</h2><p class="mt-4 text-sm leading-relaxed text-zinc-300">A correctly sized file is not a guarantee of acceptance. Check the receiving authority's current photo rules, expression requirements and background guidance.</p><div class="mt-5 flex flex-wrap gap-4 text-sm">${specs.map(item => `<a class="text-primary" href="/tools/passport-photo/${PASSPORT_PHOTO_SPEC_SLUGS[item.id]}">${escapeHtml(item.label)} →</a>`).join('')}</div></section></main>`;
  return withRoot(withHead(TEMPLATE, {
    title,
    description,
    canonicalPath,
    language: 'en-US',
    keywords: ['free passport photo online', 'free passport photo maker', '3x4 photo online free', '35x45 passport photo free', 'printable ID photo'],
    structuredData,
  }), root);
}

/**
 * `/docs` is the integration page, and its static HTML comes from the same catalog the React page and
 * the JSON files are generated from (`src/config/apiCatalog.ts`). A crawler therefore reads the real
 * model ids, parameters and refusals — where the page used to be a placeholder whose copy named a
 * host and a model the service has never served.
 *
 * The prose stays short on purpose: the tables are the data, and the JSON files carry the same facts
 * in a form a generator prefers anyway.
 */
function renderApiCatalog(): string {
  const pretty = (value: unknown) => escapeHtml(JSON.stringify(value, null, 2));
  const code = (title: string, body: string) =>
    `<figure class="mt-4 rounded-xl border border-outline-variant/20 overflow-hidden bg-surface-lowest"><figcaption class="bg-surface-low px-4 py-2 text-xs text-zinc-400 border-b border-outline-variant/20">${escapeHtml(title)}</figcaption><pre class="overflow-x-auto p-4 text-xs text-zinc-300"><code>${escapeHtml(body)}</code></pre></figure>`;

  const facts = renderTable([
    ['Fact', 'Value'],
    ['---', '---'],
    ['Calls go to', API_BASE_URL],
    ['Authentication', 'Authorization: Bearer <project API key>'],
    ['Price', API_PRICE],
    ['Upload ceiling', `${API_MAX_UPLOAD_MIB} MiB per reference image`],
    ['Result URLs', `signed, and they expire ${API_RESULT_TTL_SECONDS} s after the task finishes`],
    ['Catalog version', `${CATALOG_VERSION} (updated ${CATALOG_UPDATED})`],
  ]);

  const flow = `<ol class="mt-5 space-y-3">${API_FLOW.map(step =>
    `<li><strong>${step.n}. ${escapeHtml(step.title)}</strong> — <code>${step.method} ${escapeHtml(step.path)}</code><br />${escapeHtml(step.detail)}</li>`).join('')}</ol>`;

  const index = `<div class="overflow-x-auto"><table><thead><tr><th>Model</th><th>What you get</th><th>References</th><th>Measured</th></tr></thead><tbody>${CATALOG.map(model =>
    `<tr><td><a href="#${model.id}"><code>${model.id}</code></a></td><td>${escapeHtml(model.label)}</td><td>${model.inputs.min === model.inputs.max ? model.inputs.max : `${model.inputs.min}–${model.inputs.max}`}</td><td>${escapeHtml(model.latency)}</td></tr>`).join('')}</tbody></table></div>`;

  const sections = CATALOG.map(model => {
    const params = renderTable([
      ['Field', 'Type', 'Values', 'Default', 'Notes'],
      ['---', '---', '---', '---', '---'],
      ...model.params.map(param => [
        param.required ? `${param.name} (required)` : param.name,
        param.type,
        param.values || '—',
        param.default || '—',
        param.note || '',
      ]),
    ]);
    const refs = `<ol class="mt-2">${model.inputs.slots.map((slot, order) =>
      `<li><code>image_ids[${order}]</code> — ${escapeHtml(slot)}</li>`).join('')}</ol>`;
    return `<section id="${model.id}" class="mt-12">
      <h2><code>${model.id}</code> — ${escapeHtml(model.label)}</h2>
      <p class="mt-3">${escapeHtml(model.summary)}</p>
      <p class="mt-2 text-sm">Capability <code>${escapeHtml(model.capability)}</code> · verified ${escapeHtml(model.verified)} · <a href="${escapeHtml(apiModelJson(model.id))}">JSON for this model</a></p>
      <h3 class="mt-6">References</h3>${refs}
      <p class="mt-3"><strong>Returns:</strong> ${escapeHtml(model.output)}</p>
      <p><strong>Measured:</strong> ${escapeHtml(model.latency)}</p>
      <h3 class="mt-6">Parameters</h3>${params}
      ${model.refuses.length ? `<p class="mt-4"><strong>Refused, not ignored:</strong> <code>${escapeHtml(model.refuses.join(', '))}</code> — sending one fails the call instead of being dropped.</p>` : ''}
      <h3 class="mt-6">Where it stops</h3><ul class="mt-2">${model.limits.map(limit => `<li>${escapeHtml(limit)}</li>`).join('')}</ul>
      ${code(`POST /v1/tasks/alphanet-flux — the body for ${model.id}`, JSON.stringify(model.body, null, 2))}
      ${model.tryIt ? `<p class="mt-4"><a href="${escapeHtml(model.tryIt.path)}">${escapeHtml(model.tryIt.label)}</a></p>` : ''}
    </section>`;
  }).join('');

  const root = `<main class="pt-32 pb-24 px-6 max-w-[1100px] mx-auto">
    <nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>Integration guide</span></nav>
    <header class="max-w-3xl"><p class="text-primary uppercase tracking-widest text-xs">Integration</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">The image API, on one page</h1><p class="text-lg leading-relaxed text-zinc-300 mt-5">Nine image models behind one asynchronous API: open an upload ticket, put the bytes, submit the task, poll it, fetch the signed result. This page is what an integrator reads; the gateway is what it calls. Both — and the JSON below — are rendered from one catalog file, so they cannot disagree. Every number here is a measurement with its date.</p></header>
    <section class="mt-10 rounded-xl border border-outline-variant/20 bg-surface-low p-6"><h2 class="text-2xl font-bold text-white">Two entry points</h2><ul class="mt-4 space-y-2"><li><strong>Read</strong> — this page, <a href="${escapeHtml(API_CATALOG_JSON)}">${escapeHtml(API_CATALOG_JSON)}</a> for every model, and <code>${escapeHtml(apiModelJson('<model>'))}</code> for one. No key required.</li><li><strong>Call</strong> — <a href="${escapeHtml(API_BASE_URL)}">${escapeHtml(API_BASE_URL)}</a>: sign in, copy the project API key, then <code>GET /v1/models</code> with it to list the model ids that key may use.</li></ul><div class="prose prose-invert prose-zinc max-w-none mt-5">${facts}</div></section>
    <section class="mt-12"><h2 class="text-2xl font-bold text-white">The four steps</h2><div class="prose prose-invert prose-zinc max-w-none">${flow}</div></section>
    <section class="mt-12"><h2 class="text-2xl font-bold text-white">The nine models</h2><div class="prose prose-invert prose-zinc max-w-none">${index}</div></section>
    <section class="mt-12"><h2 class="text-2xl font-bold text-white">Model by model</h2><div class="prose prose-invert prose-zinc max-w-none">${sections}</div>
      <p class="mt-6">A worked request for <code>cutout-fast</code>: <code>${pretty({ model: 'cutout-fast', image_ids: ['<file_id>'] })}</code> submitted to <code>POST /v1/tasks/alphanet-flux</code>, polled at <code>GET /v1/tasks/{task_id}</code>, results read at <code>GET /v1/tasks/{task_id}/result</code>.</p>
    </section>
    <section class="mt-12"><h2 class="text-2xl font-bold text-white">Output shapes for the four productised models</h2><p class="mt-4">Omitted, <code>aspect</code> follows the first reference image instead of forcing a square: ${ASPECT_SIZES.map(bucket => `<code>${bucket.value}</code> = ${bucket.size}`).join(' · ')}.</p></section>
    <section class="mt-12"><h2 class="text-2xl font-bold text-white">For a machine</h2><p class="mt-3">The whole catalog is at <a href="${escapeHtml(API_CATALOG_JSON)}">${escapeHtml(API_CATALOG_JSON)}</a>, one model per file at <code>${escapeHtml(apiModelJson('<model>'))}</code>. Model names are frozen: they are billing-visible, so renaming one is a breaking change.</p></section>
  </main>`;
  return withRoot(withHead(TEMPLATE, {
    title: 'Image API Documentation — One Page, Nine Models | DLSS 5 Studio',
    description: `One asynchronous image API for nine models: background removal, SVG tracing, generative erase, detail restore, prompt-driven editing, virtual try-on, interior renders, portrait retouch and virtual makeup. Base URL ${API_BASE_URL}, ${API_PRICE}.`,
    canonicalPath: '/docs',
    language: 'en-US',
    keywords: ['image api documentation', 'background removal api', 'image upscaling api', 'virtual try-on api', 'image to svg api', 'erase object api'],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'Image API documentation — one page, nine models',
      description: 'Upload, submit, poll and fetch across nine image models behind one asynchronous API.',
      dateModified: CATALOG_UPDATED,
      inLanguage: 'en-US',
    },
  }), root);
}

/**
 * Only the sections this deployment serves are written out: prerendering a page that only redirects
 * home would hand a crawler an indexable dead end.
 */
if (profileHas('blog')) {
  for (const locale of [undefined, 'en', 'zh'] as const) {
    writeRoute(`${locale ? `/${locale}` : ''}/blog`, renderBlogIndex(locale));
    for (const article of ARTICLES) {
      writeRoute(articlePath(article.slug, locale), renderArticle(article, locale).html);
    }
  }
}
if (profileHas('models')) writeRoute('/models', renderPublicGuide({
  path: '/models',
  title: 'AI Upscaling Models | DLSS 5 Neural Super Resolution',
  description: 'Compare AI image upscaling and neural super resolution models for portraits, cinematic art, documents, and high speed enhancement.',
  heading: 'AI Upscaling Models',
  lead: 'Compare neural super-resolution workflows for portraits, cinematic art, documents and fast image enhancement.',
  keywords: ['ai upscaling models', 'neural super resolution', 'dlss model comparison', 'image enhancement model', '4k upscaling model'],
  links: [{ label: 'AI Image Upscaler', path: '/image-upscaler' }, { label: 'Image Quality Enhancer', path: '/image-quality-enhancer' }, { label: 'API documentation', path: '/docs' }],
}));
if (profileHas('about')) writeRoute('/about', renderPublicGuide({
  path: '/about',
  title: 'NVIDIA DLSS 5 — Neural Rendering Technology & Tensor Core Guide',
  description: 'Complete guide to NVIDIA DLSS 5 neural rendering. Learn how DLSS 5 uses Tensor Cores for AI upscaling, supported RTX GPUs, and how it differs from DLSS 4 and FSR 4.',
  heading: 'NVIDIA DLSS 5 — Neural Rendering Explained',
  lead: 'A source-aware technical guide to neural rendering, Tensor Core acceleration, version differences and the limits of an independent DLSS-style image tool.',
  keywords: ['NVIDIA DLSS 5', 'DLSS 5 neural rendering', 'Tensor Core upscaling', 'DLSS 5 vs DLSS 4', 'DLSS 5 vs FSR 4'],
  links: [{ label: 'DLSS 5 latest news', path: '/blog/dlss-5-latest-news-september-2026' }, { label: 'DLSS 5 technical guide', path: '/blog/what-is-dlss-5-neural-rendering-guide' }, { label: 'AI image tools compared', path: '/comparisons' }],
}));
if (profileHas('download')) writeRoute('/download', renderPublicGuide({
  path: '/download',
  title: 'DLSS 5 Download Guide — Official Sources, RTX Compatibility & Online Alternative',
  description: 'DLSS 5 has no standalone download. Learn about the NVIDIA App, supported RTX games, compatibility, and an independent online image enhancement alternative with no download.',
  heading: 'DLSS 5 Download Guide',
  lead: 'Understand where DLSS is delivered, what RTX compatibility means, and when a browser-based image enhancement workflow is a better fit.',
  keywords: ['DLSS 5 download', 'DLSS download free', 'NVIDIA DLSS installer', 'RTX DLSS compatibility', 'online image upscaler no download'],
  links: [{ label: 'Free AI Image Upscaler', path: '/image-upscaler' }, { label: 'Latest DLSS 5 news', path: '/blog/dlss-5-latest-news-september-2026' }, { label: 'Models and workflows', path: '/models' }],
}));
if (profileHas('docs')) writeRoute('/docs', renderApiCatalog());
if (profileHas('enterprise')) writeRoute('/enterprise', renderPublicGuide({
  path: '/enterprise',
  title: 'Enterprise AI Image Upscaling | Private Neural Rendering API',
  description: 'Deploy private AI image upscaling for production workflows with dedicated capacity, on premise options, and custom neural rendering support.',
  heading: 'Enterprise AI Image Upscaling',
  lead: 'Plan a private, higher-volume image enhancement workflow with dedicated capacity, API integration and operational support.',
  keywords: ['enterprise ai upscaling', 'private image upscaling api', 'on premise neural rendering', 'custom image enhancement model'],
  links: [{ label: 'Developer API docs', path: '/docs' }, { label: 'AI upscaling models', path: '/models' }, { label: 'Contact and plans', path: '/pricing' }],
}));
if (profileHas('comparisons')) writeRoute('/comparisons', renderPublicGuide({
  path: '/comparisons',
  title: 'AI Image Tools Compared: GPT Image 2, ChatGPT Images, Midjourney & DLSS 5',
  description: 'Compare AI image generation, editing and upscaling tools by quality, structure preservation, speed, cost, API access and best use case.',
  heading: 'AI Image Tools Compared',
  lead: 'Choose the right job for a renderer-grounded upscaler, a generative image model or a conversational editing workflow.',
  keywords: ['GPT Image 2 vs Midjourney', 'ChatGPT Images vs FLUX', 'DLSS 5 vs AI upscaler', 'best AI image generator comparison'],
  links: [{ label: 'AI Image Upscaler', path: '/image-upscaler' }, { label: 'DLSS 5 and GPT-6 workflow', path: '/blog/dlss-5-gpt-6-astra-ai-rendering-workflow-2026' }, { label: 'Pricing and credits', path: '/pricing' }],
}));
writeRoute('/pricing', renderPublicGuide({
  path: '/pricing',
  title: 'AI Image Upscaling Plans | DLSS 5 Credits',
  description: 'Choose a predictable AI image upscaling plan with monthly credits, daily limits, and API access options.',
  heading: 'AI Image Upscaling Plans',
  lead: 'Compare free, Pro and Team image enhancement access before you sign in or subscribe.',
  keywords: ['ai image upscaling pricing', 'image enhancement api pricing', 'dlss 5 credits', 'ai upscaler plans'],
  links: [{ label: 'Start with the free image upscaler', path: '/image-upscaler' }, { label: 'Refund and cancellation policy', path: '/refund' }, { label: 'Developer API docs', path: '/docs' }],
}));
writeRoute('/login', renderPublicGuide({
  path: '/login',
  title: 'Sign In | DLSS5NVIDIA AI Image Tools',
  description: 'Sign in to the private DLSS5NVIDIA AI image workspace.',
  heading: 'Sign in to your AI image workspace',
  lead: 'Authentication is required before processing your own image or managing credits.',
  keywords: ['DLSS5NVIDIA login', 'AI image upscaler login'],
  noindex: true,
}));
writeRoute('/register', renderPublicGuide({
  path: '/register',
  title: 'Create an Account | DLSS5NVIDIA AI Image Tools',
  description: 'Create a DLSS5NVIDIA account to use AI image upscaling and enhancement workflows.',
  heading: 'Create your AI image account',
  lead: 'Start with the free image enhancement workflow, then manage credits and results from your workspace.',
  keywords: ['DLSS5NVIDIA register', 'free AI image upscaler account'],
  noindex: true,
}));
writeRoute('/dashboard', renderDashboard());
writeRoute('/store', renderStore());
for (const legalPage of ['terms', 'privacy', 'refund'] as const) writeRoute(`/${legalPage}`, renderLegalPage(legalPage));
if (profileHas('tools')) {
  writeRoute(GAME_STYLE_LANDING.path, renderGameStyleLanding());
  writeRoute(VIDEO_LANDING.path, renderVideoLanding());
}
if (profileHas('tools')) for (const tool of TOOL_LANDINGS) writeRoute(tool.path, renderToolLanding(tool));
if (profileHas('useCases')) for (const item of USE_CASES) writeRoute(item.path, renderUseCaseLanding(item));
if (profileHas('microTools')) {
  writeRoute('/tools/passport-photo', renderPassportPhoto());
  for (const spec of publishableSpecs()) writeRoute(`/tools/passport-photo/${PASSPORT_PHOTO_SPEC_SLUGS[spec.id]}`, renderPassportPhoto(spec));
}

/** Routes that are not prerendered fall back to the shell, so it carries the same origin as well. */
writeFileSync(resolve(DIST, 'index.html'), forThisDeployment(TEMPLATE));

/**
 * `public/` is copied verbatim, and these files state the origin as an absolute URL. Rewriting them
 * here keeps one set of files truthful for every deployment; the default project is a no-op.
 */
for (const file of ['llms.txt', 'sitemap.xml', 'robots.txt']) {
  const target = resolve(DIST, file);
  if (!existsSync(target)) continue;
  const original = readFileSync(target, 'utf8');
  const adapted = withoutHiddenUrls(
    forThisDeployment(
      original.replaceAll(DEFAULT_SITE_URL, BASE_URL).replaceAll(DEFAULT_SUPPORT_EMAIL, SUPPORT_EMAIL),
    ),
  );
  // Dropping a block from the crawler notes leaves the blank line that separated it behind, so the
  // notes close up. The default project drops nothing, and so is still written byte for byte.
  const tidied = file === 'llms.txt' ? adapted.replace(/\n{3,}/g, '\n\n') : adapted;
  if (tidied !== original) writeFileSync(target, tidied);
}

console.log(`Pre-rendered ${ARTICLES.length} articles in 3 locales plus ${TOOL_LANDINGS.length} SEO tools, ${USE_CASES.length} workflow guides and ${publishableSpecs().length + 1} micro tool routes, blog indexes and dashboard noindex.`);
