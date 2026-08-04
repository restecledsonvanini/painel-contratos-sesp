import * as RadixTabs from '@radix-ui/react-tabs';
import React from 'react';
import { cn } from '../lib/cn';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, className }: TabsProps) {
  const initial = defaultValue ?? items[0]?.id;

  return (
    <RadixTabs.Root
      value={value}
      defaultValue={value === undefined ? initial : undefined}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <RadixTabs.List
        className={cn(
          'flex gap-1 overflow-x-auto border-b border-[var(--border)] pb-px',
          'scrollbar-thin',
        )}
        aria-label="Abas"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            className={cn(
              'shrink-0 rounded-t-[var(--radius-sm)] px-[var(--space-md)] py-2',
              'text-[var(--font-size-sm)] font-semibold text-[var(--text-muted)]',
              'hover:text-[var(--text)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none',
              'data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)] data-[state=active]:text-[var(--primary)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.id}
          value={item.id}
          className="pt-[var(--space-md)] focus-visible:outline-none"
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}

export { RadixTabs };
