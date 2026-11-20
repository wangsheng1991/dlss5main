import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { request } from '../features/generation/client';
import { HIGHLIGHTS_EVENTS, HIGHLIGHTS_MAX_BYTES, type HighlightsEvent, type HighlightsSegment } from '../../lib/video-highlights-beta';
import { videoPreviewPath, type VideoPreviewLocale } from '../content/videoStudio';

type Job = {
  id: string; status: 'upload' | 'queued' | 'running' | 'ready' | 'failed' | 'done' | 'discarded';
  phase: 'analyze' | 'export'; segments: HighlightsSegment[]; downloadUrl?: string; previewUrl?: string; error?: string;
};
const labels = { en: ['Vehicle', 'Person', 'Bus'], zh: ['车辆', '人物', '公交车'] };

export default function VideoHighlightsBeta({ locale }: { locale: VideoPreviewLocale }) {
  const { user, loading } = useAuth();
  const { hash } = useLocation();
  const zh = locale === 'zh';
  const [access, setAccess] = useState<'available' | 'offline' | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [event, setEvent] = useState<HighlightsEvent>('vehicle');
  const [selection, setSelection] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const preview = useRef<HTMLVideoElement>(null);
  const pending = job?.status === 'queued' || job?.status === 'running';
  const canUpload = !job || ['discarded', 'failed', 'done'].includes(job.status);

  async function call(action: string, fields = {}) {
    if (!user) throw new Error('sign-in');
    return request('/api/studio/request', await user.getIdToken(), {
      method: 'POST', body: JSON.stringify({ kind: 'video-highlights-job', action, ...fields }),
    });
  }

  useEffect(() => {
    setAccess(null);
    setJob(null);
    if (!user) return;
    let active = true;
    Promise.all([call('access'), call('recent')]).then(async ([gate, recent]) => {
      const state = recent.id ? await call('status', { id: recent.id }) as Job : null;
      if (active) {
        setAccess(gate.available ? 'available' : 'offline');
        setJob(state);
      }
    }).catch(() => undefined);
    return () => { active = false; };
    // Each account gets an independent beta session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const id = job?.id;
    if (!user || !id || !pending) return;
    let active = true;
    let requesting = false;
    const timer = window.setInterval(async () => {
      if (requesting) return;
      requesting = true;
      try {
        const state = await call('status', { id }) as Job;
        if (active) {
          setError('');
          setJob(state);
        }
      } catch {
        if (active) setError(zh ? '查询暂时失败，页面会再试。' : 'Status check failed. Retrying.');
      } finally {
        requesting = false;
      }
    }, 4000);
    return () => { active = false; window.clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.id, pending, user, zh]);

  useEffect(() => {
    if (access && hash === '#highlights-beta') document.getElementById('highlights-beta')?.scrollIntoView();
  }, [access, hash]);

  useEffect(() => {
    if (job?.status === 'ready') setSelection(job.segments.map((_, index) => index));
  }, [job]);

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (!file || busy || !canUpload || access !== 'available') return;
    if (!file.name.toLowerCase().endsWith('.mp4') || file.size < 1 || file.size > HIGHLIGHTS_MAX_BYTES) {
      setError(zh ? '请选择不超过 32 MB 的 MP4。' : 'Choose an MP4 no larger than 32 MB.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { id, uploadUrl, headers } = await call('upload', { size: file.size, event });
      setJob({ id, status: 'upload', phase: 'analyze', segments: [] });
      const response = await fetch(uploadUrl, { method: 'PUT', headers: { ...headers, 'Content-Type': 'video/mp4' }, body: file, signal: AbortSignal.timeout(90000) });
      if (!response.ok) throw new Error('upload');
      await call('submit', { id });
      setJob({ id, status: 'queued', phase: 'analyze', segments: [] });
    } catch {
      setError(zh ? '上传或排队失败。可重试查询，或放弃未提交的任务。' : 'Upload or queueing failed. Refresh the job status or discard an unfinished upload.');
    } finally {
      setBusy(false);
    }
  }

  async function change(action: 'export' | 'discard' | 'status') {
    if (!job || busy) return;
    setBusy(true);
    setError('');
    try {
      if (action !== 'status') await call(action, { id: job.id, indices: selection });
      setJob(await call('status', { id: job.id }));
    } catch {
      setError(zh ? '这次操作未确认，请刷新任务状态后再试。' : 'Could not confirm the operation. Refresh the status before retrying.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;
  if (!user) return <p className="mt-4 text-sm text-zinc-300">
    <Link to={'/login?next=' + encodeURIComponent(videoPreviewPath('/video-highlights', locale) + '#highlights-beta')}
      className="text-primary underline underline-offset-4">{zh ? '已收到内测邀请？登录试用' : 'Already invited? Sign in to try it'}</Link>
  </p>;
  if (!access) return null;

  return <section id="highlights-beta" className="mt-10 scroll-mt-24 rounded-2xl border border-primary/35 bg-[#151914] p-5 sm:p-7">
    <h2 className="font-headline text-2xl font-bold text-white">{zh ? '视频高光 · 邀请内测' : 'Video highlights · Invite-only beta'}</h2>
    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{zh
      ? '上传你有权处理的 MP4。最长 30 秒，最高 720p，最多 32 MB。原片和成片仅用于本次任务，下载窗口为 24 小时，内测暂不扣积分。'
      : 'Upload an MP4 you have permission to process. Up to 30 seconds, 720p and 32 MB. Files are used for this job, with a 24-hour download window. The beta does not use credits.'}</p>
    {access === 'offline' && <p className="mt-3 text-sm text-amber-200">{zh ? '处理节点暂不可用。已完成的任务仍可查看。' : 'The processing worker is temporarily offline. Completed jobs remain accessible.'}</p>}
    {canUpload && access === 'available' && <form className="mt-5 grid max-w-xl gap-4" onSubmit={upload}>
      <label className="grid gap-2 text-sm text-zinc-200">{zh ? '上传短片' : 'Upload a clip'}
        <input type="file" accept="video/mp4,.mp4" onChange={e => setFile(e.target.files?.[0] ?? null)} disabled={busy} className="min-w-0 rounded-lg border border-white/20 p-3" required />
      </label>
      <label className="grid gap-2 text-sm text-zinc-200">{zh ? '找出有哪类主体的片段？' : 'Which subject should we find?'}
        <select value={event} onChange={e => setEvent(e.target.value as HighlightsEvent)} disabled={busy} className="rounded-lg border border-white/20 bg-[#151914] p-3">
          {HIGHLIGHTS_EVENTS.map((kind, i) => <option key={kind} value={kind}>{labels[locale][i]}</option>)}
        </select>
      </label>
      <button disabled={busy || !file} className="w-fit rounded-lg bg-primary px-4 py-3 font-bold text-black disabled:opacity-60">
        {busy ? (zh ? '正在上传…' : 'Uploading…') : (zh ? '查找候选片段' : 'Find candidate clips')}
      </button>
    </form>}
    {pending && <p role="status" className="mt-5 text-lime-200">{job.phase === 'export'
      ? (zh ? '正在准备导出…' : 'Preparing your export…')
      : (zh ? '正在排队或分析…' : 'Queued or analyzing…')}</p>}
    {job?.status === 'failed' && <p role="alert" className="mt-5 text-amber-200">{job.error === 'invalid_media'
      ? (zh ? '无法读取视频。请检查格式、时长和分辨率。' : 'The clip could not be read. Check its format, duration and resolution.')
      : (zh ? '处理未完成。请重试，内测未扣积分。' : 'Processing did not complete. You can try again. No credits were charged.')}</p>}
    {job?.status === 'upload' && !busy && <div className="mt-5 flex gap-4 text-sm text-primary">
      <button type="button" onClick={() => void change('status')}>{zh ? '刷新状态' : 'Refresh status'}</button>
      <button type="button" onClick={() => void change('discard')}>{zh ? '放弃未提交的上传' : 'Discard unfinished upload'}</button>
    </div>}
    {job?.status === 'ready' && <div className="mt-5 max-w-2xl">
      {job.segments.length === 0 ? <p role="status">{zh ? '本次没有找到符合条件的候选片段。' : 'No matching candidate clips were found.'}</p> : <>
        <video ref={preview} controls playsInline preload="metadata" src={job.previewUrl}
          className="aspect-video w-full rounded-lg bg-black" aria-label={zh ? '回看上传的原片' : 'Review the uploaded source'} />
        <ul className="mt-4 grid gap-2">
          {job.segments.map((segment, index) => <li key={segment.start} className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selection.includes(index)} disabled={busy} onChange={e => {
                setSelection(current => e.target.checked ? [...current, index] : current.filter(id => id !== index));
              }} />
              {segment.start.toFixed(1)}–{segment.end.toFixed(1)} {zh ? '秒' : 's'}
            </label>
            <button type="button" className="text-sm text-primary underline" onClick={() => {
              if (preview.current) preview.current.currentTime = segment.start;
            }}>{zh ? '回看' : 'Preview'}</button>
          </li>)}
        </ul>
        <button type="button" disabled={busy || !selection.length} onClick={() => void change('export')}
          className="mt-4 rounded-lg bg-primary px-4 py-3 font-bold text-black disabled:opacity-60">
          {zh ? '导出选中的片段' : 'Export selected clips'}
        </button>
      </>}
      <button type="button" disabled={busy} onClick={() => void change('discard')} className="ml-4 mt-3 text-sm text-zinc-300 underline">
        {zh ? '放弃本次结果' : 'Discard this result'}
      </button>
    </div>}
    {job?.status === 'done' && <div role="status" className="mt-5 flex flex-wrap gap-4 text-sm">
      <a href={job.downloadUrl} className="font-semibold text-primary underline">{zh ? '下载导出的 MP4' : 'Download the edited MP4'}</a>
      <button type="button" onClick={() => void change('status')} className="text-zinc-300 underline">{zh ? '更新下载链接' : 'Refresh download link'}</button>
    </div>}
    {error && <p role="alert" className="mt-4 text-sm text-amber-200">{error}</p>}
  </section>;
}
