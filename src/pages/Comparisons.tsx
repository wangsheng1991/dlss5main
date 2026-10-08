import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ImageSlider from '../components/ImageSlider';

const TOOLS = [
  ['DLSS 5 (official technology)', 'Game neural rendering', 'RTX 50 series games', 'Game frames, lighting and materials'],
  ['GPT Image 2', 'Image generation and editing', 'Complex prompts and edits', 'API and ChatGPT workflows'],
  ['ChatGPT Images 2.5', 'Conversational image creation', 'Iterative revisions', 'Natural-language editing'],
  ['Midjourney', 'Creative image generation', 'Concept art and style', 'Visual exploration'],
  ['FLUX', 'Hosted image generation', 'Developer pipelines', 'Custom workflows'],
  ['Browser AI upscaler', 'Image enhancement', 'Existing photos and renders', 'Fast enlargement without a GPU'],
];

const CHECKS = [
  ['Structure', 'Does the output keep the pose, silhouette, perspective and repeated geometry?'],
  ['Identity', 'Do faces, hands, logos and product labels stay recognisable against the source?'],
  ['Texture', 'Are edges and materials clearer, or has the model invented plausible detail?'],
  ['Workflow', 'Can a visitor run a comparable input, inspect the result and keep the original?'],
];

const FAQ = [
  { question: 'Is DLSS 5 the same thing as an AI image generator?', answer: 'No. Official DLSS is an in-game neural-rendering technology. Image generators create or edit images from prompts, while the independent browser workflow on this site converts a supplied frame or reference into a reviewable visual direction.' },
  { question: 'How can I compare tools fairly?', answer: 'Keep the source image, aspect ratio, target direction and review checks fixed. Compare structure, identity, texture and workflow separately instead of judging two unrelated prompts from different models.' },
  { question: 'Are the examples on this page a benchmark?', answer: 'No. The gallery combines publicly published NVIDIA reference pairs with independent browser examples. A local Studio run is reported as one measured snapshot, not a universal speed or quality claim.' },
  { question: 'Can I try a result before creating an account?', answer: 'Yes. The character conversion and visual-enhancer examples use cached sample runs. You can inspect the before-and-after result first, then sign in when you want to upload your own image.' },
];

const COMPARISON_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://www.dlss5nvidia.com/comparisons#article',
      headline: 'AI Image Tools Compared: GPT Image 2, ChatGPT Images, Midjourney & DLSS 5',
      description: 'An independent, source-led comparison of image generation, editing, neural rendering and browser enhancement workflows.',
      dateModified: '2026-10-08',
      mainEntityOfPage: 'https://www.dlss5nvidia.com/comparisons',
      author: { '@type': 'Organization', name: 'DLSS5NVIDIA' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.dlss5nvidia.com/comparisons#faq',
      mainEntity: FAQ.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    },
  ],
};

