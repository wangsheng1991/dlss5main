import { useState } from 'react';
import { ArrowDown, ArrowRight, Expand, Film, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  VIDEO_UPSCALE_MEDIA, VIDEO_UPSCALE_SOURCE, VIDEO_UPSCALE_TOPAZ, VIDEO_UPSCALE_WINDOWS,
  videoUpscaleLabCopy, videoUpscaleLabPath,
} from '../content/videoUpscaleLab';
import { videoBetaHref, videoPreviewPath, type VideoPreviewLocale } from '../content/videoStudio';
import { trackEvent } from '../lib/analytics';
import VideoUpscalePlayer from './VideoUpscalePlayer';

export function VideoUpscaleLabLink({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  return <Link to={videoUpscaleLabPath(locale)} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-lime-300/30 bg-lime-300/10 px-4 py-3 font-semibold text-lime-300 hover:border-lime-300">
    <ScanLine size={18} aria-hidden="true" />{zh ? '查看画质对比样片与测试方法' : 'Explore the quality comparison sample'}<ArrowRight size={16} aria-hidden="true" />
  </Link>;
}

export function VideoUpscaleLabContent({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  const copy = videoUpscaleLabCopy(locale);
  const tool = videoPreviewPath('/video-upscaler', locale);
  const [frame, setFrame] = useState(1);
  const [detail, setDetail] = useState(true);
  const kinds = zh ? ['低清输入 · 360p', '标准缩放 · 720p', '高清参照 · 720p'] : ['Low-res input · 360p', 'Standard resize · 720p', 'High-res reference · 720p'];
  const checks = zh ? [
    ['清晰度', '对齐同一帧，查看篮网、篮板边缘和运动主体，再连续播放检查闪烁。'],
    ['速度', '记录从开始到可下载的总时间。单列排队、处理和写出。'],
    ['费用', '按相同输出档位比较用户实付。完整对照完成后公布。'],
  ] : [
    ['Clarity', 'Align the same frame and inspect the net, backboard edges, and moving subjects. Watch full-speed playback for flicker.'],
    ['Speed', 'Time the job from start to downloadable output. Record queueing, processing, and export separately.'],
    ['Cost', 'Compare what a customer pays for the same delivery specification. Publish the figures with the completed comparison.'],
  ];

  return <main className="mx-auto w-full max-w-[1220px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
    <nav aria-label={zh ? '面包屑' : 'Breadcrumb'} className="mb-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
      <Link to={videoPreviewPath('/video-studio', locale)} className="hover:text-lime-300">{zh ? '视频工作台' : 'Video Studio'}</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{zh ? '超分对比预览' : 'Upscaling comparison'}</span>
      <Link to={videoUpscaleLabPath(zh ? 'en' : 'zh')} hrefLang={zh ? 'en' : 'zh-CN'} className="ml-auto text-lime-300 hover:underline">{zh ? 'English' : '中文'}</Link>
    </nav>

    <header className="grid overflow-hidden rounded-3xl border border-lime-300/20 bg-[#121b13] md:grid-cols-[1.04fr_1fr]">
      <div className="self-center p-6 sm:p-10">
        <p className="flex items-center gap-2 text-sm font-semibold text-lime-300"><Film size={17} aria-hidden="true" />{copy.label}</p>
        <h1 className="mt-4 max-w-xl font-headline text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">{copy.heading}</h1>
        <p className="mt-5 max-w-xl leading-relaxed text-zinc-200">{copy.lead}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#upscale-sample" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black hover:bg-white">{zh ? '查看同帧样例' : 'Inspect the same frame'}<ArrowDown size={17} aria-hidden="true" /></a>
          <Link to={tool} onClick={() => trackEvent('tool_cta_click', { surface: 'video_upscale_comparison', tool: 'video-upscaler' })}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 font-semibold text-white hover:border-lime-300">{zh ? '前往超分工具页' : 'Open the upscaler'}<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
      <VideoUpscalePlayer locale={locale} />
    </header>

    <section id="upscale-sample" aria-labelledby="upscale-sample-title" className="mt-9 scroll-mt-28 rounded-3xl border border-white/10 bg-[#141715] p-5 sm:p-7">
      <h2 id="upscale-sample-title" className="font-headline text-2xl font-bold text-white">{zh ? '画质检查台' : 'Frame inspection'}</h2>
      <p className="mt-2 max-w-3xl text-zinc-300">{zh ? '三栏使用同一时间点和取景。标准缩放采用双三次插值。Topaz 与 Studio AI 成片尚未完成可公开的同源对照。' : 'All three views use the same time and crop. The standard resize uses bicubic scaling. A publishable Topaz and Studio AI comparison is still pending.'}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label={zh ? '时间点和视图' : 'Time and view'}>
        {VIDEO_UPSCALE_WINDOWS.map((time, index) => <button key={time} type="button" aria-pressed={frame === index} onClick={() => setFrame(index)}
          className="rounded-md border border-white/20 px-3 py-2 font-mono text-sm text-white aria-pressed:border-lime-300 aria-pressed:bg-lime-300 aria-pressed:text-black">{time}s</button>)}
        <button type="button" aria-pressed={detail} onClick={() => setDetail(!detail)} className="inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm text-white aria-pressed:border-lime-300">
          <Expand size={16} aria-hidden="true" />{zh ? '局部细节' : 'Detail crop'}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-3">
        {kinds.map((label, index) => <figure key={label} className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black">
          <img src={VIDEO_UPSCALE_MEDIA + `/f${frame + 1}-${['input', 'resize', 'reference'][index]}-${detail ? 'detail' : 'frame'}.jpg`}
            width={detail ? 640 : 1280} height={detail ? 360 : 720} alt={label} className="aspect-video w-full object-contain" />
          <figcaption className="px-1.5 py-2.5 text-xs font-semibold text-zinc-200 sm:px-3 sm:text-sm">{label}</figcaption>
        </figure>)}
      </div>
      <p className="mt-4 text-sm text-zinc-400">{zh ? '从同一高清参照降采样制作低清输入。可用真实的标准缩放成片检查运动。' : 'The low-res input was downsampled from the same reference. Use the actual resize export to inspect motion.'}{' '}
        <a href={VIDEO_UPSCALE_MEDIA + '/standard-resize.mp4'} className="text-lime-300 underline">{zh ? '打开标准缩放视频' : 'Open the standard resize video'}</a>
        {' · '}<a href={VIDEO_UPSCALE_SOURCE} className="text-lime-300 underline">Mixkit</a>
      </p>
    </section>

    <section aria-labelledby="street-candidate-heading" className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <div className="p-5 sm:p-7">
        <p className="text-sm font-semibold text-lime-300">{zh ? 'Windows 实测 · 单个街景样本' : 'Windows bench test · One street scene'}</p>
        <h2 id="street-candidate-heading" className="mt-2 font-headline text-2xl font-bold text-white">{zh ? '斑马线更锐，细节也变了' : 'Sharper crosswalk edges, changed detail'}</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">{zh ? 'Real-ESRGAN 让线条更醒目，同一位置也出现锯齿，部分路面纹理被抹平。这组展示用于筛选候选模型。' : 'Real-ESRGAN makes the markings more distinct, while introducing stair-stepped diagonals and smoothing some road texture. This sample is part of candidate evaluation.'}</p>
      </div>
      <figure>
        <div aria-hidden="true" className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/40 text-center text-xs text-zinc-200 sm:text-sm">
          {(zh ? ['高清参照', '常规缩放', 'Real-ESRGAN 候选'] : ['High-res reference', 'Bicubic resize', 'Real-ESRGAN candidate']).map(label => <span key={label} className="p-2">{label}</span>)}
        </div>
        <video controls muted playsInline preload="metadata" poster={VIDEO_UPSCALE_MEDIA + '/street-candidate-poster.jpg'}
          src={VIDEO_UPSCALE_MEDIA + '/street-candidate-review.mp4'} className="aspect-[16/3] w-full bg-black"
          aria-label={zh ? '街景原片、常规缩放与候选模型同位置同步播放' : 'Synchronized street crops from the reference, bicubic, and candidate exports'} />
        <figcaption className="p-5 text-sm text-zinc-400">{zh ? '从同一街景取段测试，双方输出同为 1080p、30 fps。样本未包含 Topaz 输出。' : 'Both test exports from this street clip were 1080p at 30 fps. Topaz has no output in this sample.'}{' '}
          <a href="https://mixkit.co/free-stock-video/crowds-of-people-cross-a-street-junction-4401/" className="text-lime-300 underline underline-offset-4">Mixkit</a>{' · '}
          <a href={VIDEO_UPSCALE_MEDIA + (zh ? '/street-proof-13s.mp4' : '/street-proof-en-13s.mp4')} className="text-lime-300 underline underline-offset-4">{zh ? '观看 13 秒实测拆解' : 'Watch the 13-second test walkthrough'}</a>
        </figcaption>
      </figure>
    </section>

    <section aria-labelledby="neon-candidate-heading" className="mt-8 overflow-hidden rounded-2xl border border-lime-300/20 bg-[#151b15]">
      <div className="p-5 sm:p-7">
        <p className="text-sm font-semibold text-lime-300">{zh ? 'Windows 实测 · 高反差文字' : 'Windows bench test · High-contrast lettering'}</p>
        <h2 id="neon-candidate-heading" className="mt-2 font-headline text-2xl font-bold text-white">{zh ? '招牌笔画更分明，光晕也更硬' : 'More distinct lettering, harder glows'}</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">{zh ? '这条霓虹样片里，候选比常规缩放更容易区分相邻线条。看灯管旁边：部分自然溢光也被收成了硬边。' : 'On this neon clip, the candidate separates adjacent lines more clearly than bicubic. Around the tubing, some of the original glow turns into a harder edge.'}</p>
      </div>
      <figure>
        <div aria-hidden="true" className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/40 text-center text-xs text-zinc-200 sm:text-sm">
          {(zh ? ['高清参照', '常规缩放', 'Real-ESRGAN 候选'] : ['High-res reference', 'Bicubic resize', 'Real-ESRGAN candidate']).map(label => <span key={label} className="p-2">{label}</span>)}
        </div>
        <img src={VIDEO_UPSCALE_MEDIA + '/neon-candidate-detail.jpg'} width={2880} height={540} loading="lazy"
          alt={zh ? '同坐标霓虹招牌裁切，比较灯管、笔画和溢光' : 'Matched neon crops showing differences in strokes and glow'} className="w-full" />
        <figcaption className="p-5 text-sm text-zinc-400">{zh ? '与高清参照比较，这条样片的亮度 SSIM 为常规缩放 0.7579、候选 0.7931。只适用于这条输入和设置。' : 'Against the reference, luma SSIM for this clip was 0.7579 with bicubic and 0.7931 with the candidate, for this input and settings.'}{' '}
          <a href="https://mixkit.co/free-stock-video/neon-signs-with-japanese-letters-4447/" className="text-lime-300 underline underline-offset-4">Mixkit</a>
        </figcaption>
      </figure>
    </section>

    <section aria-labelledby="portrait-candidate-heading" className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#151815]">
      <div className="p-5 sm:p-7">
        <p className="text-sm font-semibold text-lime-300">{zh ? 'Windows 实测 · 人像特写' : 'Windows bench test · Portrait close-up'}</p>
        <h2 id="portrait-candidate-heading" className="mt-2 font-headline text-2xl font-bold text-white">{zh ? '镜框轮廓清楚，皮肤细节怎么变了？' : 'Clearer glasses rims. What happened to skin texture?'}</h2>
        <p className="mt-2 max-w-3xl text-zinc-300">{zh ? '三栏从左到右为高清参照、常规缩放和 Real-ESRGAN。看镜框边缘和眼下皮肤。候选把边缘拉利了一些，也抹平了部分皮肤细纹。' : 'From left to right: high-resolution reference, bicubic resize, and Real-ESRGAN. Watch the glasses rim and under-eye detail. The candidate sharpens the rim while smoothing some skin texture.'}</p>
      </div>
      <figure>
        <video controls muted playsInline preload="metadata" poster={VIDEO_UPSCALE_MEDIA + '/portrait-candidate-poster.jpg'}
          src={VIDEO_UPSCALE_MEDIA + '/portrait-candidate-review.mp4'} className="aspect-[16/3] w-full bg-black"
          aria-label={zh ? '人像原片、常规缩放与候选模型同位置同步播放' : 'Synchronized portrait crops from the reference, bicubic, and candidate exports'} />
        <figcaption className="p-5 text-sm text-zinc-400">{zh ? '320×180 同源输入。双三次和候选结果均为 1280×720。' : 'Both methods received the same 320×180 input and produced 1280×720 test exports.'}{' '}
          <a href="https://mixkit.co/free-stock-video/look-of-a-woman-working-on-her-computer-42646/" className="text-lime-300 underline underline-offset-4">Mixkit</a>
        </figcaption>
      </figure>
    </section>

    <section aria-labelledby="upscale-method-title" className="mt-8">
      <h2 id="upscale-method-title" className="font-headline text-2xl font-bold text-white">{copy.table}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {checks.map(([label, description]) => <article key={label} className="rounded-xl border border-white/10 bg-[#151815] p-5">
          <h3 className="font-headline text-lg font-bold text-lime-300">{label}</h3>
          <p className="mt-2 leading-relaxed text-zinc-300">{description}</p>
        </article>)}
      </div>
      <p className="mt-4 text-sm text-zinc-400">{zh ? '对照计划以 Topaz Proteus 为起点。核对模型与许可后，才加实测结果和价格结论。' : 'Topaz Proteus is the planned reference. Verified results and pricing will be added when the model and usage rights are confirmed.'}{' '}
        <a href={VIDEO_UPSCALE_TOPAZ} className="text-lime-300 underline">{zh ? 'Topaz 模型说明' : 'Topaz model information'}</a>
      </p>
    </section>

    <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lime-300/25 bg-lime-300/5 p-5 sm:p-7">
      <div>
        <h2 className="font-headline text-xl font-bold text-white">{zh ? '想试 Studio 的视频超分？' : 'Want to try Studio video upscaling?'}</h2>
        <p className="mt-2 text-zinc-300">{zh ? '现在可以申请视频内测，告诉我们你想处理哪类素材。' : 'Apply for the video beta and tell us what kind of footage you want to process.'}</p>
      </div>
      <a href={videoBetaHref(locale, 'video-upscaler')} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black hover:bg-white">{zh ? '申请超分内测' : 'Apply for the upscaling beta'}<ArrowRight size={17} aria-hidden="true" /></a>
    </section>
  </main>;
}
