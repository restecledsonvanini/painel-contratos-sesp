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
import { useFornecedores, useDeleteFornecedor } from '../hooks/useReferences';
import { getErrorMessage } from '../lib/http';
import { useCanWrite } from '../lib/access';
import { useConfirmDialog } from '../lib/useConfirmDialog';
import { maskCnpj, maskCpf } from '../lib/masks';

function formatDoc(documento: string, tipo?: string) {
  if (!documento) return '—';
  return tipo === 'FISICA' ? maskCpf(documento) : maskCnpj(documento);
}

export default function FornecedoresList() {
  const { data: fornecedores, isLoading, error, refetch } = useFornecedores();
  const del = useDeleteFornecedor();
  const toast = useToast();
  const confirm = useConfirmDialog<string>();
  const canWrite = useCanWrite();

  const handleDelete = async () => {
    if (!confirm.pending) return;
    try {
      await del.mutateAsync(confirm.pending.payload);
      toast.success('Fornecedor desativado.');
    } catch (err) {
      toast.error('Falha ao excluir', getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <Page title="Fornecedores" description="Carregando cadastros...">
        <Skeleton variant="table" lines={6} />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Fornecedores">
        <ErrorState
          title="Falha ao carregar fornecedores"
          message={getErrorMessage(error)}
          code={(error as { code?: string }).code}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Fornecedores"
      description="Cadastro unificado de contratadas (PJ/PF), com contatos e sanções."
      actions={
        canWrite ? (
          <Link to="/fornecedores/new">
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
                <TableHeader>Razão social</TableHeader>
                <TableHeader>Documento</TableHeader>
                <TableHeader>Situação</TableHeader>
                <TableHeader>Contatos</TableHeader>
                <TableHeader>Sanções</TableHeader>
                <TableHeader>Ações</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {fornecedores?.length ? (
                fornecedores.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-semibold">{f.razaoSocial || f.nome}</TableCell>
                    <TableCell>{formatDoc(f.documento || '', f.tipoPessoa)}</TableCell>
                    <TableCell>{f.situacao || 'ATIVO'}</TableCell>
                    <TableCell>{f._count?.contatos ?? f.contatos?.length ?? 0}</TableCell>
                    <TableCell>
                      {(f._count?.sancoes ?? f.sancoes?.length ?? 0) > 0 ? (
                        <span className="text-[var(--danger, #b91c1c)] font-medium">
                          {f._count?.sancoes ?? f.sancoes?.length}
                        </span>
                      ) : (
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      {canWrite ? (
                      <div className="flex gap-2">
                        <Link to={`/fornecedores/${f.id}/edit`}>
                          <Button size="sm" variant="secondary">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            confirm.ask(f.id, 'Desativar fornecedor?', 'O registro será marcado como inativo.')
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
                    Nenhum fornecedor.
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
