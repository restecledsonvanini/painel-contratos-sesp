import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';
import { Card } from './Card';

interface KpiCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  variation?: number;
  variationLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  title,
  value,
  variation,
  variationLabel,
  icon,
  onClick,
  className,
}: KpiCardProps) {
  const positive = variation != null && variation >= 0;

  const content = (
    <>
      <div className="flex items-start justify-between gap-[var(--space-sm)]">
        <p className="text-[var(--font-size-sm)] font-semibold text-[var(--text-muted)]">{title}</p>
        {icon && <span className="text-[var(--primary)]">{icon}</span>}
      </div>
      <p className="mt-2 text-[var(--font-size-2xl)] font-bold text-[var(--heading)]">{value}</p>
      {variation != null && (
        <p
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-[var(--font-size-xs)] font-semibold',
            positive ? 'text-[var(--success)]' : 'text-[var(--danger)]',
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(variation).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
          {variationLabel && <span className="font-normal text-[var(--text-muted)]">{variationLabel}</span>}
        </p>
      )}
    </>
  );

  const cardClass = cn(
    'p-[var(--space-md)] text-left',
    onClick &&
      'cursor-pointer transition hover:border-[var(--primary)] hover:shadow-[var(--shadow)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none',
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        <Card variant="bordered" className={cardClass}>
          {content}
        </Card>
      </button>
    );
  }

  return (
    <Card variant="bordered" className={cardClass}>
      {content}
    </Card>
  );
}
