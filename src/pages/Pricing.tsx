import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

type Plan = { id: string; monthlyCredits: number; dailyGenerationLimit: number; maxConcurrentJobs: number };

export default function Pricing() {
  const [plans, setPlans] = useState<Record<string, Plan> | null>(null);
  const [contact, setContact] = useState('support@dlss5nvidia.com');
  useEffect(() => { fetch('/api/billing/plans').then((r) => r.ok ? r.json() : Promise.reject()).then((d) => { setPlans(d.plans); setContact(d.membershipContact || 'support@dlss5nvidia.com'); }).catch(() => setPlans(null)); }, []);
  return <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-[80vh]"><SEO title="AI Image Upscaling Plans | DLSS 5 Credits" description="Choose a predictable AI image upscaling plan with monthly credits, daily limits, and API access options." keywords={['ai image upscaling pricing', 'image enhancement api pricing', 'dlss 5 credits', 'ai upscaler plans']} canonical="/pricing" />
    <div className="text-center mb-14"><span className="text-nvidia-green text-xs uppercase tracking-[0.2em]">Plans</span><h1 className="text-5xl font-bold text-white mt-4">Choose your plan</h1><p className="text-zinc-400 mt-4">Every plan uses GPT Image 2 with predictable monthly limits.</p></div>
    {!plans ? <p className="text-center text-zinc-400">Unable to load plans. Please try again.</p> : <div className="grid md:grid-cols-3 gap-6">{(Object.values(plans) as Plan[]).map((p) => <article key={p.id} className="bg-surface-low border border-outline-variant/20 rounded-xl p-7"><h2 className="text-2xl font-bold text-white capitalize">{p.id}</h2><p className="text-3xl font-bold text-primary mt-5">{p.monthlyCredits}<span className="text-sm text-zinc-500"> credits / month</span></p><ul className="text-zinc-400 text-sm space-y-3 mt-6"><li>{p.dailyGenerationLimit} generations per day</li><li>{p.maxConcurrentJobs} concurrent job{p.maxConcurrentJobs === 1 ? '' : 's'}</li></ul>{p.id === 'free' ? <Link to="/register" className="block text-center mt-8 py-3 rounded-lg bg-primary-container text-white font-bold hover:bg-primary hover:text-black">Start free</Link> : <a href={`mailto:${contact}?subject=${encodeURIComponent(`Membership application: ${p.id}`)}&body=${encodeURIComponent(`Hello,\n\nI would like to apply for the ${p.id} plan.\n\nAccount email: \nCompany/use case: \n`)}`} className="block text-center mt-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-black">Apply by email</a>}</article>)}</div>}
  </main>;
}
