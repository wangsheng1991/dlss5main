/**
 * The two six-second reference clips the page and the pre-rendered copy both promise.
 * They used to exist only in the build-time HTML, so a visitor never saw them; the copy here is
 * word-for-word the text the crawler already gets, and the claims stay the same: independent
 * references from our own pipeline, not NVIDIA captures and not a performance benchmark.
 */
const CLIPS = [
  {
    src: '/examples/dlss5-upscale-before-after-demo.mp4',
    poster: '/examples/generated/architecture-1-after.jpg',
    caption: {
      en: 'Text conclusion: the clip shows a source-to-output transition; it is not a model speed or quality benchmark.',
      zh: '文字结论：片段展示从输入到输出的转换，不是速度或画质基准测试。',
    },
  },
  {
    src: '/examples/dlss5-game-style-transition.mp4',
    poster: '/examples/generated/game-cyber-1-after.jpg',
    caption: {
      en: 'Text conclusion: identity, pose and silhouette remain the review anchors in this independent style reference.',
      zh: '文字结论：独立风格参考保留身份、姿势和轮廓作为复核锚点。',
    },
  },
] as const;

export default function DownloadReferenceVideos({ chinese = false }: { chinese?: boolean }) {
  const lang: 'en' | 'zh' = chinese ? 'zh' : 'en';
  return (
    <section className="mb-16" aria-labelledby="reference-videos-heading">
      <h2 id="reference-videos-heading" className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">
        {chinese ? '前后对比视频参考' : 'Before-and-after reference videos'}
      </h2>
      <p className="text-zinc-400 leading-relaxed max-w-3xl mb-8">
        {chinese
          ? '这些六秒静音循环片段来自同一站点管线的独立视觉参考，并非 NVIDIA 截图，也不是实时性能承诺。'
          : 'These six-second silent clips show independent visual references from the same site pipeline. They are not NVIDIA captures or a real-time performance claim.'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CLIPS.map((clip) => (
          <figure key={clip.src}>
            <video
              className="w-full rounded-xl bg-black"
              controls
              muted
              loop
              playsInline
              preload="metadata"
              poster={clip.poster}
            >
              <source src={clip.src} type="video/mp4" />
            </video>
            <figcaption className="mt-2 text-sm text-zinc-400">{clip.caption[lang]}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-5">
        <a className="text-primary underline" href={chinese ? '/zh/before-after' : '/before-after'}>
          {chinese ? '查看完整前后对比证据页 →' : 'Open the complete before-and-after evidence page →'}
        </a>
      </p>
    </section>
  );
}
