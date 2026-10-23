import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeneration } from '../features/generation/useGeneration';
import { ENHANCE_MAX_EDGE, ENHANCE_FACTORS, type EnhanceFactor } from '../config/enhance';
import { MAX_UPLOAD_MIB } from '../config/tools';
import ImageSlider from './ImageSlider';

const copy = {
  en: {
    heading: 'Enhance your own image here', intro: `JPEG, PNG or WebP, up to ${MAX_UPLOAD_MIB} MiB. This model redraws detail; the longest output edge is capped at ${ENHANCE_MAX_EDGE} px. Target scaling may be reduced to fit.`,
    login: 'Sign in to enhance your image', loginError: 'Sign-in did not complete. Try again.', loading: 'Checking sign-in…',
    file: 'Choose your image', factor: 'Target scale', submit: 'Enhance · 1 credit', balance: 'Available credits', account: 'Account balance is loading. You can still resume a saved task.',
    working: 'Uploading or checking your image task…', resume: 'Resume the same task', paused: 'Checking stopped. Resume the saved task; no new generation will be submitted.',
    failed: 'The task did not complete. Check the same task again below; this does not start another generation. Check your account for any refund.',
    error: 'The request could not complete. If a task is saved, resume it below. Otherwise check the file, sign-in and available credits before retrying.',
    saved: 'Saved task', pause: 'Pause checking', ready: 'Your result is ready', download: 'Download result', downloading: 'Downloading…', downloadError: 'Download failed. Resume the same task to refresh its result link, then try downloading again.',
    refresh: 'Refresh this task’s result link', original: 'Original', result: 'Enhanced', compare: 'Compare original and enhanced image', newImage: 'Start with another image',
    reselect: 'To compare after reopening this page, choose the original image again. It stays on this device and is not resubmitted.', other: 'You have a saved task from another tool. Open the studio to finish it before starting here.', studio: 'Open saved task in studio',
  },
  zh: {
    heading: '在这里增强自己的图片', intro: `支持 JPEG、PNG、WebP，最大 ${MAX_UPLOAD_MIB} MiB。模型会重绘细节，输出最长边上限为 ${ENHANCE_MAX_EDGE} 像素；目标缩放可能因上限而降低。`,
    login: '登录后增强自己的图片', loginError: '登录未完成，请重试。', loading: '正在确认登录状态…',
    file: '选择自己的图片', factor: '目标缩放', submit: '增强 · 1 额度', balance: '可用额度', account: '正在读取账户额度，仍可恢复已保存的任务。',
    working: '正在上传或查询图片任务…', resume: '恢复同一个任务', paused: '查询已停止。恢复已保存的任务，不会提交新的生成请求。',
    failed: '任务未完成。可在下方重新查询同一个任务，不会发起新的生成；退款情况请查看账户额度。',
    error: '请求未完成。若已有任务，请在下方恢复；若尚未保存任务，请先检查图片、登录状态和可用额度再重试。',
    saved: '已保存任务', pause: '暂停查询', ready: '结果已就绪', download: '下载结果', downloading: '正在下载…', downloadError: '下载失败。请恢复同一个任务刷新结果链接，再重试下载。',
    refresh: '刷新该任务的结果链接', original: '原图', result: '增强后', compare: '对比原图和增强后的图片', newImage: '开始处理另一张图片',
    reselect: '重新打开本页后，如需对比，请再次选择原图。图片只用于本机对比，不会重新提交。', other: '你有一个其他工具的已保存任务。请先在工作台处理该任务，再回到这里。', studio: '在工作台打开已保存任务',
  },
};

