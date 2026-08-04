import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page } from '@painel/ui';
import { FilePlus2 } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';

export default function Dashboard() {
  const { data, isLoading } = useContracts();
  const contracts = Array.isArray(data) ? data : [];
  const totalValor = contracts.reduce((acc, item) => acc + (item.valorAnual || 0), 0);
  const vigentes = contracts.filter((c) => String(c.status || '').toLowerCase().includes('vigente')).length;

  const stats = [
    { label: 'Contratos', value: isLoading ? '…' : String(contracts.length) },
    {
      label: 'Valor anual (lista)',
      value: isLoading
        ? '…'
        : totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
    },
    { label: 'Vigentes', value: isLoading ? '…' : String(vigentes) },
  ];

  return (
    <Page
      title="Painel de contratos"
      description="Visão geral do hub de inteligência contratual."
      actions={
        <Link to="/contracts/new">
          <Button>
            <FilePlus2 size={16} />
            Novo contrato
          </Button>
        </Link>
      }
    >
      <section className="Form-Grade grid grid-cols-1 gap-[var(--space-md)] sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} variant="bordered" className="p-[var(--space-lg)]">
            <p className="text-[var(--font-size-xs)] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-[var(--font-size-2xl)] font-bold text-[var(--primary)]">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[1.4fr_1fr]">
        <Card variant="bordered" className="p-[var(--space-lg)]">
          <div className="mb-[var(--space-md)] flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Contratos recentes</h2>
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Últimos registros da base.</p>
            </div>
            <Link to="/contracts">
              <Button variant="secondary" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {contracts.slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/contracts/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--panel-bg)] px-3 py-3 hover:border-[var(--primary)]"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--text)]">
                    {c.protocoloCabeca || `${c.numGms}/${c.anoGms}`}
                  </p>
                  <p className="truncate text-[var(--font-size-sm)] text-[var(--text-muted)]">{c.objeto}</p>
                </div>
                <span className="shrink-0 text-[var(--font-size-xs)] font-semibold text-[var(--primary)]">
                  {c.status || '—'}
                </span>
              </Link>
            ))}
            {!isLoading && contracts.length === 0 && (
              <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">Nenhum contrato ainda.</p>
            )}
          </div>
        </Card>

        <Card variant="panel" className="p-[var(--space-lg)]">
          <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">Compliance</h2>
          <p className="mt-2 text-[var(--font-size-sm)] text-[var(--text-muted)]">
            Monitore vigência, aditivos e segregação gestor/fiscal conforme a Lei 14.133/2021.
          </p>
          <div className="mt-[var(--space-md)] grid gap-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
              <p className="text-[var(--font-size-xs)] text-[var(--text-muted)]">Cadastros de apoio</p>
              <p className="mt-1 text-[var(--font-size-sm)] font-semibold">
                Use o menu lateral para Empresas, Unidades FSP, Entidades e Serviços.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </Page>
  );
}
