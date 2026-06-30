import React from 'react';
import { cn } from '../../lib/utils';

interface WordHighlightProps {
  word: string;
  isActive: boolean;
  progress: number;
  className?: string;
}

export function WordHighlight({ word, isActive, progress, className }: WordHighlightProps) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="text-white/40">{word}</span>
      {isActive && (
        <span
          className="absolute inset-0 overflow-hidden text-white transition-all duration-75"
          style={{ width: `${progress * 100}%` }}
        >
          {word}
        </span>
      )}
    </span>
  );
}
