import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'bordered' | 'panel';
}

export function Card({ className, variant = 'surface', ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'Card-Painel rounded-[var(--radius-md)] bg-[var(--surface)] transition-colors',
        variant === 'surface' && 'shadow-[var(--shadow-sm)]',
        variant === 'bordered' && 'border border-[var(--border)] shadow-[var(--shadow-sm)]',
        variant === 'panel' && 'border border-[var(--border)] bg-[var(--panel-bg)]',
        className,
      )}
      {...props}
    />
  );
}
