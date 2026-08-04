import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';
import { Popover } from './Popover';

interface DatePickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

function formatDate(value?: Date | null): string {
  if (!value || !isValid(value)) return '';
  return format(value, 'dd/MM/yyyy', { locale: ptBR });
}

function parseDateInput(text: string): Date | null {
  const parsed = parse(text, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : null;
}

export function DatePicker({
  value,
  onChange,
  label,
  hint,
  error,
  disabled,
  placeholder = 'dd/mm/aaaa',
  className,
  id,
}: DatePickerProps) {
  const [text, setText] = useState(formatDate(value ?? null));
  const [open, setOpen] = useState(false);
  const inputId = id || (label ? `date-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const handleBlur = () => {
    if (!text.trim()) {
      onChange?.(null);
      return;
    }
    const parsed = parseDateInput(text);
    if (parsed) {
      onChange?.(parsed);
      setText(formatDate(parsed));
    } else {
      setText(formatDate(value ?? null));
    }
  };

  const daysInMonth = (() => {
    const base = value && isValid(value) ? value : new Date();
    const year = base.getFullYear();
    const month = base.getMonth();
    const first = new Date(year, month, 1);
    const startPad = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { year, month, startPad, days };
  })();

  return (
    <div className={cn('block text-[var(--font-size-sm)]', className)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block font-semibold text-[var(--label-color)]">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          className={cn(inputBaseClass, 'flex-1')}
        />
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger={
            <button
              type="button"
              disabled={disabled}
              className={cn(
                inputBaseClass,
                'inline-flex w-auto items-center justify-center px-3',
              )}
              aria-label="Abrir calendário"
            >
              <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
            </button>
          }
          contentClassName="p-[var(--space-sm)]"
        >
          <div className="grid grid-cols-7 gap-1 text-center text-[var(--font-size-xs)]">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span key={`${d}-${i}`} className="font-semibold text-[var(--text-muted)]">
                {d}
              </span>
            ))}
            {Array.from({ length: daysInMonth.startPad }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth.days }).map((_, i) => {
              const day = i + 1;
              const date = new Date(daysInMonth.year, daysInMonth.month, day);
              const selected =
                value && isValid(value) && format(value, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChange?.(date);
                    setText(formatDate(date));
                    setOpen(false);
                  }}
                  className={cn(
                    'rounded-[var(--radius-sm)] p-1 hover:bg-[var(--primary-light)]',
                    selected && 'bg-[var(--primary)] text-[var(--text-inverse)]',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Popover>
      </div>
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
