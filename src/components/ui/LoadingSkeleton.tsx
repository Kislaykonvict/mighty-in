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
    <div className="bg-[#0F1626] border border-white/8 rounded-2xl overflow-hidden p-6">
      <Skeleton className="w-full h-56 mb-5" />
      <Skeleton variant="text" className="w-24 mb-3" />
      <Skeleton variant="text" className="w-3/4 h-6 mb-2" />
      <Skeleton variant="text" className="w-full mb-1" />
      <Skeleton variant="text" className="w-2/3 mb-6" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
    </div>
  );
}
