import clsx from 'clsx';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, className, id, ...props },
  ref,
) {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <label className="Campo block text-[var(--font-size-sm)] text-[var(--label-color)]">
      {label && (
        <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>
      )}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          'w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)]',
          'px-3 py-2 text-[var(--text)] shadow-[var(--shadow-sm)] transition duration-150',
          'focus:border-[var(--primary)] focus:shadow-[var(--focus-ring)] focus:outline-none',
          className,
        )}
        {...props}
      />
      {hint && <span className="mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
});

Input.displayName = 'Input';

export { Input };
