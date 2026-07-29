import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'bordered';
}

export function Card({ className, variant = 'surface', ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-md bg-[var(--surface)] p-6 shadow-sm transition-colors',
        variant === 'bordered' && 'border border-[var(--border)]',
        className,
      )}
      {...props}
    />
  );
}
