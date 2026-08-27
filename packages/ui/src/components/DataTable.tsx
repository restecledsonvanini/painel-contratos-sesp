import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import React from 'react';
import { cn } from '../lib/cn';
import { Pagination } from './Pagination';
import { Skeleton } from './Skeleton';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  totalRows?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  pageSizeOptions?: number[];
}

export function DataTable<TData>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  totalRows,
  loading,
  emptyMessage = 'Nenhum registro encontrado.',
  className,
  pageSizeOptions,
}: DataTableProps<TData>) {
  const paged = Boolean(pagination && onPaginationChange);
  const table = useReactTable({
    data,
    columns,
    pageCount: paged ? pageCount : 1,
    state: paged ? { pagination, sorting } : { sorting },
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: paged,
    manualSorting: true,
    enableSorting: Boolean(onSortingChange),
  });

  return (
    <div className={cn('space-y-[var(--space-md)]', className)}>
      <div className="hidden overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] md:block">
        <table className="w-full min-w-full border-collapse text-[var(--font-size-sm)]">
          <thead className="bg-[var(--surface-muted)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();
                  const label =
                    typeof header.column.columnDef.header === 'string'
                      ? header.column.columnDef.header
                      : header.column.id;
                  return (
                    <th
                      key={header.id}
                      className="border-b border-[var(--border)] px-[var(--space-md)] py-2 text-left font-semibold text-[var(--label-color)]"
                      aria-sort={
                        !canSort
                          ? undefined
                          : sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : 'none'
                      }
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 cursor-pointer hover:text-[var(--primary)]"
                          onClick={header.column.getToggleSortingHandler()}
                          aria-label={
                            sorted === 'asc'
                              ? `Ordenar ${label} decrescente`
                              : `Ordenar ${label} crescente`
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : null}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: pagination?.pageSize ?? 8 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {columns.map((_, j) => (
                    <td key={j} className="border-b border-[var(--border)] px-[var(--space-md)] py-3">
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-[var(--space-md)] py-8 text-center text-[var(--text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!loading &&
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--surface-muted)]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border-b border-[var(--border)] px-[var(--space-md)] py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-[var(--space-sm)] md:hidden">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-md)] border border-[var(--border)] p-[var(--space-md)]"
            >
              <Skeleton variant="card" />
            </div>
          ))}
        {!loading && data.length === 0 && (
          <p className="py-8 text-center text-[var(--text-muted)]">{emptyMessage}</p>
        )}
        {!loading &&
          table.getRowModel().rows.map((row) => (
            <article
              key={row.id}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-md)] shadow-[var(--shadow-sm)]"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="mb-2 last:mb-0">
                  <div className="text-[var(--font-size-xs)] font-semibold text-[var(--text-muted)]">
                    {typeof cell.column.columnDef.header === 'string'
                      ? cell.column.columnDef.header
                      : cell.column.id}
                  </div>
                  <div className="text-[var(--font-size-sm)] text-[var(--text)]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </article>
          ))}
      </div>

      {paged && pagination && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount ?? 1}
          totalRows={totalRows}
          onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
          onPageSizeChange={onPaginationChange ? (pageSize) => table.setPageSize(pageSize) : undefined}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

export type { ColumnDef, PaginationState, SortingState };
