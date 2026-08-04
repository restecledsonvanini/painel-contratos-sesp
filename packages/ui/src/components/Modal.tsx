import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  description,
  className,
}: ModalProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--text)_35%,transparent)]" />
        <RadixDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
            'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]',
            'focus:outline-none',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-[var(--space-md)] border-b border-[var(--border)] px-[var(--space-lg)] py-[var(--space-md)]">
            <div>
              <RadixDialog.Title className="text-[var(--font-size-lg)] font-semibold text-[var(--heading)]">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="mt-1 text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              className="rounded-[var(--radius-sm)] p-1 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </RadixDialog.Close>
          </div>
          <div className="max-h-[60vh] overflow-y-auto px-[var(--space-lg)] py-[var(--space-md)]">{children}</div>
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
