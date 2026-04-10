import React from 'react';

export default function Models() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto min-h-[80vh]">
      <div className="mb-12">
        <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">Architecture</span>
        <h1 className="text-4xl font-headline font-bold text-white mb-6">Neural Models</h1>
        <p className="text-zinc-400 max-w-2xl leading-relaxed">Explore our specialized AI models trained for different upscaling scenarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Ada-5.0', type: 'General Purpose', desc: 'The flagship model. Balances sharpness and natural texture preservation. Best for photography and general web images.' },
          { name: 'Hopper-2.1', type: 'Cinematic / Art', desc: 'Optimized for digital art, renders, and stylized content. Exceptional at edge preservation and vector-like sharpness.' },
          { name: 'Turing-Legacy', type: 'High-Speed', desc: 'Low-latency model designed for real-time applications and video frame upscaling. Prioritizes speed over micro-details.' },
          { name: 'Lovelace-Text', type: 'Document / OCR', desc: 'Specialized in reconstructing blurry text and documents. Perfect for archival and data recovery tasks.' }
        ].map((model, i) => (
          <div key={i} className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 hover:border-primary/30 transition-colors">
            <div className="text-xs font-label uppercase tracking-widest text-primary mb-2">{model.type}</div>
            <h3 className="text-2xl font-headline font-bold text-white mb-4">{model.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{model.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
