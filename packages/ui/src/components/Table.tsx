import clsx from 'clsx';
import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}
interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function Table({ className, ...props }: TableProps) {
  return <table className={clsx('min-w-full divide-y divide-[var(--border)] text-sm', className)} {...props} />;
}

export function TableHead({ className, ...props }: TableHeadProps) {
  return <thead className={clsx('bg-white', className)} {...props} />;
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={clsx(className)} {...props} />;
}

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={clsx(className)} {...props} />;
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <th
    className={clsx('px-4 py-4 text-left font-semibold text-slate-500', className)}
    {...props}
  />;
}

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={clsx('px-4 py-4 text-[var(--text)]', className)} {...props} />;
}
