import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  DataTable,
  Input,
  Page,
  Skeleton,
  StatusBadge,
  useToast,
  type ColumnDef,
} from '@painel/ui';
import { EMAIL_DOMAINS_SLUG } from '@painel/domain';
import { getErrorMessage, http } from '../../../lib/http';

type DominioValor = {
  id: string;
  codigo: string;
  label: string;
  ordem: number;
  ativo: boolean;
};

export default function SegurancaPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const [domain, setDomain] = useState('');

  const valores = useQuery({
    queryKey: ['dominios', EMAIL_DOMAINS_SLUG, 'valores'],
    queryFn: async () =>
      (
        await http.get<DominioValor[]>(`/dominios/${EMAIL_DOMAINS_SLUG}/valores`, {
          params: { includeInativos: true },
        })
      ).data,
  });

  const create = useMutation({
    mutationFn: async () => {
      const d = domain.trim().toLowerCase();
      return (
        await http.post(`/dominios/${EMAIL_DOMAINS_SLUG}/valores`, {
          codigo: d,
          label: d,
          ordem: (valores.data?.length ?? 0) + 1,
        })
      ).data;
    },
    onSuccess: () => {
      toast.success('Domínio adicionado.');
      setDomain('');
      void qc.invalidateQueries({ queryKey: ['dominios', EMAIL_DOMAINS_SLUG] });
    },
    onError: (err) => toast.error('Falha ao adicionar.', getErrorMessage(err)),
  });

  const toggle = useMutation({
    mutationFn: async (row: DominioValor) =>
      (
        await http.put(`/dominios/${EMAIL_DOMAINS_SLUG}/valores/${row.id}`, {
          ativo: !row.ativo,
        })
      ).data,
    onSuccess: () => {
      toast.success('Atualizado.');
      void qc.invalidateQueries({ queryKey: ['dominios', EMAIL_DOMAINS_SLUG] });
    },
    onError: (err) => toast.error('Falha ao atualizar.', getErrorMessage(err)),
  });

  const domainColumns: ColumnDef<DominioValor>[] = useMemo(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Domínio',
        enableSorting: false,
        cell: ({ row }) => <span className="font-semibold">{row.original.codigo}</span>,
      },
      {
        id: 'situacao',
        header: 'Situação',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge status={row.original.ativo ? 'ATIVO' : 'INATIVO'} />
        ),
      },
      {
        id: 'acoes',
        header: 'Ações',
        enableSorting: false,
        cell: ({ row }) => (
          <Button size="sm" variant="ghost" onClick={() => toggle.mutate(row.original)}>
            {row.original.ativo ? 'Desativar' : 'Ativar'}
          </Button>
        ),
      },
    ],
    [toggle],
  );

  return (
    <Page
      title="Segurança"
      description="Domínios de e-mail permitidos no login e no cadastro de usuários. AUTH_EMAIL_DOMAINS na API sobrescreve esta lista."
    >
      <Card variant="bordered" className="mb-4 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[16rem] flex-1">
          <Input
            label="Novo domínio"
            placeholder="sesp.pr.gov.br"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <Button
          disabled={create.isPending || !domain.includes('.')}
          onClick={() => create.mutate()}
        >
          Adicionar
        </Button>
      </Card>

      {valores.isLoading ? (
        <Skeleton variant="table" lines={4} />
      ) : (
        <DataTable
          columns={domainColumns}
          data={valores.data ?? []}
          emptyMessage="Nenhum domínio cadastrado — rode o seed ou adicione acima."
        />
      )}
    </Page>
  );
}
