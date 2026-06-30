import React from 'react';
import type { LyricLine } from '@lyricshare/types';
import { cn } from '../../lib/utils';

interface LyricLineProps {
  line: LyricLine;
  isActive: boolean;
  currentWordIndex: number;
  onClick?: () => void;
  className?: string;
}

export function LyricLine_({
  line,
  isActive,
  currentWordIndex,
  onClick,
  className,
}: LyricLineProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-6 py-2 cursor-pointer transition-all duration-300',
        isActive ? 'scale-100' : 'scale-90 opacity-40',
        className
      )}
    >
      <p className="text-2xl font-medium leading-relaxed">
        {line.words.map((word, i) => (
          <span
            key={i}
            className={cn(
              'transition-colors duration-150',
              isActive && i <= currentWordIndex ? 'text-white' : 'text-white/40'
            )}
          >
            {word.word}{' '}
          </span>
        ))}
      </p>
    </div>
  );
}
