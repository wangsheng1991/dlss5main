import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ARTICLE_COVERS } from '../src/content/articles/covers';
import { ARTICLES, type Article } from '../src/content/articles/types';
import { TOOL_LANDINGS, toolAlternates, toolSchema, toolSteps, type ToolLanding } from '../src/content/toolLandings';
import { DEFAULT_SITE_URL, DEFAULT_SUPPORT_EMAIL, resolveSiteUrl, resolveSupportEmail } from '../src/config/site-url';
import { SITE_PROFILE, SITE_SECTIONS, brandCopy, isPublishedPath, profileHas } from '../src/config/profile';

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
        `<link rel="alternate" hreflang="en" href="${BASE_URL}${englishBlogPath}" />`,
        `<link rel="alternate" hreflang="zh-CN" href="${BASE_URL}${chineseBlogPath}" />`,
        `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${baseBlogPath}" />`,
      ].join('\n    ')
    : '';
  const localeAlternates = options.alternates?.map(alternate => `<link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}" />`).join('\n    ') || '';
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
    blogAlternates,
    localeAlternates,
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
  const related = tool.related.map(item => `<a href="${item.path}">${escapeHtml(item.label)}</a>`).join(' · ');
  const faqs = tool.faqs.map(faq => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join('');
  const schema = toolSchema(tool);
  const root = `<main class="pt-28 pb-24 px-6 max-w-[1200px] mx-auto">
    <nav class="mb-8 text-sm text-zinc-500"><a href="/">DLSS5NVIDIA</a> <span aria-hidden="true">/</span> <span>${escapeHtml(tool.heading)}</span></nav>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <div><p class="text-primary uppercase tracking-widest text-xs">${escapeHtml(tool.eyebrow)}</p><h1 class="text-4xl md:text-5xl font-bold text-white mt-4">${escapeHtml(tool.heading)}</h1><p class="text-lg text-zinc-300 leading-relaxed mt-5">${escapeHtml(tool.intro)}</p><p class="mt-6"><a href="/dashboard?tool=${tool.dashboardTool}" class="inline-block bg-primary text-black px-6 py-3 rounded-lg font-bold">${escapeHtml(tool.cta)} →</a></p><p class="text-xs text-zinc-500 mt-4">${escapeHtml(tool.ctaNote)}</p></div>
      ${tool.demo
        ? `<figure class="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low p-2"><img src="${tool.demo.after}" alt="${escapeHtml(`${tool.heading} — ${tool.demo.afterLabel}`)}" width="1024" height="1024" fetchpriority="high" class="w-full rounded-lg" /><img src="${tool.demo.before}" alt="${escapeHtml(`${tool.heading} — ${tool.demo.beforeLabel}`)}" width="1024" height="1024" class="w-full rounded-lg" /><figcaption class="p-3 text-xs text-zinc-400">${escapeHtml(tool.demo.caption)}</figcaption></figure>`
        : `<figure class="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low p-2"><img src="/examples/sample1-photo.webp" alt="${escapeHtml(isSpanish ? 'Comparación de mejora de imagen' : 'Image quality enhancement before and after example')}" width="1200" height="800" fetchpriority="high" class="w-full rounded-lg" /><figcaption class="p-3 text-xs text-zinc-400">${escapeHtml(isSpanish ? 'Ejemplo ilustrativo; el resultado depende de tu imagen original.' : 'Illustrative example; the result depends on your original image.')}</figcaption></figure>`}
    </section>
    <section class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">${isSpanish ? 'Cuándo usar esta herramienta' : 'When to use this tool'}</h2><ul>${tool.useCases.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article><article class="bg-surface-low rounded-xl border border-outline-variant/20 p-6"><h2 class="text-2xl font-bold text-white">${isSpanish ? 'Cómo funciona' : 'How it works'}</h2><ol>${steps.map(step => `<li><strong>${escapeHtml(step.name)}</strong> — ${escapeHtml(step.text)}</li>`).join('')}</ol></article></section>
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
writeRoute('/dashboard', renderDashboard());
writeRoute('/store', renderStore());
if (profileHas('tools')) for (const tool of TOOL_LANDINGS) writeRoute(tool.path, renderToolLanding(tool));

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

console.log(`Pre-rendered ${ARTICLES.length} articles in 3 locales plus ${TOOL_LANDINGS.length} SEO tools, blog indexes and dashboard noindex.`);
