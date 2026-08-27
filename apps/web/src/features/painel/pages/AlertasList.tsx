import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  formatStatusLabel,
  Card,
  ErrorState,
  Page,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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

  if (isLoading) {
    return (
      <Page title="Alertas" description="Carregando...">
        <Skeleton variant="card" />
      </Page>
    );
  }

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
      <Card variant="bordered" className="overflow-hidden p-0">
        <Table className="table-as-cards">
          <TableHead>
            <TableRow>
              <TableHeader>Severidade</TableHeader>
              <TableHeader>Tipo</TableHeader>
              <TableHeader>Contrato</TableHeader>
              <TableHeader>Mensagem</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length ? (
              rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell data-label="Severidade">
                    <Badge variant={sevVariant[a.severidade] ?? 'default'}>
                      {formatStatusLabel(a.severidade)}
                    </Badge>
                  </TableCell>
                  <TableCell data-label="Tipo">{a.tipo}</TableCell>
                  <TableCell data-label="Contrato">
                    <Link
                      to={contractHref(a.contrato.id, alertaTipoToTab(a.tipo))}
                      className="font-semibold underline"
                    >
                      GMS {a.contrato.numeroGms}/{a.contrato.anoGms}
                    </Link>
                  </TableCell>
                  <TableCell data-label="Mensagem">{a.mensagem}</TableCell>
                  <TableCell data-label="Ações">
                    {!a.reconhecidoEm && canAck ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={reconhecer.isPending}
                        onClick={() => reconhecer.mutate(a.id)}
                      >
                        Reconhecer
                      </Button>
                    ) : a.reconhecidoEm ? (
                      <span className="text-sm opacity-70">Reconhecido</span>
                    ) : (
                      <span className="text-sm opacity-70">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  Nenhum alerta. Clique em “Atualizar alertas” para rodar o job.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Page>
  );
}
