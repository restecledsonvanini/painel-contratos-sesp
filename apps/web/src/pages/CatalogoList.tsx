import React from 'react';
import { Link } from 'react-router-dom';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http, getErrorMessage } from '../lib/http';
import { useCanWrite } from '../lib/access';
import { useConfirmDialog } from '../lib/useConfirmDialog';

type CatalogoItem = {
  id: string;
  nome: string;
  codigo?: string | null;
  descricao?: string | null;
  categoriaItem?: { codigo: string; label: string };
  unidadeMedidaPadrao?: { codigo: string; label: string };
  ativo?: boolean;
};

export default function CatalogoList() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['catalogo-itens'],
    queryFn: async () => (await http.get<CatalogoItem[]>('/catalogo-itens?flat=true')).data,
  });
  const del = useMutation({
    mutationFn: async (id: string) => (await http.delete(`/catalogo-itens/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['catalogo-itens'] });
      qc.invalidateQueries({ queryKey: ['lookups'] });
    },
  });

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Item desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Catálogo de itens" description="Carregando...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Catálogo de itens">
        <ErrorState
          title="Falha ao carregar catálogo"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Catálogo de itens"
      description="Itens reutilizáveis nos contratos (viaturas, postos, alimentos…)."
      actions={
        canWrite ? (
          <Link to="/catalogo-itens/new">
            <Button>
              <Plus size={16} /> Novo
            </Button>
          </Link>
        ) : undefined
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Categoria</TableHeader>
                <TableHeader>Unidade</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">{item.nome}</TableCell>
                    <TableCell>{item.categoriaItem?.label || '—'}</TableCell>
                    <TableCell>{item.unidadeMedidaPadrao?.codigo || '—'}</TableCell>
                    <TableCell>
                      {canWrite ? (
                      <div className="flex gap-2">
                        <Link to={`/catalogo-itens/${item.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(item.id, 'Desativar item?', 'O item deixa de aparecer nas listas.')
                          }
                        >
                          Desativar
                        </Button>
                      </div>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-[var(--text-muted)]">
                    Nenhum item no catálogo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onOpenChange={confirm.onOpenChange}
        title={confirm.pending?.title ?? 'Confirmar'}
        description={confirm.pending?.description}
        variant="danger"
        confirmLabel="Desativar"
        onConfirm={handleDelete}
        loading={del.isPending}
      />
    </Page>
  );
}
