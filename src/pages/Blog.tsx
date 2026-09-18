import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { ARTICLES } from '../content/articles/types';
import SEO from '../components/SEO';

const ARTICLE_COVERS: Record<string, { src: string; alt: string }> = {
  'what-is-dlss-5-neural-rendering-guide': { src: '/examples/sample1.jpg', alt: 'Neural rendering concept in a kitchen scene' },
  'dlss5-vs-dlss4-vs-fsr4-comparison-2026': { src: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/news/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res/dlss-4-5-dynamic-multi-frame-gen-6x-2nd-gen-transformer-super-res-ogimage.jpg', alt: 'NVIDIA DLSS 4.5 neural rendering' },
  'crimson-desert-pc-optimization-dlss-fsr-guide-2026': { src: '/examples/sample2.jpg', alt: 'Game scene optimization guide' },
  'best-ai-image-upscaler-2026-comparison': { src: '/examples/sample1-photo.webp', alt: 'AI image enhancement comparison' },
  'dlss5-artistic-vision-debate-honest-assessment': { src: 'https://www.nvidia.com/content/dam/en-zz/nvidiaweb/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/nvidia-dlss-5-breakthrough-in-visual-fidelity-for-games-ogimage.jpg', alt: 'DLSS 5 visual fidelity and artistic direction' },
  'dlss-5-online-image-upscaler-guide': { src: '/examples/sample2.jpg', alt: 'Online AI image upscaling workflow' },
  'dlss-5-gpt-6-astra-ai-rendering-workflow-2026': { src: '/examples/sample1-photo.webp', alt: 'AI reasoning and neural rendering workflow' },
  'dlss-5-latest-news-september-2026': { src: 'https://www.nvidia.com/content/dam/en-zz/nvidiaweb/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/nvidia-dlss-5-breakthrough-in-visual-fidelity-for-games-ogimage.jpg', alt: 'Latest DLSS 5 neural rendering briefing' },
};

export default function Blog() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [activeLang, setActiveLang] = useState<'en' | 'cn'>(i18n.language.startsWith('zh') ? 'cn' : 'en');

  // Blog index page
  if (!slug) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
        <SEO
          title="DLSS 5 Blog — Neural Rendering News, GPT-6 Workflows & AI Upscaling"
          description="Source-led DLSS 5 and DLSS 4.5 news, neural rendering explainers, GPT-6 Astra workflow guides, RTX comparisons and practical AI image enhancement research."
          keywords={['dlss 5 latest news', 'dlss 5 gpt-6', 'gpt-6 astra image workflow', 'dlss 4.5 transformer', '3d-guided neural rendering', 'ai image upscaling guide']}
          canonical="/blog"
        />
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-white mb-4">DLSS 5 Blog</h1>
          <p className="text-zinc-400">
            {activeLang === 'cn' ? '一手资料驱动的 DLSS 5 新闻、神经渲染解析、GPT-6 工作流和实用 AI 图像研究。' : 'Source-led DLSS 5 news, neural rendering explainers, GPT-6 workflows, and practical AI image research.'}
          </p>
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
    mainEntityOfPage: `https://www.dlss5nvidia.com/blog/${article.slug}`,
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
        canonical={`/blog/${slug}`}
        type="article"
        structuredData={structuredData}
      />
      {/* Language Toggle */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/blog"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setActiveLang('en')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeLang === 'en'
                ? 'bg-primary text-black font-bold'
                : 'bg-surface-low text-zinc-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setActiveLang('cn')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeLang === 'cn'
                ? 'bg-primary text-black font-bold'
                : 'bg-surface-low text-zinc-400 hover:text-white'
            }`}
          >
            中文
          </button>
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
          <figcaption className="absolute bottom-4 left-5 right-5 text-xs text-zinc-200/80">{activeLang === 'cn' ? '技术简报 · 来源驱动内容' : 'Technical briefing · source-led coverage'}</figcaption>
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
          {renderContent(content)}
        </div>

        {article.sources?.length ? <aside className="mt-10 rounded-xl border border-outline-variant/20 bg-surface-low p-5">
          <h2 className="text-sm font-label uppercase tracking-widest text-primary mb-3">{activeLang === 'cn' ? '资料与来源' : 'Sources and methodology'}</h2>
          <p className="text-sm text-zinc-400 mb-3">{activeLang === 'cn' ? '本文优先使用官方一手资料；厂商声明与独立测试不会混写。' : 'Primary sources are listed first; vendor claims are kept separate from independent testing.'}</p>
          <ul className="space-y-2 text-sm">
            {article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-zinc-300 underline decoration-primary/60 underline-offset-2 hover:text-primary">{source.label}</a></li>)}
          </ul>
        </aside> : null}

        {/* CTA */}
        <div className="mt-12 p-6 bg-surface-low rounded-xl border border-outline-variant/20 text-center">
          <p className="text-zinc-300 mb-4">
            {activeLang === 'cn'
              ? '准备好体验 AI 图像增强了？无需 GPU，无需安装。'
              : 'Ready to experience AI image enhancement? No GPU required, no installation needed.'}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-container transition-colors"
          >
            {activeLang === 'cn' ? '立即试用免费工具' : 'Try Free Tool Now'}
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-outline-variant/20 text-center text-zinc-500 text-sm">
          <p>
            {activeLang === 'cn'
              ? '本文为独立创作，不隶属于或受 NVIDIA Corporation 支持或认可。'
              : 'This article is independently produced and is not affiliated with or endorsed by NVIDIA Corporation.'}
          </p>
        </footer>
      </article>
    </main>
  );
}
