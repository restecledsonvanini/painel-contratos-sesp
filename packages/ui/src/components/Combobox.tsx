import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';
import { Popover } from './Popover';

export interface ComboboxOption {
  id: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onCreate?: (query: string) => void | Promise<void>;
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
}

export function Combobox({
  options,
  value,
  onChange,
  onCreate,
  loading,
  placeholder = 'Buscar…',
  emptyMessage = 'Nenhum resultado.',
  disabled,
  label,
  hint,
  error,
  className,
  renderOption,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = options.find((o) => o.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const showCreate =
    onCreate &&
    query.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className={cn('block text-[var(--font-size-sm)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            type="button"
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              inputBaseClass,
              'inline-flex items-center justify-between gap-2 text-left',
              !selected && 'text-[var(--text-muted)]',
            )}
          >
            <span className="truncate">{selected?.label ?? placeholder}</span>
            {loading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--text-muted)]" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
            )}
          </button>
        }
        contentClassName="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command shouldFilter={false} className="rounded-[var(--radius-md)]">
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder={placeholder}
            className={cn(
              'w-full border-b border-[var(--border)] bg-transparent px-[var(--space-md)] py-2',
              'text-[var(--font-size-sm)] text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]',
            )}
          />
          <Command.List className="max-h-60 overflow-y-auto p-1">
            {loading && (
              <div className="flex items-center gap-2 px-[var(--space-sm)] py-2 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando…
              </div>
            )}
            {!loading && filtered.length === 0 && !showCreate && (
              <Command.Empty className="px-[var(--space-sm)] py-2 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                {emptyMessage}
              </Command.Empty>
            )}
            {filtered.map((option) => (
              <Command.Item
                key={option.id}
                value={option.id}
                onSelect={() => {
                  onChange?.(option.id);
                  setOpen(false);
                  setQuery('');
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-[var(--space-sm)] py-2',
                  'text-[var(--font-size-sm)] text-[var(--text)]',
                  'aria-selected:bg-[var(--primary-light)] aria-selected:text-[var(--primary-dark)]',
                )}
              >
                <Check
                  className={cn('h-4 w-4 shrink-0', value === option.id ? 'opacity-100' : 'opacity-0')}
                />
                {renderOption ? renderOption(option) : option.label}
              </Command.Item>
            ))}
            {showCreate && (
              <Command.Item
                value={`__create__${query}`}
                onSelect={() => {
                  onCreate?.(query.trim());
                  setOpen(false);
                  setQuery('');
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-[var(--space-sm)] py-2',
                  'text-[var(--font-size-sm)] font-semibold text-[var(--primary)]',
                  'aria-selected:bg-[var(--primary-light)]',
                )}
              >
                <Plus className="h-4 w-4" />
                Cadastrar «{query.trim()}»
              </Command.Item>
            )}
          </Command.List>
        </Command>
      </Popover>
      {hint && !error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
