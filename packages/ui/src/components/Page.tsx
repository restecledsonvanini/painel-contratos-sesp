import clsx from 'clsx';
import React from 'react';

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

/** Container de página full-width — padding único (sem max-width estreito). */
export function Page({ title, description, actions, className, children, ...props }: PageProps) {
  return (
    <div className={clsx('Página-App mx-auto w-full space-y-[var(--space-lg)]', className)} {...props}>
      {(title || actions) && (
        <div className="Bloco-PageHeader flex flex-col gap-3 border-b border-[var(--border)] pb-[var(--space-md)] sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h1 className="text-[var(--font-size-xl)] font-bold text-[var(--primary)] sm:text-[var(--font-size-2xl)]">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-[var(--font-size-sm)] text-[var(--text-muted)]">{description}</p>
            )}
          </div>
          {actions && <div className="Bloco-Toolbar flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
