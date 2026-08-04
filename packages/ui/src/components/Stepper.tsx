import { AlertCircle, Check, Circle } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/cn';

export type StepStatus = 'completed' | 'current' | 'error' | 'pending';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
}

interface StepperProps {
  steps: StepItem[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'completed') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)] text-[var(--text-inverse)]">
        <Check className="h-4 w-4" />
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--danger)_15%,white)] text-[var(--danger)] ring-2 ring-[var(--danger)]">
        <AlertCircle className="h-4 w-4" />
      </span>
    );
  }
  if (status === 'current') {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--text-inverse)] ring-2 ring-[var(--primary-light)]">
        <Circle className="h-3 w-3 fill-current" />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-muted)]">
      <Circle className="h-3 w-3" />
    </span>
  );
}

export function Stepper({ steps, onStepClick, className }: StepperProps) {
  return (
    <nav aria-label="Progresso" className={cn('w-full overflow-x-auto', className)}>
      <ol className="flex min-w-max items-start gap-[var(--space-sm)]">
        {steps.map((step, index) => {
          const clickable = Boolean(onStepClick);
          const content = (
            <>
              <StepIcon status={step.status} />
              <div className="mt-2 min-w-[5rem] max-w-[8rem]">
                <p
                  className={cn(
                    'text-[var(--font-size-xs)] font-semibold',
                    step.status === 'current' && 'text-[var(--primary)]',
                    step.status === 'error' && 'text-[var(--danger)]',
                    step.status === 'completed' && 'text-[var(--success)]',
                    step.status === 'pending' && 'text-[var(--text-muted)]',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-[var(--font-size-xs)] text-[var(--text-muted)]">{step.description}</p>
                )}
              </div>
            </>
          );

          return (
            <li key={step.id} className="flex items-start">
              <div className="flex flex-col items-center px-[var(--space-xs)]">
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(step.id)}
                    className="flex flex-col items-center rounded-[var(--radius-sm)] focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
                  >
                    {content}
                  </button>
                ) : (
                  content
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mt-4 h-0.5 w-8 shrink-0',
                    step.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--border)]',
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
