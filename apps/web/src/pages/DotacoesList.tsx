import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
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
import { Plus } from 'lucide-react';
import { http, getErrorMessage } from '../lib/http';
import { useConfirmDialog } from '../lib/useConfirmDialog';

type Dotacao = {
  id: string;
  exercicio: number;
  codigo: string;
  descricao?: string | null;
  naturezaDespesa?: { codigo: string; label: string };
  fonteRecurso?: { codigo: string; label: string };
};

export default function DotacoesList() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dotacoes'],
    queryFn: async () => (await http.get<Dotacao[]>('/dotacoes')).data,
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await http.delete(`/dotacoes/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dotacoes'] });
    },
  });

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Dotação excluída.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Dotações orçamentárias" description="Carregando...">
        <Skeleton variant="card" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Dotações orçamentárias">
        <ErrorState
          title="Falha ao carregar"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Dotações orçamentárias"
      description="Natureza de despesa e fonte de recurso por exercício."
      actions={
        <Link to="/dotacoes/new">
          <Button>
            <Plus size={16} /> Nova dotação
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Exercício</TableHeader>
              <TableHeader>Código</TableHeader>
              <TableHeader>Natureza</TableHeader>
              <TableHeader>Fonte</TableHeader>
              <TableHeader>Descrição</TableHeader>
              <TableHeader>Ações</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length ? (
              data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.exercicio}</TableCell>
                  <TableCell className="font-semibold">{d.codigo}</TableCell>
                  <TableCell>{d.naturezaDespesa?.label || d.naturezaDespesa?.codigo || '—'}</TableCell>
                  <TableCell>{d.fonteRecurso?.label || d.fonteRecurso?.codigo || '—'}</TableCell>
                  <TableCell>{d.descricao || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/dotacoes/${d.id}/edit`}>
                        <Button size="sm" variant="secondary">
                          Editar
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          confirm.ask(
                            d.id,
                            'Excluir dotação?',
                            `Remover ${d.codigo}/${d.exercicio}. Vínculos com contratos podem impedir a exclusão.`,
                          )
                        }
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>Nenhuma dotação cadastrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={del.isPending}
      />
    </Page>
  );
}
