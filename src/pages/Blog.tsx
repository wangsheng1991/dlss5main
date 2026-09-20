import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { ARTICLES } from '../content/articles/types';
import SEO from '../components/SEO';

const ARTICLE_COVERS: Record<string, { src: string; ogSrc?: string; alt: string }> = {
  'seedance-2-5-video-super-resolution-cost-guide-2026': { src: '/blog/seedance25-video-superres.png', alt: 'Low-resolution AI video passing through a neural super-resolution pipeline into a crisp 4K frame' },
  'what-is-dlss-5-neural-rendering-guide': { src: '/blog/dlss5-neural-rendering.webp', ogSrc: '/blog/dlss5-neural-rendering.png', alt: 'DLSS 5 neural rendering transforming a wireframe city into a cinematic scene' },
  'dlss5-vs-dlss4-vs-fsr4-comparison-2026': { src: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res-ogimage.jpg', alt: 'NVIDIA DLSS 4.5 neural rendering' },
  'crimson-desert-pc-optimization-dlss-fsr-guide-2026': { src: '/examples/sample2.jpg', alt: 'Game scene optimization guide' },
  'best-ai-image-upscaler-2026-comparison': { src: '/examples/sample1-photo.webp', alt: 'AI image enhancement comparison' },
  'dlss5-artistic-vision-debate-honest-assessment': { src: '/blog/dlss5-neural-rendering.webp', ogSrc: '/blog/dlss5-neural-rendering.png', alt: 'DLSS 5 visual fidelity and artistic direction' },
  'dlss-5-online-image-upscaler-guide': { src: '/examples/sample2.jpg', alt: 'Online AI image upscaling workflow' },
  'dlss-5-gpt-6-astra-ai-rendering-workflow-2026': { src: '/blog/gpt6-dlss5-workflow.webp', ogSrc: '/blog/gpt6-dlss5-workflow.png', alt: 'GPT-6 reasoning workflow connected to a DLSS 5 neural rendering scene' },
  'dlss-5-latest-news-september-2026': { src: '/blog/dlss5-neural-rendering.webp', ogSrc: '/blog/dlss5-neural-rendering.png', alt: 'Latest DLSS 5 neural rendering briefing' },
};

type BlogLocale = 'en-US' | 'zh-CN' | 'ja' | 'ko' | 'ru' | 'uk' | 'id' | 'et';

const BLOG_COPY: Record<BlogLocale, {
  pageTitle: string;
  tagline: string;
  translationNotice: string;
  back: string;
  sources: string;
  methodology: string;
  figureCaption: string;
  cta: string;
  ctaButton: string;
  disclaimer: string;
}> = {
  'en-US': {
    pageTitle: 'DLSS 5 Blog',
    tagline: 'Source-led DLSS 5 news, neural rendering explainers, GPT-6 workflows, and practical AI image research.',
    translationNotice: 'This article is currently available in English and Chinese. Other interface languages use the English source edition.',
    back: 'Back to Blog',
    sources: 'Sources and methodology',
    methodology: 'Primary sources are listed first; vendor claims are kept separate from independent testing.',
    figureCaption: 'Technical briefing · source-led coverage',
    cta: 'Ready to experience AI image enhancement? No GPU required, no installation needed.',
    ctaButton: 'Try Free Tool Now',
    disclaimer: 'This article is independently produced and is not affiliated with or endorsed by NVIDIA Corporation.',
  },
  'zh-CN': {
    pageTitle: 'DLSS 5 博客',
    tagline: '一手资料驱动的 DLSS 5 新闻、神经渲染解析、GPT-6 工作流和实用 AI 图像研究。',
    translationNotice: '本文目前提供中文和英文版本；其他界面语言暂使用英文原文。',
    back: '返回博客',
    sources: '资料与来源',
    methodology: '优先列出官方一手资料；厂商声明与独立测试会分开说明。',
    figureCaption: '技术简报 · 来源驱动内容',
    cta: '准备好体验 AI 图像增强了？无需 GPU，无需安装。',
    ctaButton: '立即试用免费工具',
    disclaimer: '本文为独立创作，不隶属于或受 NVIDIA Corporation 支持或认可。',
  },
  ja: {
    pageTitle: 'DLSS 5 ブログ',
    tagline: '一次資料に基づく DLSS 5 ニュース、ニューラルレンダリング解説、GPT-6 ワークフロー、実用的な AI 画像研究。',
    translationNotice: 'この記事は現在、英語と中国語で提供しています。その他の言語では英語版を表示します。',
    back: 'ブログに戻る',
    sources: '出典と方法',
    methodology: '公式一次資料を優先し、メーカーの主張と独立検証を分けて掲載しています。',
    figureCaption: 'テクニカルブリーフィング · 出典ベース',
    cta: 'AI 画像補正を試してみませんか？GPU もインストールも不要です。',
    ctaButton: '無料ツールを試す',
    disclaimer: 'この記事は独立した制作物であり、NVIDIA Corporation との提携や承認を示すものではありません。',
  },
  ko: {
    pageTitle: 'DLSS 5 블로그',
    tagline: '1차 자료 기반 DLSS 5 뉴스, 신경 렌더링 해설, GPT-6 워크플로와 실용적인 AI 이미지 연구.',
    translationNotice: '이 글은 현재 영어와 중국어로 제공됩니다. 다른 인터페이스 언어에서는 영어 원문을 표시합니다.',
    back: '블로그로 돌아가기',
    sources: '출처 및 방법론',
    methodology: '공식 1차 자료를 우선하며, 제조사 주장과 독립 테스트를 구분합니다.',
    figureCaption: '기술 브리핑 · 출처 기반 콘텐츠',
    cta: 'AI 이미지 향상을 경험해 보세요. GPU와 설치가 필요하지 않습니다.',
    ctaButton: '무료 도구 사용하기',
    disclaimer: '이 글은 독립적으로 제작되었으며 NVIDIA Corporation의 제휴 또는 보증을 받지 않습니다.',
  },
  ru: {
    pageTitle: 'Блог DLSS 5',
    tagline: 'Новости DLSS 5 по первичным источникам, разбор нейрорендеринга, рабочие процессы GPT-6 и практические исследования AI-изображений.',
    translationNotice: 'Эта статья доступна на английском и китайском языках. Для других языков интерфейса используется английская версия.',
    back: 'Назад в блог',
    sources: 'Источники и методика',
    methodology: 'Сначала указаны первичные источники; заявления производителей отделены от независимых тестов.',
    figureCaption: 'Технический обзор · материалы по источникам',
    cta: 'Готовы попробовать улучшение изображений с AI? GPU и установка не нужны.',
    ctaButton: 'Попробовать бесплатно',
    disclaimer: 'Статья подготовлена независимо и не связана с NVIDIA Corporation и не одобрена ею.',
  },
  uk: {
    pageTitle: 'Блог DLSS 5',
    tagline: 'Новини DLSS 5 на основі першоджерел, пояснення нейронного рендерингу, робочі процеси GPT-6 і практичні дослідження AI-зображень.',
    translationNotice: 'Ця стаття доступна англійською та китайською. Для інших мов інтерфейсу використовується англійська версія.',
    back: 'Повернутися до блогу',
    sources: 'Джерела та методика',
    methodology: 'Спочатку наведено першоджерела; заяви виробників відокремлено від незалежних тестів.',
    figureCaption: 'Технічний огляд · матеріали на основі джерел',
    cta: 'Готові спробувати покращення зображень за допомогою AI? GPU та встановлення не потрібні.',
    ctaButton: 'Спробувати безкоштовно',
    disclaimer: 'Статтю підготовлено незалежно; вона не пов’язана з NVIDIA Corporation і не схвалена нею.',
  },
  id: {
    pageTitle: 'Blog DLSS 5',
    tagline: 'Berita DLSS 5 berbasis sumber utama, penjelasan neural rendering, alur kerja GPT-6, dan riset gambar AI praktis.',
    translationNotice: 'Artikel ini saat ini tersedia dalam bahasa Inggris dan Mandarin. Bahasa antarmuka lain menggunakan edisi sumber berbahasa Inggris.',
    back: 'Kembali ke Blog',
    sources: 'Sumber dan metodologi',
    methodology: 'Sumber utama dicantumkan lebih dahulu; klaim vendor dipisahkan dari pengujian independen.',
    figureCaption: 'Ringkasan teknis · liputan berbasis sumber',
    cta: 'Siap mencoba peningkatan gambar AI? Tidak perlu GPU atau instalasi.',
    ctaButton: 'Coba Alat Gratis',
    disclaimer: 'Artikel ini dibuat secara independen dan tidak berafiliasi atau didukung oleh NVIDIA Corporation.',
  },
  et: {
    pageTitle: 'DLSS 5 ajaveeb',
    tagline: 'Esmastel allikatel põhinevad DLSS 5 uudised, närvirenderduse selgitused, GPT-6 töövood ja praktilised AI-pildi uuringud.',
    translationNotice: 'See artikkel on praegu saadaval inglise ja hiina keeles. Teiste liidese keelte puhul kuvatakse ingliskeelne algversioon.',
    back: 'Tagasi ajaveebi',
    sources: 'Allikad ja metoodika',
    methodology: 'Esmased allikad on loetletud esimesena; tootjate väited on sõltumatutest testidest eraldatud.',
    figureCaption: 'Tehniline ülevaade · allikapõhine sisu',
    cta: 'Kas oled valmis AI-pildi täiustamist proovima? GPU-d ega paigaldust pole vaja.',
    ctaButton: 'Proovi tasuta tööriista',
    disclaimer: 'See artikkel on sõltumatult koostatud ega ole NVIDIA Corporationiga seotud ega selle heaks kiidetud.',
  },
};

export default function Blog() {
  const { i18n } = useTranslation();
  const { slug, locale: routeLocale } = useParams<{ slug?: string; locale?: 'en' | 'zh' }>();
  const routeLanguage = routeLocale === 'zh' ? 'zh-CN' : routeLocale === 'en' ? 'en-US' : undefined;
  const locale = (routeLanguage || i18n.resolvedLanguage || i18n.language || 'en-US') as BlogLocale;
  const copy = BLOG_COPY[locale] || BLOG_COPY['en-US'];
  const isArticleLocaleSupported = locale === 'en-US' || locale === 'zh-CN';
  const [activeLang, setActiveLang] = useState<'en' | 'cn'>(locale.startsWith('zh') ? 'cn' : 'en');

  useEffect(() => {
    if (routeLanguage && i18n.language !== routeLanguage) {
      void i18n.changeLanguage(routeLanguage);
    }
    setActiveLang((routeLanguage || i18n.resolvedLanguage || i18n.language || '').startsWith('zh') ? 'cn' : 'en');
  }, [i18n, i18n.language, i18n.resolvedLanguage, routeLanguage]);

  const localizedBlogPath = (language: 'en' | 'zh') => `/${language}/blog${slug ? `/${slug}` : ''}`;
  const canonicalPath = routeLocale ? localizedBlogPath(routeLocale) : `/blog${slug ? `/${slug}` : ''}`;
  const alternateLinks = [
    { hrefLang: 'en', href: `https://www.dlss5nvidia.com${localizedBlogPath('en')}` },
    { hrefLang: 'zh-CN', href: `https://www.dlss5nvidia.com${localizedBlogPath('zh')}` },
    { hrefLang: 'x-default', href: `https://www.dlss5nvidia.com${slug ? `/blog/${slug}` : '/blog'}` },
  ];

  // Blog index page
  if (!slug) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
        <SEO
          title={`${copy.pageTitle} — Neural Rendering News, GPT-6 Workflows & AI Upscaling`}
          description={copy.tagline}
          keywords={['dlss 5 latest news', 'dlss 5 image converter', 'dlss 5 visual enhancer', 'dlss 5 upscaling', 'dlss 5 online', 'dlss 5 gpt-6', 'gpt-6 astra image workflow', 'dlss 4.5 transformer', '3d-guided neural rendering', 'ai image upscaling guide']}
          canonical={canonicalPath}
          image="/blog/dlss5-neural-rendering.png"
          language={locale}
          alternates={alternateLinks}
        />
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-white mb-4">{copy.pageTitle}</h1>
          <p className="text-zinc-400">
            {copy.tagline}
          </p>
          {!isArticleLocaleSupported && <p className="mt-3 text-xs text-zinc-500" role="status">{copy.translationNotice}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...ARTICLES].sort((a, b) => Number(!!b.datePublished) - Number(!!a.datePublished)).map(article => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="bg-surface-low rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-surface-high">
                <img src={ARTICLE_COVERS[article.slug]?.src || '/examples/sample1.jpg'} alt={ARTICLE_COVERS[article.slug]?.alt || article.title_en} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className={`absolute left-4 bottom-4 px-2 py-0.5 rounded text-xs font-label uppercase ${
                  article.priority === 'P0' ? 'bg-nvidia-green/90 text-black' : 'bg-black/60 text-zinc-200'
                }`}>
                  {article.priority} · {article.readTime}
                </span>
              </div>
              <div className="p-6">
              <h2 className="text-xl font-headline font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {activeLang === 'cn' ? article.title_cn : article.title_en}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                {activeLang === 'cn' ? article.description_cn || article.type : article.description_en || article.type}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-surface-high rounded text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  // Article detail page
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const content = activeLang === 'cn' ? article.content_cn : article.content_en;
  const title = activeLang === 'cn' ? article.title_cn : article.title_en;
  const description = activeLang === 'cn' ? article.description_cn || article.title_cn : article.description_en || article.title_en;
  const cover = ARTICLE_COVERS[article.slug] || { src: '/examples/sample1.jpg', alt: article.title_en };
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    inLanguage: activeLang === 'cn' ? 'zh-CN' : 'en-US',
    dateModified: article.datePublished || undefined,
    datePublished: article.datePublished || undefined,
    author: { '@type': 'Organization', name: 'DLSS5 Independent Research Desk' },
    publisher: { '@type': 'Organization', name: 'DLSS5 Independent Research Desk', url: 'https://www.dlss5nvidia.com' },
    mainEntityOfPage: `https://www.dlss5nvidia.com${canonicalPath}`,
    citation: article.sources?.map(source => source.url),
  };

  // Parse markdown-like content to JSX
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside space-y-2 text-zinc-300 my-4">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={elements.length} className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-high border-b border-outline-variant/20">
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="px-4 py-3 text-xs font-label uppercase tracking-widest text-primary">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {tableRows.slice(2).map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-sm text-zinc-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();

      // Table row (contains |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cells = trimmed.split('|').filter((_, i, arr) => i > 0 && i < arr.length);
        tableRows.push(cells.map(c => c.trim()));
        return;
      }

      // Flush table if we hit a non-table line
      if (inTable && !trimmed.startsWith('|')) {
        flushTable();
      }

      // Skip separator lines
      if (trimmed.startsWith('---') || trimmed.startsWith('***')) {
        return;
      }

      // H2
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={i} className="text-2xl font-headline font-bold text-white mt-8 mb-4">
            {trimmed.slice(3)}
          </h2>
        );
        return;
      }

      // H3
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={i} className="text-xl font-headline font-semibold text-white mt-6 mb-3">
            {trimmed.slice(4)}
          </h3>
        );
        return;
      }

      // Bold
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        elements.push(
          <p key={i} className="text-white font-semibold my-4">
            {trimmed.slice(2, -2)}
          </p>
        );
        return;
      }

      // Italic (standalone line)
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        elements.push(
          <p key={i} className="text-zinc-400 italic my-4">
            {trimmed.slice(1, -1)}
          </p>
        );
        return;
      }

      // List item
      if (trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
        currentList.push(trimmed.slice(2));
        return;
      }

      // Regular paragraph
      if (trimmed.length > 0) {
        flushList();
        // Handle **bold** within text
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={i} className="text-zinc-300 leading-relaxed my-4">
            {parts.map((part, pi) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={pi} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });

    flushList();
    flushTable();

    return elements;
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[900px] mx-auto">
      <SEO
        title={`${title} — DLSS 5 Blog`}
        description={description}
        keywords={activeLang === 'cn' ? article.target_keywords_cn : article.target_keywords_en}
        canonical={canonicalPath}
        type="article"
        image={cover.ogSrc || cover.src}
        language={activeLang === 'cn' ? 'zh-CN' : 'en-US'}
        alternates={alternateLinks}
        structuredData={structuredData}
      />
      {/* Language Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/blog"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {copy.back}
        </Link>
        <div className="ml-auto flex gap-2">
          <Link
            to={localizedBlogPath('en')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeLang === 'en'
                ? 'bg-primary text-black font-bold'
                : 'bg-surface-low text-zinc-400 hover:text-white'
            }`}
          >
            EN
          </Link>
          <Link
            to={localizedBlogPath('zh')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeLang === 'cn'
                ? 'bg-primary text-black font-bold'
                : 'bg-surface-low text-zinc-400 hover:text-white'
            }`}
          >
            中文
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-2 py-0.5 rounded text-xs font-label uppercase ${
              article.priority === 'P0' ? 'bg-nvidia-green/20 text-nvidia-green' : 'bg-surface-high text-zinc-400'
            }`}>
              {article.priority}
            </span>
            <div className="flex items-center gap-1 text-zinc-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{article.lastUpdated}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-surface-low rounded text-zinc-400">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <figure className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-low mb-10">
          <img src={cover.src} alt={cover.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <figcaption className="absolute bottom-4 left-5 right-5 text-xs text-zinc-200/80">{copy.figureCaption}</figcaption>
        </figure>

        {/* SEO Keywords for crawlers */}
        <div className="sr-only">
          {article.target_keywords_en.map(kw => (
            <span key={kw}>{kw}, </span>
          ))}
          {article.target_keywords_cn.map(kw => (
            <span key={kw}>{kw}, </span>
          ))}
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          {!isArticleLocaleSupported && <p className="not-prose rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-zinc-300" role="status">{copy.translationNotice}</p>}
          {renderContent(content)}
        </div>

        {article.sources?.length ? <aside className="mt-10 rounded-xl border border-outline-variant/20 bg-surface-low p-5">
          <h2 className="text-sm font-label uppercase tracking-widest text-primary mb-3">{copy.sources}</h2>
          <p className="text-sm text-zinc-400 mb-3">{copy.methodology}</p>
          <ul className="space-y-2 text-sm">
            {article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-zinc-300 underline decoration-primary/60 underline-offset-2 hover:text-primary">{source.label}</a></li>)}
          </ul>
        </aside> : null}

        {/* CTA */}
        <div className="mt-12 p-6 bg-surface-low rounded-xl border border-outline-variant/20 text-center">
          <p className="text-zinc-300 mb-4">{copy.cta}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-container transition-colors"
          >
            {copy.ctaButton}
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-outline-variant/20 text-center text-zinc-500 text-sm">
          <p>
            {copy.disclaimer}
          </p>
        </footer>
      </article>
    </main>
  );
}
