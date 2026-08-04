import clsx from 'clsx';
import React from 'react';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string | null;
}

function getBadgeVariant(status?: string | null) {
  const normalized = String(status || '').toLowerCase();

  if (normalized.includes('vigente') || normalized.includes('ativo') || normalized.includes('conclu')) {
    return 'success';
  }

  if (normalized.includes('vencendo') || normalized.includes('próximo') || normalized.includes('aviso') || normalized.includes('pendente')) {
    return 'warning';
  }

  if (
    normalized.includes('suspenso') ||
    normalized.includes('cancelado') ||
    normalized.includes('vencido') ||
    normalized.includes('encerrado')
  ) {
    return 'danger';
  }

  return 'default';
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const variant = getBadgeVariant(status);

  const variantClasses = {
    default: 'bg-[var(--surface-muted)] text-[var(--secondary)] ring-1 ring-[var(--border)]',
    success: 'bg-[color-mix(in_srgb,var(--success)_16%,white)] text-[color-mix(in_srgb,var(--success)_70%,black)]',
    warning: 'bg-[color-mix(in_srgb,var(--warning)_16%,white)] text-[color-mix(in_srgb,var(--warning)_75%,black)]',
    danger: 'bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1 text-[var(--font-size-xs)] font-semibold',
        variantClasses[variant as keyof typeof variantClasses],
        className,
      )}
      {...props}
    >
      {status || 'Sem status'}
    </span>
  );
}
