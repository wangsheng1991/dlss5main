import { useRef, useState } from 'react';
import { VIDEO_UPSCALE_MEDIA } from '../content/videoUpscaleLab';
import type { VideoPreviewLocale } from '../content/videoStudio';

const variants = ['reference', 'bicubic', 'candidate'] as const;
type Variant = typeof variants[number];

export default function VideoUpscalePlayer({ locale }: { locale: VideoPreviewLocale }) {
  const zh = locale === 'zh';
  const [scene, setScene] = useState<'neon' | 'street'>('neon');
  const [variant, setVariant] = useState<Variant>('candidate');
  const player = useRef<HTMLVideoElement>(null);
  const resume = useRef({ time: 0, wasPlaying: false });
  const labels: Record<Variant, string> = zh
    ? { reference: '高清参照', bicubic: '常规缩放', candidate: 'Real-ESRGAN 候选' }
    : { reference: 'Reference', bicubic: 'Bicubic', candidate: 'Real-ESRGAN candidate' };

  function select(next: Variant) {
    if (next === variant || !player.current) return;
    resume.current = { time: player.current.currentTime, wasPlaying: !player.current.paused };
    setVariant(next);
  }

  return <figure className="min-w-0 self-center overflow-hidden bg-black/30">
    <div role="group" aria-label={zh ? '样片' : 'Scenes'} className="flex gap-2 border-b border-white/10 px-3 py-2">
      {(['neon', 'street'] as const).map(value => <button key={value} type="button" aria-pressed={scene === value}
        onClick={() => {
          if (scene === value) return;
          resume.current = { time: 0, wasPlaying: false };
          setScene(value);
        }}
        className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-300 hover:text-white aria-pressed:bg-white/10 aria-pressed:text-lime-300">
        {value === 'neon' ? (zh ? '霓虹文字' : 'Neon lettering') : (zh ? '街景' : 'Street')}
      </button>)}
    </div>
    <div role="group" aria-label={zh ? '切换同源结果' : 'Switch same-source results'} className="flex flex-wrap gap-1.5 p-3 sm:gap-2">
      {variants.map(value => <button key={value} type="button" aria-pressed={variant === value} onClick={() => select(value)}
        className="min-h-9 rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-white hover:border-lime-300 aria-pressed:border-lime-300 aria-pressed:bg-lime-300 aria-pressed:text-black">{labels[value]}</button>)}
    </div>
    <video key={scene + '-' + variant} ref={player} controls muted playsInline preload="metadata" aria-label={labels[variant]}
      className="aspect-video w-full bg-black object-contain"
      poster={VIDEO_UPSCALE_MEDIA + '/' + scene + '-' + variant + '-full-poster.jpg'}
      src={VIDEO_UPSCALE_MEDIA + '/' + scene + '-' + variant + '.mp4'}
      onLoadedMetadata={event => {
        const video = event.currentTarget;
        video.currentTime = Math.min(resume.current.time, Math.max(video.duration - 0.05, 0));
        if (resume.current.wasPlaying) void video.play().catch(() => {});
      }} />
    <figcaption className="px-4 py-3 text-xs leading-relaxed text-zinc-300">{zh
      ? 'Windows 同源实测 · 切换同一场景的结果时保留播放位置。'
      : 'Windows test footage. Switch versions of the same scene without losing your playback position.'}</figcaption>
  </figure>;
}
