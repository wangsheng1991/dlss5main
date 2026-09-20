import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ARTICLE_COVERS } from '../src/content/articles/covers';
import { ARTICLES, type Article } from '../src/content/articles/types';

const BASE_URL = 'https://www.dlss5nvidia.com';
const DIST = resolve(process.cwd(), 'dist');
const TEMPLATE = readFileSync(resolve(DIST, 'index.html'), 'utf8');

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
  language: 'en-US' | 'zh-CN';
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  noindex?: boolean;
  structuredData?: object;
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
  const alternates = options.canonicalPath.includes('/blog')
    ? [
        `<link rel="alternate" hreflang="en" href="${BASE_URL}${englishBlogPath}" />`,
        `<link rel="alternate" hreflang="zh-CN" href="${BASE_URL}${chineseBlogPath}" />`,
        `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${baseBlogPath}" />`,
      ].join('\n    ')
    : '';
  const jsonLd = options.structuredData
    ? `<script type="application/ld+json">${JSON.stringify(options.structuredData).replaceAll('<', '\\u003c')}</script>`
    : '';
  const headTags = [
    `<meta name="robots" content="${options.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${options.type || 'website'}" />`,
    `<meta property="og:title" content="${escapeHtml(options.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(options.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:site_name" content="DLSS5NVIDIA" />`,
    `<meta property="og:locale" content="${options.language.replace('-', '_')}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(options.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(options.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    alternates,
    jsonLd,
  ].filter(Boolean).join('\n    ');
  return headTags;
}

function withHead(template: string, options: Parameters<typeof pageHead>[0]): string {
  let html = template.replace('<html lang="en">', `<html lang="${options.language}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(options.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(options.description)}" />`);
  html = html.replace(/<meta name="keywords" content="[^"]*"\s*\/>/, `<meta name="keywords" content="${escapeHtml((options.keywords || []).join(', '))}" />`);
  const marker = '    <!-- Paint the theme colour';
  return html.replace(marker, `    ${pageHead(options)}\n${marker}`);
}

function withRoot(template: string, rootHtml: string): string {
  const rootStart = template.indexOf('<div id="root">');
  const noscriptStart = template.indexOf('\n    <noscript>', rootStart);
  if (rootStart < 0 || noscriptStart < 0) throw new Error('Unable to locate the static root in dist/index.html');
  return `${template.slice(0, rootStart)}<div id="root">${rootHtml}</div>${template.slice(noscriptStart)}`;
}

function writeRoute(route: string, html: string): void {
  const output = resolve(DIST, route.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, html);
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

for (const locale of [undefined, 'en', 'zh'] as const) {
  writeRoute(`${locale ? `/${locale}` : ''}/blog`, renderBlogIndex(locale));
  for (const article of ARTICLES) {
    writeRoute(articlePath(article.slug, locale), renderArticle(article, locale).html);
  }
}
writeRoute('/dashboard', renderDashboard());

console.log(`Pre-rendered ${ARTICLES.length} articles in 3 locales plus blog indexes and dashboard noindex.`);
