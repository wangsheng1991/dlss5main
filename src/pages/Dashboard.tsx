import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, Download, RefreshCw, AlertCircle, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';
import { SAMPLES, SAMPLE_IDS, GUEST_SAMPLE_IDS, type SampleId } from '../config/samples';
import { ENHANCE_FACTORS, ENHANCE_MAX_EDGE, enhanceOutput, type EnhanceFactor } from '../config/enhance';
import {
  STEPS_RANGE, TOOL_SUMMARY, isToolId, ERASE_OUTPUT_EDGE,
  VECTORIZE_MAX_EDGE, VECTORIZE_PRESETS, VECTORIZE_PRESET_LABEL, VECTORIZE_PRESET_NOTE,
  MAX_UPLOAD_BYTES, failureNote, inputLimitNote, oversizeNote,
  type VectorizePreset, type ToolId,
} from '../config/tools';
import type { GenerationMode } from '../features/generation/operation';
import { useGeneration } from '../features/generation/useGeneration';
import { useSampleRun } from '../features/generation/useSampleRun';
import { claimShareReward } from '../features/rewards/shareClaim';
import { SHARE_REWARD } from '../config/promos';
import SEO from '../components/SEO';

type HistoryJob = { id: string; status: string; prompt: string; tool?: string; createdAt: number; completedAt?: number; errorCode?: string; saved?: boolean; width?: number; height?: number };

/** Query values the SEO tool pages use to open the studio with a preset already selected. */
const MODE_BY_TOOL_QUERY: Record<string, GenerationMode> = {
  upscale: 'enhance', enhance: 'enhance', unblur: 'enhance',
  'remove-background': 'cutout', erase: 'erase', 'erase-object': 'erase',
  'image-to-svg': 'vectorize', vectorize: 'vectorize',
};

/** The presets offered in the studio, in display order. */
const MODES: Array<[GenerationMode, string]> = [
  ['edit', 'Image editing'],
  ['enhance', 'HD enhance'],
  ['cutout', TOOL_SUMMARY.cutout.label],
  ['vectorize', TOOL_SUMMARY.vectorize.label],
  ['erase', TOOL_SUMMARY.erase.label],
];

const TOOL_LABEL: Record<ToolId, string> = {
  cutout: TOOL_SUMMARY.cutout.label, vectorize: TOOL_SUMMARY.vectorize.label, erase: TOOL_SUMMARY.erase.label,
};

/** Traced long edges the studio offers; the service accepts 256–2048. */
const VECTORIZE_EDGES = [1024, 1536, VECTORIZE_MAX_EDGE.max] as const;

