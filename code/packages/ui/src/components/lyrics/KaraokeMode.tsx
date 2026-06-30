import React, { useRef, useEffect } from 'react';
import type { LyricLine } from '@lyricshare/types';
import { cn } from '../../lib/utils';

interface KaraokeModeProps {
  lines: LyricLine[];
  currentLineIndex: number;
  currentWordIndex: number;
  lineProgress: number;
  onClose?: () => void;
  className?: string;
}

export function KaraokeMode({
  lines,
  currentLineIndex,
  currentWordIndex,
  lineProgress,
  onClose,
  className,
}: KaraokeModeProps) {
  const currentLine = lines[currentLineIndex];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black',
        className
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center max-w-2xl px-8">
        {currentLine && (
          <div className="mb-8">
            <p className="text-5xl font-bold leading-relaxed text-white">
              {currentLine.words.map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    'transition-colors duration-75',
                    i <= currentWordIndex ? 'text-accent-400' : 'text-white/30'
                  )}
                >
                  {word.word}{' '}
                </span>
              ))}
            </p>
          </div>
        )}

        {currentLineIndex + 1 < lines.length && (
          <p className="text-2xl text-white/20 mt-4">
            {lines[currentLineIndex + 1].text}
          </p>
        )}
      </div>
    </div>
  );
}
