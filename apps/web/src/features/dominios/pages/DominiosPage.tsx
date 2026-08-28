import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  Page,
  Skeleton,
  StatusBadge,
  useToast,
  type ColumnDef,
} from '@painel/ui';
import { http, getErrorMessage } from '../../../lib/http';
import { useIsAdmin } from '../../../lib/access';
import { qk } from '../../../lib/queryKeys';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';
import type { DominioDTO, DominioValorDTO } from '@painel/schema';

export default function DominiosPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const confirm = useConfirmDialog<string>();
  const canEdit = useIsAdmin();
  const [slug, setSlug] = useState<string>('');
  const [codigo, setCodigo] = useState('');
  const [label, setLabel] = useState('');

  const dominiosQuery = useQuery({
    queryKey: ['dominios'],
    queryFn: async () => (await http.get<DominioDTO[]>('/dominios')).data,
  });

  const selected = useMemo(
    () => dominiosQuery.data?.find((d) => d.slug === slug) ?? dominiosQuery.data?.[0],
    [dominiosQuery.data, slug],
  );

  const activeSlug = slug || selected?.slug || '';

  const valoresQuery = useQuery({
    queryKey: ['dominios', activeSlug, 'valores'],
    queryFn: async () =>
      (await http.get<DominioValorDTO[]>(`/dominios/${activeSlug}/valores`, {
        params: { includeInativos: true },
      })).data,
    enabled: Boolean(activeSlug),
  });

  const createValor = useMutation({
    mutationFn: async () =>
      (
        await http.post(`/dominios/${activeSlug}/valores`, {
          codigo: codigo.trim().toUpperCase().replace(/\s+/g, '_'),
          label: label.trim(),
          ordem: (valoresQuery.data?.length ?? 0) + 1,
        })
      ).data,
    onSuccess: () => {
      toast.success('Valor criado.');
      setCodigo('');
      setLabel('');
      void qc.invalidateQueries({ queryKey: ['dominios', activeSlug, 'valores'] });
      void qc.invalidateQueries({ queryKey: qk.lookups });
    },
    onError: (err) => toast.error('Erro ao criar valor', getErrorMessage(err)),
  });

  const toggleAtivo = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) =>
      (await http.put(`/dominios/${activeSlug}/valores/${id}`, { ativo })).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['dominios', activeSlug, 'valores'] });
      void qc.invalidateQueries({ queryKey: qk.lookups });
    },
    onError: (err) => toast.error('Erro ao atualizar', getErrorMessage(err)),
  });

  const deactivate = useMutation({
    mutationFn: async (id: string) =>
      (await http.delete(`/dominios/${activeSlug}/valores/${id}`)).data,
    onSuccess: () => {
      toast.success('Valor desativado.');
      void qc.invalidateQueries({ queryKey: ['dominios', activeSlug, 'valores'] });
      void qc.invalidateQueries({ queryKey: qk.lookups });
    },
    onError: (err) => toast.error('Erro ao desativar', getErrorMessage(err)),
  });

  const valorColumns: ColumnDef<DominioValorDTO>[] = useMemo(
    () => [
      {
        accessorKey: 'ordem',
        header: 'Ordem',
        enableSorting: false,
      },
      {
        accessorKey: 'codigo',
        header: 'Código',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-mono text-[var(--font-size-xs)]">{row.original.codigo}</span>
        ),
      },
      {
        accessorKey: 'label',
        header: 'Rótulo',
        enableSorting: false,
      },
      {
        id: 'ativo',
        header: 'Ativo',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge status={row.original.ativo ? 'ATIVO' : 'INATIVO'} />
        ),
      },
      {
        id: 'acoes',
        header: 'Ações',
        enableSorting: false,
        cell: ({ row }) =>
          selected?.editavelPeloUsuario && canEdit ? (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleAtivo.mutate({ id: row.original.id, ativo: !row.original.ativo })}
              >
                {row.original.ativo ? 'Desativar' : 'Reativar'}
              </Button>
              {row.original.ativo && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    confirm.ask(row.original.id, 'Desativar valor?', `Desativar «${row.original.label}»?`)
                  }
                >
                  Remover
                </Button>
              )}
            </div>
          ) : (
            '—'
          ),
      },
    ],
    [canEdit, confirm, selected?.editavelPeloUsuario, toggleAtivo],
  );

  if (dominiosQuery.isLoading) {
    return (
      <Page title="Listas suspensas">
        <Skeleton variant="table" lines={8} />
      </Page>
    );
  }

  if (dominiosQuery.error) {
    return (
      <Page title="Listas suspensas">
        <ErrorState
          title="Falha ao carregar domínios"
          message={getErrorMessage(dominiosQuery.error)}
          onRetry={() => dominiosQuery.refetch()}
        />
      </Page>
    );
  }

  const dominios = dominiosQuery.data ?? [];

  return (
    <Page
      title="Listas suspensas"
      description="Domínios gerenciáveis reutilizados em todos os formulários."
    >
      <div className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[280px_1fr]">
        <Card variant="bordered" className="overflow-hidden p-0">
          <ul className="divide-y divide-[var(--border)]">
            {dominios.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  className={`w-full px-[var(--space-md)] py-3 text-left text-[var(--font-size-sm)] hover:bg-[var(--surface-muted)] ${
                    activeSlug === d.slug ? 'bg-[var(--primary-light)] font-semibold text-[var(--primary)]' : ''
                  }`}
                  onClick={() => setSlug(d.slug)}
                >
                  <span className="block">{d.nome}</span>
                  <span className="text-[var(--font-size-xs)] text-[var(--text-muted)]">{d.slug}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-[var(--space-md)]">
          {!selected ? (
            <EmptyState title="Selecione um domínio" />
          ) : (
            <>
              <Card variant="bordered" className="p-[var(--space-lg)]">
                <h2 className="text-[var(--font-size-lg)] font-bold text-[var(--primary)]">{selected.nome}</h2>
                <p className="text-[var(--font-size-sm)] text-[var(--text-muted)]">
                  {selected.editavelPeloUsuario
                    ? canEdit
                      ? 'Editável — valores podem ser criados e desativados.'
                      : 'Editável apenas por ADMIN — você está em modo consulta.'
                    : 'Lista legal fixa — apenas consulta.'}
                </p>

                {selected.editavelPeloUsuario && canEdit && (
                  <form
                    className="app-form__grid mt-[var(--space-md)]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!codigo.trim() || !label.trim()) return;
                      createValor.mutate();
                    }}
                  >
                    <FormField label="Código" className="app-form__col-5">
                      <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    </FormField>
                    <FormField label="Rótulo" className="app-form__col-5">
                      <Input value={label} onChange={(e) => setLabel(e.target.value)} />
                    </FormField>
                    <div className="app-form__col-2 flex items-end">
                      <Button type="submit" disabled={createValor.isPending}>
                        Adicionar
                      </Button>
                    </div>
                  </form>
                )}
              </Card>

              {valoresQuery.isLoading ? (
                <Skeleton variant="table" lines={6} />
              ) : (
                <DataTable
                  columns={valorColumns}
                  data={valoresQuery.data ?? []}
                  emptyMessage="Nenhum valor nesta lista."
                />
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Desativar"
        onConfirm={async () => {
          if (confirm.pending) await deactivate.mutateAsync(confirm.pending.payload);
        }}
      />
    </Page>
  );
}
