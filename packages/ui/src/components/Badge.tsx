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

const STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  vigente: 'Vigente',
  vencendo: 'Vencendo',
  vencido: 'Vencido',
  suspenso: 'Suspenso',
  encerrado: 'Encerrado',
  cancelado: 'Cancelado',
  impedido: 'Impedido',
  inidoneo: 'Inidôneo',
  inidôneo: 'Inidôneo',
  pendente: 'Pendente',
  minuta: 'Minuta',
  assinado: 'Assinado',
  publicado: 'Publicado',
  alta: 'Alta',
  media: 'Média',
  média: 'Média',
  baixa: 'Baixa',
  info: 'Info',
  atencao: 'Atenção',
  atenção: 'Atenção',
  critico: 'Crítico',
  crítico: 'Crítico',
};

export function formatStatusLabel(status?: string | null): string {
  if (!status?.trim()) return 'Sem status';
  const key = status.trim().toLowerCase();
  if (STATUS_LABELS[key]) return STATUS_LABELS[key];
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (ch) => ch.toUpperCase());
}

export function badgeVariantFromStatus(status?: string | null): BadgeVariant {
  const n = String(status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  if (/(inativ|rascunho|minuta)/.test(n)) return 'default';
  if (/(imped|inidone|suspens|cancel|vencid|encerr)/.test(n)) return 'danger';
  if (/(vencend|proximo|aviso|pendente)/.test(n)) return 'warning';
  if (/(vigente|^ativo$| ativo|conclu|assinado|publicado)/.test(n)) return 'success';
  return 'default';
}
