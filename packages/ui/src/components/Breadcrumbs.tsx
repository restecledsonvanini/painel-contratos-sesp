import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/cn';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[var(--font-size-sm)]', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden />
              )}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast ? 'font-semibold text-[var(--text)]' : 'text-[var(--text-muted)]')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
