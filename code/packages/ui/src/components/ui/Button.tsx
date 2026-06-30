import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-accent-500 text-white hover:bg-accent-400 active:bg-accent-600',
        variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
        variant === 'ghost' && 'text-white/60 hover:text-white hover:bg-white/5',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2 text-base',
        size === 'lg' && 'px-8 py-3 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
