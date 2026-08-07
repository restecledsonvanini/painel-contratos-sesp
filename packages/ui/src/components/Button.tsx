import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        'Botão inline-flex items-center justify-center gap-2 font-semibold transition duration-150',
        'rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-55',
        size === 'sm' && 'px-3 py-1.5 text-[var(--font-size-sm)]',
        size === 'md' && 'px-4 py-2 text-[var(--font-size-sm)]',
        variant === 'primary' &&
          'bg-[var(--primary)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary-dark)]',
        variant === 'secondary' &&
          'border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
        variant === 'ghost' &&
          'bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]',
        variant === 'danger' &&
          'border border-transparent bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_18%,white)]',
        className,
      )}
      {...props}
    />
  );
});
Button.displayName = 'Button';
