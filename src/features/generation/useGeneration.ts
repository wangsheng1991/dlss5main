import { useEffect, useRef, useState } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import type { User } from 'firebase/auth';
import { request } from './client';
import { clearOperation, readOperation, saveOperation, terminal, type GenerationBody, type GenerationMode, type SavedOperation } from './operation';
import { enhanceOutput, preserveOutput, type EnhanceFactor } from '../../config/enhance';
import { failureNote, isToolId, MAX_UPLOAD_BYTES, MAX_UPLOAD_MIB, modelForTool, oversizeNote, toolNeedsPrompt, toolNeedsSecondImage, toolTakesSecondImage, TOOL_EXTRA_MAX, TOOL_OPTIONS, TOOL_REFERENCES, type VectorizePreset } from '../../config/tools';
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
  async function submit(file: File, prompt: string, settings: { mode?: GenerationMode; factor?: EnhanceFactor; source?: { width: number; height: number }; steps?: number; preset?: VectorizePreset; maxEdge?: number; second?: File; options?: Record<string, string>; extra?: string } = {}) {
    if (!user) { setError('Sign in before generating an image.'); return; }
    if (active.current || (operation && !terminal(operation.status))) return;
    active.current = true; setSubmitting(true); setError('');
    try {
      const mode = settings.mode || 'edit';
      const enhancing = mode === 'enhance';
      const tool = isToolId(mode) ? mode : null;
      if (!enhancing && !tool && !prompt.trim()) throw new Error('Describe the edit you want to make.');
      if (tool && toolNeedsPrompt(tool) && !prompt.trim()) throw new Error(tool === 'erase' ? 'Describe what should be removed.' : 'Describe what you want to change.');
      if (tool && toolNeedsSecondImage(tool) && !settings.second) throw new Error(`This tool needs two images: ${TOOL_REFERENCES[tool].slots.join(', then ')}.`);
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > MAX_UPLOAD_BYTES || !file.size) throw new Error(`Use a JPEG, PNG or WebP image up to ${MAX_UPLOAD_MIB} MiB.`);
      if (settings.second && (!['image/jpeg', 'image/png', 'image/webp'].includes(settings.second.type) || settings.second.size > MAX_UPLOAD_BYTES || !settings.second.size)) throw new Error(`The second image must also be a JPEG, PNG or WebP up to ${MAX_UPLOAD_MIB} MiB.`);
      const existing = readOperation(user.uid);
      if (existing && !terminal(existing.status)) { setOperation(existing); throw new Error('An operation is already saved. Resume it first.'); }
      localStorage.setItem(`dlss:storage-check:${user.uid}`, '1'); localStorage.removeItem(`dlss:storage-check:${user.uid}`);
      // Measure every mode so normal edits can keep the source geometry as well as HD enhance.
      const source = settings.source || await measureImage(file);
      // The services refuse more than 16 MP (a 48 MP phone photo is only ~15 MiB), and learning that
      // from a failed task costs a queue wait and hides the reason — so refuse it here instead.
      const tooBig = oversizeNote(source.width, source.height, mode);
      if (tooBig) throw new Error(tooBig);
      // The measured size travels with the upload request so the server can apply the same ceiling
      // the browser just did, instead of letting an oversized file reach the provider and fail there.
      const upload = async (candidate: File, dims: { width: number; height: number }) => {
        const ticket = await request('/api/image-edit/upload', await user!.getIdToken(), { method: 'POST', body: JSON.stringify({ fileName: candidate.name, contentType: candidate.type, size: candidate.size, width: dims.width, height: dims.height, model: tool ? modelForTool(tool) : 'flux-klein' }) });
        const put = await fetch(ticket.upload_url, { method: 'PUT', headers: ticket.headers, body: candidate, signal: AbortSignal.timeout(120000) });
        if (!put.ok) throw new Error('Image upload failed. No generation was submitted.');
        return ticket.file_id as string;
      };
      setPhase('Uploading image…');
      const imageIds = [await upload(file, source)];
      // A two-image tool reads its references in order, so the second upload is appended, never swapped.
      if (tool && toolTakesSecondImage(tool) && settings.second) {
        setPhase('Uploading the second image…');
        const secondSource = await measureImage(settings.second);
        if (uid.current !== user.uid) throw new Error('Account changed. Sign in again before submitting.');
        imageIds.push(await upload(settings.second, secondSource));
      }
      if (uid.current !== user.uid) throw new Error('Account changed. Sign in again before submitting.');
      let body: GenerationBody;
      if (tool) {
        // The tool's model decides the output geometry, so no width, height or format is sent: the
        // provider refuses those fields instead of ignoring them.
        body = { image_ids: imageIds, mode: tool };
        if (toolNeedsPrompt(tool)) body.prompt = prompt.trim();
        if (tool === 'erase' && settings.steps) body.num_inference_steps = settings.steps;
        if (tool === 'vectorize') {
          if (settings.preset) body.preset = settings.preset;
          if (settings.maxEdge) body.max_edge = settings.maxEdge;
        }
        // The A-line tools send names, never a prompt: the option tables above are the whole contract,
        // and the default travels explicitly so the page and the task agree on what was chosen.
        for (const spec of TOOL_OPTIONS[tool] || []) {
          const value = settings.options?.[spec.key];
          body[spec.key] = typeof value === 'string' && spec.choices.some(choice => choice.value === value) ? value : spec.default;
        }
        if (tool === 'interior') {
          const extra = (settings.extra || '').trim().slice(0, TOOL_EXTRA_MAX);
          if (extra) body.extra = extra;
        }
      } else {
        const output = enhancing ? enhanceOutput(source.width, source.height, settings.factor === 4 ? 4 : 2) : preserveOutput(source.width, source.height);
        body = enhancing
          ? { prompt: '', image_ids: imageIds, ...output, output_format: 'webp', mode: 'enhance', factor: settings.factor === 4 ? 4 : 2, source_width: source.width, source_height: source.height }
          : { prompt: prompt.trim(), image_ids: imageIds, ...output, output_format: 'webp', mode: 'edit', source_width: source.width, source_height: source.height };
      }
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
  // The provider now reports why a task failed (the gateway used to answer with an empty reason),
  // so a refund comes with the sentence that tells the customer what to change.
  const reason = failureNote(query.data?.error, operation?.body?.mode || 'edit');
  const failure = operation?.status === 'FAILED' ? `${query.data?.refunded ? 'Generation failed. Your credit has been refunded.' : 'Generation failed. Check your balance; refund reconciliation may still be pending.'}${reason ? ` ${reason}` : ''}` : '';
  return { operation, busy: submitting || waiting, submitting, pending, error: error || query.error?.message || failure, phase: submitting ? phase : statusText, submit, resume,
    pause: () => setPaused(true),
    reset: () => { if (user && terminal(operation?.status)) { clearOperation(user.uid); setOperation(null); setError(''); queryClient.removeQueries({ queryKey: ['generation', user.uid] }); } },
  };
}
