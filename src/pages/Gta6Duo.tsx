import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { GTA6_DUO, gta6DuoPath, gta6DuoSchema, type Gta6DuoLocale } from '../content/gta6Duo';

/**
 * The GTA VI duo-portrait page, one component for both locales.
 *
 * Every claim that the campaigns rest on is a fact about platforms and dates; the picture is not a
 * game feature and the page says so twice — in the header and again in the FAQ — because a page with
 * a character on it is exactly where a crawler or a reader would assume the opposite.
 */
export default function Gta6Duo({ locale }: { locale: Gta6DuoLocale }) {
  const copy = GTA6_DUO[locale];
  const zh = locale === 'zh';
  return <>
    <SEO
      title={copy.title}
      description={copy.description}
      keywords={[...copy.keywords]}
      canonical={gta6DuoPath(locale)}
      language={copy.language}
      image={GTA6_DUO.image}
      alternates={[
        { hrefLang: 'en', href: `${SITE_URL}${GTA6_DUO.path}` },
        { hrefLang: 'zh-CN', href: `${SITE_URL}${GTA6_DUO.zhPath}` },
        { hrefLang: 'x-default', href: `${SITE_URL}${GTA6_DUO.path}` },
      ]}
      structuredData={gta6DuoSchema(locale, SITE_URL)}
    />
    <main lang={copy.language} className="pt-28 sm:pt-32 pb-20 px-5 max-w-[1100px] mx-auto w-full">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="breadcrumb">
        <Link to={zh ? '/zh' : '/'} className="hover:text-primary">DLSS5NVIDIA</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>{copy.heading}</span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-primary font-label text-xs uppercase tracking-[0.2em]">{copy.eyebrow}</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-[1.08]">{copy.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">{copy.lead}</p>
        <p className="mt-4 text-xs leading-relaxed text-zinc-400">{copy.trademarkNote}</p>
      </header>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to={`/dashboard?tool=together&sample=together`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-black hover:bg-white">
          {copy.sampleRun}<ArrowRight size={16} aria-hidden="true" />
        </Link>
        <span className="text-xs text-zinc-500">{copy.ctaNote}</span>
      </div>

      <figure className="mt-10 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-low">
        <img src={GTA6_DUO.image} alt={zh ? GTA6_DUO.imageAlt_cn : GTA6_DUO.imageAlt_en} width={1024} height={1024} fetchpriority="high" className="w-full object-cover" />
        <figcaption className="px-5 py-3 text-xs text-zinc-400">{zh ? GTA6_DUO.imageCaption_cn : GTA6_DUO.imageCaption_en}</figcaption>
      </figure>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-bold text-white">{copy.statusHeading}</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
          {copy.status.map(item => <li key={item} className="flex gap-3"><Check size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">{copy.stepsHeading}</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {copy.steps.map((step, index) => <article key={step.name} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
            <p className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{step.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.text}</p>
          </article>)}
        </div>
      </section>

      <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6">
          <h2 className="text-xl font-bold text-white">{copy.checksHeading}</h2>
          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
            {copy.checks.map(item => <li key={item}>{item}</li>)}
          </ol>
        </article>
        <article className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-6">
          <h2 className="text-xl font-bold text-white">{copy.limitsHeading}</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
            {copy.limits.map(item => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>

      <section className="mt-14 rounded-xl border border-primary/25 bg-primary/[0.05] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white">{copy.fanHeading}</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">
          {copy.fan.map(item => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="mt-14 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">{copy.sampleHeading}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">{copy.sampleLead}</p>
        <p className="mt-6">
          <Link to="/dashboard?tool=together" className="inline-block rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white">{copy.cta} →</Link>
        </p>
        <p className="mt-3 text-xs text-zinc-500">{copy.ctaNote}</p>
      </section>

      <section className="mt-16" id="faq">
        <h2 className="text-2xl font-bold text-white">{copy.faqHeading}</h2>
        <div className="mt-5 grid gap-4">
          {GTA6_DUO.faqs[locale].map(([question, answer]) => <article key={question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
            <h3 className="font-semibold text-white">{question}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{answer}</p>
          </article>)}
        </div>
      </section>

      <section className="mt-16 border-t border-outline-variant/20 pt-8">
        <h2 className="text-xl font-bold text-white">{copy.relatedHeading}</h2>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {copy.related.map(item => <Link key={item.path} to={item.path} className="text-primary hover:underline">{item.label} →</Link>)}
        </p>
        <p className="mt-6 text-xs leading-relaxed text-zinc-500">{copy.trademarkNote}</p>
      </section>
    </main>
  </>;
}
