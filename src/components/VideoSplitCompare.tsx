import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { Pause, Play } from 'lucide-react';

export type ComparePane = {
  src: string;
  poster: string;
  label: string;
  note: string;
};

type Props = {
  left: ComparePane;
  right: ComparePane;
  /** Accessible description of what is being compared. */
  caption: string;
  playLabel?: string;
  pauseLabel?: string;
  initialSplit?: number;
};

/**
 * Two same-source clips stacked on one stage, split by a draggable divider.
 * The left clip fills the stage; the right clip is clipped at the divider so both
 * panes always show the exact same instant and framing.
 */
export default function VideoSplitCompare({ left, right, caption, playLabel = 'Play together', pauseLabel = 'Pause', initialSplit = 50 }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const leftVideo = useRef<HTMLVideoElement>(null);
  const rightVideo = useRef<HTMLVideoElement>(null);
  const dragging = useRef(false);
  const [split, setSplit] = useState(initialSplit);
  const [playing, setPlaying] = useState(false);

  // Keep the two clips on the same frame: the left clip drives, the right follows.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const a = leftVideo.current;
      const b = rightVideo.current;
      if (a && b && !a.paused && !b.paused) {
        const drift = a.currentTime - b.currentTime;
        if (Math.abs(drift) > 0.08) b.currentTime = a.currentTime;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = useCallback(() => {
    const a = leftVideo.current;
    const b = rightVideo.current;
    if (!a || !b) return;
    if (a.paused) {
      void a.play();
      void b.play();
      setPlaying(true);
    } else {
      a.pause();
      b.pause();
      setPlaying(false);
    }
  }, []);

  const moveTo = useCallback((clientX: number) => {
    const el = stage.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    moveTo(event.clientX);
    const onMove = (moveEvent: PointerEvent) => {
      if (dragging.current) moveTo(moveEvent.clientX);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') {
      setSplit((value) => Math.max(0, value - step));
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      setSplit((value) => Math.min(100, value + step));
      event.preventDefault();
    } else if (event.key === 'Home') {
      setSplit(0);
      event.preventDefault();
    } else if (event.key === 'End') {
      setSplit(100);
      event.preventDefault();
    }
  };

  return (
    <figure className="min-w-0">
      <div
        ref={stage}
        className="relative aspect-video w-full touch-none select-none overflow-hidden rounded-xl border border-white/10 bg-black"
      >
        <video
          ref={leftVideo}
          className="absolute inset-0 h-full w-full object-contain"
          src={left.src}
          poster={left.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <video
          ref={rightVideo}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
          src={right.src}
          poster={right.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute left-0 top-0 m-2 rounded-md bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white sm:m-3">
          {left.label}
          <span className="ml-2 font-normal text-zinc-400">{left.note}</span>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 m-2 rounded-md bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white sm:m-3">
          {right.label}
          <span className="ml-2 font-normal text-zinc-400">{right.note}</span>
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label={caption}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          aria-valuetext={`${Math.round(split)}%`}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
          className="absolute inset-y-0 z-10 w-10 -translate-x-1/2 cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
          style={{ left: `${split}%` }}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/90" aria-hidden="true" />
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M6.5 4.5 3 9l3.5 4.5M11.5 4.5 15 9l-3.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-2.5 py-1.5 font-semibold text-white hover:border-lime-300"
        >
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {playing ? pauseLabel : playLabel}
        </button>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
