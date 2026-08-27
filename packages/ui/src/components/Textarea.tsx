import clsx from 'clsx';
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, className, ...props },
  ref,
) {
  const control = (
    <textarea
      ref={ref}
      className={clsx(
        'w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)]',
        'px-3 py-2 text-[var(--text)] shadow-[var(--shadow-sm)] transition duration-150',
        'focus:border-[var(--primary)] focus:shadow-[var(--focus-ring)] focus:outline-none',
        className,
      )}
      {...props}
    />
  );

  if (!label) return control;

  return (
    <label className="Campo block text-[var(--font-size-sm)] text-[var(--label-color)]">
      <span className="mb-1.5 block font-semibold text-[var(--label-color)]">{label}</span>
      {control}
    </label>
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