export default function Comparisons() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
      <SEO
        title="AI Image Tools Compared: GPT Image 2, ChatGPT Images, Midjourney & DLSS 5"
        description="Compare AI image generation, editing and upscaling tools by quality, structure preservation, speed, cost, API access and best use case. Run a free visual sample before choosing a workflow."
        keywords={['GPT Image 2 vs Midjourney', 'ChatGPT Images vs FLUX', 'DLSS 5 vs AI upscaler', 'best AI image generator comparison', 'AI image tool benchmark', 'image conversion workflow']}
        canonical="/comparisons"
        image="/marketing/reddit/dlss5-official-contact-sheet.jpg"
        structuredData={COMPARISON_SCHEMA}
      />

      <header className="mb-12 max-w-4xl">
        <span className="text-nvidia-green text-xs uppercase tracking-[0.2em]">Independent guide · updated October 2026</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-white mt-4 mb-5">AI image tools compared</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">DLSS 5 is an in-game neural rendering technology. GPT Image, ChatGPT Images, Midjourney and FLUX create or edit images. This guide compares their jobs instead of treating them as interchangeable products, then gives you a real sample and a checklist to run yourself.</p>
      </header>

      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 mb-14" aria-labelledby="try-heading">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-label">Try before you choose</p>
            <h2 id="try-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mt-3">Run a conversion, inspect the pixels, then read the table</h2>
            <p className="text-zinc-300 leading-relaxed mt-4">The examples are cached so you can see the workflow before signing in. Use the character sample for style conversion, the enhancer sample for existing images, or open the source-led gallery when you want to audit published references.</p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/dashboard?tool=game-character-style&sample=characterStyle" className="rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-primary-container transition-colors">Try character conversion</Link>
            <Link to="/dashboard?tool=enhance&sample=sample1" className="rounded-lg border border-primary/50 px-5 py-3 font-semibold text-primary hover:bg-primary/10 transition-colors">Try visual enhancer</Link>
            <a href="/marketing/reddit/dlss5-reddit-comparisons.html" className="rounded-lg border border-outline-variant/30 px-5 py-3 font-semibold text-zinc-200 hover:border-primary hover:text-primary transition-colors">Open 20-pair gallery</a>
          </div>
        </div>
      </section>

      <section aria-labelledby="tools-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-label">Choose by task</p>
            <h2 id="tools-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mt-2">What each workflow is actually for</h2>
          </div>
          <p className="text-xs text-zinc-500 max-w-sm">Model names, prices and availability change. Verify provider details before making a purchase or production decision.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full text-left min-w-[760px]">
            <thead><tr className="bg-surface-high"><th className="p-4 text-primary">Tool</th><th className="p-4 text-primary">Primary role</th><th className="p-4 text-primary">Best for</th><th className="p-4 text-primary">Typical workflow</th></tr></thead>
            <tbody>{TOOLS.map(([name, role, best, flow]) => <tr key={name} className="border-t border-outline-variant/10"><td className="p-4 text-white font-semibold">{name}</td><td className="p-4 text-zinc-300">{role}</td><td className="p-4 text-zinc-300">{best}</td><td className="p-4 text-zinc-300">{flow}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="evidence-heading">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-label">Evidence, not a leaderboard</p>
          <h2 id="evidence-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mt-2">Three ways to inspect the claim</h2>
          <p className="text-zinc-400 leading-relaxed mt-4">A useful comparison lets a reader see the source, run a related task and understand the boundary of the result. These are independent references, not a claim that one model wins every prompt.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden">
            <img src="/marketing/reddit/dlss5-official-contact-sheet.jpg" alt="Twenty publicly published DLSS 5 reference pairs arranged as a contact sheet" className="w-full aspect-[16/10] object-cover" loading="lazy" />
            <div className="p-5"><p className="text-[10px] uppercase tracking-widest text-primary">Public references</p><h3 className="text-lg font-headline font-bold text-white mt-2">20 source-linked reference pairs</h3><p className="text-sm leading-relaxed text-zinc-400 mt-3">Keep the NVIDIA source link beside every pair and inspect faces, hair, thin geometry, materials and shadows at 100%.</p><a href="/marketing/reddit/dlss5-reddit-comparisons.html" className="inline-block mt-4 text-sm text-primary font-semibold">Open the source-led gallery →</a></div>
          </article>
          <article className="rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden">
            <ImageSlider highRes="/examples/case-product.jpg" lowRes="/examples/case-product-low.jpg" alt="Independent browser enhancement example" inputLabel="Input" outputLabel="Reference output" compareLabel="Drag to compare the independent browser example" initialAspectRatio={1.5} />
            <div className="p-5"><p className="text-[10px] uppercase tracking-widest text-primary">Runnable example</p><h3 className="text-lg font-headline font-bold text-white mt-2">A browser result you can inspect</h3><p className="text-sm leading-relaxed text-zinc-400 mt-3">Use the same before-and-after checks for product labels, faces and straight edges before deciding whether an enhancement is useful.</p><Link to="/image-quality-enhancer" className="inline-block mt-4 text-sm text-primary font-semibold">Open the free enhancer →</Link></div>
          </article>
          <article className="rounded-xl border border-outline-variant/20 bg-surface-low overflow-hidden">
            <ImageSlider highRes="/examples/generated/game-cyber-1-after.jpg" lowRes="/examples/generated/game-cyber-1-before.jpg" alt="Independent game character style conversion example" inputLabel="Base frame" outputLabel="Converted reference" compareLabel="Drag to compare the game character conversion example" initialAspectRatio={1.5} />
            <div className="p-5"><p className="text-[10px] uppercase tracking-widest text-primary">Conversion path</p><h3 className="text-lg font-headline font-bold text-white mt-2">Style conversion keeps the source visible</h3><p className="text-sm leading-relaxed text-zinc-400 mt-3">The independent workflow changes style, lighting and material direction while keeping the original frame available for review.</p><Link to="/game-character-style" className="inline-block mt-4 text-sm text-primary font-semibold">See the character cases →</Link></div>
          </article>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8" aria-labelledby="method-heading">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-label">Repeatable review</p>
          <h2 id="method-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mt-2">Use the same four checks every time</h2>
          <div className="mt-6 grid gap-4">{CHECKS.map(([name, text], index) => <div key={name} className="flex gap-4 rounded-xl border border-outline-variant/20 bg-surface-low p-5"><span className="text-primary font-headline font-bold text-xl">0{index + 1}</span><div><h3 className="text-white font-semibold">{name}</h3><p className="text-sm text-zinc-400 leading-relaxed mt-1">{text}</p></div></div>)}</div>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-low p-6 sm:p-8">
          <h2 className="text-2xl font-headline font-bold text-white">One measured snapshot</h2>
          <p className="text-sm leading-relaxed text-zinc-400 mt-4">The local DLSS5 Studio workflow processed one 3-second, 720p public-domain clip as 36 frames in 87.4 seconds on an RTX 4090 reference machine — about 2.43 seconds per frame. That is a batch-workflow observation, not a real-time promise or a cross-provider benchmark.</p>
          <dl className="mt-6 grid grid-cols-2 gap-4"><div className="rounded-lg border border-outline-variant/20 p-4"><dt className="text-xs uppercase tracking-widest text-zinc-500">Frames</dt><dd className="text-2xl font-headline font-bold text-white mt-1">36</dd></div><div className="rounded-lg border border-outline-variant/20 p-4"><dt className="text-xs uppercase tracking-widest text-zinc-500">Elapsed</dt><dd className="text-2xl font-headline font-bold text-white mt-1">87.4s</dd></div><div className="rounded-lg border border-outline-variant/20 p-4"><dt className="text-xs uppercase tracking-widest text-zinc-500">Per frame</dt><dd className="text-2xl font-headline font-bold text-white mt-1">2.43s</dd></div><div className="rounded-lg border border-outline-variant/20 p-4"><dt className="text-xs uppercase tracking-widest text-zinc-500">Machine</dt><dd className="text-sm font-semibold text-white mt-2">RTX 4090</dd></div></dl>
          <Link to="/download#showcase" className="inline-block mt-6 text-sm text-primary font-semibold">Read the full Studio evidence →</Link>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mb-6">Comparison questions</h2>
        <div className="grid gap-4">{FAQ.map((item) => <details key={item.question} className="rounded-xl border border-outline-variant/20 bg-surface-low p-5"><summary className="cursor-pointer text-white font-semibold">{item.question}</summary><p className="text-sm leading-relaxed text-zinc-400 mt-3 max-w-3xl">{item.answer}</p></details>)}</div>
      </section>

      <p className="text-zinc-500 text-xs mt-12">DLSS and NVIDIA are trademarks of NVIDIA Corporation. This site is independent and non-official. Public NVIDIA reference images remain the property of their respective owners; the browser examples are independent references.</p>
    </main>
  );
}
