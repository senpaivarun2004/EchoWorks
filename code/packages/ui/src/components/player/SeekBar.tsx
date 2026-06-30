import React from 'react';
import { cn } from '../../lib/utils';
import { Slider } from '../ui/Slider';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SeekBar({ currentTime, duration, onSeek, className }: SeekBarProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-xs text-white/40 w-10 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>
      <Slider
        value={currentTime}
        min={0}
        max={duration || 1}
        step={0.1}
        onChange={onSeek}
        className="flex-1"
      />
      <span className="text-xs text-white/40 w-10 tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
}
