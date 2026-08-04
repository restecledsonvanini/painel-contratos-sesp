import React from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows?: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className,
}: PaginationProps) {
  const currentPage = pageIndex + 1;
  const canPrev = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <div
      className={cn(
        'flex flex-col gap-[var(--space-sm)] sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
        {totalRows != null ? (
          <>
            {totalRows} registro{totalRows === 1 ? '' : 's'} · Página {currentPage} de {Math.max(pageCount, 1)}
          </>
        ) : (
          <>Página {currentPage} de {Math.max(pageCount, 1)}</>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Por página
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'rounded-[var(--radius-sm)] border border-[var(--input-border)] bg-[var(--input-bg)]',
                'px-2 py-1 text-[var(--font-size-sm)] text-[var(--text)]',
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button size="sm" variant="secondary" onClick={() => onPageChange(0)} disabled={!canPrev}>
          Primeira
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onPageChange(pageIndex - 1)} disabled={!canPrev}>
          Anterior
        </Button>
        <Button size="sm" variant="secondary" onClick={() => onPageChange(pageIndex + 1)} disabled={!canNext}>
          Próxima
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNext}
        >
          Última
        </Button>
      </div>
    </div>
  );
}
