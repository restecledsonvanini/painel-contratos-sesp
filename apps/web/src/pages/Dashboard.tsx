import React from 'react';
import { Button, Card } from '@painel/ui';

const stats = [
  { label: 'Contratos ativos', value: 42 },
  { label: 'Valor total', value: 'R$ 12.450.000' },
  { label: 'Vencimentos próximos', value: 8 },
];

const timeline = [
  { title: 'Assinatura', date: '12/07/2026', status: 'Concluído' },
  { title: 'Início de vigência', date: '01/08/2026', status: 'Em andamento' },
  { title: 'Primeira revisão', date: '15/09/2026', status: 'Pendente' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Visão geral</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--text)]">Painel de contratos</h2>
          </div>
          <Button variant="primary">Novo contrato</Button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-[var(--text)]">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-md bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">Linha do tempo contratual</h3>
              <p className="mt-1 text-sm text-slate-500">Eventos futuros e próximos prazos.</p>
            </div>
            <Button variant="secondary">Ver mais</Button>
          </div>
          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item.title} className="rounded-md bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--text)]">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </div>
                  <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">Resumo de compliance</h3>
              <p className="mt-1 text-sm text-slate-500">Indicadores de conformidade em andamento.</p>
            </div>
            <span className="rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
              Atualizado
            </span>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-md bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Aditivos pendentes</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">5</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[var(--border)]">
              <p className="text-sm text-slate-500">Contratos em revisão</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">3</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-[var(--border)]">
              <p className="text-sm text-slate-500">Alertas de prazo</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text)]">2</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
