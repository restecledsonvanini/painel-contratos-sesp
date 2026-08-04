import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { Plus } from 'lucide-react';
import { useFornecedores, useDeleteFornecedor } from '../hooks/useReferences';

export default function FornecedoresList() {
  const { data: fornecedores, isLoading, error } = useFornecedores();
  const del = useDeleteFornecedor();

  return (
    <Page
      title="Fornecedores"
      description="Cadastro de fornecedores."
      actions={
        <Link to="/fornecedores/new">
          <Button>
            <Plus size={16} /> Novo
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        {isLoading ? (
          <p className="p-[var(--space-lg)] text-[var(--text-muted)]">Carregando...</p>
        ) : error ? (
          <p className="p-[var(--space-lg)] text-[var(--danger)]">Erro ao carregar.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>CNPJ</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedores?.length ? (
                  fornecedores.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-semibold">{f.nome}</TableCell>
                      <TableCell>{f.cnpj || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/fornecedores/${f.id}/edit`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm('Excluir?')) return;
                              await del.mutateAsync(f.id);
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-[var(--text-muted)]">
                      Nenhum fornecedor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </Page>
  );
}
