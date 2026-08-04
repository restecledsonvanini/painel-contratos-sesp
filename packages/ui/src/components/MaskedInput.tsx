import React, { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { inputBaseClass } from '../lib/inputStyles';
import { applyMask, getMaskPlaceholder, type MaskType } from '../lib/masks';

interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  mask: MaskType;
  value: string;
  onChange: (digits: string) => void;
  label?: string;
  hint?: string;
  error?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  { mask, value, onChange, label, hint, error, className, id, disabled, ...props },
  ref,
) {
  const inputId = id || (label ? `masked-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [display, setDisplay] = useState(() => applyMask(mask, value).display);

  useEffect(() => {
    setDisplay(applyMask(mask, value).display);
  }, [mask, value]);

  return (
    <label className={cn('block text-[var(--font-size-sm)] text-[var(--label-color)]', className)}>
      {label && <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>}
      <input
        {...props}
        id={inputId}
        ref={ref}
        type="text"
        value={display}
        disabled={disabled}
        placeholder={props.placeholder ?? getMaskPlaceholder(mask)}
        aria-invalid={error ? true : undefined}
        onChange={(e) => {
          const { display: nextDisplay, digits } = applyMask(mask, e.target.value);
          setDisplay(nextDisplay);
          onChange(digits);
        }}
        className={inputBaseClass}
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

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };
