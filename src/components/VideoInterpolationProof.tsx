import { Film } from 'lucide-react';
import type { VideoPreviewLocale } from '../content/videoStudio';

export default function VideoInterpolationProof({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  return <section aria-labelledby="interpolation-demo-heading" className="mt-8 overflow-hidden rounded-2xl border border-lime-300/20 bg-[#141a14]">
    <div className="p-5 sm:p-7">
      <p className="flex items-center gap-2 font-semibold text-lime-300"><Film size={17} aria-hidden="true" />{zh ? '同源运动样片 · 24 → 48 fps' : 'Same-source motion demo · 24 → 48 fps'}</p>
      <h2 id="interpolation-demo-heading" className="mt-3 font-headline text-2xl font-bold text-white">{zh ? '看球和人物边缘怎么动' : 'Watch the ball and the moving edges'}</h2>
      <p className="mt-2 max-w-3xl text-zinc-300">{zh ? '同一播放器锁定两边的进度，左侧复用原帧，右侧由 FFmpeg 光流生成中间帧。快速移动或遮挡处要留意变形。' : 'Both views stay in sync in one player. The left repeats source frames. The right generates in-between frames with FFmpeg motion interpolation. Check fast motion and occlusion for warping.'}</p>
    </div>
    <figure>
      <div aria-hidden="true" className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 bg-black/40 text-center text-xs text-zinc-200 sm:text-sm">
        <span className="p-2">{zh ? '重复帧基线' : 'Repeated-frame baseline'}</span><span className="p-2">{zh ? '常规光流插帧' : 'Conventional optical flow'}</span>
      </div>
      <video controls muted playsInline preload="metadata" poster="/examples/video-interpolation-baseline/poster.jpg"
        src="/examples/video-interpolation-baseline/comparison.mp4" className="aspect-[32/9] w-full bg-black"
        aria-label={zh ? '重复帧和常规光流插帧的同步运动对比' : 'Synchronized repeated-frame and optical flow examples'} />
      <figcaption className="p-5 text-sm text-zinc-400">{zh ? '这是常规方法基线。Studio 插帧功能及模型对比仍在准备中。' : 'This is a conventional baseline. Studio interpolation and the model comparison are coming soon.'}{' '}
        <a href="https://mixkit.co/free-stock-video/couple-playing-basketball-2280/" className="text-lime-300 underline underline-offset-4">Mixkit</a>
      </figcaption>
    </figure>
  </section>;
}
