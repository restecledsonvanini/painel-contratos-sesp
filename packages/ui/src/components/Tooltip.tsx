import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';
import { cn } from '../lib/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  className?: string;
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      {children}
    </RadixTooltip.Provider>
  );
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 300,
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={4}
          className={cn(
            'z-50 max-w-xs rounded-[var(--radius-sm)] bg-[var(--primary-dark)] px-[var(--space-sm)] py-1.5',
            'text-[var(--font-size-xs)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)]',
            className,
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[var(--primary-dark)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
