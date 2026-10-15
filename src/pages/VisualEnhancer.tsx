import React from 'react';
import { ArrowRight, Download, Loader2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSampleRun } from '../features/generation/useSampleRun';
import ImageSlider from '../components/ImageSlider';
import SEO from '../components/SEO';
import { SAMPLES } from '../config/samples';
import { visualEnhancerSchema, VISUAL_ENHANCER_COPY, type VisualEnhancerLocale } from '../content/visualEnhancer';
import { SITE_URL } from '../config/site';

export default function VisualEnhancer({ locale = 'en' }: { locale?: VisualEnhancerLocale }) {
  const copy = VISUAL_ENHANCER_COPY[locale];
  const isZh = locale === 'zh';
  const sample = useSampleRun();
  const state = sample.state;
  return <>
    <SEO title={copy.title} description={copy.description} keywords={isZh ? ['dlss 5 视觉增强器', 'dlss 5 图像增强', '图片质量增强', '免费视觉增强器'] : ['dlss 5 visual enhancer', 'dlss 5 visual enhancer online', 'free dlss 5 visual enhancer', 'visual enhancer online', 'image quality enhancer']} canonical={copy.path} language={isZh ? 'zh-CN' : 'en-US'} alternates={[{ hrefLang: 'en', href: `${SITE_URL}/visual-enhancer` }, { hrefLang: 'zh-CN', href: `${SITE_URL}/zh/visual-enhancer` }, { hrefLang: 'x-default', href: `${SITE_URL}/visual-enhancer` }]} structuredData={visualEnhancerSchema(locale)} />
    <main className="pt-32 pb-24 px-6 max-w-[1100px] mx-auto">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb"><Link to={isZh ? '/zh' : '/'} className="hover:text-primary">DLSS5NVIDIA</Link><span aria-hidden="true" className="mx-2">/</span><span>{copy.heading}</span></nav>
      <header className="max-w-4xl"><p className="text-primary uppercase tracking-[0.2em] text-xs font-label">{copy.eyebrow}</p><h1 className="text-4xl md:text-6xl font-headline font-bold text-white mt-4">{copy.heading}</h1><p className="text-lg leading-relaxed text-zinc-300 mt-6">{copy.lead}</p></header>
      <section className="mt-10 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 sm:p-8" aria-labelledby="visual-enhancer-sample-heading">
        <h2 id="visual-enhancer-sample-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.sampleHeading}</h2><p className="mt-3 max-w-3xl text-zinc-300 leading-relaxed">{copy.sampleIntro}</p>
        {state.status === 'error' && <p role="alert" className="mt-4 text-sm text-red-300">{state.message}</p>}
        {state.status !== 'ready' && <button type="button" disabled={state.status === 'running'} onClick={() => void sample.run('sample1')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60">{state.status === 'running' ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Play aria-hidden="true" className="h-4 w-4" />}{state.status === 'running' ? copy.running : copy.run}</button>}
        {state.status === 'ready' && <div className="mt-6 grid gap-5"><ImageSlider highRes={state.run.result} lowRes={state.run.input} alt={isZh ? '图片视觉增强前后对比' : 'Visual enhancement before and after'} inputLabel={copy.baseLabel} outputLabel={copy.resultLabel} compareLabel={copy.compareLabel} initialAspectRatio={1.5} /><div className="flex flex-wrap items-center gap-4 text-sm"><a href={state.run.result} download={`${SAMPLES.sample1.fileName.replace(/\.[^.]+$/, '')}-enhanced.${state.run.extension}`} className="inline-flex items-center gap-2 text-primary"><Download aria-hidden="true" className="h-4 w-4" />{copy.download}</a><Link to="/dashboard?tool=enhance" className="inline-flex items-center gap-2 text-primary">{copy.own}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link><span role="status" className="text-xs text-zinc-500">{state.run.cached ? (isZh ? '缓存结果' : 'served from cache') : (isZh ? '刚刚生成' : 'generated now')}</span></div></div>}
      </section>
      <section className="mt-14 max-w-4xl" aria-labelledby="what-heading"><h2 id="what-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.explainHeading}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.explain}</p></section>
      <section className="mt-10 max-w-4xl rounded-xl border border-primary/20 bg-primary/[0.04] p-6" aria-labelledby="online-heading"><h2 id="online-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.onlineHeading}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.onlineText}</p></section>
      <section className="mt-14" aria-labelledby="workflow-heading"><h2 id="workflow-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.workflowHeading}</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{copy.steps.map(([heading, text]) => <article key={heading} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><h3 className="text-lg font-semibold text-white">{heading}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{text}</p></article>)}</div></section>
      <section className="mt-14 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-6" aria-labelledby="limits-heading"><h2 id="limits-heading" className="text-2xl font-headline font-bold text-white">{copy.limitsHeading}</h2><p className="mt-4 text-zinc-300 leading-relaxed">{copy.limits}</p></section>
      <section className="mt-14" id="faq" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.faqHeading}</h2><div className="mt-6 grid gap-4">{copy.faq.map(([question, answer]) => <article key={question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><h3 className="font-semibold text-white">{question}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-300">{answer}</p></article>)}</div></section>
      <section className="mt-14 border-t border-outline-variant/20 pt-8" aria-labelledby="links-heading"><h2 id="links-heading" className="text-xl font-bold text-white">{copy.linksHeading}</h2><div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">{copy.links.map(([path, label]) => <Link key={path} to={path} className="text-primary hover:underline">{label} →</Link>)}</div><p className="mt-5 text-xs text-zinc-500">{copy.desktop}</p></section>
    </main>
  </>;
}
