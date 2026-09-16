import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';
import { useAuth } from '../contexts/AuthContext';
import { useGeneration } from '../features/generation/useGeneration';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const generation = useGeneration(user);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [prompt, setPrompt] = useState('Make the lighting more natural and preserve the composition.');
  const [history, setHistory] = useState<Array<{ id: string; status: string; prompt: string; createdAt: number }>>([]);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  useEffect(() => { setFile(null); }, [user?.uid]);
  useEffect(() => { let active = true; if (!user) { setHistory([]); return; } user.getIdToken().then(token => fetch('/api/image-edit/history', { headers: { Authorization: `Bearer ${token}` } })).then(r => r.ok ? r.json() : null).then(data => { if (active && data?.jobs) setHistory(data.jobs); }).catch(() => {}); return () => { active = false; }; }, [user?.uid]);
  const choose = (candidate?: File) => {
    if (!candidate) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(candidate.type) || !candidate.size || candidate.size > 20 * 1024 * 1024) { setFileError('Choose a JPEG, PNG or WebP image up to 20 MiB.'); return; }
    setFileError(''); setFile(candidate);
  };
  const result = generation.operation?.outputUrl;
  const locked = generation.busy || generation.pending || !!result;
  return <main className="pt-24 pb-24 px-4 sm:px-6 max-w-[1440px] mx-auto min-h-[80vh]">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-headline font-bold text-white">AI Image Studio</h1><p className="text-zinc-400 text-sm mt-2 max-w-2xl">Edit a photo with a prompt. Independent AI image editing; not NVIDIA DLSS game rendering.</p></div>
      <span className="px-4 py-2 bg-surface-low rounded-lg border border-outline-variant/20 text-sm text-zinc-300">{user ? `${profile?.credits ?? '—'} credits` : 'Sign in to generate'}</span>
    </div>
    {user && history.length > 0 && <section aria-labelledby="history-heading" className="mb-6 bg-surface-low rounded-xl border border-outline-variant/20 p-5"><h2 id="history-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400 mb-3">Recent generations</h2><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{history.map(job => <div key={job.id} className="rounded-lg border border-outline-variant/20 p-3"><div className="flex justify-between gap-2 text-xs"><span className="text-zinc-300">{job.status}</span><span className="text-zinc-500">{new Date(job.createdAt).toLocaleDateString()}</span></div><p className="text-sm text-zinc-400 mt-2 line-clamp-2">{job.prompt || 'Image edit'}</p></div>)}</div></section>}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section aria-labelledby="settings-heading" className="lg:col-span-1 bg-surface-low p-6 rounded-xl border border-outline-variant/20 h-fit space-y-6">
        <h2 id="settings-heading" className="text-xs font-label uppercase tracking-widest text-zinc-400">Generation settings</h2>
        <div><div className="bg-primary/15 border border-primary/30 rounded-lg p-3 text-primary font-semibold">Image editing</div><p className="text-xs text-zinc-400 mt-2">True 2× / 4× super resolution is not available with this model.</p></div>
        <div><label htmlFor="edit-prompt" className="block text-sm text-white mb-2">Describe your edit</label><textarea id="edit-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} disabled={locked} maxLength={4000} className="w-full bg-surface-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary h-36 resize-y disabled:opacity-60"/><p className="text-xs text-zinc-400 mt-2">Describe lighting, colors or objects to change. Results may alter details.</p></div>
        <div className="text-sm text-zinc-400 space-y-2"><p>Output: 1024 × 1024 · WebP</p><p>Cost: 1 credit per task. Confirmed failures are refunded by the server.</p><Link to="/pricing" className="text-primary underline inline-block">View plans</Link></div>
      </section>
      <section aria-label="Image workspace" className="lg:col-span-3 bg-surface-low rounded-xl border border-outline-variant/20 p-4 sm:p-6 flex flex-col min-h-[500px]">
        {(fileError || generation.error) && <div role="alert" className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-300 text-sm"><AlertCircle className="w-5 h-5 shrink-0"/><span>{fileError || generation.error}</span></div>}
        {!user && <div className="mb-4 p-4 rounded-lg bg-primary/10 text-zinc-200 text-sm">You can preview an image before signing in. <Link to="/login" className="text-primary underline">Sign in to generate</Link>.</div>}
        {generation.operation && <div className="mb-4 text-xs text-zinc-400 break-all">Operation: {generation.operation.jobId || generation.operation.key}<br/>Saved on this device. Refreshing will preserve this request.</div>}
        {generation.busy && <div role="status" aria-live="polite" className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-primary"/><h2 className="text-xl text-white">{generation.phase}</h2><p className="text-zinc-400 text-sm">You can leave and return. Do not submit another image for this operation.</p>{!generation.submitting && <button onClick={generation.pause} className="px-4 py-2 border border-outline-variant/30 rounded-lg text-zinc-300">Pause checking</button>}</div>}
        {!generation.busy && generation.pending && <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10"><h2 className="text-white text-xl">Your operation is saved</h2><p className="text-sm text-zinc-400 max-w-md">The result is not confirmed yet. Resume the same operation to check its status without creating a new charge.</p><button onClick={() => void generation.resume()} className="px-6 py-3 bg-primary text-black rounded-lg font-bold">Resume operation</button></div>}
        {!generation.busy && result && <div className="flex-1 flex flex-col gap-5"><div className="flex-1 min-h-64">{preview ? <ImageSlider highRes={result} lowRes={preview}/> : <img src={result} alt="Completed AI image edit" className="max-h-[600px] w-full object-contain rounded-lg"/>}</div><div className="flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-nvidia-green text-sm">Image ready</p><div className="flex flex-wrap gap-3"><button onClick={() => void generation.resume()} className="text-sm text-zinc-300 px-3 py-2">Refresh result link</button><a href={result} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary text-black font-bold rounded-lg inline-flex items-center gap-2"><Download className="w-4 h-4"/>Open full image</a><button onClick={() => { generation.reset(); setFile(null); }} className="px-4 py-2 border border-outline-variant/30 rounded-lg text-white">New image</button></div></div></div>}
        {!generation.busy && !generation.pending && !result && <div className="flex-1 flex flex-col gap-5 justify-center">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Select an image" onChange={e => { choose(e.target.files?.[0]); e.target.value = ''; }} className="sr-only"/>
          {preview ? <img src={preview} alt="Selected image preview" className="w-full max-h-[480px] object-contain rounded-lg"/> : <button type="button" onClick={() => input.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }} className="w-full min-h-[300px] border-2 border-dashed border-outline-variant/40 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary p-5"><UploadCloud className="w-12 h-12 text-zinc-400"/><span className="text-xl text-white">Drop an image or browse files</span><span className="text-sm text-zinc-400">JPEG, PNG or WebP · up to 20 MiB</span></button>}
          {file && <div className="flex flex-wrap items-center gap-3"><span className="text-xs text-zinc-400 break-all flex-1">{file.name}</span><button onClick={() => { setFile(null); setFileError(''); }} className="px-4 py-3 rounded-lg border border-outline-variant/30 text-white">Clear image</button><button disabled={!user || !prompt.trim()} onClick={() => { if (generation.operation?.status === 'FAILED') generation.reset(); void generation.submit(file, prompt); }} className="px-5 py-3 rounded-lg bg-primary text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed">{generation.operation?.status === 'FAILED' ? 'Retry · 1 credit' : 'Generate · 1 credit'}</button></div>}
        </div>}
      </section>
    </div>
  </main>;
}
