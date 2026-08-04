import clsx from 'clsx';
import React from 'react';

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={clsx('Tabela-Dados min-w-full divide-y divide-[var(--border)] text-[var(--font-size-sm)]', className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={clsx('bg-[var(--panel-bg)]', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={clsx('divide-y divide-[var(--border)] bg-[var(--surface)]', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={clsx('hover:bg-[var(--surface-muted)]/80', className)} {...props} />;
}

export function TableHeader({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        'px-3 py-3 text-left text-[var(--font-size-xs)] font-bold uppercase tracking-wide text-[var(--text-muted)]',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('px-3 py-3 align-middle text-[var(--text)]', className)} {...props} />;
}