function SignedInEnhancer({ user, locale }: { user: User; locale: 'en' | 'zh' }) {
  const c = copy[locale];
  const { profile } = useAuth();
  const generation = useGeneration(user);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [factor, setFactor] = useState<EnhanceFactor>(2);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const op = generation.operation;
  const result = op?.status === 'SUCCEEDED' ? op.outputUrl : undefined;
  const other = !!op && op.body.mode !== 'enhance';
  const credits = profile ? profile.credits + (profile.bonusCredits || 0) : null;
  async function download() {
    if (!result || downloading) return;
    setDownloading(true); setDownloadError(false);
    try {
      const response = await fetch(result, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      if (!blob.size || !blob.type.startsWith('image/')) throw new Error('Invalid image');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `enhanced.${blob.type.includes('png') ? 'png' : blob.type.includes('jpeg') ? 'jpg' : 'webp'}`;
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setDownloadError(true); }
    finally { setDownloading(false); }
  }
  if (other) return <div className="mt-4"><p>{c.other}</p><Link className="text-primary underline" to="/dashboard?tool=enhance">{c.studio}</Link></div>;
  return <div className="mt-5 space-y-4" data-own-image-flow>
    <p className="text-sm">{credits === null ? c.account : `${c.balance}: ${credits}`}</p>
    {op && <p className="text-xs break-all" data-clarity-mask="true">{c.saved}: <span data-own-task-id>{op.jobId || op.key}</span></p>}
    {generation.error && <p role="alert" className="text-red-300">{op?.status === 'FAILED' ? c.failed : c.error}</p>}
    {generation.busy && <div role="status"><p>{c.working}</p>{!generation.submitting && <button className="mt-2 underline" type="button" onClick={generation.pause}>{c.pause}</button>}</div>}
    {!generation.busy && op && !result && <div><p>{op.status === 'FAILED' ? c.failed : c.paused}</p><button type="button" data-own-resume onClick={() => void generation.resume()} className="mt-3 rounded-lg bg-primary px-5 py-3 font-bold text-black">{c.resume}</button></div>}
    {(!op || (result && !preview)) && <label className="block">{result ? c.reselect : c.file}<input data-own-file className="mt-2 block w-full min-w-0 text-sm" type="file" accept="image/jpeg,image/png,image/webp" disabled={generation.busy || downloading} onChange={e => { setFile(e.target.files?.[0] || null); setDownloadError(false); }} /></label>}
    {!op && <>
      <label className="block">{c.factor}<select className="ml-3 rounded border border-zinc-600 bg-zinc-950 p-2" value={factor} onChange={e => setFactor(Number(e.target.value) as EnhanceFactor)} disabled={generation.busy}>{ENHANCE_FACTORS.map(f => <option key={f} value={f}>{f}×</option>)}</select></label>
      {preview && <img data-clarity-mask="true" src={preview} alt={c.original} className="max-h-64 max-w-full object-contain" />}
      <button data-own-submit type="button" disabled={!file || generation.busy || credits === null || credits < 1} onClick={() => { if (file) { const uploadFile = new File([file], `enhance-input.${file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp'}`, { type: file.type }); void generation.submit(uploadFile, '', { mode: 'enhance', factor }); } }} className="rounded-lg bg-primary px-5 py-3 font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed">{c.submit}</button>
    </>}
    {result && <div className="space-y-4">
      <p role="status">{c.ready}</p>
      {preview ? <ImageSlider highRes={result} lowRes={preview} alt={c.compare} privacyMask inputLabel={c.original} outputLabel={c.result} compareLabel={c.compare} /> : <img data-clarity-mask="true" src={result} alt={c.result} className="max-h-[600px] max-w-full object-contain" />}
      {downloadError && <p role="alert" className="text-red-300">{c.downloadError}</p>}
      <div className="flex flex-wrap gap-4"><button data-own-download type="button" disabled={downloading} onClick={() => void download()} className="rounded-lg bg-primary px-5 py-3 font-bold text-black">{downloading ? c.downloading : c.download}</button><button type="button" onClick={() => { setDownloadError(false); void generation.resume(); }} className="underline">{c.refresh}</button><button type="button" disabled={downloading} onClick={() => { generation.reset(); setFile(null); setDownloadError(false); }} className="underline">{c.newImage}</button></div>
    </div>}
  </div>;
}

export default function OwnImageEnhancer({ locale }: { locale: 'en' | 'zh' }) {
  const c = copy[locale];
  const { user, loading, signInWithGoogle } = useAuth();
  const [loginError, setLoginError] = useState(false);
  return <section id="own-image" aria-labelledby="own-image-heading" className="mt-10 min-w-0 rounded-2xl border border-primary/30 bg-surface-low p-6 text-zinc-300" style={{ overflowWrap: 'anywhere' }}>
    <h2 id="own-image-heading" className="text-2xl font-bold text-white">{c.heading}</h2><p className="mt-3">{c.intro}</p>
    {loading ? <p role="status">{c.loading}</p> : user ? <React.Fragment key={user.uid}><SignedInEnhancer user={user} locale={locale} /></React.Fragment> : <>
      <button type="button" onClick={() => { setLoginError(false); void signInWithGoogle().catch(() => setLoginError(true)); }} className="mt-5 rounded-lg bg-primary px-5 py-3 font-bold text-black">{c.login}</button>
      {loginError && <p role="alert">{c.loginError}</p>}
    </>}
  </section>;
}
