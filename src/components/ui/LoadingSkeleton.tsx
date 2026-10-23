import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 my-1.5',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-800/60 border border-white/5',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[16/10] rounded-2xl" />
      <div className="px-1 space-y-1.5">
        <Skeleton variant="text" className="w-36 h-4" />
        <Skeleton variant="text" className="w-24 h-3" />
      </div>
    </div>
  );
}
