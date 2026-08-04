import React from 'react';
import { cn } from '../lib/cn';

interface ProgressProps {
  value: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, label, showValue, className }: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('space-y-[var(--space-xs)]', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-[var(--space-sm)] text-[var(--font-size-sm)]">
          {label && <span className="font-semibold text-[var(--text)]">{label}</span>}
          {showValue && <span className="tabular-nums text-[var(--text-muted)]">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-[var(--radius-sm)] bg-[var(--primary)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
