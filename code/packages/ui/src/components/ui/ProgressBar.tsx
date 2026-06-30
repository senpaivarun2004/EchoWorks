import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={cn('h-1 bg-white/10 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-accent-400 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  );
}
