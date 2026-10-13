import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { expansionPage, type ExpansionKind, type ExpansionLocale } from '../content/seoExpansion';

type Props = { kind: ExpansionKind; locale?: ExpansionLocale };

export default function SeoExpansion({ kind, locale = 'en' }: Props) {
  const page = expansionPage(kind, locale);
  const isZh = locale === 'zh';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://www.dlss5nvidia.com${page.path}#webpage`,
        url: `https://www.dlss5nvidia.com${page.path}`,
        name: page.heading,
        description: page.description,
        inLanguage: isZh ? 'zh-CN' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://www.dlss5nvidia.com${page.path}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DLSS5NVIDIA', item: 'https://www.dlss5nvidia.com/' },
          { '@type': 'ListItem', position: 2, name: page.heading, item: `https://www.dlss5nvidia.com${page.path}` },
        ],
      },
      {
        '@type': 'Article',
        '@id': `https://www.dlss5nvidia.com${page.path}#article`,
        headline: page.heading,
        description: page.description,
        dateModified: '2026-10-11',
        inLanguage: isZh ? 'zh-CN' : 'en-US',
        mainEntityOfPage: `https://www.dlss5nvidia.com${page.path}`,
        author: { '@type': 'Organization', name: 'DLSS5NVIDIA' },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://www.dlss5nvidia.com${page.path}#faq`,
        mainEntity: page.faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      ...(page.itemList ? [{
        '@type': 'ItemList',
        '@id': `https://www.dlss5nvidia.com${page.path}#itemlist`,
        itemListElement: page.itemList.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, url: item.url })),
      }] : []),
    ],
  };

  return (
    <main className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto">
      <SEO
        title={page.title}
        description={page.description}
        keywords={[...page.keywords]}
        canonical={page.path}
        language={isZh ? 'zh-CN' : 'en-US'}
        structuredData={schema}
      />
      <nav className="mb-8 text-sm text-zinc-500">
        <Link to={isZh ? '/zh/blog' : '/blog'} className="hover:text-primary">{isZh ? '博客' : 'DLSS5NVIDIA'}</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>{page.heading}</span>
      </nav>
      <header className="max-w-4xl">
        <p className="text-primary uppercase tracking-[0.2em] text-xs font-label">{isZh ? '来源驱动的独立指南' : 'Source-led independent guide'}</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mt-4">{page.heading}</h1>
        <p className="text-lg leading-relaxed text-zinc-300 mt-5">{page.lead}</p>
        <p className="text-sm leading-relaxed text-zinc-400 mt-4">{page.description}</p>
      </header>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4" aria-label={isZh ? '关键事实' : 'Key facts'}>
        {page.facts.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
            <h2 className="text-sm font-semibold text-primary">{label}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{value}</p>
          </article>
        ))}
      </section>

      {page.sections?.map((section, index) => (
        <section key={section.heading} className="mt-12 max-w-4xl" aria-labelledby={`section-${page.kind}-${index}`}>
          <h2 id={`section-${page.kind}-${index}`} className="text-2xl font-headline font-bold text-white">{section.heading}</h2>
          <p className="mt-4 text-zinc-300 leading-relaxed">{section.body}</p>
        </section>
      ))}

      {page.table && (
        <section className="mt-12" aria-labelledby="comparison-table-heading">
          <h2 id="comparison-table-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '对照表' : 'At-a-glance comparison'}</h2>
          <div className="overflow-x-auto rounded-xl border border-outline-variant/20 mt-5">
            <table className="w-full min-w-[720px] text-left">
              <thead><tr className="bg-surface-high">{page.table.headers.map(header => <th key={header} className="p-4 text-primary">{header}</th>)}</tr></thead>
              <tbody>{page.table.rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="border-t border-outline-variant/10">{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cell} scope="row" className="p-4 text-white font-semibold">{cell}</th> : <td key={cell} className="p-4 text-zinc-300">{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6 sm:p-8" aria-labelledby="try-heading">
        <h2 id="try-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '把阅读变成一次可复核的体验' : 'Turn the guide into a reviewable test'}</h2>
        <p className="mt-3 text-zinc-300 leading-relaxed">{isZh ? '先看缓存示例，再决定是否上传自己的图片；官方技术结论与本站独立转换结果始终分开标注。' : 'Inspect a cached example before uploading your own image; official technology claims and this site’s independent conversion results stay clearly separated.'}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {page.links.map(link => link.href.startsWith('http') ? <a key={link.href} href={link.href} className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-200 hover:border-primary hover:text-primary">{link.label} →</a> : <Link key={link.href} to={link.href} className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-200 hover:border-primary hover:text-primary">{link.label} →</Link>)}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="sources-heading">
        <h2 id="sources-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '来源与边界' : 'Sources and boundaries'}</h2>
        <ul className="mt-4 space-y-3">{page.sourceLinks.map(link => <li key={link.href}><a className="text-primary hover:underline" href={link.href} rel="noreferrer">{link.label} ↗</a></li>)}</ul>
        <p className="mt-5 text-xs text-zinc-500">{isZh ? '本文为独立资料整理，不代表 NVIDIA 官方页面或合作关系。' : 'This is an independent reference. It is not an NVIDIA official page or partnership.'}</p>
      </section>

      <section className="mt-12" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-headline font-bold text-white">{isZh ? '常见问题' : 'Frequently asked questions'}</h2>
        <div className="mt-5 grid gap-4">{page.faq.map(([question, answer]) => <details key={question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><summary className="cursor-pointer text-white font-semibold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-300">{answer}</p></details>)}</div>
      </section>
    </main>
  );
}
