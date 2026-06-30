import React from 'react';
import { cn } from '../../lib/utils';

interface TranslationOverlayProps {
  text: string;
  romanization?: string;
  isVisible: boolean;
  className?: string;
}

export function TranslationOverlay({
  text,
  romanization,
  isVisible,
  className,
}: TranslationOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'mt-2 space-y-1 text-center transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      <p className="text-sm text-gray-300">{text}</p>
      {romanization && (
        <p className="text-xs text-gray-500 italic">{romanization}</p>
      )}
    </div>
  );
}
