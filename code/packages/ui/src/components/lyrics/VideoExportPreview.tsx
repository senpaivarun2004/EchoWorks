import React from 'react';
import type { LyricLine } from '@lyricshare/types';
import { cn } from '../../lib/utils';
import type { VideoExportSettingsType } from '@lyricshare/types';

interface VideoExportPreviewProps {
  lines: LyricLine[];
  currentLineIndex: number;
  currentWordIndex: number;
  settings: VideoExportSettingsType;
}

export function VideoExportPreview({
  lines,
  currentLineIndex,
  currentWordIndex,
  settings,
}: VideoExportPreviewProps) {
  const aspectRatio = settings.aspectRatio;
  const dimensions = aspectRatio === '9:16' ? { w: 720, h: 1280 } : aspectRatio === '16:9' ? { w: 1280, h: 720 } : { w: 720, h: 720 };

  const currentLine = lines[currentLineIndex];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-900 to-black shadow-2xl'
      )}
      style={{ aspectRatio: `${dimensions.w}/${dimensions.h}`, maxHeight: '70vh' }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center">
          {currentLine && (
            <p
              className="font-bold leading-relaxed text-white"
              style={{ fontSize: `${Math.min(dimensions.w / 20, 48)}px` }}
            >
              {currentLine.words.map((word, i) => (
                <span key={i} className={cn(i <= currentWordIndex ? 'text-accent-400' : 'text-white/60')}>
                  {word.word}{' '}
                </span>
              ))}
            </p>
          )}
          {settings.showTranslation && currentLine?.translation && (
            <p className="mt-4 text-white/50" style={{ fontSize: `${Math.min(dimensions.w / 30, 24)}px` }}>
              {currentLine.translation}
            </p>
          )}
          {settings.showRomanization && currentLine?.romanization && (
            <p className="mt-2 text-white/30 italic" style={{ fontSize: `${Math.min(dimensions.w / 35, 18)}px` }}>
              {currentLine.romanization}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
