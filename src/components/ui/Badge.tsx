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
    default: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
    growth: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
    tech: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
    talent: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
    outline: 'bg-transparent text-slate-600 border-slate-300 dark:text-slate-400 dark:border-slate-700',
    subtle: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
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
