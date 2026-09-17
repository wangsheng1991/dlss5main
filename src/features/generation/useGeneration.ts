import { useEffect, useRef, useState } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { request } from './client';
import { clearOperation, readOperation, saveOperation, terminal, type GenerationBody, type SavedOperation } from './operation';
import { enhanceOutput, type EnhanceFactor } from '../../config/enhance';
const queryClient = new QueryClient();
/** A queued task can wait minutes on the provider's spare machines, so keep polling well past that. */
const POLL_BUDGET_MS = 600000;
/** Natural pixel size of the picked file, used to size an enhancement. */
const measureImage = (file: File) => new Promise<{ width: number; height: number }>((resolve, reject) => {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => { URL.revokeObjectURL(url); resolve({ width: image.naturalWidth, height: image.naturalHeight }); };
  image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be read. Try another file.')); };
  image.src = url;
});
export function useGeneration(user: User | null) {
  const [operation, setOperation] = useState<SavedOperation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('');
  const [paused, setPaused] = useState(false);
  const active = useRef(false);
  const uid = useRef(user?.uid); uid.current = user?.uid;
  const pollingStarted = useRef(Date.now());
  const query = useQuery({
    queryKey: ['generation', user?.uid, operation?.jobId],
    enabled: !!user && !!operation?.jobId && !terminal(operation.status) && !paused,
    queryFn: async () => {
      const saved = operation!;
      const data = await request(`/api/image-edit/jobs/${encodeURIComponent(saved.jobId!)}`, await user!.getIdToken());
      const outputUrl = data.result?.images?.[0]?.url;
      if (data.status === 'SUCCEEDED' && !outputUrl) throw new Error('Result link is not ready. Resume to refresh it.');
      const next = { ...saved, status: data.status, outputUrl };
      saveOperation(next);
      if (uid.current === saved.userId) setOperation(next);
      return data;
    },
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000),
    refetchInterval: query => terminal(query.state.data?.status) || query.state.status === 'error' || Date.now() - pollingStarted.current > POLL_BUDGET_MS ? false : 2000,
    refetchOnWindowFocus: false,
  }, queryClient);
  useEffect(() => {
    setOperation(null); setError(''); setPaused(false); pollingStarted.current = Date.now();
    if (!user) return;
    try { setOperation(readOperation(user.uid)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Cannot restore saved operation.'); }
  }, [user?.uid]);
  async function replay(saved: SavedOperation) {
    if (!user || active.current) return;
    active.current = true; setSubmitting(true); setError(''); setPhase('Confirming saved submission…');
    try {
      const data = await request('/api/image-edit/jobs', await user.getIdToken(), { method: 'POST', headers: { 'Idempotency-Key': saved.key }, body: JSON.stringify(saved.body) });
      if (!data.jobId) throw new Error('Submission response incomplete. Resume the same operation.');
      const next = { ...saved, jobId: data.jobId, status: data.status, outputUrl: data.result?.images?.[0]?.url };
      saveOperation(next);
      if (uid.current === saved.userId) { setOperation(next); setPaused(false); pollingStarted.current = Date.now(); }
    } catch (cause) { if (uid.current === saved.userId) setError(cause instanceof Error ? cause.message : 'Connection interrupted. Resume your saved operation.'); }
    finally { active.current = false; setSubmitting(false); }
  }
  async function submit(file: File, prompt: string, options: { mode?: 'edit' | 'enhance'; factor?: EnhanceFactor; source?: { width: number; height: number } } = {}) {
    if (!user) { setError('Sign in before generating an image.'); return; }
    if (active.current || (operation && !terminal(operation.status))) return;
    active.current = true; setSubmitting(true); setError('');
    try {
      const enhancing = options.mode === 'enhance';
      if (!enhancing && !prompt.trim()) throw new Error('Describe the edit you want to make.');
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024 || !file.size) throw new Error('Use a JPEG, PNG or WebP image up to 20 MiB.');
      const existing = readOperation(user.uid);
      if (existing && !terminal(existing.status)) { setOperation(existing); throw new Error('An operation is already saved. Resume it first.'); }
      localStorage.setItem(`dlss:storage-check:${user.uid}`, '1'); localStorage.removeItem(`dlss:storage-check:${user.uid}`);
      const source = enhancing ? options.source || await measureImage(file) : null;
      setPhase('Uploading image…');
      const ticket = await request('/api/image-edit/upload', await user.getIdToken(), { method: 'POST', body: JSON.stringify({ fileName: file.name, contentType: file.type, size: file.size }) });
      const upload = await fetch(ticket.upload_url, { method: 'PUT', headers: ticket.headers, body: file, signal: AbortSignal.timeout(120000) });
      if (!upload.ok) throw new Error('Image upload failed. No generation was submitted.');
      if (uid.current !== user.uid) throw new Error('Account changed. Sign in again before submitting.');
      const body: GenerationBody = enhancing && source
        ? { prompt: '', image_ids: [ticket.file_id], ...enhanceOutput(source.width, source.height, options.factor === 4 ? 4 : 2), output_format: 'webp', mode: 'enhance', factor: options.factor === 4 ? 4 : 2, source_width: source.width, source_height: source.height }
        : { prompt: prompt.trim(), image_ids: [ticket.file_id], width: 1024, height: 1024, output_format: 'webp', mode: 'edit' };
      const saved: SavedOperation = { version: 1, userId: user.uid, key: crypto.randomUUID(), body, createdAt: new Date().toISOString() };
      saveOperation(saved); setOperation(saved); active.current = false; await replay(saved);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not upload your image.'); }
    finally { active.current = false; setSubmitting(false); }
  }
  const resume = async () => {
    if (!operation) return;
    setError(''); pollingStarted.current = Date.now(); setPaused(false);
    if (!operation.jobId || operation.status === 'SUBMISSION_UNCERTAIN') await replay(operation);
    else await query.refetch();
  };
  const pending = !!operation && !terminal(operation.status);
  const waiting = pending && !!operation.jobId && !paused && !query.isError && Date.now() - pollingStarted.current <= POLL_BUDGET_MS;
  const statusText = operation?.status === 'SUBMISSION_UNCERTAIN' ? 'Confirming submission. Resume safely with the same saved request.' : operation?.status === 'QUEUED' ? 'Queued — waiting for processing.' : 'Processing your image…';
  const failure = operation?.status === 'FAILED' ? (query.data?.refunded ? 'Generation failed. Your credit has been refunded.' : 'Generation failed. Check your balance; refund reconciliation may still be pending.') : '';
  return { operation, busy: submitting || waiting, submitting, pending, error: error || query.error?.message || failure, phase: submitting ? phase : statusText, submit, resume,
    pause: () => setPaused(true),
    reset: () => { if (user && terminal(operation?.status)) { clearOperation(user.uid); setOperation(null); setError(''); queryClient.removeQueries({ queryKey: ['generation', user.uid] }); } },
  };
}
