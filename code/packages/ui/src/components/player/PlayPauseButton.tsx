import React from 'react';
import { cn } from '../../lib/utils';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PlayPauseButton({
  isPlaying,
  onToggle,
  size = 'md',
  className,
}: PlayPauseButtonProps) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSize = {
    sm: 18,
    md: 24,
    lg: 36,
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        'flex items-center justify-center rounded-full bg-accent-500 text-white hover:bg-accent-400 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-accent-500/25',
        sizeMap[size],
        className
      )}
    >
      {isPlaying ? (
        <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
