import React from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeVariant =
  | 'default'
  | 'growth'
  | 'tech'
  | 'talent'
  | 'outline'
  | 'subtle'
  | 'success';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    growth: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    tech: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    talent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    outline: 'bg-transparent text-slate-400 border-slate-700',
    subtle: 'bg-white/5 text-slate-300 border-white/10',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  const dotColors = {
    default: 'bg-slate-400',
    growth: 'bg-orange-400',
    tech: 'bg-blue-400',
    talent: 'bg-emerald-400',
    outline: 'bg-slate-400',
    subtle: 'bg-sky-400',
    success: 'bg-emerald-400',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-wide',
    md: 'px-3 py-1 text-xs font-medium tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors select-none font-mono uppercase tracking-wider',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
