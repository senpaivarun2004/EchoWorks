import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl', className)}>
      {children}
    </div>
  );
}
