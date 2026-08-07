import * as RadixPopover from '@radix-ui/react-popover';
import React from 'react';
import { cn } from '../lib/cn';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  contentClassName?: string;
}

export function Popover({
  trigger,
  children,
  open,
  onOpenChange,
  align = 'start',
  side = 'bottom',
  className,
  contentClassName,
}: PopoverProps) {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>
        {React.isValidElement(trigger) ? (
          className
            ? React.cloneElement(trigger as React.ReactElement<{ className?: string }>, {
                className: cn(
                  (trigger as React.ReactElement<{ className?: string }>).props.className,
                  className,
                ),
              })
            : trigger
        ) : (
          <button type="button" className={className}>
            {trigger}
          </button>
        )}
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align}
          side={side}
          sideOffset={4}
          className={cn(
            'z-50 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]',
            'p-[var(--space-sm)] shadow-[var(--shadow)] outline-none',
            contentClassName,
          )}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

export { RadixPopover };
