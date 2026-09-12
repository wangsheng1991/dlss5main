import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

type Plan = { id: string; monthlyCredits: number; dailyGenerationLimit: number; maxConcurrentJobs: number };

export default function Pricing() {
  const [plans, setPlans] = useState<Record<string, Plan> | null>(null);
  useEffect(() => { fetch('/api/billing/plans').then((r) => r.ok ? r.json() : Promise.reject()).then((d) => setPlans(d.plans)).catch(() => setPlans(null)); }, []);
  return <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-[80vh]"><SEO title="Plans | DLSS 5" description="Choose a DLSS 5 image generation plan." canonical="/pricing" />
    <div className="text-center mb-14"><span className="text-nvidia-green text-xs uppercase tracking-[0.2em]">Plans</span><h1 className="text-5xl font-bold text-white mt-4">Choose your plan</h1><p className="text-zinc-400 mt-4">Every plan uses GPT Image 2 with predictable monthly limits.</p></div>
    {!plans ? <p className="text-center text-zinc-400">Unable to load plans. Please try again.</p> : <div className="grid md:grid-cols-3 gap-6">{(Object.values(plans) as Plan[]).map((p) => <article key={p.id} className="bg-surface-low border border-outline-variant/20 rounded-xl p-7"><h2 className="text-2xl font-bold text-white capitalize">{p.id}</h2><p className="text-3xl font-bold text-primary mt-5">{p.monthlyCredits}<span className="text-sm text-zinc-500"> credits / month</span></p><ul className="text-zinc-400 text-sm space-y-3 mt-6"><li>{p.dailyGenerationLimit} generations per day</li><li>{p.maxConcurrentJobs} concurrent job{p.maxConcurrentJobs === 1 ? '' : 's'}</li></ul><Link to="/register" className="block text-center mt-8 py-3 rounded-lg bg-primary-container text-white font-bold hover:bg-primary hover:text-black">Get started</Link></article>)}</div>}
  </main>;
}
