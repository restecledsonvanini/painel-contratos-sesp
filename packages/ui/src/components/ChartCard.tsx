import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { cn } from '../lib/cn';
import { Card } from './Card';

interface ChartCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  atualizadoEm?: string | Date;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  atualizadoEm,
  actions,
  children,
  className,
}: ChartCardProps) {
  const updatedLabel =
    atualizadoEm != null
      ? format(atualizadoEm instanceof Date ? atualizadoEm : new Date(atualizadoEm), "dd/MM/yyyy 'às' HH:mm", {
          locale: ptBR,
        })
      : null;

  return (
    <Card variant="bordered" className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-start justify-between gap-[var(--space-sm)] border-b border-[var(--border)] px-[var(--space-md)] py-[var(--space-md)]">
        <div>
          <h3 className="text-[var(--font-size-md)] font-semibold text-[var(--heading)]">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-[var(--font-size-sm)] text-[var(--text-muted)]">{subtitle}</p>
          )}
          {updatedLabel && (
            <p className="mt-1 text-[var(--font-size-xs)] text-[var(--text-muted)]">
              Atualizado em {updatedLabel}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-[var(--space-sm)]">{actions}</div>}
      </div>
      <div className="p-[var(--space-md)]">{children}</div>
    </Card>
  );
}
