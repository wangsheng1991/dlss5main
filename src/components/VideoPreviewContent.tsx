import LocalVideoEntry from './LocalVideoEntry';
import type { ReactNode } from 'react';
import { ArrowRight, Clapperboard, Expand, Film, Image, ScanLine, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoToolDirectory } from './VideoToolContent';
import VideoUnderstandingDemo from './VideoUnderstandingDemo';
import VideoHighlightsDemo from './VideoHighlightsDemo';
import VideoInterpolationProof from './VideoInterpolationProof';
import { VideoUpscaleLabLink } from './VideoUpscaleLab';
import { HIGHLIGHTS_MEDIA } from '../content/videoHighlights';
import { UNDERSTANDING_MEDIA } from '../content/videoUnderstanding';
import {
  VIDEO_PREVIEW_COPY, VIDEO_PREVIEW_PATHS, videoBetaHref, videoPreviewPath, type VideoBetaFeature, type VideoPreviewLocale, type VideoPreviewPath,
} from '../content/videoStudio';

type Props = { page: VideoPreviewPath; locale: VideoPreviewLocale; application?: ReactNode };
const icons = { '/video-understanding': ScanLine, '/image-to-video': Clapperboard, '/video-upscaler': Expand, '/frame-interpolation': Film, '/video-highlights': Scissors };

