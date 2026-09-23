import React from 'react';
import { ArrowRight, Check, UploadCloud } from 'lucide-react';
import ImageSlider from './ImageSlider';
import { toolAlternates, toolSteps, type ToolLanding } from '../content/toolLandings';
import { ENHANCE_MAX_EDGE } from '../config/enhance';
import { profileHas } from '../config/profile';
import { trackEvent } from '../lib/analytics';
import { USE_CASES } from '../content/useCases';

export function ToolUploadIntro({ tool }: { tool: ToolLanding }) {
  const es = tool.locale === 'es';
  return <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
    <UploadCloud aria-hidden="true" className="w-8 h-8 mx-auto mb-3 text-primary" />
    <a href={`/dashboard?tool=${tool.dashboardTool}`} onClick={() => trackEvent('tool_cta_click', { tool: tool.dashboardTool, locale: tool.locale })} className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{tool.cta}</a>
    <p className="mt-3 text-xs leading-relaxed text-zinc-400">{es ? 'O arrastra una imagen aquí. La vista previa permanece en tu navegador.' : 'Or drop an image here. Your preview stays in your browser.'}</p>
    <p className="mt-2 text-xs text-zinc-400">{tool.ctaNote}</p>
  </div>;
}

/** Shared public content: rendered at build time and in React to prevent SEO/content drift. */
export default function ToolLandingView({ tool, workspace }: { tool: ToolLanding; workspace?: React.ReactNode }) {
  const es = tool.locale === 'es';
  const isUnblur = tool.dashboardTool === 'unblur';
  const alternates = toolAlternates(tool).filter(a => a.hrefLang !== 'x-default');
  const steps = toolSteps(tool);
  const checks = tool.checks ?? (es
    ? ['Comprueba que las líneas y los bordes mantengan su forma.', 'Revisa que no aparezcan letras ni objetos nuevos.', 'Compara los colores y la iluminación con el original.']
    : isUnblur
      ? ['Inspect eyes and hair for invented texture or altered identity.', 'Look for halos along high-contrast edges at 100%.', 'Use another source if text or numbers remain unreadable.']
      : tool.dashboardTool === 'upscale'
        ? ['Check the displayed output dimensions before spending a credit.', 'Keep the original aspect ratio and compare straight edges.', 'For print, calculate the required pixel dimensions first.']
        : ['Inspect blocky compression areas and fine product textures.', 'Check that labels and logos have not been rewritten.', 'Compare colors and lighting against your original.']);
  return <>
    <main lang={tool.locale} className="pt-28 sm:pt-32 pb-20 px-5 max-w-[1200px] mx-auto w-full">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" id="tool">
        <div className="lg:col-span-6">
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">{tool.eyebrow}</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-white leading-[1.08]">{tool.heading}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-300">{tool.intro}</p>
          <div className="mt-6">{workspace ?? <ToolUploadIntro tool={tool} />}</div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-400">{tool.sharedNote ?? (es ? `Objetivos de 2× / 4×; máximo ${ENHANCE_MAX_EDGE} px por lado. La IA puede cambiar detalles. No garantiza recuperar información perdida.` : `2× / 4× targets; maximum ${ENHANCE_MAX_EDGE} px per edge. AI can alter details and cannot guarantee recovery of lost information.`)}</p>
        </div>
        {tool.demo ? <figure className="lg:col-span-6 rounded-2xl border border-outline-variant/20 bg-surface-low p-2 overflow-hidden">
          <ImageSlider highRes={tool.demo.after} lowRes={tool.demo.before} alt={`${tool.heading} — before and after`} inputLabel={tool.demo.beforeLabel} outputLabel={tool.demo.afterLabel} compareLabel={es ? 'Arrastra o usa las flechas para comparar' : 'Drag or use arrow keys to compare'} initialAspectRatio={tool.demo.aspectRatio} outputBackdrop={tool.demo.backdrop} priority />
          <figcaption className="px-3 py-4 text-xs leading-relaxed text-zinc-400">{tool.demo.caption}</figcaption>
        </figure> : <figure className="lg:col-span-6 rounded-2xl border border-outline-variant/20 bg-surface-low p-2 overflow-hidden">
          <ImageSlider highRes="/examples/sample1-photo.webp" lowRes="/examples/sample1-photo-low.webp" alt={es ? 'Comparación ilustrativa de calidad de imagen' : 'Illustrative image quality comparison'} inputLabel={es ? 'Baja resolución' : 'Low resolution'} outputLabel={es ? 'Referencia' : 'Reference'} compareLabel={es ? 'Arrastra o usa las flechas para comparar' : 'Drag or use arrow keys to compare'} initialAspectRatio={1.5} priority />
          <figcaption className="px-3 py-4 text-xs leading-relaxed text-zinc-400">{es ? 'Demostración ilustrativa: copia de baja resolución frente a la imagen de referencia. No es una medición del resultado del modelo. Tu resultado dependerá de la imagen original.' : 'Illustrative demo: a low-resolution copy compared with its reference image. This is not a measured model output. Your result depends on the source image.'}</figcaption>
        </figure>}
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" id="examples" aria-labelledby="use-cases-heading">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 id="use-cases-heading" className="text-2xl font-headline font-bold text-white">{es ? 'Cuándo usar esta herramienta' : 'When to use this tool'}</h2>
          <ul className="mt-5 grid gap-3">{tool.useCases.map(useCase => <li key={useCase} className="flex items-start gap-2 text-sm text-zinc-300"><Check aria-hidden="true" className="mt-0.5 w-4 h-4 shrink-0 text-primary" />{useCase}</li>)}</ul>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400">{tool.whenToUse ?? (es ? 'Conserva siempre el archivo original. Para una foto demasiado borrosa o para documentos, usa una captura mejor cuando sea posible.' : isUnblur ? 'Best for mild softness. Heavy motion blur, unreadable text and forensic detail cannot be reliably restored. Start with a sharper original if one is available.' : tool.dashboardTool === 'upscale' ? 'Useful when a small source needs more pixels. Large originals may be reduced by the output limit; the tool shows this before submission.' : 'Useful for a cleaner visual finish on small photos. It does not guarantee faithful restoration of text, product labels or faces.')}</p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-7">
          <h2 className="text-2xl font-headline font-bold text-white">{es ? 'Qué revisar en el resultado' : 'What to check in the result'}</h2>
          <ol className="mt-5 space-y-4 text-sm text-zinc-300">{checks.map((check, i) => <li key={check} className="flex gap-3"><span className="text-primary font-bold">0{i + 1}</span><span>{check}</span></li>)}</ol>
          <p className="mt-5 text-xs leading-relaxed text-zinc-400">{tool.disclaimer ?? (es ? 'Estas herramientas utilizan la misma mejora de imagen con IA. No hay un modelo independiente de eliminación de desenfoque.' : 'These tools share the same AI enhancement mode. The unblur page uses this enhancement capability, not a separate deblurring model.')}</p>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-3xl font-headline font-bold text-white mb-6">{tool.stepsHeading ?? (es ? 'Cómo mejorar tu imagen' : 'How to enhance your image')}</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">{steps.map((step, i) => <li key={step.name} className="border-t border-outline-variant/30 pt-5"><span className="text-primary text-sm font-mono">0{i + 1}</span><h3 className="text-lg text-white font-semibold mt-3">{step.name}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{step.text}</p></li>)}</ol>
      </section>
      <section className="mt-16 max-w-4xl" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-headline font-bold text-white mb-6">{es ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>
        <div className="space-y-3">{tool.faqs.map(faq => <details key={faq.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><summary className="cursor-pointer font-semibold text-white">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p></details>)}</div>
      </section>
      <section className="mt-16 border-t border-outline-variant/20 pt-8" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-headline font-bold text-white">{es ? 'Herramientas relacionadas (en inglés)' : 'Related tools'}</h2>
        <div className="mt-4 flex flex-wrap gap-3">{tool.related.map(related => <a key={related.path} href={related.path} hrefLang="en" className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">{related.label} <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></a>)}</div>
        {profileHas('useCases') && <>
          <h3 className="text-lg font-headline font-bold text-white mt-8">Workflow guides</h3>
          <div className="mt-4 flex flex-wrap gap-3">{USE_CASES.filter(item => item.toolPath === tool.path).map(item => <a key={item.path} href={item.path} className="rounded-lg border border-primary/30 px-4 py-3 text-sm text-primary hover:bg-primary/10">{item.heading} <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></a>)}</div>
        </>}
        {profileHas('blog') && <a className="inline-block mt-6 text-sm text-primary" href="/blog/dlss-5-online-image-upscaler-guide">{es ? 'Guía sobre mejora de imágenes (en inglés) →' : 'Read the online image enhancement guide →'}</a>}
      </section>
    </main>
  </>;
}
