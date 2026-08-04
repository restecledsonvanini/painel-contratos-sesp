import React from 'react';
import { cn } from '../lib/cn';

export interface DescriptionListItem {
  term: React.ReactNode;
  detail: React.ReactNode;
}

interface DescriptionListProps {
  items: DescriptionListItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function DescriptionList({ items, columns = 1, className }: DescriptionListProps) {
  return (
    <dl
      className={cn(
        'grid gap-[var(--space-md)]',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="min-w-0">
          <dt className="text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            {item.term}
          </dt>
          <dd className="mt-1 text-[var(--font-size-sm)] text-[var(--text)]">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
