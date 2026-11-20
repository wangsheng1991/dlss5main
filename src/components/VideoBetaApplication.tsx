import { useEffect, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { VideoBetaSignIn } from './VideoPreviewContent';
import { request, ApiError } from '../features/generation/client';
import { VIDEO_PREVIEW_COPY, type VideoPreviewLocale } from '../content/videoStudio';
import { VIDEO_BETA_FEATURES } from '../../lib/video-beta-features';

export default function VideoBetaApplication({ locale }: { locale: VideoPreviewLocale }) {
  const { user, loading } = useAuth();
  const { hash, search } = useLocation();
  const zh = locale === 'zh';
  const requestedFeature = new URLSearchParams(search).get('feature');
  const requested = VIDEO_BETA_FEATURES.find(candidate => candidate === requestedFeature);
  const [feature, setFeature] = useState<string>(requested ?? VIDEO_BETA_FEATURES[0]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<'sent' | 'existing' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hash === '#video-beta') document.getElementById('video-beta')?.scrollIntoView();
  }, [hash]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || busy || result) return;
    setBusy(true);
    setError('');
    try {
      const data = await request('/api/studio/request', await user.getIdToken(), {
        method: 'POST',
        body: JSON.stringify({ kind: 'video-beta', feature, note }),
      });
      if (data.ok !== true) throw new Error('Video beta application was not saved');
      setResult(data.alreadyApplied ? 'existing' : 'sent');
    } catch (cause) {
      const missingEmail = cause instanceof ApiError && cause.code === 'email_required';
      setError(missingEmail
        ? (zh ? '请用绑定了邮箱的账号申请。' : 'Use an account with an email address to apply.')
        : (zh ? '未能确认申请已保存，请重试。' : 'We could not confirm that your application was saved. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-zinc-400">{zh ? '正在检查登录状态…' : 'Checking sign-in…'}</p>;
  if (!user) return <VideoBetaSignIn locale={locale} feature={requested} />;
  if (result) return <p role="status" className="font-semibold text-primary">
    {result === 'sent' ? (zh ? '内测申请已提交。发出邀请时，我们会联系你的账号邮箱。' : 'Application submitted. We’ll use your account email if an invitation becomes available.')
      : (zh ? '这个账号已提交过申请，无需重复提交。' : 'This account has already applied. You’re on the list.')}
  </p>;

  return <form onSubmit={submit} className="grid max-w-xl gap-4">
    <label className="grid gap-2 text-sm text-zinc-200">
      {zh ? '最想试哪个工具？' : 'Which tool would you like to try first?'}
      <select value={feature} onChange={event => setFeature(event.target.value)} disabled={busy} className="rounded-lg border border-outline-variant/40 bg-surface-low p-3 text-white">
        {VIDEO_BETA_FEATURES.map(id => <option key={id} value={id}>{VIDEO_PREVIEW_COPY[locale][`/${id}`].heading}</option>)}
      </select>
    </label>
    <label className="grid gap-2 text-sm text-zinc-200">
      {zh ? '你打算怎么用？（可选）' : 'What would you like to use it for? (Optional)'}
      <textarea rows={3} value={note} maxLength={2000} onChange={event => setNote(event.target.value)} disabled={busy} className="rounded-lg border border-outline-variant/40 bg-surface-low p-3 text-white" />
    </label>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button type="submit" disabled={busy} className="w-fit rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-white disabled:opacity-60">
      {busy ? (zh ? '正在提交…' : 'Submitting…') : (zh ? '提交内测申请' : 'Submit beta application')}
    </button>
  </form>;
}
