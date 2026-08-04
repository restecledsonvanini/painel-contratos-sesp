import React from 'react';
import { cn } from '../lib/cn';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--surface-muted)] text-[var(--secondary)] ring-1 ring-[var(--border)]',
  success:
    'bg-[color-mix(in_srgb,var(--success)_16%,white)] text-[color-mix(in_srgb,var(--success)_70%,black)]',
  warning:
    'bg-[color-mix(in_srgb,var(--warning)_16%,white)] text-[color-mix(in_srgb,var(--warning)_75%,black)]',
  danger: 'bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)]',
  info: 'bg-[color-mix(in_srgb,var(--primary)_12%,white)] text-[var(--primary)]',
  primary: 'bg-[var(--primary)] text-[var(--text-inverse)]',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1 text-[var(--font-size-xs)] font-semibold',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function badgeVariantFromStatus(status?: string | null): BadgeVariant {
  const normalized = String(status || '').toLowerCase();

  if (normalized.includes('vigente') || normalized.includes('ativo') || normalized.includes('conclu')) {
    return 'success';
  }
  if (
    normalized.includes('vencendo') ||
    normalized.includes('próximo') ||
    normalized.includes('aviso') ||
    normalized.includes('pendente')
  ) {
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
