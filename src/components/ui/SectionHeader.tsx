import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Badge, BadgeVariant } from './Badge';

export interface SectionHeaderProps {
  eyebrow?: string;
  badgeVariant?: BadgeVariant;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  badgeVariant = 'subtle',
  title,
  subtitle,
  align = 'left',
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mb-12 sm:mb-16', alignClasses[align], className)}>
      {eyebrow && (
        <div className="mb-4">
          <Badge variant={badgeVariant} dot>
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2
        className={cn(
          'text-display-h2 font-black tracking-tight text-slate-900 dark:text-white mb-4',
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-body-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
