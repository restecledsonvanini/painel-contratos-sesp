import clsx from 'clsx';
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="block text-sm text-[var(--text)]">
      {label && <span className="mb-2 block font-medium text-[var(--text)]">{label}</span>}
      <textarea
        className={clsx(
          'w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] shadow-sm transition duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
          className,
        )}
        {...props}
      />
    </label>
  );
}
