import React, { useId } from 'react';
import { cn } from '../lib/cn';

interface FormFieldProps {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('app-form__field block text-[var(--font-size-sm)]', className)}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block font-semibold text-[var(--label-color)]">
          {label}
          {required && (
            <span className="ml-1 text-[var(--danger)]" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id: (children as React.ReactElement).props.id ?? fieldId,
            'aria-describedby': describedBy,
            'aria-invalid': error ? true : undefined,
            required,
          })
        : children}
      {hint && (
        <span id={hintId} className="mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="mt-1 block text-[var(--font-size-xs)] text-[var(--danger)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
