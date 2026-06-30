import React from 'react';
import { cn } from '../../lib/utils';

interface MiniPlayerProps {
  currentLine: string;
  progress: number;
  className?: string;
}

export function MiniPlayer({ currentLine, progress, className }: MiniPlayerProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3',
        className
      )}
    >
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-white/80 text-center truncate">
          {currentLine || ' '}
        </p>
        <div className="mt-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-400 transition-all duration-150 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
