import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { ARTICLES } from '../content/articles/types';

export default function Blog() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [activeLang, setActiveLang] = useState<'en' | 'cn'>(i18n.language.startsWith('zh') ? 'cn' : 'en');

  // Blog index page
  if (!slug) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-white mb-4">DLSS 5 Blog</h1>
          <p className="text-zinc-400">
            In-depth articles about DLSS 5 technology, comparisons, and AI image upscaling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map(article => (
            <Link
              key={article.slug}
              to={`/blog/${article.slug}`}
              className="bg-surface-low rounded-xl border border-outline-variant/20 p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-label uppercase ${
                  article.priority === 'P0' ? 'bg-nvidia-green/20 text-nvidia-green' : 'bg-surface-high text-zinc-400'
                }`}>
                  {article.priority}
                </span>
                <span className="text-xs text-zinc-500">{article.readTime}</span>
              </div>
              <h2 className="text-xl font-headline font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {activeLang === 'cn' ? article.title_cn : article.title_en}
              </h2>
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-surface-high rounded text-zinc-400">
                    {tag}
                  </span>
                ))}
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
