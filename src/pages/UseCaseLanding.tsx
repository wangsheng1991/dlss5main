import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { USE_CASE_BY_PATH, useCaseSchema } from '../content/useCases';
import { trackEvent } from '../lib/analytics';

export default function UseCaseLanding() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const item = USE_CASE_BY_PATH[pathname.replace(/\/+$/, '')] || USE_CASE_BY_PATH['/use-cases/product-photo-enhancer'];
  const isZh = i18n.language.startsWith('zh');
  const cta = isZh ? '用自己的图片试试' : 'Try this workflow';

  useEffect(() => {
    trackEvent('use_case_view', { use_case: item.slug });
  }, [item.slug]);

  return <>
    <SEO
      title={item.title}
      description={item.description}
      keywords={item.keywords}
      canonical={item.path}
      structuredData={useCaseSchema(item)}
      image={item.after}
    />
    <main className="pt-28 sm:pt-32 pb-24 px-5 max-w-[1200px] mx-auto w-full">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary">DLSS5NVIDIA</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span>{item.heading}</span>
      </nav>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6">
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">{item.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-[1.08]">{item.heading}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">{item.intro}</p>
          <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-5">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">{isZh ? '快速结论' : 'Quick answer'}</p>
            <p className="text-sm leading-relaxed text-zinc-200">{item.tldr}</p>
          </div>
          <p className="mt-6">
            <Link
              to={`/dashboard?tool=${item.dashboardTool}`}
              onClick={() => trackEvent('use_case_cta_click', { use_case: item.slug, tool: item.dashboardTool })}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {cta} <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">JPG, PNG and WebP · sign in before processing · 1 credit per task</p>
        </div>
        <figure className="lg:col-span-6 rounded-2xl border border-outline-variant/20 bg-surface-low p-2 overflow-hidden">
          <ImageSlider
            highRes={item.after}
            lowRes={item.before}
            alt={item.imageAlt}
            inputLabel={item.beforeLabel}
            outputLabel={item.afterLabel}
            compareLabel="Drag or use the arrow keys to compare"
            initialAspectRatio={1.5}
            priority
          />
          <figcaption className="px-3 py-4 text-xs leading-relaxed text-zinc-400">{item.caption}</figcaption>
        </figure>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" aria-labelledby="use-cases-heading">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 id="use-cases-heading" className="text-2xl font-headline font-bold text-white">When this workflow helps</h2>
          <ul className="mt-5 grid gap-3">{item.useCases.map(useCase => <li key={useCase} className="flex items-start gap-2 text-sm text-zinc-300"><Check aria-hidden="true" className="mt-0.5 w-4 h-4 shrink-0 text-primary" />{useCase}</li>)}</ul>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">The result is an AI reconstruction. Keep the original file and inspect information-sensitive details before using the image commercially.</p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">What to check before publishing</h2>
          <ol className="mt-5 space-y-4 text-sm text-zinc-300">{['Compare the original and result at 100%.', 'Check edges, text, faces and repeated patterns.', 'Keep the original and reject any change you cannot verify.'].map((check, index) => <li key={check} className="flex gap-3"><span className="text-primary font-bold">0{index + 1}</span><span>{check}</span></li>)}</ol>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-3xl font-headline font-bold text-white mb-6">How to use this workflow</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">{item.steps.map((step, index) => <li key={step.name} className="border-t border-outline-variant/30 pt-5"><span className="text-primary text-sm font-mono">0{index + 1}</span><h3 className="text-lg text-white font-semibold mt-3">{step.name}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.text}</p></li>)}</ol>
      </section>

      <section className="mt-16 max-w-4xl" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-headline font-bold text-white mb-6">Frequently asked questions</h2>
        <div className="space-y-3">{item.faqs.map(faq => <details key={faq.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><summary className="cursor-pointer font-semibold text-white">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p></details>)}</div>
      </section>

      <section className="mt-16 border-t border-outline-variant/20 pt-8" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-headline font-bold text-white">Use the underlying tool</h2>
        <div className="mt-4 flex flex-wrap gap-3">{item.related.map(related => <Link key={related.path} to={related.path} className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">{related.label} <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></Link>)}</div>
        <Link to="/blog/dlss-5-online-image-upscaler-guide" className="inline-block mt-6 text-sm text-primary">Read the image enhancement guide →</Link>
      </section>
    </main>
  </>;
}
