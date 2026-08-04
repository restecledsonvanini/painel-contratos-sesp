import { X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';
import { ComboboxOption } from './Combobox';

interface MultiSelectProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione…',
  disabled,
  label,
  hint,
  error,
  className,
}: MultiSelectProps) {
  const [query, setQuery] = useState('');

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.id)),
    [options, value],
  );

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options.filter(
      (o) => !value.includes(o.id) && (!q || o.label.toLowerCase().includes(q)),
    );
  }, [options, value, query]);

  const add = (id: string) => {
    if (!value.includes(id)) onChange([...value, id]);
    setQuery('');
  };

  const remove = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className={cn('block text-[var(--font-size-sm)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <div
        className={cn(
          inputBaseClass,
          'flex min-h-[2.5rem] flex-wrap items-center gap-1.5 py-1.5',
          disabled && 'pointer-events-none opacity-55',
        )}
      >
        {selectedOptions.map((option) => (
          <span
            key={option.id}
            className={cn(
              'inline-flex items-center gap-1 rounded-[var(--radius-sm)]',
              'bg-[var(--primary-light)] px-2 py-0.5 text-[var(--font-size-xs)] font-semibold text-[var(--primary-dark)]',
            )}
          >
            {option.label}
            <button
              type="button"
              onClick={() => remove(option.id)}
              className="rounded-[var(--radius-sm)] p-0.5 hover:bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              aria-label={`Remover ${option.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !query && value.length > 0) {
              remove(value[value.length - 1]);
            }
            if (e.key === 'Enter' && available[0]) {
              e.preventDefault();
              add(available[0].id);
            }
          }}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="min-w-[6rem] flex-1 border-0 bg-transparent p-0 text-[var(--font-size-sm)] outline-none placeholder:text-[var(--text-muted)]"
          aria-expanded={available.length > 0 && query.length > 0}
          role="combobox"
        />
      </div>
      {query && available.length > 0 && (
        <ul
          className="mt-1 max-h-40 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
          role="listbox"
        >
          {available.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                onClick={() => add(option.id)}
                className={cn(
                  'w-full px-[var(--space-sm)] py-2 text-left text-[var(--font-size-sm)] text-[var(--text)]',
                  'hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]',
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
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
