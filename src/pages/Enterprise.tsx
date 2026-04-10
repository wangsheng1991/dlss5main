import React from 'react';
import { Shield, Server, Zap } from 'lucide-react';

export default function Enterprise() {
  return (
    <main className="pt-32 pb-24 px-6 max-w-[1440px] mx-auto min-h-[80vh]">
      <div className="text-center mb-16">
        <span className="text-nvidia-green font-label text-xs uppercase tracking-[0.2em] mb-4 block">Scale</span>
        <h1 className="text-5xl font-headline font-bold text-white mb-6">Enterprise Solutions</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">Dedicated clusters, custom model fine-tuning, and SLA-backed performance for high-volume workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 text-center">
          <Server className="w-12 h-12 text-primary mx-auto mb-6" />
          <h3 className="text-xl font-headline font-bold text-white mb-4">Dedicated Hardware</h3>
          <p className="text-zinc-400 text-sm">Private H100 instances isolated from the public pool for guaranteed throughput.</p>
        </div>
        <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
          <h3 className="text-xl font-headline font-bold text-white mb-4">On-Premise Deployment</h3>
          <p className="text-zinc-400 text-sm">Deploy our models directly to your own secure infrastructure.</p>
        </div>
        <div className="bg-surface-low p-8 rounded-xl border border-outline-variant/20 text-center">
          <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
          <h3 className="text-xl font-headline font-bold text-white mb-4">Custom Fine-Tuning</h3>
          <p className="text-zinc-400 text-sm">Models trained specifically on your proprietary dataset for unmatched accuracy.</p>
        </div>
      </div>
    </main>
  );
}