export function VideoStudioNotice({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  return (
    <aside className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-l-2 border-primary pl-4 text-sm text-zinc-300">
      <span>{zh ? '在线视频处理即将上线。' : 'Online video processing is coming soon.'}</span>
      <Link className="font-semibold text-primary hover:underline" to={videoPreviewPath('/video-studio', locale)}>
        {zh ? '查看视频工作台预告' : 'See the Video Studio preview'}
      </Link>
      <a className="font-semibold text-primary hover:underline" href={videoBetaHref(locale, 'video-upscaler')}>{zh ? '申请视频内测' : 'Apply for the video beta'}</a>
    </aside>
  );
}

export function VideoBetaSignIn({ locale, feature }: { locale: VideoPreviewLocale; feature?: VideoBetaFeature }) {
  const zh = locale === 'zh';
  const next = encodeURIComponent(videoBetaHref(locale, feature));
  return <div className="flex flex-wrap items-center gap-4">
    <Link to={`/login?next=${next}`} className="rounded-lg bg-primary px-5 py-3 font-bold text-black hover:bg-white">{zh ? '登录后申请' : 'Sign in to apply'}</Link>
    <Link to={`/register?next=${next}`} className="text-sm font-semibold text-primary hover:underline">{zh ? '创建账号' : 'Create an account'}</Link>
  </div>;
}

export function VideoPreviewContent({ page, locale, application }: Props) {
  const zh = locale === 'zh';
  const hub = page === '/video-studio';
  const betaFeature = page === '/video-upscaler' ? 'video-upscaler' : page === '/frame-interpolation' ? 'frame-interpolation' : undefined;
  const copy = VIDEO_PREVIEW_COPY[locale][page];
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <nav aria-label={zh ? '面包屑' : 'Breadcrumb'} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
        <Link className="hover:text-primary" to={zh ? '/zh' : '/'}>DLSS 5 Studio</Link>
        <span aria-hidden="true">/</span>
        {!hub && <><Link className="hover:text-primary" to={videoPreviewPath('/video-studio', locale)}>{VIDEO_PREVIEW_COPY[locale]['/video-studio'].heading}</Link><span aria-hidden="true">/</span></>}
        <span aria-current="page">{copy.heading}</span>
        <Link className="ml-auto text-primary hover:underline" hrefLang={zh ? 'en' : 'zh-CN'} to={videoPreviewPath(page, zh ? 'en' : 'zh')}>{zh ? 'English' : '中文'}</Link>
      </nav>

      {page === '/video-understanding' ? <VideoUnderstandingDemo locale={locale} /> : page === '/video-highlights' ? <VideoHighlightsDemo locale={locale} /> : <header className="grid gap-8 border-y border-outline-variant/25 py-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-12">
        <div>
          <p className="text-sm font-semibold text-primary">{hub ? (zh ? '浏览器工具 · 视频内测' : 'Browser tools · Video beta') : (zh ? '即将上线' : 'Coming soon')}</p>
          <h1 className="mt-3 font-headline text-4xl font-bold tracking-tight text-white md:text-6xl">{copy.heading}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-200">{copy.lead}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">{copy.details}</p>
          <a href={hub ? '#video-beta' : videoBetaHref(locale, betaFeature)} className="mr-3 mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-black hover:bg-white">
            {zh ? '申请视频内测' : 'Apply for the video beta'}<ArrowRight aria-hidden="true" size={18} />
          </a>
          <Link to="/game-character-style" className="mt-7 inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-4 py-3 font-semibold text-zinc-100 hover:border-primary hover:text-primary">
            <Image aria-hidden="true" size={18} />
            {zh ? '体验现有图像风格转换' : 'Try image style conversion'}
          </Link>
        </div>
        {hub ? (
          <figure className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-low">
            <img src="/examples/generated/game-cyber-1-after.jpg" alt={zh ? '现有图像工具中的赛博朋克角色静帧参考' : 'Cyberpunk character still from the existing image tool'} className="aspect-video w-full object-cover" />
            <figcaption className="px-4 py-3 text-sm leading-relaxed text-zinc-300">{zh ? '现有图像风格转换案例。可先用下方工具从视频中挑选参考帧。' : 'Still-image result from the current style converter. Use the video tools below to choose a reference frame.'}</figcaption>
          </figure>
        ) : (
          <section aria-labelledby="video-review-heading" className="rounded-xl border border-outline-variant/25 bg-surface-low p-6">
            <h2 id="video-review-heading" className="font-headline text-xl font-semibold text-white">{zh ? '计划中的流程' : 'Planned workflow'}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-300">
              {(zh ? ['选用有权使用的参考素材', '预览镜头并检查细节', '确认处理结果后导出'] : ['Choose a reference you have permission to use', 'Preview the shot and check details', 'Approve the result before exporting']).map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>
        )}
      </header>}

      {hub && <LocalVideoEntry chinese={zh} />}
      {hub && <VideoToolDirectory locale={locale} />}

      {(hub || page === '/video-upscaler') && <VideoUpscaleLabLink locale={locale} />}
      {page === '/frame-interpolation' && <VideoInterpolationProof locale={locale} />}
      {page === '/video-highlights' && application}

      <section aria-labelledby="video-tools-heading" className="mt-12">
        <h2 id="video-tools-heading" className="font-headline text-2xl font-bold text-white">{zh ? '视频工具预告' : 'Upcoming video tools'}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_PREVIEW_PATHS.filter(path => path !== '/video-studio' && path !== page).map(path => {
            const Icon = icons[path];
            const tool = VIDEO_PREVIEW_COPY[locale][path];
            const highlights = path === '/video-highlights';
            if (hub && (highlights || path === '/video-understanding')) return <Link key={path} to={videoPreviewPath(path, locale)}
              className="group grid overflow-hidden rounded-2xl border border-lime-300/30 bg-[#162013] transition-colors hover:border-lime-300 sm:col-span-2 md:grid-cols-2 lg:col-span-3">
              <div className="self-center p-6 sm:p-8">
                <p className="flex items-center gap-2 text-sm font-semibold text-lime-300"><Icon aria-hidden="true" size={18} />{zh ? '内测预告 · 实测演示' : 'Beta preview · Recorded demo'}</p>
                <h3 className="mt-3 font-headline text-3xl font-bold text-white">{tool.heading}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-zinc-200">{tool.lead}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-lime-300 group-hover:underline">
                  {highlights ? (zh ? '查看高光剪辑' : 'Watch the highlight edit') : (zh ? '查看路口演示' : 'See the street-scene demo')}
                  <ArrowRight aria-hidden="true" size={17} />
                </span>
              </div>
              <img src={highlights ? HIGHLIGHTS_MEDIA.poster : UNDERSTANDING_MEDIA.poster} alt="" loading="lazy" decoding="async" className="aspect-video w-full self-center object-cover" />
            </Link>;
            return <Link key={path} to={videoPreviewPath(path, locale)} className="group rounded-xl border border-outline-variant/30 bg-surface-low p-5 hover:border-primary/70">
              <Icon aria-hidden="true" className="text-primary" size={22} />
              <h3 className="mt-4 font-headline text-xl font-semibold text-white">{tool.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{tool.lead}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{zh ? '查看预告' : 'View preview'}<ArrowRight aria-hidden="true" size={16} /></span>
            </Link>;
          })}
        </div>
      </section>

      {hub && <section id="video-beta" aria-labelledby="video-beta-heading" className="mt-12 scroll-mt-24 rounded-xl border border-primary/30 bg-surface-low p-6 sm:p-8">
        <h2 id="video-beta-heading" className="font-headline text-2xl font-bold text-white">{zh ? '申请视频内测' : 'Apply for the video beta'}</h2>
        <p className="mt-3 max-w-2xl text-zinc-300">{zh
          ? '可以提交申请，告诉我们你最想试哪项模型处理能力。如有邀请，我们会通过账号邮箱联系你。'
          : 'Apply now and tell us which model-powered video workflow you want to try first. If an invitation becomes available, we’ll contact your account email.'}</p>
        <div className="mt-5">{application ?? <VideoBetaSignIn locale={locale} />}</div>
      </section>}

      {hub && <section id="model-preview" aria-labelledby="video-model-heading" className="mt-12 border-t border-outline-variant/25 pt-7">
        <h2 id="video-model-heading" className="font-headline text-2xl font-bold text-white">{zh ? '自研模型 · 即将上线' : 'Our in-house model · Coming soon'}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-zinc-300">{zh ? '公司自研模型计划接入 Studio。模型规格和实测样片会在这里发布。' : 'We plan to bring our in-house model into Studio. Model specifications and tested examples will be published here.'}</p>
      </section>}
    </main>
  );
}
