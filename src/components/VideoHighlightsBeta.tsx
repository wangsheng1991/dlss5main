import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError, request } from '../features/generation/client';
import { HIGHLIGHTS_EVENTS, HIGHLIGHTS_MAX_BYTES, type HighlightsEvent, type HighlightsSegment } from '../../lib/video-highlights-beta';
import { videoPreviewPath, type VideoPreviewLocale } from '../content/videoStudio';

type Job = {
  id: string; status: 'upload' | 'queued' | 'running' | 'ready' | 'failed' | 'done' | 'discarded';
  phase: 'analyze' | 'export'; segments: HighlightsSegment[]; downloadUrl?: string; previewUrl?: string; error?: string; uploadSize?: number;
};
const labels = { en: ['Vehicle', 'Person', 'Bus'], zh: ['车辆', '人物', '公交车'] };

export default function VideoHighlightsBeta({ locale }: { locale: VideoPreviewLocale }) {
  const { user, loading } = useAuth();
  const { hash } = useLocation();
  const zh = locale === 'zh';
  const [access, setAccess] = useState<'available' | 'offline' | 'verify-email' | 'invite' | null>(null);
  const [connectionAttempt, setConnectionAttempt] = useState(0);
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
    }).catch(cause => {
      if (active) setAccess(cause instanceof ApiError && cause.status === 403
        ? (cause.code === 'email_unverified' ? 'verify-email' : 'invite') : 'offline');
    });
    return () => { active = false; };
    // Each account gets an independent beta session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, connectionAttempt]);

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

  async function putVideo(ticket: { uploadUrl: string; headers: Record<string, string> }, source: File) {
    const response = await fetch(ticket.uploadUrl, {
      method: 'PUT', headers: { ...ticket.headers, 'Content-Type': 'video/mp4' }, body: source, signal: AbortSignal.timeout(90000),
    });
    // An upload may have completed even if the browser lost its response.
    // In that case the write-once precondition fails and submit verifies the stored object.
    if (!response.ok && response.status !== 412) throw new Error('upload');
  }

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
      const ticket = await call('upload', { size: file.size, event });
      setJob({ id: ticket.id, status: 'upload', phase: 'analyze', segments: [], uploadSize: file.size });
      await putVideo(ticket, file);
      await call('submit', { id: ticket.id });
      setJob({ id: ticket.id, status: 'queued', phase: 'analyze', segments: [] });
    } catch (cause) {
      try {
        const recent = await call('recent');
        if (recent.id) setJob(await call('status', { id: recent.id }));
      } catch {
        // Keep the known job in place when the network is still unavailable.
      }
      if (cause instanceof ApiError && cause.code === 'worker_offline') {
        setAccess('offline');
        setError(zh ? '处理节点暂不可用，请稍后重查连接。' : 'The processing worker is unavailable. Check the connection later.');
      } else if (cause instanceof ApiError && cause.code === 'daily_limit') {
        setError(zh ? '今天的试用次数已用完。' : 'You have reached today’s trial limit.');
      } else if (cause instanceof ApiError && cause.code === 'rate_limit') {
        setError(zh ? '请稍等再提交新任务。' : 'Wait a moment before starting a new job.');
      } else {
        setError(zh ? '上传未能确认，已保存的任务可以继续。' : 'The upload could not be confirmed. You can resume a saved job.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function resumeUpload(source?: File) {
    if (job?.status !== 'upload' || busy) return;
    setBusy(true);
    setError('');
    try {
      if (source) {
        if (!source.name.toLowerCase().endsWith('.mp4') || source.size !== job.uploadSize) {
          setError(zh ? '请选择之前的同一个 MP4 文件。' : 'Choose the same MP4 file as before.');
          return;
        }
        const ticket = await call('retry_upload', { id: job.id, size: source.size });
        if (!ticket.alreadyUploaded) await putVideo(ticket, source);
      }
      await call('submit', { id: job.id });
      setJob(await call('status', { id: job.id }));
    } catch (cause) {
      setError(cause instanceof ApiError && cause.code === 'upload_missing'
        ? (zh ? '文件还没传完，请重新选择原 MP4。' : 'The upload is incomplete. Choose the original MP4 again.')
        : (zh ? '暂时无法继续，请稍后重试。' : 'Unable to resume right now. Try again shortly.'));
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
      setError(zh ? '任务状态可能已变化，请稍等或更新状态。' : 'The job may have changed. Wait a moment or refresh its status.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;
  if (!user) return <p className="mt-4 text-sm text-zinc-300">
    <Link to={'/login?next=' + encodeURIComponent(videoPreviewPath('/video-highlights', locale) + '#highlights-beta')}
      className="text-primary underline underline-offset-4">{zh ? '登录后试用高光剪辑' : 'Sign in to try video highlights'}</Link>
  </p>;
  if (!access) return null;
  if (access === 'verify-email' || access === 'invite') return <p className="mt-4 text-sm text-amber-200">
    {access === 'verify-email'
      ? (zh ? '请先验证邮箱，再重新登录试用。' : 'Verify your email, then sign in again to try the tool.')
      : (zh ? '目前仅向受邀账号开放。' : 'Access is currently limited to invited accounts.')}
  </p>;

  return <section className="mt-10 scroll-mt-24 rounded-2xl border border-primary/35 bg-[#151914] p-5 sm:p-7">
    <h2 className="font-headline text-2xl font-bold text-white">{zh ? '视频高光 · 在线试用' : 'Video highlights · Online trial'}</h2>
    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{zh
      ? '上传你有权处理的 MP4。最长 30 秒，最高 720p，最多 32 MB。原片和成片仅用于本次任务，下载窗口为 24 小时，试用不扣积分，每个账号每天可提交 5 次。'
      : 'Upload an MP4 you have permission to process. Up to 30 seconds, 720p and 32 MB. Files are used for this job, with a 24-hour download window. The trial costs no credits and allows 5 jobs per account per day.'}</p>
    {access === 'offline' && <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-amber-200">
      <p>{zh ? '处理节点暂不可用。已完成的任务仍可查看。' : 'The processing worker is temporarily offline. Completed jobs remain accessible.'}</p>
      <button type="button" className="underline" onClick={() => setConnectionAttempt(attempt => attempt + 1)}>
        {zh ? '重查连接' : 'Check connection again'}
      </button>
    </div>}
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
    {job?.status === 'queued' && <button type="button" disabled={busy} onClick={() => void change('discard')}
      className="mt-2 text-sm text-zinc-300 underline">{zh ? '取消排队' : 'Cancel queued job'}</button>}
    {job?.status === 'failed' && <p role="alert" className="mt-5 text-amber-200">{job.error === 'invalid_media'
      ? (zh ? '无法读取视频。请检查格式、时长和分辨率。' : 'The clip could not be read. Check its format, duration and resolution.')
      : job.error === 'queue_timeout' || job.error === 'worker_lost'
        ? (zh ? '处理等待超时，任务已结束。处理节点恢复后可以重试。' : 'This job timed out. You can start a new job when the worker is available.')
        : (zh ? '处理未完成。请重试，本次未扣积分。' : 'Processing did not complete. You can try again. No credits were charged.')}</p>}
    {job?.status === 'upload' && <div className="mt-5 grid max-w-xl gap-3 text-sm">
      <p className="text-zinc-300">{zh ? '上次上传尚未提交。如果文件已经传完，可直接继续分析。' : 'The previous upload has not been submitted. If it finished uploading, you can resume analysis.'}</p>
      <div className="flex flex-wrap gap-4 text-primary">
        <button type="button" className="underline" disabled={busy} onClick={() => void resumeUpload()}>
          {zh ? '继续分析' : 'Resume analysis'}
        </button>
        <button type="button" className="underline" disabled={busy} onClick={() => void change('discard')}>
          {zh ? '放弃未提交的上传' : 'Discard unfinished upload'}
        </button>
      </div>
      <label className="grid gap-2 text-zinc-300">{zh ? '如果文件未传完，重新选择原 MP4' : 'If the upload did not finish, choose the original MP4 again'}
        <input type="file" accept="video/mp4,.mp4" disabled={busy} className="min-w-0 rounded-lg border border-white/20 p-3"
          onChange={event => {
            const source = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (source) void resumeUpload(source);
          }} />
      </label>
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
    {error && <div className="mt-4 text-sm text-amber-200">
      <p role="alert">{error}</p>
      {job && <button type="button" className="mt-2 underline" disabled={busy} onClick={() => void change('status')}>
        {zh ? '更新任务状态' : 'Refresh job status'}
      </button>}
    </div>}
  </section>;
}
