import { CORE_VIDEOS, coreVideoCopy } from '../content/articles/coreVideo20261023';
export default function CoreArticleVideo({ slug, chinese }: {slug: string; chinese: boolean}) {
  const video = CORE_VIDEOS[slug];
  if (!video) return null;
  const copy = coreVideoCopy(slug, chinese);
  return <figure data-core-video className="not-prose my-8 rounded-xl border border-outline-variant/20 bg-surface-low p-4">
    <h2 className="mb-3 text-lg font-semibold text-white">{copy.title}</h2>
    <video controls playsInline preload="metadata" poster={video.thumbnailPath} width={video.width} height={video.height} aria-label={copy.title} className="h-auto w-full rounded-lg">
      <source src={video.contentPath} type="video/mp4" />
      <a href={video.contentPath}>{chinese ? '下载真实录屏' : 'Download the screen recording'}</a>
    </video>
    <figcaption className="mt-3 text-sm leading-relaxed text-zinc-400">{copy.description}</figcaption>
  </figure>;
}
