import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  formatStatusLabel,
  DataTable,
  ErrorState,
  Page,
  type ColumnDef,
} from '@painel/ui';
import { useCanAct } from '../../../lib/access';
import { http, getErrorMessage } from '../../../lib/http';
import { alertaTipoToTab, contractHref } from '../../../lib/recentContracts';
import type { AlertaDTO } from '@painel/schema';

const sevVariant: Record<string, 'default' | 'warning' | 'danger' | 'success'> = {
  INFO: 'default',
  ATENCAO: 'warning',
  CRITICO: 'danger',
};

export default function AlertasList() {
  const qc = useQueryClient();
  const [somenteAbertos, setSomenteAbertos] = useState(true);
  const canAck = useCanAct('ANALISTA');
  const canGenerate = useCanAct('ADMIN');
  const canImport = useCanAct('ANALISTA');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['alertas', somenteAbertos],
    queryFn: async () =>
      (
        await http.get<AlertaDTO[]>('/alertas', {
          params: somenteAbertos ? { reconhecido: 'false' } : undefined,
        })
      ).data,
  });

  const gerar = useMutation({
    mutationFn: async () => (await http.post('/admin/gerar-alertas')).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertas'] }),
  });

  const reconhecer = useMutation({
    mutationFn: async (id: string) => (await http.post(`/alertas/${id}/reconhecer`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alertas'] }),
  });

  const rows = useMemo(() => data ?? [], [data]);

  const columns: ColumnDef<AlertaDTO>[] = useMemo(
    () => [
      {
        id: 'severidade',
        header: 'Severidade',
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant={sevVariant[row.original.severidade] ?? 'default'}>
            {formatStatusLabel(row.original.severidade)}
          </Badge>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        enableSorting: false,
        cell: ({ row }) => row.original.tipo,
      },
      {
        id: 'contrato',
        header: 'Contrato',
        enableSorting: false,
        cell: ({ row }) => {
          const c = row.original.contrato;
          return (
            <Link
              to={contractHref(c.id, alertaTipoToTab(row.original.tipo))}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              GMS {c.numeroGms}/{c.anoGms}
            </Link>
          );
        },
      },
      {
        accessorKey: 'mensagem',
        header: 'Mensagem',
        enableSorting: false,
      },
      {
        id: 'acoes',
        header: 'Ações',
        enableSorting: false,
        cell: ({ row }) => {
          const a = row.original;
          if (!a.reconhecidoEm && canAck) {
            return (
              <Button
                size="sm"
                variant="ghost"
                disabled={reconhecer.isPending}
                onClick={() => reconhecer.mutate(a.id)}
              >
                Reconhecer
              </Button>
            );
          }
          return (
            <span className="text-sm opacity-70">{a.reconhecidoEm ? 'Reconhecido' : '—'}</span>
          );
        },
      },
    ],
    [canAck, reconhecer],
  );

  if (error) {
    return (
      <Page title="Alertas">
        <ErrorState
          title="Falha ao carregar alertas"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Central de alertas"
      description="Vencimentos, limites legais, publicidade e sanções — priorizados por severidade."
      actions={
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setSomenteAbertos((v) => !v)}>
            {somenteAbertos ? 'Mostrar todos' : 'Só abertos'}
          </Button>
          {canGenerate ? (
            <Button onClick={() => gerar.mutate()} disabled={gerar.isPending}>
              {gerar.isPending ? 'Gerando…' : 'Atualizar alertas'}
            </Button>
          ) : null}
          {canImport ? (
            <Button to="/utilitarios?tab=importacao" variant="ghost">
              Importação
            </Button>
          ) : null}
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyMessage="Nenhum alerta. Clique em “Atualizar alertas” para rodar o job."
      />
    </Page>
  );
}
