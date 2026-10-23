import { CORE_VIDEO, coreVideoCopy } from '../content/articles/coreVideo20261023';
export default function CoreArticleVideo({ slug, chinese }: {slug: string; chinese: boolean}) {
  if (slug !== CORE_VIDEO.slug) return null;
  const copy = coreVideoCopy(chinese);
  return <figure data-core-video className="not-prose my-8 rounded-xl border border-outline-variant/20 bg-surface-low p-4">
    <h2 className="mb-3 text-lg font-semibold text-white">{copy.title}</h2>
    <video controls playsInline preload="metadata" poster={CORE_VIDEO.thumbnailPath} width={CORE_VIDEO.width} height={CORE_VIDEO.height} aria-label={copy.title} className="h-auto w-full rounded-lg">
      <source src={CORE_VIDEO.contentPath} type="video/mp4" />
      <a href={CORE_VIDEO.contentPath}>{chinese ? '下载真实录屏' : 'Download the screen recording'}</a>
    </video>
    <figcaption className="mt-3 text-sm leading-relaxed text-zinc-400">{copy.description}</figcaption>
  </figure>;
}
