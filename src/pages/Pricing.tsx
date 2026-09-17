import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

type Plan = { name: string; monthlyCredits: number; dailyGenerationLimit: number; maxConcurrentJobs: number; priceUsd: number; purchasable: boolean; currency?: string };
type PlanId = 'free' | 'pro' | 'team';

export default function Pricing() {
  const { user, profile } = useAuth();
  const [params] = useSearchParams();
  const [plans, setPlans] = useState<Record<string, Plan> | null>(null);
  const [contact, setContact] = useState('support@dlss5nvidia.com');
  const [billingEnabled, setBillingEnabled] = useState(false);
  const [paypal, setPaypal] = useState<{ enabled: boolean; environment: string } | null>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const paypalCancelled = params.get('paypal') === 'cancelled';
  const cancelled = params.get('checkout') === 'cancelled' || paypalCancelled;
  useEffect(() => {
    fetch('/api/billing/plans').then((r) => r.ok ? r.json() : Promise.reject()).then((d) => {
      setPlans(d.plans); setContact(d.membershipContact || 'support@dlss5nvidia.com'); setBillingEnabled(Boolean(d.billingEnabled)); setPaypal(d.paypal || null);
    }).catch(() => setPlans(null));
  }, []);
  const current = (profile?.tier || 'free') as PlanId;
  const subscribed = current !== 'free';
  const post = async (path: string, body?: unknown) => {
    const token = await user!.getIdToken();
    const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined });
    return { ok: response.ok, data: await response.json().catch(() => ({})) as { url?: string; code?: string; error?: string } };
  };
  const choose = async (id: PlanId) => {
    if (!user) return;
    setBusy(id); setError('');
    try {
      // Existing subscribers switch the subscription (prorated); everyone else opens checkout.
      const change = subscribed ? await post('/api/billing/change', { plan: id }) : { ok: false, data: { code: 'no_subscription' } };
      if (change.ok) return window.location.assign('/dashboard?plan=changed');
      if (change.data.code !== 'no_subscription') throw new Error(change.data.error || 'Could not change your plan.');
      const checkout = await post('/api/billing/checkout', { plan: id });
      if (!checkout.ok || !checkout.data.url) throw new Error(checkout.data.error || 'Checkout is unavailable right now. Please try again.');
      window.location.assign(checkout.data.url);
    } catch (cause) {
      setError((cause as Error).message);
      setBusy('');
    }
  };
  /** PayPal takes over the page: the buyer approves on PayPal, then lands back on the dashboard. */
  const choosePaypal = async (id: PlanId) => {
    if (!user) return;
    setBusy(id); setError('');
    try {
      const checkout = await post('/api/billing/paypal-checkout', { plan: id });
      if (!checkout.ok || !checkout.data.url) throw new Error(checkout.data.error || 'PayPal is unavailable right now. Please try again.');
      window.location.assign(checkout.data.url);
    } catch (cause) {
      setError((cause as Error).message);
      setBusy('');
    }
  };
  const mailto = (id: string) => `mailto:${contact}?subject=${encodeURIComponent(`Membership application: ${id}`)}&body=${encodeURIComponent(`Hello,\n\nI would like to apply for the ${id} plan.\n\nAccount email: \nCompany/use case: \n`)}`;
  return <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-[80vh]"><SEO title="AI Image Upscaling Plans | DLSS 5 Credits" description="Choose a predictable AI image upscaling plan with monthly credits, daily limits, and API access options." keywords={['ai image upscaling pricing', 'image enhancement api pricing', 'dlss 5 credits', 'ai upscaler plans']} canonical="/pricing" />
    <div className="text-center mb-14"><span className="text-nvidia-green text-xs uppercase tracking-[0.2em]">Plans</span><h1 className="text-5xl font-bold text-white mt-4">Choose your plan</h1><p className="text-zinc-400 mt-4">Every plan uses GPT Image 2 with predictable monthly limits.</p></div>
    {cancelled && <p role="status" className="mb-8 text-center text-sm text-zinc-300 bg-surface-low border border-outline-variant/20 rounded-lg py-3 px-4">{paypalCancelled ? 'PayPal checkout cancelled — nothing was charged.' : 'Checkout cancelled — nothing was charged.'}</p>}
    {error && <p role="alert" className="mb-8 text-center text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg py-3 px-4">{error}</p>}
    {!plans ? <p className="text-center text-zinc-400">Unable to load plans. Please try again.</p> : <div className="grid md:grid-cols-3 gap-6">{(Object.entries(plans) as [PlanId, Plan][]).map(([id, p]) => <article key={id} className={`bg-surface-low border rounded-xl p-7 ${current === id ? 'border-primary/60' : 'border-outline-variant/20'}`}>
      <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-bold text-white">{p.name}</h2>{current === id && <span className="text-xs text-primary border border-primary/40 rounded-full px-3 py-1">Current plan</span>}</div>
      <p className="text-3xl font-bold text-primary mt-5">{p.priceUsd === 0 ? 'Free' : `$${p.priceUsd}`}{p.priceUsd > 0 && <span className="text-sm text-zinc-500"> / month</span>}</p>
      <p className="text-sm text-zinc-500 mt-2">{p.monthlyCredits} credits per month</p>
      <ul className="text-zinc-400 text-sm space-y-3 mt-6"><li>{p.dailyGenerationLimit} generations per day</li><li>{p.maxConcurrentJobs} concurrent job{p.maxConcurrentJobs === 1 ? '' : 's'}</li></ul>
      {id === 'free' ? <Link to="/register" className="block text-center mt-8 py-3 rounded-lg bg-primary-container text-white font-bold hover:bg-primary hover:text-black">Start free</Link>
        : current === id ? <span className="block text-center mt-8 py-3 rounded-lg border border-outline-variant/30 text-zinc-400">Active</span>
        : !user ? <Link to="/login" className="block text-center mt-8 py-3 rounded-lg bg-primary text-black font-bold">Sign in to subscribe</Link>
        : <div className="mt-8 space-y-3">
          {billingEnabled
            ? <button onClick={() => void choose(id)} disabled={busy === id} className="w-full py-3 rounded-lg bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed">{busy === id ? 'Opening…' : `${subscribed ? 'Switch to' : 'Subscribe to'} ${p.name}`}</button>
            : <a href={mailto(id)} className="block text-center py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary hover:text-black">Apply by email</a>}
          {/* A second checkout lane: buyers who prefer PayPal never touch the card form. */}
          {paypal?.enabled && !subscribed && <button onClick={() => void choosePaypal(id)} disabled={busy === id} className="w-full py-3 rounded-lg border border-outline-variant/30 text-zinc-200 font-bold hover:border-primary/50 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed">{busy === id ? 'Opening…' : `Pay with PayPal${paypal.environment === 'sandbox' ? ' (sandbox)' : ''}`}</button>}
        </div>}
    </article>)}</div>}
    <p className="text-center text-xs text-zinc-500 mt-10">Subscriptions renew monthly and can be cancelled any time; unused credits do not roll over. Questions? <a href={`mailto:${contact}`} className="text-primary underline">{contact}</a></p>
  </main>;
}
