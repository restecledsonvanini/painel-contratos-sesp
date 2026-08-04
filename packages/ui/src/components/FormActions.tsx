import React from 'react';
import { cn } from '../lib/cn';

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'end' | 'between';
}

export function FormActions({ children, className, align = 'end' }: FormActionsProps) {
  return (
    <div
      className={cn(
        'app-form__actions',
        align === 'start' && 'justify-start',
        align === 'end' && 'justify-end',
        align === 'between' && 'justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
}
