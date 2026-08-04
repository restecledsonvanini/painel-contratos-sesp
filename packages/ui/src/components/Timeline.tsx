import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Circle } from 'lucide-react';
import React, { useMemo } from 'react';
import { cn } from '../lib/cn';
import { Badge } from './Badge';

export interface TimelineEvent {
  id: string;
  date: string | Date;
  title: string;
  detail?: string;
  tipo?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : parseISO(value);
}

export function Timeline({ events, className }: TimelineProps) {
  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
    const map = new Map<string, TimelineEvent[]>();
    for (const event of sorted) {
      const year = format(toDate(event.date), 'yyyy');
      const list = map.get(year) ?? [];
      list.push(event);
      map.set(year, list);
    }
    return Array.from(map.entries());
  }, [events]);

  return (
    <div className={cn('space-y-[var(--space-lg)]', className)}>
      {grouped.map(([year, yearEvents]) => (
        <section key={year}>
          <h3 className="mb-[var(--space-md)] text-[var(--font-size-sm)] font-semibold text-[var(--text-muted)]">
            {year}
          </h3>
          <ol className="relative space-y-[var(--space-md)] border-l border-[var(--border)] pl-[var(--space-lg)]">
            {yearEvents.map((event) => (
              <li key={event.id} className="relative">
                <span
                  className="absolute -left-[calc(var(--space-lg)+0.375rem)] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--primary)] ring-4 ring-[var(--surface)]"
                  aria-hidden
                >
                  <Circle className="h-1.5 w-1.5 fill-[var(--text-inverse)] text-[var(--text-inverse)]" />
                </span>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[var(--text)]">{event.title}</p>
                      {event.tipo && <Badge variant="info">{event.tipo}</Badge>}
                    </div>
                    {event.detail && (
                      <p className="mt-1 text-[var(--font-size-sm)] text-[var(--text-muted)]">{event.detail}</p>
                    )}
                  </div>
                  <time
                    dateTime={toDate(event.date).toISOString()}
                    className="shrink-0 text-[var(--font-size-xs)] text-[var(--text-muted)]"
                  >
                    {format(toDate(event.date), 'dd/MM/yyyy', { locale: ptBR })}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
