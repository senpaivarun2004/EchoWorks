import React from 'react';
import { cn } from '../../lib/utils';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export function VolumeControl({ volume, onVolumeChange, className }: VolumeControlProps) {
  const icon = volume === 0
    ? 'M16.5 9l-6 6H3v-6h7.5l6-6v12z'
    : volume < 0.5
    ? 'M16.5 9l-6 6H3v-6h7.5l6-6v12zM18.5 8.5a3 3 0 010 7'
    : 'M16.5 9l-6 6H3v-6h7.5l6-6v12zM18.5 8.5a3 3 0 010 7M21 6a6 6 0 010 12';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
        className="text-white/40 hover:text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {volume > 0 && <path d={icon} />}
        </svg>
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-20 h-1 accent-accent-400 cursor-pointer"
      />
    </div>
  );
}
