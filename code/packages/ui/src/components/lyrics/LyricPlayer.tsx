import React, { useRef, useEffect, useCallback, useState } from 'react';
import type { LyricLine, LyricWord } from '@lyricshare/types';
import { cn } from '../../lib/utils';

interface LyricPlayerProps {
  lines: LyricLine[];
  currentLineIndex: number;
  currentWordIndex: number;
  lineProgress: number;
  translations?: Record<number, string>;
  romanizations?: Record<number, string>;
  showTranslation?: boolean;
  showRomanization?: boolean;
  onLineClick?: (index: number) => void;
  className?: string;
}

export function LyricPlayer({
  lines,
  currentLineIndex,
  currentWordIndex,
  lineProgress,
  translations,
  romanizations,
  showTranslation = false,
  showRomanization = false,
  onLineClick,
  className,
}: LyricPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = lineRefs.current[currentLineIndex];
    if (el && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = el.getBoundingClientRect();
      const offset = elementRect.top - containerRect.top - containerRect.height / 2 + elementRect.height / 2;
      container.scrollBy({ top: offset, behavior: 'smooth' });
    }
  }, [currentLineIndex]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-y-auto h-full scroll-smooth', className)}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className="py-32">
        {lines.map((line, i) => (
          <div
            key={i}
            ref={(el) => { lineRefs.current[i] = el; }}
            onClick={() => onLineClick?.(i)}
            className={cn(
              'cursor-pointer px-6 py-2 transition-all duration-300',
              i === currentLineIndex
                ? 'scale-100 opacity-100'
                : i < currentLineIndex
                ? 'scale-90 opacity-30'
                : 'scale-90 opacity-40'
            )}
          >
            <LyricLineContent
              line={line}
              isActive={i === currentLineIndex}
              currentWordIndex={currentWordIndex}
              lineProgress={lineProgress}
            />
            {showTranslation && translations?.[i] && (
              <p className="mt-1 text-sm text-gray-400">{translations[i]}</p>
            )}
            {showRomanization && romanizations?.[i] && (
              <p className="mt-1 text-sm text-gray-500 italic">{romanizations[i]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface LyricLineContentProps {
  line: LyricLine;
  isActive: boolean;
  currentWordIndex: number;
  lineProgress: number;
}

function LyricLineContent({ line, isActive, currentWordIndex, lineProgress }: LyricLineContentProps) {
  if (!line.words || line.words.length === 0) {
    return (
      <p
        className={cn(
          'text-2xl font-medium leading-relaxed',
          isActive ? 'text-white' : 'text-white'
        )}
      >
        {line.text}
      </p>
    );
  }

  return (
    <p className="text-2xl font-medium leading-relaxed">
      {line.words.map((word, i) => (
        <span
          key={i}
          className={cn(
            'transition-colors duration-150',
            isActive && i <= currentWordIndex
              ? 'text-white'
              : 'text-white/40'
          )}
        >
          {word.word}{' '}
        </span>
      ))}
    </p>
  );
}
