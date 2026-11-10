import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';
import { SITE_URL } from '../config/site';
import { TOGETHER_ZH, togetherZhSchema } from '../content/togetherZh';

/**
 * The Chinese edition of the duo-portrait page.
 *
 * It is a page of its own rather than a `locale` flag on the shared tool view: that view generates
 * its long-form paragraphs in English out of each tool's contract, and every one of the sixteen
 * existing tool pages reads that same generator. Branching it for one Chinese edition would put a
 * condition in sixteen pages' path; a separate page keeps the English pages untouched.
 */
export default function GameCharacterTogetherZh() {
  const copy = TOGETHER_ZH;
  return <>
    <SEO
      title={copy.title}
      description={copy.description}
      keywords={copy.keywords}
      canonical={copy.path}
      language={copy.language}
      alternates={[
        { hrefLang: 'en', href: `${SITE_URL}/game-character-together` },
        { hrefLang: 'zh-CN', href: `${SITE_URL}${copy.path}` },
        { hrefLang: 'x-default', href: `${SITE_URL}/game-character-together` },
      ]}
      structuredData={togetherZhSchema()}
      image={copy.demo.after}
    />
    <main lang="zh-CN" className="pt-28 sm:pt-32 pb-20 px-5 max-w-[1200px] mx-auto w-full">
      <nav className="mb-8 text-sm text-zinc-500" aria-label="面包屑"><Link to="/zh" className="hover:text-primary">DLSS5NVIDIA</Link><span aria-hidden="true" className="mx-2">/</span><span>{copy.heading}</span></nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6">
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">{copy.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-[1.08]">{copy.heading}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">{copy.lead}</p>
          <div className="mt-6 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard?tool=together&sample=together" className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{copy.sampleRun}</Link>
              <Link to="/dashboard?tool=together" className="inline-flex items-center rounded-lg border border-primary/50 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{copy.cta}</Link>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">{copy.sampleNote}</p>
            <p className="mt-2 text-xs text-zinc-400">{copy.ctaNote}</p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-400">{copy.whatIsNot}</p>
        </div>
        <figure className="lg:col-span-6 rounded-2xl border border-outline-variant/20 bg-surface-low p-2 overflow-hidden">
          <div className="relative">
            <ImageSlider highRes={copy.demo.after} lowRes={copy.demo.before} alt={`${copy.heading} — 参考图与结果对比`} inputLabel={copy.demo.beforeLabel} outputLabel={copy.demo.afterLabel} compareLabel="拖动或用方向键对比" initialAspectRatio={1} priority />
            <span className="absolute left-3 top-3 rounded-full border border-primary/50 bg-black/75 px-2.5 py-1 text-[10px] font-label uppercase tracking-widest text-primary">免费示例</span>
          </div>
          <figcaption className="px-3 py-4 text-xs leading-relaxed text-zinc-400">{copy.demo.caption}</figcaption>
        </figure>
      </section>

      <section className="mt-14" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.galleryHeading}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">{copy.galleryIntro}</p>
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {copy.gallery.map(card => <figure key={card.src} className="rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-low">
            <img src={card.src} alt={`${copy.heading} — ${card.label}`} width={card.width} height={card.height} loading="lazy" className="w-full" />
            <figcaption className="p-4">
              <p className="text-xs uppercase tracking-widest text-primary">{card.pose}</p>
              <p className="mt-2 text-sm font-semibold text-white">{card.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{card.note}</p>
            </figcaption>
          </figure>)}
        </div>
      </section>

      <section className="mt-14 max-w-4xl" aria-labelledby="what-heading">
        <h2 id="what-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.whatHeading}</h2>
        <p className="mt-4 text-zinc-300 leading-relaxed">{copy.whatIs}</p>
      </section>

      <section className="mt-14" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-2xl md:text-3xl font-headline font-bold text-white">{copy.stepsHeading}</h2>
        <ol className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {copy.steps.map((step, index) => <li key={step.name} className="border-t border-outline-variant/30 pt-5">
            <span className="text-primary text-sm font-mono">0{index + 1}</span>
            <h3 className="text-lg text-white font-semibold mt-3">{step.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.text}</p>
          </li>)}
        </ol>
      </section>

      <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">{copy.fitHeading}</h2>
          <ul className="mt-5 space-y-3 text-sm text-zinc-300">{copy.fit.map(item => <li key={item}>· {item}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">{copy.checksHeading}</h2>
          <ol className="mt-5 space-y-4 text-sm text-zinc-300">{copy.checks.map((check, index) => <li key={check} className="flex gap-3"><span className="text-primary font-bold">0{index + 1}</span><span>{check}</span></li>)}</ol>
        </div>
      </section>

      <section className="mt-14 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-6 sm:p-7" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-2xl font-headline font-bold text-white">这些地方它做不到</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-zinc-300">{copy.limits.map(item => <li key={item}>· {item}</li>)}</ul>
      </section>

      <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">{copy.priceHeading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{copy.price}</p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">{copy.reviewHeading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{copy.review}</p>
        </div>
      </section>

      <section className="mt-16 max-w-4xl" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mb-6">常见问题</h2>
        <div className="space-y-3">{copy.faqs.map(faq => <article key={faq.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5">
          <h3 className="font-semibold text-white">{faq.question}</h3>
          <details className="mt-3"><summary className="cursor-pointer text-xs text-primary">看答案</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p></details>
        </article>)}</div>
      </section>

      <section className="mt-16 border-t border-outline-variant/20 pt-8" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-headline font-bold text-white">相关页面</h2>
        <div className="mt-4 flex flex-wrap gap-3">{copy.related.map(item => <Link key={item.path} to={item.path} className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">{item.label} <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></Link>)}</div>
        <p className="mt-6"><a className="text-sm text-primary" href="/game-character-together" hrefLang="en">English version of this page →</a></p>
      </section>
    </main>
  </>;
}
