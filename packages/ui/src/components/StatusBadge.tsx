import clsx from 'clsx';
import React from 'react';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string | null;
}

function getBadgeVariant(status?: string | null) {
  const normalized = String(status || '').toLowerCase();

  if (normalized.includes('vigente') || normalized.includes('ativo') || normalized.includes('ativo')) {
    return 'success';
  }

  if (normalized.includes('vencendo') || normalized.includes('próximo') || normalized.includes('aviso')) {
    return 'warning';
  }

  if (normalized.includes('suspenso') || normalized.includes('cancelado') || normalized.includes('vencido')) {
    return 'danger';
  }

  return 'default';
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const variant = getBadgeVariant(status);

  const variantClasses = {
    default: 'bg-[var(--surface)] text-[var(--text)] ring-1 ring-[var(--border)]',
    success: 'bg-[var(--primary-light)] text-[var(--primary)]',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        variantClasses[variant as keyof typeof variantClasses],
        className,
      )}
      {...props}
    >
      {status || 'Sem status'}
    </span>
  );
}
