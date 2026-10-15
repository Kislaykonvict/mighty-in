'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'growth'
  | 'tech'
  | 'talent'
  | 'white';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  external?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      external,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3.5 py-1.5 text-xs font-medium gap-1.5 rounded-lg',
      md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
      lg: 'px-7 py-3.5 text-base font-semibold gap-2.5 rounded-xl',
    };

    const variantClasses = {
      primary:
        'bg-white text-slate-950 hover:bg-slate-100 active:bg-slate-200 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-white/40',
      secondary:
        'bg-slate-800/80 text-white hover:bg-slate-700/80 active:bg-slate-750 border border-white/10 hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-white/20',
      outline:
        'bg-transparent text-slate-200 border border-white/20 hover:border-white/40 hover:bg-white/5 active:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-white/20',
      ghost:
        'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-white/10',
      growth:
        'bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-lg shadow-orange-500/20 active:opacity-95 transition-all focus-visible:ring-2 focus-visible:ring-orange-400',
      tech:
        'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20 active:opacity-95 transition-all focus-visible:ring-2 focus-visible:ring-blue-400',
      talent:
        'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 active:opacity-95 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400',
      white:
        'bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 font-semibold shadow-md',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center font-sans select-none tracking-tight outline-none focus:outline-none focus-visible:outline-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
      </>
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
          >
            {content}
          </a>
        );
      }
      return (
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
