import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { VIDEO_LANDING, VIDEO_LONG_FORM, videoLandingSchema } from '../content/videoLanding';

export default function VideoUpscaler() {
  return (
    <>
      <SEO title={VIDEO_LANDING.title} description={VIDEO_LANDING.description} keywords={[...VIDEO_LANDING.keywords]} canonical={VIDEO_LANDING.path} image={VIDEO_LANDING.demos[0].poster} structuredData={videoLandingSchema()} />
      <main className="pt-28 sm:pt-32 pb-24 px-5 max-w-[1200px] mx-auto w-full">
        <nav className="mb-8 text-sm text-zinc-500" aria-label="Breadcrumb"><Link to="/" className="hover:text-primary">DLSS5NVIDIA</Link><span className="mx-2" aria-hidden="true">/</span><span>{VIDEO_LANDING.heading}</span></nav>
        <header className="max-w-4xl">
          <p className="text-primary font-label text-xs uppercase tracking-[0.2em] mb-4">Video super-resolution workflow</p>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white leading-[1.05]">{VIDEO_LANDING.heading}</h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{VIDEO_LANDING.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link to="/dashboard?tool=enhance" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-primary">Try a representative frame <ArrowRight aria-hidden="true" className="w-4 h-4" /></Link><Link to="/blog/seedance-2-5-video-super-resolution-cost-guide-2026" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-6 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary">Read the Seedance 2.5 cost guide <ArrowRight aria-hidden="true" className="w-4 h-4" /></Link></div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">The current public workspace processes still image frames. The clips below are original silent reference demos for the planned video provider workflow.</p>
        </header>

        <section className="mt-16 max-w-4xl space-y-7" aria-labelledby="video-definition-heading">
          <div><h2 id="video-definition-heading" className="text-2xl font-headline font-bold text-white">What AI video upscaling changes</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.definition}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Why preview resolution comes first</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.preview}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Review time, not only one frame</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.checks}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Document the final delivery</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.delivery}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Test the hardest scene</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.sceneNotes}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Compare the whole cost</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.costNotes}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Keep the handoff reproducible</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.handoff}</p></div>
          <div><h2 className="text-2xl font-headline font-bold text-white">Use a final review checklist</h2><p className="mt-3 text-sm leading-relaxed text-zinc-300">{VIDEO_LONG_FORM.checklist}</p></div>
        </section>

        <section className="mt-16" aria-labelledby="video-demos-heading"><div className="mb-7"><p className="text-xs uppercase tracking-widest text-primary">Original reference demos</p><h2 id="video-demos-heading" className="mt-2 text-3xl font-headline font-bold text-white">See the transition before you commit to a workflow</h2></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{VIDEO_LANDING.demos.map((demo) => <figure key={demo.src} className="rounded-2xl border border-primary/25 bg-surface-low overflow-hidden"><video className="w-full aspect-video object-cover bg-black" controls muted playsInline preload="metadata" poster={demo.poster} aria-label={demo.alt}><source src={demo.src} type="video/mp4" />Your browser does not support this video.</video><figcaption className="p-5"><h3 className="text-lg font-headline font-bold text-white">{demo.name}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-400">{demo.description}</p></figcaption></figure>)}</div></section>

        <section className="mt-20" aria-labelledby="workflow-heading"><div className="mb-7"><p className="text-xs uppercase tracking-widest text-primary">Low-cost iteration → approved finish</p><h2 id="workflow-heading" className="mt-2 text-3xl font-headline font-bold text-white">A practical 3-step video enhancement workflow</h2></div><ol className="grid grid-cols-1 md:grid-cols-3 gap-6">{[
          ['01', 'Generate a preview', 'Use 480p or 720p to iterate on prompt, camera movement, references and timing before paying for a final finish.'],
          ['02', 'Inspect key frames', 'Check faces, hands, typography, thin geometry, fast motion and temporal consistency at 100%.'],
          ['03', 'Finish the approved shot', 'Run the selected video super-resolution pass for 1080p or 4K delivery, then keep the original beside the AI-enhanced result.'],
        ].map(([number, title, text]) => <li key={number} className="rounded-xl border border-outline-variant/20 bg-surface-low p-6"><span className="text-primary font-mono text-sm">{number}</span><h3 className="mt-4 text-xl font-headline font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-400">{text}</p></li>)}</ol></section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6" aria-labelledby="quality-checks-heading"><article className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-8"><h2 id="quality-checks-heading" className="text-2xl font-headline font-bold text-white">What to check before publishing</h2><ul className="mt-5 space-y-4">{['Faces and identity stay recognizable.', 'Text, UI and numbers are not invented.', 'Edges, hair and thin lines do not flicker.', 'Motion remains stable across adjacent frames.'].map((check) => <li key={check} className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300"><Check aria-hidden="true" className="mt-0.5 w-4 h-4 shrink-0 text-primary" />{check}</li>)}</ul></article><article className="rounded-xl border border-primary/25 bg-primary/5 p-6 sm:p-8"><h2 className="text-2xl font-headline font-bold text-white">When the two-step path saves money</h2><p className="mt-4 text-sm leading-relaxed text-zinc-300">If a low-resolution generation plus one finishing pass costs less than repeated native high-resolution attempts, use the two-step route for drafts, social clips, product teasers, real-estate fly-throughs and game-concept shots. Re-render when the final frame needs tiny text or pixel-accurate texture.</p><Link to="/blog/seedance-2-5-video-super-resolution-cost-guide-2026" className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary">See the cost model <ArrowRight aria-hidden="true" className="w-4 h-4" /></Link></article></section>

        <section className="mt-16 max-w-4xl" id="faq" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-3xl font-headline font-bold text-white mb-6">Frequently asked questions</h2><div className="space-y-3">{VIDEO_LANDING.faqs.map((faq) => <article key={faq.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><h3 className="font-semibold text-white">{faq.question}</h3><details className="mt-3"><summary className="cursor-pointer text-sm text-primary">Read the answer</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p></details></article>)}</div></section>

        <section className="mt-16 border-t border-outline-variant/20 pt-8" aria-labelledby="video-related-heading"><h2 id="video-related-heading" className="text-xl font-headline font-bold text-white">Continue with related workflows</h2><div className="mt-4 flex flex-wrap gap-3"><Link to="/game-character-style" className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">20 game character cases <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></Link><Link to="/image-quality-enhancer" className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">Image quality enhancer <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></Link><Link to="/comparisons" className="rounded-lg border border-outline-variant/30 px-4 py-3 text-sm text-zinc-300 hover:border-primary hover:text-primary">AI tools compared <ArrowRight aria-hidden="true" className="ml-1 inline w-4 h-4" /></Link></div></section>
      </main>
    </>
  );
}
