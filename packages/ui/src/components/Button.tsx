import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
        variant === 'primary' && 'bg-[var(--primary)] text-[var(--text-inverse)] shadow-sm hover:bg-[var(--primary-dark)]',
        variant === 'secondary' && 'bg-[var(--surface)] text-[var(--text)] shadow-sm hover:bg-slate-100 border border-[var(--border)]',
        variant === 'ghost' && 'bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]',
        className,
      )}
      {...props}
    />
  );
}
