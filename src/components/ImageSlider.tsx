import React, { useState, useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

export default function ImageSlider({ highRes, lowRes }: { highRes: string, lowRes: string }) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-lg cursor-ew-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <img src={highRes} alt="High Resolution" className="absolute inset-0 w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" loading="lazy" />
      <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-primary z-10" style={{ width: `${sliderPos}%` }}>
        <img src={lowRes} alt="Low Resolution" className="absolute inset-y-0 left-0 h-full w-[200%] max-w-none object-cover pointer-events-none" style={{ width: `${100 / (sliderPos / 100)}%` }} referrerPolicy="no-referrer" loading="lazy" />
      </div>
      <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest text-white pointer-events-none">Input</div>
      <div className="absolute bottom-4 right-4 z-20 bg-nvidia-green text-black px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest pointer-events-none">Output</div>
      <div className="absolute inset-y-0 flex items-center justify-center z-20 pointer-events-none" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <ChevronsLeftRight className="text-black w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
