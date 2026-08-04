import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

interface ErrorStateProps {
  title?: React.ReactNode;
  message?: React.ReactNode;
  code?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message,
  code,
  onRetry,
  retryLabel = 'Tentar novamente',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--danger)_35%,var(--border))]',
        'bg-[color-mix(in_srgb,var(--danger)_6%,var(--surface))] px-[var(--space-lg)] py-[var(--space-2xl)] text-center',
        className,
      )}
      role="alert"
    >
      <AlertTriangle className="mb-[var(--space-md)] h-10 w-10 text-[var(--danger)]" aria-hidden />
      <h3 className="text-[var(--font-size-md)] font-semibold text-[var(--text)]">{title}</h3>
      {message && (
        <p className="mt-2 max-w-md text-[var(--font-size-sm)] text-[var(--text-muted)]">{message}</p>
      )}
      {code && (
        <p className="mt-2 font-mono text-[var(--font-size-xs)] text-[var(--danger)]">Código: {code}</p>
      )}
      {onRetry && (
        <Button className="mt-[var(--space-md)]" variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
