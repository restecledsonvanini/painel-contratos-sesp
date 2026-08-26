import React from 'react';
import { Card, EmptyState, Timeline } from '@painel/ui';

export function TimelineTab({
  events,
}: {
  events: Array<{ id: string; date: string; title: string; detail?: string; tipo?: string }>;
}) {
  if (!events.length) {
    return <EmptyState title="Sem eventos" description="A linha do tempo ainda não tem registros." />;
  }
  return (
    <Card variant="bordered" className="p-[var(--space-lg)]">
      <Timeline events={events} />
    </Card>
  );
}
