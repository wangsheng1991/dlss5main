import type { ReactNode } from 'react';
import { ArrowRight, Clapperboard, Film, LayoutGrid, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VIDEO_PREVIEW_COPY, videoBetaHref, videoPreviewPath, type VideoPreviewLocale } from '../content/videoStudio';
import { VIDEO_TOOLS, videoToolPath, type VideoTool } from '../content/videoTools';
import { STREET_SOURCE } from '../content/videoUnderstanding';
import { HIGHLIGHTS_MEDIA } from '../content/videoHighlights';

export function VideoToolDirectory({ locale, current }: { locale: VideoPreviewLocale; current?: VideoTool }) {
  const zh = locale === 'zh';
  const groups = [
    { id: 'inspect', name: zh ? '检查与提取' : 'Inspect & extract', Icon: ScanLine },
    { id: 'compare', name: zh ? '画幅与运动' : 'Framing & motion', Icon: Film },
    { id: 'plan', name: zh ? '剪辑与交接' : 'Plan & hand off', Icon: LayoutGrid },
  ] as const;
  return <section className="mt-12 border-t border-white/10 pt-8">
    <h2 className="font-headline text-2xl font-bold text-white">{zh ? '在线视频工具' : 'Online video tools'}</h2>
    <p className="mt-2 text-zinc-300">{zh ? '先用样片试，或在浏览器中打开自己的片段。' : 'Try the sample or open your own clip in the browser.'}</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      {groups.map(({ id, name, Icon }) => <div key={id} className="rounded-2xl border border-white/10 bg-[#181d17] p-5">
        <h3 className="flex items-center gap-2 font-semibold text-lime-300"><Icon size={18} aria-hidden="true" />{name}</h3>
        <ul className="mt-3 divide-y divide-white/10">
          {VIDEO_TOOLS.filter(tool => tool.group === id && tool !== current).map(tool => <li key={tool.slug}>
            <Link className="flex items-center justify-between gap-4 py-3 text-sm font-semibold text-white hover:text-lime-300" to={videoToolPath(tool, locale)}>{tool[locale][0]}<ArrowRight aria-hidden="true" size={14} className="shrink-0" /></Link>
          </li>)}
        </ul>
      </div>)}
    </div>
  </section>;
}

export function VideoToolContent({ tool, locale, workspace }: { tool: VideoTool; locale: VideoPreviewLocale; workspace?: ReactNode }) {
  const zh = locale === 'zh';
  const [heading, description, review, sample] = tool[locale];
  const back = videoPreviewPath('/video-studio', locale);
  return <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
    <nav aria-label={zh ? '面包屑' : 'Breadcrumb'} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
      <Link to={back} className="hover:text-lime-300">{zh ? '视频工作台' : 'Video Studio'}</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{heading}</span>
      <Link className="ml-auto text-lime-300 hover:underline" hrefLang={zh ? 'en' : 'zh-CN'} to={videoToolPath(tool, zh ? 'en' : 'zh')}>{zh ? 'English' : '中文'}</Link>
    </nav>
    <header className="rounded-t-3xl border border-white/10 bg-[radial-gradient(ellipse_at_top_left,#35452c,#161b16_70%)] p-6 sm:p-10">
      <div className="flex items-center gap-2 text-sm font-semibold text-lime-300"><Clapperboard size={18} aria-hidden="true" />DLSS 5 Studio</div>
      <h1 className="mt-4 max-w-4xl font-headline text-4xl font-bold tracking-tight text-white md:text-6xl">{heading}</h1>
      <p className="mt-4 max-w-[64ch] text-base leading-relaxed text-zinc-200 sm:text-lg">{description}</p>
    </header>
    <section className="overflow-hidden rounded-b-3xl border border-t-0 border-white/10 bg-[#121612] p-4 sm:p-6" aria-label={zh ? '操作台' : 'Workbench'}>
      {workspace ?? <figure className="overflow-hidden rounded-xl bg-black">
        <img className="mx-auto aspect-video w-full max-w-2xl object-contain" src={HIGHLIGHTS_MEDIA.poster} alt={zh ? '用于视频工具演示的路口样片' : 'Street-scene clip used in the video tools'} />
      </figure>}
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{zh ? '自己的文件只在当前浏览器处理，无需登录。样片来源：' : 'Your files are processed in this browser. No login required. Sample footage: '}{' '}<a href={STREET_SOURCE} className="text-lime-300 underline underline-offset-4">Mixkit</a>.</p>
    </section>
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-surface-low p-6">
        <h2 className="font-headline text-xl font-semibold text-white">{zh ? '用样片做一次' : 'Try it on the sample'}</h2>
        <p className="mt-3 leading-relaxed text-zinc-300">{sample}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-surface-low p-6">
        <h2 className="font-headline text-xl font-semibold text-white">{zh ? '交付前检查什么' : 'What to check before delivery'}</h2>
        <p className="mt-3 leading-relaxed text-zinc-300">{review}</p>
        <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-lime-300 hover:underline" to={videoPreviewPath(tool.related, locale)}>
          {VIDEO_PREVIEW_COPY[locale][tool.related].heading}<ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
    <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lime-300/20 bg-[#1a2418] p-6">
      <div>
        <h2 className="font-headline text-xl font-semibold text-white">{zh ? '把选好的画面交给 Studio' : 'Take the selected frame into Studio'}</h2>
        <p className="mt-2 text-sm text-zinc-300">{zh ? '把静帧带到现有风格转换器，做光照、材质或角色风格参考；需要模型处理整段视频时可申请内测。' : 'Use a still as a lighting, material or character reference in the existing style converter. Apply for the beta for model-powered video processing.'}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/game-character-style" className="rounded-lg bg-lime-300 px-4 py-3 text-sm font-bold text-black hover:bg-white">{zh ? '打开风格转换器' : 'Open style converter'}</Link>
        <a href={videoBetaHref(locale)} className="rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:border-lime-300">{zh ? '申请视频内测' : 'Apply for video beta'}</a>
      </div>
    </section>
    <VideoToolDirectory locale={locale} current={tool} />
  </main>;
}
