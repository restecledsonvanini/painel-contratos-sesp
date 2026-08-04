import React, { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  hint?: string;
  error?: string;
  decimals?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, onChange, label, hint, error, decimals = 2, className, id, disabled, ...props },
  ref,
) {
  const inputId = id || (label ? `number-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (value == null || Number.isNaN(value)) {
      setDisplay('');
      return;
    }
    setDisplay(
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    );
  }, [value, decimals]);

  const parseLocaleNumber = (text: string): number | null => {
    const normalized = text.trim().replace(/\./g, '').replace(',', '.');
    if (!normalized) return null;
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
  };

  return (
    <label className={cn('block text-[var(--font-size-sm)] text-[var(--label-color)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <input
        {...props}
        id={inputId}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={display}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          setDisplay(e.target.value);
          onChange(parseLocaleNumber(e.target.value));
        }}
        onBlur={() => {
          const parsed = parseLocaleNumber(display);
          onChange(parsed);
        }}
        className={cn(inputBaseClass, 'tabular-nums')}
      />
      {hint && !error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--danger)]" role="alert">
          {error}
        </span>
      )}
    </label>
  );
});

NumberInput.displayName = 'NumberInput';

export { NumberInput };
