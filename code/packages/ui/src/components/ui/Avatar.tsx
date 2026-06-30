import React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt = '', size = 'md', className }: AvatarProps) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold',
          sizeMap[size],
          className
        )}
      >
        <span className="text-sm">{alt.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', sizeMap[size], className)}
    />
  );
}
