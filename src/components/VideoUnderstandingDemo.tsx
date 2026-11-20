import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Braces, Crosshair, ScanLine } from 'lucide-react';
import { HOOP_SOURCE, STREET_SOURCE, STREET_WINDOWS, UNDERSTANDING_MEDIA } from '../content/videoUnderstanding';
import { VIDEO_PREVIEW_COPY, videoBetaHref, type VideoPreviewLocale } from '../content/videoStudio';

export default function VideoUnderstandingDemo({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const sample = STREET_WINDOWS[active];
  const copy = VIDEO_PREVIEW_COPY[locale]['/video-understanding'];

  function seek(index: number) {
    setActive(index);
    if (video.current) video.current.currentTime = STREET_WINDOWS[index].start;
  }

  return <>
    <header className="relative overflow-hidden rounded-3xl border border-lime-300/20 bg-[#121810] px-6 py-9 sm:px-10 sm:py-12"
      style={{ backgroundImage: 'radial-gradient(ellipse at top right, #354a2466, transparent 62%)' }}>
      <p className="inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-3 py-1.5 text-sm font-semibold text-lime-300">
        <ScanLine aria-hidden="true" size={16} />{zh ? 'Studio 视频内测预告' : 'Studio video beta preview'}
      </p>
      <h1 className="mt-4 max-w-4xl font-headline text-4xl font-bold tracking-tight text-white sm:text-6xl">{copy.heading}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-200">{copy.lead}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href={videoBetaHref(locale, 'video-understanding')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-white">
          {zh ? '申请视频内测' : 'Apply for the video beta'}<ArrowRight aria-hidden="true" size={18} />
        </a>
        <a href="#street-demo" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 font-semibold text-white hover:border-primary hover:text-primary">
          {zh ? '查看实测演示' : 'Explore the demo'}<ArrowDown aria-hidden="true" size={17} />
        </a>
      </div>
    </header>

    <section id="street-demo" aria-labelledby="street-demo-title" className="mt-10 scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-[#151815]">
      <div className="px-5 py-6 sm:px-8">
        <h2 id="street-demo-title" className="font-headline text-2xl font-bold text-white sm:text-3xl">{zh ? '一段路口视频，拆成可检查的时间轴' : 'Review a street scene one window at a time'}</h2>
        <p className="mt-2 leading-relaxed text-zinc-300">{zh ? '点一个时间段，视频会跳到对应位置，下方显示该段原始 JSON。' : 'Choose a time window to seek the video and inspect the model’s original JSON for that segment.'}</p>
      </div>
      <div className="grid items-start border-t border-white/10 lg:grid-cols-[1.5fr_1fr]">
        <figure className="min-w-0">
          <video ref={video} controls muted playsInline preload="metadata" poster={UNDERSTANDING_MEDIA.poster} src={UNDERSTANDING_MEDIA.street}
            aria-label={zh ? '路口时间轴演示，无音轨' : 'Street-scene timeline demo, silent'}
            onTimeUpdate={event => {
              const time = event.currentTarget.currentTime;
              const next = STREET_WINDOWS.findIndex(window => time >= window.start && time < window.end);
              setActive(next < 0 ? STREET_WINDOWS.length - 1 : next);
            }}
            className="aspect-video w-full bg-black object-contain" />
          <figcaption className="px-5 py-3 text-sm text-zinc-400">
            {zh ? '画面叠加的是模型对人物、汽车和自行车的判断。' : 'The overlays show the model’s predictions for people, cars, and bicycles.'}{' '}
            <a href={STREET_SOURCE} className="text-lime-300 underline underline-offset-4">Mixkit</a>
          </figcaption>
        </figure>
        <div className="min-w-0 border-t border-white/10 px-5 py-5 lg:border-l lg:border-t-0">
          <h3 className="flex items-center gap-2 font-semibold text-white"><Braces aria-hidden="true" className="text-lime-300" size={18} />{zh ? '原始模型输出' : 'Original model output'}</h3>
          <div role="group" aria-label={zh ? '时间段' : 'Time windows'} className="mt-4 grid grid-cols-3 gap-2">
            {STREET_WINDOWS.map((window, index) => <button key={window.start} type="button" aria-pressed={active === index}
              onClick={() => seek(index)} className="whitespace-nowrap rounded-md border border-white/15 px-1 py-2 font-mono text-xs tabular-nums text-zinc-200 hover:border-lime-300 aria-pressed:border-lime-300 aria-pressed:bg-lime-300 aria-pressed:font-bold aria-pressed:text-black">
              {window.start.toFixed(1)}–{window.end.toFixed(1)}s
            </button>)}
          </div>
          <pre lang="zh-CN" className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-black/50 px-4 py-3 text-sm leading-relaxed text-lime-200"><code>{JSON.stringify(JSON.parse(sample.raw), null, 2)}</code></pre>
          {!zh && <p className="mt-3 text-xs leading-relaxed text-zinc-400">Original keys: person count, car present, bicycle present.</p>}
        </div>
      </div>
    </section>

    <section aria-labelledby="hoop-demo-title" className="mt-8 grid overflow-hidden rounded-3xl border border-white/10 bg-[#151815] md:grid-cols-2">
      <figure className="min-w-0 md:order-2">
        <img src={UNDERSTANDING_MEDIA.hoop} alt={zh ? '室外球场实测帧，红框围住篮板和篮筐' : 'Outdoor basketball frame with a red model-predicted box around the backboard and hoop'}
          loading="lazy" decoding="async" className="aspect-video w-full bg-black object-contain" />
        <figcaption className="px-5 py-3 text-sm text-zinc-400">{zh ? '模型预测框 · 素材来源' : 'Model-predicted box · Footage from'}{' '}<a href={HOOP_SOURCE} className="text-lime-300 underline underline-offset-4">Mixkit</a></figcaption>
      </figure>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <Crosshair aria-hidden="true" className="text-lime-300" size={26} />
        <h2 id="hoop-demo-title" className="mt-3 font-headline text-2xl font-bold text-white sm:text-3xl">{zh ? '一句中文，在画面里找到篮筐' : 'Locate the hoop with a Chinese prompt'}</h2>
        <blockquote lang="zh-CN" className="mt-4 w-fit rounded-lg border border-white/15 bg-black/25 px-4 py-2 font-semibold text-white">框出篮筐</blockquote>
        <p className="mt-4 leading-relaxed text-zinc-300">{zh ? '这次实测定位到了篮板和篮筐。远处、被遮挡或画面里不存在的目标仍可能被错判。' : 'In this run, the model located the backboard and hoop. It can still make mistakes when a target is distant, obscured, or absent.'}</p>
      </div>
    </section>

    <section aria-labelledby="review-output-title" className="mt-8 border-y border-white/10 py-7">
      <h2 id="review-output-title" className="font-headline text-xl font-bold text-white">{zh ? '怎样用时间轴核对结果？' : 'How to review the output'}</h2>
      <div className="mt-4 grid gap-4 text-sm leading-relaxed text-zinc-300 sm:grid-cols-3">
        <p>{zh ? '从 0.0–1.5 秒切到 1.5–3.0 秒，原始输出的「有自行车」由 true 变为 false。点对应时间段，就能回看是什么画面让模型作出不同判断。' : 'Compare 0.0–1.5 seconds with 1.5–3.0 seconds. The original bicycle field changes from true to false. Select each window to review the image sequence behind that change.'}</p>
        <p>{zh ? '「人数」里的 20/20+ 是模型返回的分类。整理素材时，可以用这种字段先把片段归组，再回看原片，核对人数或标记容易误判的画面。' : 'The 20/20+ value is the category returned in the person-count field. When organizing footage, fields like this can help group clips for review. Check the original footage for an exact count or an ambiguous case.'}</p>
        <p>{zh ? '篮筐红框属于单帧定位示例。用这种结果做素材标注时，可以先检查目标是不是框对了，再决定是否把这帧留进素材库。' : 'The hoop box shows localization on a single frame. In a footage-review workflow, the next step would be to confirm the target and the box before keeping that frame as a reference.'}</p>
      </div>
    </section>

    <section aria-labelledby="understanding-limits-title" className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-surface-low p-6 sm:grid-cols-2 sm:p-8">
      <div>
        <h2 id="understanding-limits-title" className="font-headline text-xl font-bold text-white">{zh ? '这批演示从哪里来？' : 'Where these examples come from'}</h2>
        <p className="mt-2 leading-relaxed text-zinc-300">{copy.details}</p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{zh ? '原型分析画面，当前不分析音轨。结构化结果在实际使用前需要核对。' : 'The prototype analyzes visuals only. Review the structured output before relying on it.'}</p>
      </div>
      <div className="border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <h2 className="font-headline text-xl font-bold text-white">{zh ? '自动高光剪辑 · 即将上线' : 'Automatic highlights · Coming soon'}</h2>
        <a href={videoBetaHref(locale, 'video-understanding')} className="mt-4 inline-flex items-center gap-2 font-semibold text-lime-300 hover:underline">
          {zh ? '申请视频内测' : 'Apply for the video beta'}<ArrowRight aria-hidden="true" size={16} />
        </a>
      </div>
    </section>
  </>;
}
