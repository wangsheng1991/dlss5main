import { useRef, useState, type SyntheticEvent } from 'react';
import { ArrowRight, Clapperboard, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HIGHLIGHTS_MEDIA, HIGHLIGHT_WINDOWS } from '../content/videoHighlights';
import { STREET_SOURCE } from '../content/videoUnderstanding';
import { VIDEO_PREVIEW_COPY, videoBetaHref, videoPreviewPath, type VideoPreviewLocale } from '../content/videoStudio';

type ClipMode = 'edit' | 'source';
const EDIT_COUNT = HIGHLIGHT_WINDOWS.filter(clip => clip.editStart !== null).length;

export default function VideoHighlightsDemo({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  const copy = VIDEO_PREVIEW_COPY[locale]['/video-highlights'];
  const [mode, setMode] = useState<ClipMode>('edit');
  const [active, setActive] = useState(0);
  const player = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const previewFrame = useRef<HTMLElement>(null);

  function seek(nextMode: ClipMode, target: number, index: number) {
    setActive(index);
    if (mode === nextMode && player.current?.readyState) {
      player.current.currentTime = target;
      return;
    }
    pendingSeek.current = target;
    setMode(nextMode);
  }

  function loadPosition(event: SyntheticEvent<HTMLVideoElement>) {
    if (pendingSeek.current === null) return;
    event.currentTarget.currentTime = pendingSeek.current;
    pendingSeek.current = null;
  }

  function updatePosition(event: SyntheticEvent<HTMLVideoElement>) {
    if (pendingSeek.current !== null) return;
    const time = event.currentTarget.currentTime;
    const clip = HIGHLIGHT_WINDOWS.find(window => {
      const start = mode === 'source' ? window.start : window.editStart;
      return start !== null && start <= time && time < start + window.end - window.start;
    });
    setActive(clip?.index ?? -1);
  }

  const labels = {
    edit: zh ? '高光剪辑 · 13.5 秒' : 'Highlight edit · 13.5 s',
    source: zh ? '原片 · 19.8 秒' : 'Source clip · 19.8 s',
  };

  return <>
    <header className="grid gap-8 border-y border-outline-variant/25 py-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-11">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Scissors aria-hidden="true" size={17} />{zh ? '视频工作台 · 即将上线' : 'Video Studio · Coming soon'}</p>
        <h1 className="mt-3 font-headline text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">{copy.heading}</h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-200">{copy.lead}</p>
        <p className="mt-3 leading-relaxed text-zinc-400">{copy.details}</p>
        <a href={videoBetaHref(locale, 'video-highlights')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black hover:bg-white">
          {zh ? '申请高光内测' : 'Apply for the highlights beta'}<ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
      <figure ref={previewFrame} className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-lime-300/25 bg-[#131a13]">
        <div role="group" aria-label={zh ? '选择视频版本' : 'Choose video version'} className="flex flex-wrap gap-1 p-2">
          {(['edit', 'source'] as const).map(item => <button key={item} type="button" aria-pressed={mode === item}
            className="rounded-md px-3 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white aria-pressed:bg-primary aria-pressed:text-black"
            onClick={() => { if (mode !== item) seek(item, 0, 0); }}>{labels[item]}</button>)}
        </div>
        <video key={mode} ref={player} controls muted playsInline preload="metadata" poster={mode === 'edit' ? HIGHLIGHTS_MEDIA.poster : undefined}
          src={HIGHLIGHTS_MEDIA[mode]} className="aspect-video w-full bg-black"
          aria-label={labels[mode]} onLoadedMetadata={loadPosition} onTimeUpdate={updatePosition} />
        <figcaption className="px-4 py-3 text-sm leading-relaxed text-zinc-300">
          {zh ? '本地原型的保存结果。可以切回原片，看看剪辑里保留和略过了什么。' : 'Saved local prototype output. Switch to the source to see what the edit kept and skipped.'}
        </figcaption>
      </figure>
    </header>

    <section aria-labelledby="highlight-timeline-heading" className="mt-10 rounded-2xl border border-outline-variant/35 bg-[#151914] p-5 sm:p-7">
      <p className="flex items-center gap-2 text-sm font-semibold text-lime-300"><Clapperboard aria-hidden="true" size={17} />{zh ? '路口实测' : 'Street-scene test'}</p>
      <h2 id="highlight-timeline-heading" className="mt-2 font-headline text-2xl font-bold text-white">{zh ? '逐段核对剪辑取舍' : 'Check what each cut kept'}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
        {zh ? `记录了 ${HIGHLIGHT_WINDOWS.length} 个时间窗，其中 ${EDIT_COUNT} 个拼成演示。点击保留段跳到剪辑中对应的位置，点击略过段会切回原片。`
          : `The prototype logged ${HIGHLIGHT_WINDOWS.length} time windows and joined ${EDIT_COUNT} into the edit. Choose a kept window to seek within the edit, or a skipped window to jump to its source footage.`}
      </p>
      <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
        {HIGHLIGHT_WINDOWS.map(clip => {
          const kept = clip.editStart !== null;
          return <li key={clip.index}>
            <button type="button" aria-pressed={active === clip.index} data-clip={clip.index}
              onClick={event => {
                seek(kept ? 'edit' : 'source', clip.editStart ?? clip.start, clip.index);
                if (event.detail > 0) previewFrame.current?.scrollIntoView({ block: 'nearest' });
              }}
              className={`flex min-h-14 w-full flex-col justify-center rounded-lg border px-2 py-2 text-left text-xs tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 aria-pressed:ring-2 aria-pressed:ring-lime-300 ${kept ? 'border-lime-300/20 bg-lime-300/10 text-lime-100 hover:bg-lime-300/20' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'}`}>
              <span className="whitespace-nowrap font-semibold">{clip.start.toFixed(1)}–{clip.end.toFixed(1)} {zh ? '秒' : 's'}</span>
              <span className="mt-1">{kept ? (zh ? '保留' : 'Kept') : (zh ? '略过' : 'Skipped')}</span>
            </button>
          </li>;
        })}
      </ol>
      <p className="mt-5 text-sm leading-relaxed text-zinc-400">
        {zh ? '这些是当次原型的候选判定。原始提示词和判定模型版本尚未随样片保存，准确率也未评估。上线前还需验证长片、切镜和片段边界。' : 'These are candidate decisions from one prototype run. Its original prompt and model version were not recorded with the clip, and accuracy has not been evaluated. Longer footage, scene changes and cut boundaries still need testing.'}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a href={STREET_SOURCE} className="text-lime-300 underline underline-offset-4">{zh ? '素材来源 · Mixkit #4401' : 'Footage source · Mixkit #4401'}</a>
        <Link to={videoPreviewPath('/video-understanding', locale)} className="text-lime-300 underline underline-offset-4">{zh ? '查看视频理解与原始 JSON' : 'See video understanding and raw JSON'}</Link>
      </div>
    </section>
  </>;
}
