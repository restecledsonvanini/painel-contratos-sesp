import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renderiza um Link com o mesmo visual — evita <a><button>. */
  to?: string;
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return clsx(
    'Botão inline-flex items-center justify-center gap-2 font-semibold transition duration-150',
    'rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
    'disabled:cursor-not-allowed disabled:opacity-55',
    size === 'sm' && 'px-3 py-1.5 text-[var(--font-size-sm)]',
    size === 'md' && 'px-4 py-2 text-[var(--font-size-sm)]',
    size === 'icon' && 'h-8 w-8 shrink-0 p-0',
    variant === 'primary' &&
      'bg-[var(--primary)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary-dark)]',
    variant === 'secondary' &&
      'border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]',
    variant === 'ghost' &&
      'bg-transparent text-[var(--primary)] hover:bg-[var(--primary-light)]',
    variant === 'danger' &&
      'border border-transparent bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_18%,white)]',
    className,
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', to, disabled, ...props },
  ref,
) {
  const classes = buttonClassName({ variant, size, className });

  if (to) {
    const { children, onClick, ...rest } = props;
    return (
      <Link
        ref={ref as never}
        to={to}
        className={clsx(classes, disabled && 'pointer-events-none opacity-55')}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={(e) => {
          if (disabled) e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return <button ref={ref} type={type} disabled={disabled} className={classes} {...props} />;
});
Button.displayName = 'Button';
