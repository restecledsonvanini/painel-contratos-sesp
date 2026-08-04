import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { Plus } from 'lucide-react';
import { useEmpresas, useDeleteEmpresa } from '../hooks/useReferences';

export default function EmpresasList() {
  const { data: empresas, isLoading, error } = useEmpresas();
  const del = useDeleteEmpresa();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta empresa?')) return;
    try {
      await del.mutateAsync(id);
    } catch {
      alert('Falha ao excluir');
    }
  };

  return (
    <Page
      title="Empresas"
      description="Cadastro de empresas contratadas (CNPJ)."
      actions={
        <Link to="/empresas/new">
          <Button>
            <Plus size={16} />
            Nova empresa
          </Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden">
        {isLoading ? (
          <p className="p-[var(--space-lg)] text-[var(--text-muted)]">Carregando...</p>
        ) : error ? (
          <p className="p-[var(--space-lg)] text-[var(--danger)]">
            Erro ao carregar empresas. Verifique se a API está rodando (`npm run api:dev`).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>CNPJ</TableHeader>
                  <TableHeader>Razão social</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {empresas && empresas.length > 0 ? (
                  empresas.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.cnpj}</TableCell>
                      <TableCell className="font-semibold">{e.razaoSocial}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/empresas/${e.id}/edit`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(e.id)}>
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-[var(--text-muted)]">
                      Nenhuma empresa encontrada.
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
