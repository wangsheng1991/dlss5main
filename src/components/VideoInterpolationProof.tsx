import { Film } from 'lucide-react';
import type { VideoPreviewLocale } from '../content/videoStudio';

const referenceMedia = '/examples/video-interpolation-reference';

function FrameReference({ zh }: { zh: boolean }) {
  const compare = zh
    ? ['原片参照', '重复前一帧', '光流补帧']
    : ['Source reference', 'Previous frame repeated', 'Optical flow'];
  const examples = [
    {
      id: 'motion',
      title: zh ? '运动边缘还原得更接近' : 'A closer match on a moving edge',
      note: zh ? '看右侧角色的眼睑。重复帧保留了眼睛闭得更紧的前一刻，光流补帧的眼睑位置更接近左侧原片。' : 'Look at the eyelid. The repeated frame holds the earlier, more closed eyelid, while the optical-flow frame places the eyelid closer to the source.',
    },
    {
      id: 'occlusion',
      title: zh ? '快速移动处出现拖影' : 'Fast movement can leave a trail',
      note: zh ? '看从画面下方快速掠过的角色。光流在原片轮廓之外拉出半透明拖影，重复帧没有这条拖影。' : 'Watch the character moving across the bottom. Optical flow creates a translucent trail around its outline. The repeated frame has no such trail.',
    },
  ];

  return <section aria-labelledby="interpolation-reference-heading" className="mt-8 overflow-hidden rounded-2xl border border-lime-300/25 bg-[#141a14]">
    <header className="p-5 sm:p-7">
      <p className="flex items-center gap-2 text-sm font-semibold text-lime-300"><Film size={17} aria-hidden="true" />{zh ? '同源实测 · 30 → 60 fps' : 'Same-source test · 30 → 60 fps'}</p>
      <h2 id="interpolation-reference-heading" className="mt-3 font-headline text-2xl font-bold text-white sm:text-3xl">{zh ? '补出来的那一帧，和原片差多少？' : 'How close is the generated frame to the original?'}</h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-zinc-300">{zh ? '从 60 fps 的动画源片中隔帧取样，让重复帧和 FFmpeg 光流处理同一个 30 fps 输入。再用留出的原片帧逐一核对。' : 'We removed every other frame from a 60 fps animation and gave the same 30 fps input to frame repetition and FFmpeg optical flow. We then checked the reconstructed frames against the withheld originals.'}</p>
    </header>
    <figure className="border-t border-white/10 bg-black/50">
      <div className="grid grid-cols-3 divide-x divide-white/10 text-center text-xs text-zinc-200 sm:text-sm">
        {compare.map(label => <span key={label} className="grid min-h-12 place-items-center p-2">{label}</span>)}
      </div>
      <video controls muted playsInline preload="metadata" poster={`${referenceMedia}/poster.jpg`}
        src={`${referenceMedia}/comparison.mp4`} className="aspect-[16/3] w-full bg-black"
        aria-label={zh ? '同一片段的原片、重复帧与光流插帧三路同步视频' : 'Synchronized video showing the reference, repeated frames and optical flow'} />
      <figcaption className="p-5 text-sm leading-relaxed text-zinc-300 sm:px-7">{zh
        ? '本段实测共核对 180 个留出的原片帧。光流有 166 帧的亮度结构相似度（SSIM）更高。重复帧平均为 0.975745，光流为 0.989755。'
        : 'In this measured clip, optical flow scored higher on luminance structural similarity (SSIM) for 166 of 180 withheld frames. Mean luma SSIM was 0.975745 for repeated frames and 0.989755 for optical flow.'}</figcaption>
    </figure>
    <div className="grid gap-5 border-t border-white/10 p-5 lg:grid-cols-2 sm:p-7">
      {examples.map(example => <figure key={example.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/25">
        <div aria-hidden="true" className="grid grid-cols-3 divide-x divide-white/10 text-center text-[11px] text-zinc-300">
          {compare.map(label => <span key={label} className="grid min-h-10 place-items-center px-1.5 py-1">{label}</span>)}
        </div>
        <img src={`${referenceMedia}/${example.id}.jpg`} alt={zh ? '同一处局部从左到右：原片、重复帧、光流' : 'Same crop from left to right: source reference, repeated frame, optical flow'} width="720" height="170" className="h-auto w-full" loading="lazy" />
        <figcaption className="p-4">
          <h3 className="font-semibold text-white">{example.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-300">{example.note}</p>
        </figcaption>
      </figure>)}
    </div>
    <footer className="border-t border-white/10 p-5 text-sm leading-relaxed text-zinc-300 sm:px-7">
      <p>{zh ? '这是对一段动画做的基线实测，Studio 插帧仍在准备中。' : 'These are baseline measurements on one animation clip. Studio interpolation is still in development.'}</p>
      <p className="mt-2">
        <a href="https://bbb3d.renderfarming.net/" className="text-lime-300 underline underline-offset-4">Big Buck Bunny, Sunflower version</a>{' · '}
        Blender Foundation (2008), Janus B. Kristensen (2013){' · '}
        <a href="https://creativecommons.org/licenses/by/3.0/" className="text-lime-300 underline underline-offset-4">CC BY 3.0</a>{' · '}
        {zh ? '节选、缩放、并排对照与局部裁切' : 'Excerpted, resized, juxtaposed and cropped'}
      </p>
    </footer>
  </section>;
}

export default function VideoInterpolationProof({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  return <>
    <FrameReference zh={zh} />
    <section aria-labelledby="interpolation-demo-heading" className="mt-8 overflow-hidden rounded-2xl border border-lime-300/20 bg-[#141a14]">
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
    </section>
  </>;
}
