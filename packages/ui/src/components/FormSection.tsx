import React from 'react';
import { cn } from '../lib/cn';

interface FormSectionProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <section className={cn('app-form__panel', className)}>
      {(title || description) && (
        <header className="mb-[var(--space-md)]">
          {title && (
            <h2 className="text-[var(--font-size-md)] font-semibold text-[var(--heading)]">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-[var(--font-size-sm)] text-[var(--text-muted)]">{description}</p>
          )}
        </header>
      )}
      <div className={cn('app-form__grid', className)}>{children}</div>
    </section>
  );
}
