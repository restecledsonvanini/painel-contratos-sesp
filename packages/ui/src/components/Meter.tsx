import React from 'react';
import { cn } from '../lib/cn';

interface MeterProps {
  value: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  thresholds?: { amber: number; red: number };
  className?: string;
}

export function Meter({
  value,
  max = 100,
  label,
  showValue = true,
  thresholds = { amber: 50, red: 75 },
  className,
}: MeterProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor =
    pct >= thresholds.red
      ? 'var(--danger)'
      : pct >= thresholds.amber
        ? 'var(--warning)'
        : 'var(--success)';

  return (
    <div className={cn('space-y-[var(--space-xs)]', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-[var(--space-sm)] text-[var(--font-size-sm)]">
          {label && <span className="font-semibold text-[var(--text)]">{label}</span>}
          {showValue && (
            <span className="tabular-nums text-[var(--text-muted)]">
              {value.toLocaleString('pt-BR')} / {max.toLocaleString('pt-BR')} ({pct.toFixed(0)}%)
            </span>
          )}
        </div>
      )}
      <div
        className="relative h-3 w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={typeof label === 'string' ? label : 'Medidor'}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-[var(--radius-sm)] transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 border-r border-[var(--border-strong)]"
          style={{ left: `${thresholds.amber}%` }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 border-r border-[var(--border-strong)]"
          style={{ left: `${thresholds.red}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
