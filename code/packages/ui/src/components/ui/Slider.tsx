import React, { useCallback, useRef } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function Slider({
  value,
  min = 0,
  max = 1,
  step = 0.001,
  onChange,
  className,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const updateValue = (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = min + ratio * (max - min);
      const stepped = Math.round(val / step) * step;
      onChange?.(Math.max(min, Math.min(max, stepped)));
    };

    updateValue(e.clientX);

    const handleMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [min, max, step, onChange]);

  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div
      ref={trackRef}
      className={cn('relative h-1 bg-white/10 rounded-full cursor-pointer group', className)}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute inset-y-0 left-0 bg-accent-400 rounded-full transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${progress}% - 6px)` }}
      />
    </div>
  );
}
