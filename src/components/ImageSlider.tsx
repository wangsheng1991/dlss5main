import React, { useEffect, useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

/**
 * Before/after comparison for one edit: the original sits on the left, the result on the right.
 *
 * The two images usually have different aspect ratios (the model answers with a square), so both are
 * placed in the exact same box. Containment keeps older cached inputs visible without cropping, and
 * the split is drawn with clip-path so the input never scales independently of the output.
 * The handle only follows a real drag or a tap, not a passing pointer.
 */
export default function ImageSlider({ highRes, lowRes, alt = 'AI image edit comparison', inputLabel = 'Input', outputLabel = 'Output', compareLabel, initialAspectRatio }: { highRes: string; lowRes: string; alt?: string; inputLabel?: string; outputLabel?: string; compareLabel?: string; initialAspectRatio?: number; priority?: boolean }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [ratio, setRatio] = useState(initialAspectRatio || 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const resultLoaded = useRef(false);

  const move = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect?.width) return;
    setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    move(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (dragging.current) move(event.clientX);
  };

  const stopDragging = () => { dragging.current = false; };

  const measure = (img: HTMLImageElement, isResult: boolean) => {
    if (!isResult && resultLoaded.current) return;
    const next = img.naturalWidth / img.naturalHeight;
    if (!next) return;
    if (isResult) resultLoaded.current = true;
    setRatio(next);
  };

  // A new pair of images starts a new comparison: the result defines the frame.
  useEffect(() => {
    resultLoaded.current = false;
    setRatio(initialAspectRatio || 1);
    setSliderPos(50);
  }, [highRes, lowRes]);

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={compareLabel || `${alt} — drag to compare`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPos)}
      className="relative w-full overflow-hidden rounded-lg bg-black cursor-ew-resize select-none touch-none focus-visible:outline-2 focus-visible:outline-primary"
      style={{ aspectRatio: ratio, maxHeight: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') setSliderPos((value) => Math.max(0, value - 2));
        if (event.key === 'ArrowRight') setSliderPos((value) => Math.min(100, value + 2));
      }}
    >
      <img
        src={lowRes}
        alt={`${alt} — original`}
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={(event) => measure(event.currentTarget, false)}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      />
      <img
        src={highRes}
        alt={`${alt} — result`}
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={(event) => measure(event.currentTarget, true)}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      />
      <div className="absolute inset-y-0 z-20 pointer-events-none border-l-2 border-primary" style={{ left: `${sliderPos}%` }} />
      <div className="absolute inset-y-0 z-20 flex items-center justify-center pointer-events-none" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <ChevronsLeftRight className="text-black w-4 h-4" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-30 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest text-white pointer-events-none">{inputLabel}</div>
      <div className="absolute bottom-4 right-4 z-30 bg-nvidia-green text-black px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest pointer-events-none">{outputLabel}</div>
    </div>
  );
}
