import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'outline' | 'growth' | 'tech' | 'talent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  const variantClasses = {
    default: 'bg-[#0F1626] border border-white/8 shadow-sm',
    glass: 'bg-[#0F1626]/70 backdrop-blur-xl border border-white/10 shadow-lg',
    interactive:
      'bg-[#0F1626] border border-white/8 hover:border-white/20 hover:bg-[#141D30] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm',
    outline: 'bg-transparent border border-white/12 hover:border-white/25 transition-colors',
    growth:
      'bg-[#0F1626] border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#15121c] transition-all duration-300 hover:-translate-y-1',
    tech:
      'bg-[#0F1626] border border-blue-500/20 hover:border-blue-500/50 hover:bg-[#0d1728] transition-all duration-300 hover:-translate-y-1',
    talent:
      'bg-[#0F1626] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0c1c18] transition-all duration-300 hover:-translate-y-1',
  };

  return (
    <div
      className={cn('rounded-2xl transition-all', paddingClasses[padding], variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
