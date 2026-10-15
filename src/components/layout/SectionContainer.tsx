import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'header' | 'footer';
  width?: 'default' | 'narrow' | 'wide' | 'full';
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionContainer({
  as: Component = 'section',
  width = 'default',
  paddingY = 'lg',
  className,
  children,
  ...props
}: SectionContainerProps) {
  const widthClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: 'py-0',
    sm: 'py-8 sm:py-12',
    md: 'py-14 sm:py-20',
    lg: 'py-20 sm:py-28',
    xl: 'py-24 sm:py-36',
  };

  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 relative',
        widthClasses[width],
        paddingClasses[paddingY],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
