import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Page,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@painel/ui';
import { http, getErrorMessage } from '../../../lib/http';
import { qk } from '../../../lib/queryKeys';
import { useConfirmDialog } from '../../../lib/useConfirmDialog';

type Dominio = {
  id: string;
  slug: string;
  nome: string;
  editavelPeloUsuario: boolean;
  _count?: { valores: number };
};

type DominioValor = {
  id: string;
  codigo: string;
  label: string;
  ordem: number;
  ativo: boolean;
  parentId: string | null;
};

export default function DominiosPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const confirm = useConfirmDialog<string>();
  const [slug, setSlug] = useState<string>('');
  const [codigo, setCodigo] = useState('');
  const [label, setLabel] = useState('');

  const dominiosQuery = useQuery({
    queryKey: ['dominios'],
    queryFn: async () => (await http.get<Dominio[]>('/dominios')).data,
  });

  const selected = useMemo(
    () => dominiosQuery.data?.find((d) => d.slug === slug) ?? dominiosQuery.data?.[0],
    [dominiosQuery.data, slug],
  );

  const activeSlug = slug || selected?.slug || '';

  const valoresQuery = useQuery({
    queryKey: ['dominios', activeSlug, 'valores'],
    queryFn: async () =>
      (await http.get<DominioValor[]>(`/dominios/${activeSlug}/valores`, {
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
                    ? 'Editável — valores podem ser criados e desativados.'
                    : 'Lista legal fixa — apenas consulta.'}
                </p>

                {selected.editavelPeloUsuario && (
                  <form
                    className="mt-[var(--space-md)] grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!codigo.trim() || !label.trim()) return;
                      createValor.mutate();
                    }}
                  >
                    <Input label="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    <Input label="Rótulo" value={label} onChange={(e) => setLabel(e.target.value)} />
                    <div className="flex items-end">
                      <Button type="submit" disabled={createValor.isPending}>
                        Adicionar
                      </Button>
                    </div>
                  </form>
                )}
              </Card>

              <Card variant="bordered" className="overflow-hidden">
                {valoresQuery.isLoading ? (
                  <Skeleton variant="table" lines={6} />
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Ordem</TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Rótulo</TableHeader>
                        <TableHeader>Ativo</TableHeader>
                        <TableHeader>Ações</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(valoresQuery.data ?? []).map((v) => (
                        <TableRow key={v.id}>
                          <TableCell>{v.ordem}</TableCell>
                          <TableCell className="font-mono text-[var(--font-size-xs)]">{v.codigo}</TableCell>
                          <TableCell>{v.label}</TableCell>
                          <TableCell>{v.ativo ? 'Sim' : 'Não'}</TableCell>
                          <TableCell>
                            {selected.editavelPeloUsuario && (
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => toggleAtivo.mutate({ id: v.id, ativo: !v.ativo })}
                                >
                                  {v.ativo ? 'Desativar' : 'Reativar'}
                                </Button>
                                {v.ativo && (
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() =>
                                      confirm.ask(v.id, 'Desativar valor?', `Desativar «${v.label}»?`)
                                    }
                                  >
                                    Remover
                                  </Button>
                                )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
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
