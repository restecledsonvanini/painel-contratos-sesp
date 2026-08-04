import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  footer,
  side = 'right',
  className,
}: DrawerProps) {
  const sideClasses =
    side === 'right'
      ? 'right-0 top-0 h-full w-full max-w-md translate-x-0 data-[state=closed]:translate-x-full'
      : 'left-0 top-0 h-full w-full max-w-md translate-x-0 data-[state=closed]:-translate-x-full';

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--text)_35%,transparent)]" />
        <RadixDialog.Content
          className={cn(
            'fixed z-50 flex flex-col border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]',
            'transition-transform duration-200 ease-out focus:outline-none',
            sideClasses,
            className,
          )}
        >
          <div className="flex items-center justify-between gap-[var(--space-md)] border-b border-[var(--border)] px-[var(--space-lg)] py-[var(--space-md)]">
            <RadixDialog.Title className="text-[var(--font-size-lg)] font-semibold text-[var(--heading)]">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close
              className="rounded-[var(--radius-sm)] p-1 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-[var(--space-lg)] py-[var(--space-md)]">{children}</div>
          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-[var(--space-sm)] border-t border-[var(--border)] px-[var(--space-lg)] py-[var(--space-md)]">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
