import { ArrowRight, Clapperboard, Expand, Film, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  VIDEO_PREVIEW_COPY, VIDEO_PREVIEW_PATHS, videoPreviewPath, type VideoPreviewLocale, type VideoPreviewPath,
} from '../content/videoStudio';

type Props = { page: VideoPreviewPath; locale: VideoPreviewLocale };
const icons = { '/image-to-video': Clapperboard, '/video-upscaler': Expand, '/frame-interpolation': Film };

export function VideoStudioNotice({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  return (
    <aside className="mt-7 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-l-2 border-primary pl-4 text-sm text-zinc-300">
      <span>{zh ? '在线视频处理即将上线。' : 'Online video processing is coming soon.'}</span>
      <Link className="font-semibold text-primary hover:underline" to={videoPreviewPath('/video-studio', locale)}>
        {zh ? '查看视频工作台预告' : 'See the Video Studio preview'}
      </Link>
    </aside>
  );
}

export function VideoPreviewContent({ page, locale }: Props) {
  const zh = locale === 'zh';
  const hub = page === '/video-studio';
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

      <header className="grid gap-8 border-y border-outline-variant/25 py-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-12">
        <div>
          <p className="text-sm font-semibold text-primary">{zh ? '即将上线' : 'Coming soon'}</p>
          <h1 className="mt-3 font-headline text-4xl font-bold tracking-tight text-white md:text-6xl">{copy.heading}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-200">{copy.lead}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">{copy.details}</p>
          <Link to="/game-character-style" className="mt-7 inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-4 py-3 font-semibold text-zinc-100 hover:border-primary hover:text-primary">
            <Image aria-hidden="true" size={18} />
            {zh ? '体验现有图像风格转换' : 'Try image style conversion'}
          </Link>
        </div>
        {hub ? (
          <figure className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-low">
            <img src="/examples/generated/game-cyber-1-after.jpg" alt={zh ? '现有图像工具中的赛博朋克角色静帧参考' : 'Cyberpunk character still from the existing image tool'} className="aspect-video w-full object-cover" />
            <figcaption className="px-4 py-3 text-sm leading-relaxed text-zinc-300">{zh ? '现有图像风格转换案例。视频功能仍在准备中。' : 'Still-image example from the current style converter. Video tools are coming soon.'}</figcaption>
          </figure>
        ) : (
          <section aria-labelledby="video-review-heading" className="rounded-xl border border-outline-variant/25 bg-surface-low p-6">
            <h2 id="video-review-heading" className="font-headline text-xl font-semibold text-white">{zh ? '计划中的流程' : 'Planned workflow'}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-300">
              {(zh ? ['选用有权使用的参考素材', '预览镜头并检查细节', '确认处理结果后导出'] : ['Choose a reference you have permission to use', 'Preview the shot and check details', 'Approve the result before exporting']).map(step => <li key={step}>{step}</li>)}
            </ol>
          </section>
        )}
      </header>

      <section aria-labelledby="video-tools-heading" className="mt-12">
        <h2 id="video-tools-heading" className="font-headline text-2xl font-bold text-white">{zh ? '视频工具预告' : 'Upcoming video tools'}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {VIDEO_PREVIEW_PATHS.filter(path => path !== '/video-studio' && path !== page).map(path => {
            const Icon = icons[path];
            const tool = VIDEO_PREVIEW_COPY[locale][path];
            return <Link key={path} to={videoPreviewPath(path, locale)} className="group rounded-xl border border-outline-variant/30 bg-surface-low p-5 hover:border-primary/70">
              <Icon aria-hidden="true" className="text-primary" size={22} />
              <h3 className="mt-4 font-headline text-xl font-semibold text-white">{tool.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{tool.lead}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{zh ? '查看预告' : 'View preview'}<ArrowRight aria-hidden="true" size={16} /></span>
            </Link>;
          })}
        </div>
      </section>

      {hub && <section id="model-preview" aria-labelledby="video-model-heading" className="mt-12 border-t border-outline-variant/25 pt-7">
        <h2 id="video-model-heading" className="font-headline text-2xl font-bold text-white">{zh ? '自研模型 · 即将上线' : 'Our in-house model · Coming soon'}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-zinc-300">{zh ? '公司自研模型计划接入 Studio。模型规格和实测样片会在这里发布。' : 'We plan to bring our in-house model into Studio. Model specifications and tested examples will be published here.'}</p>
      </section>}
    </main>
  );
}
