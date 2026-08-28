import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

interface FieldArrayListProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  emptyLabel?: string;
  className?: string;
  minItems?: number;
}

export function FieldArrayList<T>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = 'Adicionar linha',
  emptyLabel = 'Nenhuma linha adicionada.',
  className,
  minItems = 0,
}: FieldArrayListProps<T>) {
  return (
    <div className={cn('space-y-[var(--space-md)]', className)}>
      {items.length === 0 && (
        <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">{emptyLabel}</p>
      )}
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-[var(--space-sm)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-[var(--space-md)]"
        >
          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={items.length <= minItems}
            aria-label="Remover linha"
          >
            <Trash2 className="h-4 w-4 text-[var(--danger)]" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 shrink-0" />
        {addLabel}
      </Button>
    </div>
  );
}
