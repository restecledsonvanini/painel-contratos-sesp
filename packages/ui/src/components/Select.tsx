import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useMemo } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';

export interface SelectOption {
  id: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Selecione…',
  disabled,
  label,
  hint,
  error,
  id,
  className,
  name,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
}: SelectProps) {
  const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  // Radix não aceita value=""; e value fora das options derruba o SelectValue.
  const normalized = value && value.trim() ? value : undefined;
  const items = useMemo(() => {
    const base = options.filter((o) => o.id && o.id.trim());
    if (normalized && !base.some((o) => o.id === normalized)) {
      return [{ id: normalized, label: normalized, disabled: true }, ...base];
    }
    return base;
  }, [options, normalized]);

  // Sempre controlado: "" = sem seleção (Radix trata "" como vazio; Item nunca usa "").
  const rootValue = normalized && items.some((o) => o.id === normalized) ? normalized : '';

  return (
    <div className={cn('block text-[var(--font-size-sm)] text-[var(--label-color)]', className)}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block font-semibold text-[var(--label-color)]">
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={rootValue}
        onValueChange={onChange}
        disabled={disabled}
        name={name}
      >
        <RadixSelect.Trigger
          id={selectId}
          aria-invalid={error || ariaInvalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            inputBaseClass,
            'inline-flex items-center justify-between gap-2 text-left',
            !rootValue && 'text-[var(--text-muted)]',
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.ScrollUpButton className="flex items-center justify-center py-1 text-[var(--text-muted)]">
              <ChevronUp className="h-4 w-4" />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="p-1">
              {items.map((option) => (
                <RadixSelect.Item
                  key={option.id}
                  value={option.id}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-[var(--radius-sm)]',
                    'px-8 py-2 text-[var(--font-size-sm)] text-[var(--text)] outline-none',
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    'data-[highlighted]:bg-[var(--primary-light)] data-[highlighted]:text-[var(--primary-dark)]',
                  )}
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4 text-[var(--primary)]" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex items-center justify-center py-1 text-[var(--text-muted)]">
              <ChevronDown className="h-4 w-4" />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
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
