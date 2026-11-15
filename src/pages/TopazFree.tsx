import React, { useState } from 'react';
import { ArrowRight, Check, Copy, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { SITE_URL } from '../config/site';
import { TOPAZ_FREE, topazFreeMailto, topazFreeSchema, type TopazFreeLocale } from '../content/topazFree';

/**
 * The free-window pre-announcement, one component for both locales.
 *
 * There is no form here on purpose: the list is a mailbox. Everything the page promises is either a
 * page you can open today, or a notification the mailbox can deliver — the date and the size of the
 * window are stated as undecided because they are.
 */
export default function TopazFree({ locale }: { locale: TopazFreeLocale }) {
  const copy = locale === 'zh' ? TOPAZ_FREE.zh : TOPAZ_FREE.en;
  const [copied, setCopied] = useState(false);
  const path = locale === 'zh' ? TOPAZ_FREE.zhPath : TOPAZ_FREE.path;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(TOPAZ_FREE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return <>
    <SEO
      title={copy.title}
      description={copy.description}
      keywords={[...copy.keywords]}
      canonical={path}
      language={copy.language}
      image={TOPAZ_FREE.image}
      alternates={[
        { hrefLang: 'en', href: `${SITE_URL}${TOPAZ_FREE.path}` },
        { hrefLang: 'zh-CN', href: `${SITE_URL}${TOPAZ_FREE.zhPath}` },
        { hrefLang: 'x-default', href: `${SITE_URL}${TOPAZ_FREE.path}` },
      ]}
      structuredData={topazFreeSchema(locale, SITE_URL)}
    />
    <main lang={copy.language} className="pt-28 sm:pt-32 pb-20 px-5 max-w-[1100px] mx-auto w-full">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="breadcrumb">
        <Link to={locale === 'zh' ? '/zh' : '/'} className="hover:text-primary">DLSS5NVIDIA</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span>{copy.heading}</span>
      </nav>

      <header>
        <p className="text-primary font-label text-xs uppercase tracking-[0.2em]">{copy.eyebrow}</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-[1.08]">{copy.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">{copy.lead}</p>
      </header>

      <figure className="mt-8 rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-low">
        <img src={TOPAZ_FREE.image} alt={locale === 'zh' ? TOPAZ_FREE.imageAlt_cn : TOPAZ_FREE.imageAlt_en} width={1200} height={630} fetchpriority="high" className="w-full object-cover" />
        <figcaption className="px-5 py-3 text-xs text-zinc-400">{locale === 'zh' ? '七条功能线的状态板：图由本站绘制，没有第三方截图。' : 'Lane status board — drawn here; no third-party screenshot.'}</figcaption>
      </figure>

      <section className="mt-12" aria-labelledby="lanes-heading">
        <h2 id="lanes-heading" className="text-2xl font-bold text-white">{copy.statusLead}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{copy.statusNote}</p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOPAZ_FREE.lanes.map(lane => (
            <article key={lane.name_en} className={`rounded-xl border p-5 ${lane.status === 'live' ? 'border-emerald-500/30 bg-emerald-500/[0.06]' : 'border-amber-500/30 bg-amber-500/[0.06]'}`}>
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${lane.status === 'live' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {locale === 'zh' ? lane.name_cn : lane.name_en}
                <span className={`ml-auto text-[10px] uppercase tracking-widest ${lane.status === 'live' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {lane.status === 'live' ? (locale === 'zh' ? '已上线' : 'Live') : (locale === 'zh' ? '建设中' : 'Building')}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{locale === 'zh' ? lane.detail_cn : lane.detail_en}</p>
              <Link to={lane.href} className="mt-3 inline-flex items-center gap-1 text-sm text-primary">{locale === 'zh' ? '打开这一页' : 'Open the page'} <ArrowRight className="h-3.5 w-3.5" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 sm:p-8" aria-labelledby="offer-heading">
        <h2 id="offer-heading" className="text-2xl font-bold text-white">{copy.offerHeading}</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-200">
          {copy.offer.map(item => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
        </ul>
        <p className="mt-5 text-xs leading-relaxed text-zinc-400">{copy.offerNote}</p>
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-primary/40 bg-surface-low p-6 sm:p-8" id="join" aria-labelledby="join-heading">
        <h2 id="join-heading" className="text-2xl font-bold text-white">{copy.joinHeading}</h2>
        <ol className="mt-5 space-y-2 text-sm leading-relaxed text-zinc-300">
          {copy.joinSteps.map((step, index) => <li key={step} className="flex gap-3"><span className="text-primary font-semibold">{index + 1}.</span><span>{step}</span></li>)}
        </ol>
        <p className="mt-6 rounded-lg border border-outline-variant/30 bg-black/30 px-4 py-3 font-mono text-sm text-white break-all">{TOPAZ_FREE.email}</p>
        <p className="mt-2 text-xs text-zinc-400">{locale === 'zh' ? '主题：' : 'Subject: '}<span className="font-mono text-zinc-200">{copy.subject}</span></p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={topazFreeMailto(locale)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <Mail className="h-4 w-4" aria-hidden="true" />{copy.mailLabel}
          </a>
          <button type="button" onClick={copyAddress} className="inline-flex items-center gap-2 rounded-lg border border-primary/50 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/10">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? copy.copiedLabel : copy.copyLabel}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">{copy.mailNote}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{copy.legalNote}</p>
      </section>

      <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6">
          <h2 className="text-xl font-bold text-white">{copy.promiseHeading}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">{copy.promise.map(item => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-6">
          <h2 className="text-xl font-bold text-white">{locale === 'zh' ? '不承诺的部分' : 'What we do not promise'}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">{copy.notPromise.map(item => <li key={item}>{item}</li>)}</ul>
        </article>
      </section>

      <section className="mt-16" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold text-white">{copy.faqHeading}</h2>
        <div className="mt-5 grid gap-4">
          {TOPAZ_FREE.faqs[locale].map(([question, answer]) => (
            <article key={question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
              <h3 className="font-semibold text-white">{question}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-outline-variant/20 pt-8">
        <h2 className="text-xl font-bold text-white">{copy.relatedHeading}</h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {copy.related.map(item => <li key={item.path}><Link to={item.path} className="text-primary">{item.label} →</Link></li>)}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-zinc-500">{copy.trademarkNote}</p>
      </section>
    </main>
  </>;
}
