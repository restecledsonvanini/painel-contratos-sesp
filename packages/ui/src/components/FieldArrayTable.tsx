import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table';

export type FieldArrayTableColumn = {
  id: string;
  header: string;
  className?: string;
  headerClassName?: string;
  width?: string;
  align?: 'left' | 'right' | 'center';
};

interface FieldArrayTableProps<T> {
  columns: FieldArrayTableColumn[];
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderCells: (item: T, index: number) => React.ReactNode[];
  addLabel?: string;
  emptyLabel?: string;
  minItems?: number;
  className?: string;
}

export function FieldArrayTable<T>({
  columns,
  items,
  onAdd,
  onRemove,
  renderCells,
  addLabel = 'Adicionar linha',
  emptyLabel = 'Nenhuma linha.',
  minItems = 0,
  className,
}: FieldArrayTableProps<T>) {
  return (
    <div className={cn('app-form__array-table space-y-3', className)}>
      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
        <Table className="app-form__array-table__table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeader
                  key={col.id}
                  className={cn(
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.headerClassName,
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </TableHeader>
              ))}
              <TableHeader className="w-11 px-2 text-center">
                <span className="sr-only">Ações</span>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-6 text-center text-[var(--text-muted)]"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={index}>
                  {renderCells(item, index).map((cell, cellIndex) => (
                    <TableCell
                      key={columns[cellIndex]?.id ?? cellIndex}
                      className={cn(
                        columns[cellIndex]?.align === 'right' && 'text-right',
                        columns[cellIndex]?.align === 'center' && 'text-center',
                        columns[cellIndex]?.className,
                      )}
                    >
                      {cell}
                    </TableCell>
                  ))}
                  <TableCell className="w-11 px-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(index)}
                      disabled={items.length <= minItems}
                      aria-label={`Remover linha ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 shrink-0 text-[var(--danger)]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 shrink-0" />
        {addLabel}
      </Button>
    </div>
  );
}
