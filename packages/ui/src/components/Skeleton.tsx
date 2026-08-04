import React from 'react';
import { cn } from '../lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'table';
  lines?: number;
}

export function Skeleton({ variant = 'text', lines = 3, className, ...props }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-muted)]',
          'h-24 w-full',
          className,
        )}
        aria-hidden
        {...props}
      />
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)} aria-hidden {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('h-4 w-full max-w-xs animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-muted)]', className)}
      aria-hidden
      {...props}
    />
  );
}
