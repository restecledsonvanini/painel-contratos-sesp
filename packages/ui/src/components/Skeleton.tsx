import React from 'react';
import { cn } from '../lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'card' | 'table';
  lines?: number;
}

export function Skeleton({ variant = 'text', lines = 3, className, ...props }: SkeletonProps) {
  const status = {
    role: 'status' as const,
    'aria-busy': true,
    'aria-live': 'polite' as const,
  };

  if (variant === 'card') {
    return (
      <div className={cn('space-y-2', className)} {...status} {...props}>
        <span className="sr-only">Carregando</span>
        <div
          className="h-24 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--surface-muted)]"
          aria-hidden
        />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)} {...status} {...props}>
        <span className="sr-only">Carregando</span>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('max-w-xs', className)} {...status} {...props}>
      <span className="sr-only">Carregando</span>
      <div
        className="h-4 w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
        aria-hidden
      />
    </div>
  );
}
