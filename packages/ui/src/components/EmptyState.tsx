import { Inbox } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-[var(--border)]',
        'bg-[var(--surface-muted)] px-[var(--space-lg)] py-[var(--space-2xl)] text-center',
        className,
      )}
    >
      <div className="mb-[var(--space-md)] text-[var(--text-muted)]">
        {icon ?? <Inbox className="mx-auto h-10 w-10" aria-hidden />}
      </div>
      <h3 className="text-[var(--font-size-md)] font-semibold text-[var(--text)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-[var(--font-size-sm)] text-[var(--text-muted)]">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-[var(--space-md)]" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
