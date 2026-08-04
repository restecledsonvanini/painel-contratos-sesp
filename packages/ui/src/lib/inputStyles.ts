import { cn } from './cn';

export const inputBaseClass = cn(
  'w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)]',
  'px-3 py-2 text-[var(--text)] shadow-[var(--shadow-sm)] transition duration-150',
  'focus:border-[var(--primary)] focus:shadow-[var(--focus-ring)] focus:outline-none',
  'disabled:cursor-not-allowed disabled:opacity-55',
);

export const labelClass = 'mb-1.5 block font-semibold text-[var(--label-color)]';
export const hintClass = 'mt-1 block text-[var(--font-size-xs)] text-[var(--text-muted)]';
export const errorClass = 'mt-1 block text-[var(--font-size-xs)] text-[var(--danger)]';
