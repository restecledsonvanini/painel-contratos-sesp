import React, { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (cents: number) => void;
  label?: string;
  hint?: string;
  error?: string;
}

function formatCents(cents: number): string {
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100);
  const centavos = abs % 100;
  const formatted = `${reais.toLocaleString('pt-BR')},${String(centavos).padStart(2, '0')}`;
  return cents < 0 ? `-R$ ${formatted}` : `R$ ${formatted}`;
}

function parseToCents(text: string): number {
  const digits = text.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits);
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { value, onChange, label, hint, error, className, id, disabled, ...props },
  ref,
) {
  const inputId = id || (label ? `currency-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [display, setDisplay] = useState(formatCents(value));

  useEffect(() => {
    setDisplay(formatCents(value));
  }, [value]);

  return (
    <label className={cn('block text-[var(--font-size-sm)] text-[var(--label-color)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <input
        {...props}
        id={inputId}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={display}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          const cents = parseToCents(e.target.value);
          onChange(cents);
          setDisplay(formatCents(cents));
        }}
        onFocus={(e) => e.target.select()}
        className={cn(inputBaseClass, 'font-mono tabular-nums')}
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

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