/** Results are owner-only, so the image is fetched with the ID token instead of a plain <img src>. */
function HistoryResult({ jobId, token, alt }: { jobId: string; token: string; alt: string }) {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<'loading' | 'ready' | 'expired'>('loading');
  useEffect(() => {
    let active = true, objectUrl = '';
    setState('loading');
    fetch(`/api/image-edit/results/${encodeURIComponent(jobId)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) { setState('expired'); return; }
        objectUrl = URL.createObjectURL(await response.blob());
        setUrl(objectUrl);
        setState('ready');
      })
      .catch(() => { if (active) setState('expired'); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [jobId, token]);
  if (state === 'loading') return <div className="aspect-video rounded-lg bg-surface-lowest border border-outline-variant/20 flex items-center justify-center"><RefreshCw className="w-4 h-4 animate-spin text-zinc-500"/></div>;
  if (state === 'expired') return <div className="aspect-video rounded-lg bg-surface-lowest border border-outline-variant/20 flex items-center justify-center text-xs text-zinc-500 px-3 text-center">Result no longer available</div>;
  return <a href={url} target="_blank" rel="noreferrer" className="block aspect-video rounded-lg overflow-hidden border border-outline-variant/20 hover:border-primary transition-colors"><img src={url} alt={alt} className="w-full h-full object-cover"/></a>;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user, profile, dailyCheckIn } = useAuth();
  const generation = useGeneration(user);
  const sampleRun = useSampleRun();
  const [selectedSample, setSelectedSample] = useState<SampleId | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [prompt, setPrompt] = useState('Make the lighting more natural and preserve the composition.');
  const [mode, setMode] = useState<GenerationMode>('edit');
  const [factor, setFactor] = useState<EnhanceFactor>(2);
  const [steps, setSteps] = useState<number>(STEPS_RANGE.default);
  const [preset, setPreset] = useState<VectorizePreset>('logo');
  const [vectorEdge, setVectorEdge] = useState<number>(VECTORIZE_MAX_EDGE.default);
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null);
  const [history, setHistory] = useState<HistoryJob[]>([]);
  const [historyToken, setHistoryToken] = useState('');
  const [historyVersion, setHistoryVersion] = useState(0);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInNotice, setCheckInNotice] = useState('');
  const [billingNotice, setBillingNotice] = useState('');
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareClaimed, setShareClaimed] = useState(false);
  const [shareNotice, setShareNotice] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const shareInput = useRef<HTMLInputElement>(null);
  // SEO tool pages link into the same studio with the matching preset already selected.
  useEffect(() => {
    const tool = new URL(window.location.href).searchParams.get('tool');
    const preset = tool ? MODE_BY_TOOL_QUERY[tool] : undefined;
    if (preset) setMode(preset);
  }, []);
  // Stripe and PayPal both return buyers here; the server confirms the purchase and grants credits.
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('session_id') || '';
    if (url.searchParams.get('plan') === 'changed') {
      setBillingNotice('Plan changed — your new allowance appears as soon as Stripe confirms the proration.');
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url);
    }
    if (url.searchParams.get('dodo') === 'success') {
      setBillingNotice('Dodo checkout completed. Your credits will appear after the verified payment webhook arrives.');
      url.searchParams.delete('dodo');
      window.history.replaceState({}, '', url);
    }
    if (!user) return;
    // PayPal's return carries no subscription id of its own: the account bound at checkout is the one
    // the server confirms, which also covers a buyer who approves on PayPal and lands back here.
    if (url.searchParams.get('paypal') === 'success') {
      let active = true;
      user.getIdToken()
        .then((token) => fetch('/api/billing/paypal-confirm', { headers: { Authorization: `Bearer ${token}` } }))
        .then((r) => r.json())
        .then((data) => {
          if (!active) return;
          setBillingNotice(data.status === 'active'
            ? `Payment confirmed — ${data.tier} plan active with ${data.credits} credits.`
            : 'PayPal is still confirming this subscription — your credits appear as soon as it does.');
        })
        .catch(() => { if (active) setBillingNotice('We could not confirm this payment yet. Refresh in a moment or contact support.'); })
        .finally(() => { url.searchParams.delete('paypal'); window.history.replaceState({}, '', url); });
      return () => { active = false; };
    }
    if (url.searchParams.get('checkout') !== 'success' || !sessionId) return;
    let active = true;
    user.getIdToken()
      .then((token) => fetch(`/api/billing/checkout?session_id=${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${token}` } }))
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setBillingNotice(data.status === 'active'
          ? `Payment confirmed — ${data.tier} plan active with ${data.credits} credits.`
          : 'Payment received. Access is still being confirmed; refresh in a moment.');
      })
      .catch(() => { if (active) setBillingNotice('We could not confirm this payment yet. Refresh in a moment or contact support.'); })
      .finally(() => { url.searchParams.delete('checkout'); url.searchParams.delete('session_id'); window.history.replaceState({}, '', url); });
    return () => { active = false; };
  }, [user]);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  // A different account must not inherit the previous one's image, so drop the file and its measured size together.
  useEffect(() => { setFile(null); setSourceSize(null); }, [user?.uid]);
  useEffect(() => {
    let active = true;
    if (!user) { setHistory([]); setHistoryToken(''); return; }
    user.getIdToken().then(async (token) => {
      if (!active) return;
      setHistoryToken(token);
      const response = await fetch('/api/image-edit/history', { headers: { Authorization: `Bearer ${token}` } });
      const data = response.ok ? await response.json() : null;
      if (active && data?.jobs) setHistory(data.jobs);
    }).catch(() => {});
    return () => { active = false; };
  }, [user?.uid, historyVersion]);
  // A finished generation belongs in the history immediately.
  useEffect(() => { if (generation.operation?.status === 'SUCCEEDED') setHistoryVersion(v => v + 1); }, [generation.operation?.status, generation.operation?.jobId]);
  const checkIn = async () => {
    setCheckingIn(true); setCheckInNotice('');
    const outcome = await dailyCheckIn();
    setCheckInNotice(outcome.success
      ? `${outcome.message} ${t('dashboard.creditsEarned')}`
      : outcome.code === 'already_checked_in' ? t('dashboard.alreadyCheckedIn') : outcome.message);
    setCheckingIn(false);
  };
  const claimShare = async () => {
    if (!user || !shareFile) return;
    setShareBusy(true); setShareNotice('');
    try {
      const result = await claimShareReward(user, shareFile);
      setShareClaimed(true); setShareFile(null);
      setShareNotice(result.granted ? t('dashboard.shareGranted', { count: result.awarded }) : t('dashboard.shareAlready'));
    } catch (cause) {
      setShareNotice(cause instanceof Error ? cause.message : t('dashboard.shareFailed'));
    } finally { setShareBusy(false); }
  };
  const choose = (candidate?: File) => {
    if (!candidate) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(candidate.type) || !candidate.size || candidate.size > MAX_UPLOAD_BYTES) { setFileError('Choose a JPEG, PNG or WebP image up to 20 MiB.'); return; }
    setFileError(''); setFile(candidate); setSourceSize(null);
    // Enhancement is sized from the original pixels, so measure the file as soon as it is picked.
    const url = URL.createObjectURL(candidate);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      setSourceSize({ width: image.naturalWidth, height: image.naturalHeight });
      // The services cap the input at 40 MP; a 48 MP phone photo is only ~15 MiB, so it would pass
      // the size check above and then fail inside the service with no visible reason.
      const tooBig = oversizeNote(image.naturalWidth, image.naturalHeight, mode);
      if (tooBig) { setFileError(tooBig); setFile(null); setSourceSize(null); }
    };
    image.onerror = () => { URL.revokeObjectURL(url); setSourceSize(null); };
    image.src = url;
  };
  /**
   * Signed in: an example becomes the input File and runs like an upload.
   * Signed out: the example is previewed and the server generates it for free from its own catalog.
   */
  const useExample = async (sample: SampleId) => {
    setFileError('');
    sampleRun.reset();
    setSelectedSample(sample);
    setPrompt(SAMPLES[sample].prompt);
    // An example may belong to a tool: picking it also selects the tool it belongs to, and the
    // vectorizer example also selects the preset it was traced with.
    const tool = SAMPLES[sample].tool;
    setMode(tool ?? 'edit');
    if (tool === 'vectorize' && 'preset' in SAMPLES[sample]) setPreset(SAMPLES[sample].preset as VectorizePreset);
    if (!user) return;
    try {
      const response = await fetch(SAMPLES[sample].src);
      if (!response.ok) throw new Error('unavailable');
      const blob = await response.blob();
      choose(new File([blob], SAMPLES[sample].fileName, { type: blob.type || SAMPLES[sample].contentType }));
    } catch {
      setFileError('That example could not be loaded. Choose your own image instead.');
    }
  };
  const openPortal = async () => {
    if (!user) return;
    setBillingNotice('Opening the billing portal…');
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/billing/portal', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.url) throw new Error(data.error || 'The billing portal is unavailable right now.');
      window.location.assign(data.url);
    } catch (cause) {
      setBillingNotice((cause as Error).message);
    }
  };
  const result = generation.operation?.outputUrl;
  const locked = generation.busy || generation.pending || !!result;
  const enhance = mode === 'enhance' && sourceSize ? enhanceOutput(sourceSize.width, sourceSize.height, factor) : null;
  return <>
    <SEO
      title="AI Image Studio — DLSS5NVIDIA"
      description="Private AI image editing workspace for signed-in DLSS5NVIDIA users."
      canonical="/dashboard"
      robots="noindex,nofollow"
    />
    <main className="pt-24 pb-24 px-4 sm:px-6 max-w-[1440px] mx-auto min-h-[80vh]">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-headline font-bold text-white">AI Image Studio</h1><p className="text-zinc-400 text-sm mt-2 max-w-2xl">Edit a photo with a prompt. Independent AI image editing; not NVIDIA DLSS game rendering.</p></div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-4 py-2 bg-surface-low rounded-lg border border-outline-variant/20 text-sm text-zinc-300">{user ? `${profile?.tier ?? 'free'} · ${profile?.credits ?? '—'}${profile?.bonusCredits ? ` + ${profile.bonusCredits} ${t('dashboard.bonusCredits')}` : ''} credits` : 'Sign in to generate'}</span>
        {user && <Link to="/pricing" className="px-4 py-2 rounded-lg border border-primary/40 text-primary text-sm hover:bg-primary/10">{profile?.tier && profile.tier !== 'free' ? 'Change plan' : 'Upgrade'}</Link>}
        {user && profile?.tier && profile.tier !== 'free' && <button onClick={() => void openPortal()} className="px-4 py-2 rounded-lg border border-outline-variant/30 text-zinc-300 text-sm hover:border-primary/40">Manage billing</button>}
      </div>
    </div>
    {billingNotice && <p role="status" className="mb-6 text-sm text-zinc-200 bg-primary/10 border border-primary/25 rounded-lg px-4 py-3">{billingNotice}</p>}
    {user && <section aria-labelledby="share-heading" className="mb-6 bg-surface-low rounded-xl border border-outline-variant/20 p-5">
      <h2 id="share-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400 mb-2">{t('dashboard.shareHeading', { count: SHARE_REWARD.credits })}</h2>
      <p className="text-sm text-zinc-300 max-w-3xl">{t('dashboard.shareBody', { count: SHARE_REWARD.credits })}</p>
      <input ref={shareInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label={t('dashboard.shareUpload')} onChange={e => { setShareFile(e.target.files?.[0] ?? null); setShareNotice(''); e.target.value = ''; }} className="sr-only"/>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button type="button" onClick={() => shareInput.current?.click()} className="px-4 py-3 rounded-lg border border-outline-variant/30 text-white">{shareFile ? `${shareFile.name} · ${(shareFile.size / 1024).toFixed(0)} KB` : t('dashboard.shareUpload')}</button>
        <button type="button" disabled={!shareFile || shareBusy || shareClaimed} onClick={() => void claimShare()} className="px-5 py-3 rounded-lg bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed">{shareBusy ? t('dashboard.shareUploading') : t('dashboard.shareClaim', { count: SHARE_REWARD.credits })}</button>
        {shareClaimed && <span className="text-sm text-nvidia-green">{t('dashboard.shareAlready')}</span>}
      </div>
      {shareNotice && <p role="status" aria-live="polite" className="text-sm text-nvidia-green mt-3">{shareNotice}</p>}
    </section>}
    {user && <section aria-labelledby="history-heading" className="mb-6 bg-surface-low rounded-xl border border-outline-variant/20 p-5">
      <h2 id="history-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400 mb-3">Your generations</h2>
      {history.length === 0
        ? <p className="text-sm text-zinc-500">Your images stay here after you close the page. Sign in on another device to see the same history.</p>
        : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{history.map(job => <article key={job.id} className="rounded-lg border border-outline-variant/20 p-3 flex flex-col gap-3">
          {job.status === 'SUCCEEDED' && historyToken
            ? <HistoryResult jobId={job.id} token={historyToken} alt={job.prompt || 'Generated image'}/>
            : <div className="aspect-video rounded-lg bg-surface-lowest border border-outline-variant/20 flex items-center justify-center px-3 text-center text-xs text-zinc-500">{job.status === 'FAILED' ? `Failed${job.errorCode ? ` · ${failureNote(job.errorCode, job.tool || 'edit')}` : ''} · credit refunded` : job.status.toLowerCase()}</div>}
          <div className="flex-1">
            <div className="flex justify-between gap-2 text-xs"><span className={job.status === 'SUCCEEDED' ? 'text-nvidia-green' : job.status === 'FAILED' ? 'text-red-300' : 'text-zinc-300'}>{job.status}</span><span className="text-zinc-500">{new Date(job.completedAt || job.createdAt).toLocaleString()}</span></div>
            <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{job.tool ? `${TOOL_LABEL[job.tool as ToolId] ?? job.tool}${job.prompt ? ` · ${job.prompt}` : ''}` : job.prompt || 'Image edit'}</p>
            {job.width ? <p className="text-xs text-zinc-600 mt-1">{job.width} × {job.height}{job.saved ? '' : ' · copy not kept'}</p> : null}
          </div>
        </article>)}</div>}
    </section>}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section aria-labelledby="settings-heading" className="lg:col-span-1 bg-surface-low p-6 rounded-xl border border-outline-variant/20 h-fit space-y-6">
        <h2 id="settings-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400">Generation settings</h2>
        <div><div className="grid grid-cols-2 gap-2">
          {MODES.map(([value, label]) => <button key={value} type="button" onClick={() => setMode(value)} disabled={locked} className={mode === value ? 'bg-primary/15 border border-primary/40 rounded-lg p-3 text-primary font-semibold' : 'bg-surface-highest border border-outline-variant/20 rounded-lg p-3 text-zinc-300 disabled:opacity-60'}>{label}</button>)}
        </div>
          {mode === 'enhance' ? <div className="mt-3">
            <div className="grid grid-cols-2 gap-2">{ENHANCE_FACTORS.map(value => <button key={value} type="button" onClick={() => setFactor(value)} disabled={locked} className={factor === value ? 'bg-primary/20 text-primary border border-primary font-bold rounded-lg py-2 text-sm' : 'bg-surface-highest text-white border border-outline-variant/20 rounded-lg py-2 text-sm disabled:opacity-60'}>{value}×</button>)}</div>
            <p className="text-xs text-zinc-400 mt-2">{enhance
              ? <>Output <span className="text-white">{enhance.width} × {enhance.height}</span>{enhance.clamped ? ` · ${factor}× capped by the model's ${ENHANCE_MAX_EDGE} px edge, ${enhance.factor}× achieved` : ` · ${factor}× the ${sourceSize?.width} × ${sourceSize?.height} original`}</>
              : 'Pick an image first — the output size follows its pixels.'}</p>
            <p className="text-xs text-zinc-500 mt-2">The model re-renders detail at the larger size, so this is AI enhancement rather than a pixel-exact upscale. The instruction is fixed by the server.</p>
          </div> : mode === 'erase' ? <div className="mt-3">
            <label className="block text-xs text-zinc-400 mb-2" htmlFor="erase-steps">Detail steps · {steps}</label>
            <input id="erase-steps" type="range" min={STEPS_RANGE.min} max={STEPS_RANGE.max} step={2} value={steps} disabled={locked} onChange={e => setSteps(Number(e.target.value))} className="w-full accent-[var(--color-primary,#b1fa50)]"/>
            <p className="text-xs text-zinc-400 mt-2">The model rebuilds the whole frame, so the result becomes {ERASE_OUTPUT_EDGE} × {ERASE_OUTPUT_EDGE} and takes {TOOL_SUMMARY.erase.seconds}. More steps refine the rebuilt area and take longer.</p>
          </div> : mode === 'vectorize' ? <div className="mt-3">
            <div className="grid grid-cols-1 gap-2">{VECTORIZE_PRESETS.map(value => <button key={value} type="button" onClick={() => setPreset(value)} disabled={locked} aria-pressed={preset === value} className={preset === value ? 'bg-primary/15 border border-primary/40 rounded-lg px-3 py-2 text-primary font-semibold text-sm text-left' : 'bg-surface-highest border border-outline-variant/20 rounded-lg px-3 py-2 text-zinc-300 text-sm text-left disabled:opacity-60'}>{VECTORIZE_PRESET_LABEL[value]}</button>)}</div>
            <p className="text-xs text-zinc-400 mt-2">{VECTORIZE_PRESET_NOTE[preset]}</p>
            <label className="block text-xs text-zinc-400 mt-3 mb-1" htmlFor="vector-edge">Long edge of the trace</label>
            <div className="grid grid-cols-3 gap-2">{VECTORIZE_EDGES.map(value => <button key={value} type="button" onClick={() => setVectorEdge(value)} disabled={locked} aria-pressed={vectorEdge === value} className={vectorEdge === value ? 'bg-primary/20 text-primary border border-primary font-bold rounded-lg py-2 text-sm' : 'bg-surface-highest text-white border border-outline-variant/20 rounded-lg py-2 text-sm disabled:opacity-60'}>{value} px</button>)}</div>
            <p className="text-xs text-zinc-500 mt-2">A larger image is traced down to this edge; the SVG keeps your colours{sourceSize ? ` (this image is ${sourceSize.width} × ${sourceSize.height})` : ''}.</p>
          </div> : mode === 'cutout' ? <p className="text-xs text-zinc-400 mt-3">The cut keeps your pixel size and returns a transparent PNG. No instruction is needed.</p> : <p className="text-xs text-zinc-400 mt-2">Edit a photo by describing the change you want.</p>}</div>
        {mode === 'edit' || mode === 'erase'
          ? <div><label htmlFor="edit-prompt" className="block text-sm text-white mb-2">{mode === 'erase' ? 'What should be removed?' : 'Describe your edit'}</label><textarea id="edit-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} disabled={locked || !user} maxLength={4000} className="w-full bg-surface-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary h-36 resize-y disabled:opacity-60"/><p className="text-xs text-zinc-400 mt-2">{user ? mode === 'erase' ? 'Name the object to erase. Everything else is asked to stay exactly as it is.' : 'Describe lighting, colors or objects to change. Results may alter details.' : 'Sign in to write your own prompt. Examples run with their own fixed prompt.'}</p></div>
          : <div><p className="text-sm text-white mb-2">{mode === 'cutout' ? 'Background removal' : mode === 'vectorize' ? 'Vectorizing' : 'Enhancement instruction'}</p><p className="text-xs text-zinc-400">{mode === 'cutout' ? 'Fixed by the server: keep the subject, drop the background, return transparency. No prompt needed.' : mode === 'vectorize' ? 'No prompt needed: the preset decides how the pixels are traced. You get an SVG file you can scale to any size and edit in a vector tool.' : 'Fixed by the server: restore realistic detail, texture and sharpness at the target size while keeping the composition identical. No prompt needed.'}</p></div>}
        {user && <div>
          <p className="text-sm text-white mb-2">{t('dashboard.dailyCheckIn')}</p>
          <button type="button" onClick={() => void checkIn()} disabled={checkingIn || !profile || profile.lastCheckIn === new Date().toISOString().slice(0, 10)} className="w-full px-4 py-3 rounded-lg bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"><Gift className="w-4 h-4"/>{profile?.lastCheckIn === new Date().toISOString().slice(0, 10) ? t('dashboard.checkedIn') : checkingIn ? t('dashboard.checkingIn') : t('dashboard.claimCredits')}</button>
          <p className="text-xs text-zinc-400 mt-2">{t('dashboard.checkInReward')}</p>
          {checkInNotice && <p role="status" className="text-xs text-nvidia-green mt-2">{checkInNotice}</p>}
        </div>}
        <div className="text-sm text-zinc-400 space-y-2"><p>{isToolId(mode) ? `${TOOL_SUMMARY[mode].output} · ${inputLimitNote(mode)}` : mode === 'enhance' ? `Output: ${enhance ? `${enhance.width} × ${enhance.height}` : 'follows your image'} · up to ${ENHANCE_MAX_EDGE} px per edge · ${inputLimitNote('enhance')}` : `Output: preserves your image aspect ratio · WebP · ${inputLimitNote('edit')}`}</p>{user ? <p>Cost: 1 credit per task. Confirmed failures are refunded by the server.</p> : <p>Examples are free and need no account. Uploading your own image needs one.</p>}<Link to="/pricing" className="text-primary underline inline-block">View plans</Link></div>
      </section>
      <section aria-label="Image workspace" className="lg:col-span-3 bg-surface-low rounded-xl border border-outline-variant/20 p-4 sm:p-6 flex flex-col min-h-[500px]">
        {(fileError || generation.error) && <div role="alert" className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-300 text-sm"><AlertCircle className="w-5 h-5 shrink-0"/><span>{fileError || generation.error}</span></div>}
        {!user && <div className="mb-4 p-4 rounded-lg bg-primary/10 text-zinc-200 text-sm">The examples below are free and need no account — including the background-removal and vectorizing ones. <Link to="/login" className="text-primary underline">Sign in</Link> to upload your own image and write your own prompt.</div>}
        {sampleRun.state.status === 'error' && <div role="alert" className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-300 text-sm"><AlertCircle className="w-5 h-5 shrink-0"/><span>{sampleRun.state.message}</span></div>}
        {!user && sampleRun.state.status === 'running' && <div role="status" aria-live="polite" className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-primary"/><h2 className="text-xl text-white">Preparing {SAMPLES[sampleRun.state.sample].name.toLowerCase()}…</h2><p className="text-zinc-400 text-sm max-w-md">This example is generated once and then served from cache, so it costs nothing and needs no account.</p></div>}
        {!user && sampleRun.state.status === 'ready' && <div className="flex-1 flex flex-col gap-5">
          <div className="flex-1 min-h-64"><ImageSlider highRes={sampleRun.state.run.result} lowRes={sampleRun.state.run.input} alt={`${SAMPLES[sampleRun.state.sample].name} example`} outputBackdrop={SAMPLES[sampleRun.state.sample].tool === 'cutout' ? '#ffffff' : undefined}/></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-nvidia-green text-sm">Example ready{sampleRun.state.run.cached ? ' · served from cache' : ''}</p>
            <div className="flex flex-wrap gap-3">
              <a href={sampleRun.state.run.result} download={`${sampleRun.state.run.sample}.${sampleRun.state.run.extension}`} className="px-4 py-3 bg-primary text-black font-bold rounded-lg inline-flex items-center gap-2"><Download className="w-4 h-4"/>Download example result</a>
              <button onClick={() => { sampleRun.reset(); setSelectedSample(null); }} className="px-4 py-3 border border-outline-variant/30 rounded-lg text-white">Try another example</button>
              <Link to="/login" className="px-4 py-3 rounded-lg border border-primary/40 text-primary hover:bg-primary/10">Sign in to use your own image</Link>
            </div>
          </div>
        </div>}
        {generation.operation && <div className="mb-4 text-xs text-zinc-400 break-all">Operation: {generation.operation.jobId || generation.operation.key}<br/>Saved on this device. Refreshing will preserve this request.</div>}
        {generation.busy && <div role="status" aria-live="polite" className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-primary"/><h2 className="text-xl text-white">{generation.phase}</h2><p className="text-zinc-400 text-sm">You can leave and return. Do not submit another image for this operation.</p>{!generation.submitting && <button onClick={generation.pause} className="px-4 py-2 border border-outline-variant/30 rounded-lg text-zinc-300">Pause checking</button>}</div>}
        {!generation.busy && generation.pending && <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10"><h2 className="text-white text-xl">Your operation is saved</h2><p className="text-sm text-zinc-400 max-w-md">The result is not confirmed yet. Resume the same operation to check its status without creating a new charge.</p><button onClick={() => void generation.resume()} className="px-6 py-3 bg-primary text-black rounded-lg font-bold">Resume operation</button></div>}
        {!generation.busy && result && <div className="flex-1 flex flex-col gap-5"><div className="flex-1 min-h-64">{preview ? <ImageSlider highRes={result} lowRes={preview} alt="Your AI image edit" outputBackdrop={generation.operation?.body.mode === 'cutout' ? '#ffffff' : undefined}/> : <img src={result} alt="Completed AI image edit" className="max-h-[600px] w-full object-contain rounded-lg"/>}</div><div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-nvidia-green text-sm">Image ready</p><div className="flex flex-wrap gap-3"><button onClick={() => void generation.resume()} className="text-sm text-zinc-300 px-3 py-2">Refresh result link</button><a href={result} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary text-black font-bold rounded-lg inline-flex items-center gap-2"><Download className="w-4 h-4"/>{generation.operation?.body.mode === 'vectorize' ? 'Open the SVG' : 'Open full image'}</a><button onClick={() => { generation.reset(); setFile(null); }} className="px-4 py-2 border border-outline-variant/30 rounded-lg text-white">New image</button></div></div></div>}
        {!generation.busy && !generation.pending && !result && sampleRun.state.status !== 'running' && sampleRun.state.status !== 'ready' && <div className="flex-1 flex flex-col gap-5 justify-center">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Select an image" onChange={e => { choose(e.target.files?.[0]); e.target.value = ''; }} disabled={!user} className="sr-only"/>
          {user && (preview ? <img src={preview} alt="Selected image preview" className="w-full max-h-[480px] object-contain rounded-lg"/> : <button type="button" onClick={() => input.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }} className="w-full min-h-[300px] border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary p-5"><UploadCloud className="w-12 h-12 text-zinc-400"/><span className="text-xl text-white">Drop an image or browse files</span><span className="text-sm text-zinc-400">JPEG, PNG or WebP · up to 20 MiB</span></button>)}
          {!user && (selectedSample ? <img src={SAMPLES[selectedSample].src} alt={`${SAMPLES[selectedSample].name} preview`} className="w-full max-h-[480px] object-contain rounded-lg"/> : <Link to="/login" className="w-full min-h-[300px] border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary p-5"><UploadCloud className="w-12 h-12 text-zinc-400"/><span className="text-xl text-white">Uploading your own image needs an account</span><span className="text-sm text-primary">Sign in to upload · or try an example below for free</span></Link>)}
          {!file && <div className="pt-1"><h3 className="text-xs font-label uppercase tracking-widest text-zinc-400 mb-3 text-center">Or try these examples</h3><div className="grid grid-cols-2 gap-4 max-w-md mx-auto">{(user ? SAMPLE_IDS : GUEST_SAMPLE_IDS).map(id => <button key={id} type="button" onClick={() => void useExample(id)} className={`relative aspect-video rounded-lg overflow-hidden border transition-all group ${selectedSample === id ? 'border-primary' : 'border-outline-variant/20 hover:border-primary'}`}><img src={SAMPLES[id].src} alt={SAMPLES[id].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/><span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-xs font-bold text-white">{SAMPLES[id].name}</span></button>)}</div></div>}
          {user && file && <div className="flex flex-wrap items-center gap-3"><span className="text-xs text-zinc-400 break-all flex-1">{file.name}{mode === 'enhance' && enhance ? ` · ${enhance.width} × ${enhance.height}` : ''}</span><button onClick={() => { setFile(null); setSourceSize(null); setFileError(''); }} className="px-4 py-3 rounded-lg border border-outline-variant/30 text-white">Clear image</button><button disabled={!profile || ((mode === 'edit' || mode === 'erase') && !prompt.trim()) || (mode === 'enhance' && !sourceSize)} onClick={() => { if (generation.operation?.status === 'FAILED') generation.reset(); void generation.submit(file, prompt, { mode, factor, source: sourceSize || undefined, steps, preset, maxEdge: vectorEdge }); }} className="px-5 py-3 rounded-lg bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed">{generation.operation?.status === 'FAILED' ? 'Retry · 1 credit' : isToolId(mode) ? `${TOOL_SUMMARY[mode].short} · 1 credit` : mode === 'enhance' ? `Enhance · 1 credit` : 'Generate · 1 credit'}</button></div>}
          {!user && selectedSample && <div className="flex flex-wrap items-center gap-3"><span className="text-xs text-zinc-400 flex-1">{SAMPLES[selectedSample].name}</span><Link to="/login" className="px-4 py-3 rounded-lg border border-outline-variant/30 text-zinc-300">Sign in to edit the prompt</Link><button onClick={() => void sampleRun.run(selectedSample)} className="px-5 py-3 rounded-lg bg-primary text-black font-bold">Run this example · free</button></div>}
        </div>}
      </section>
    </div>
    </main>
  </>;
}
