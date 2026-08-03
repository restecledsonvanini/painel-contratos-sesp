import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@painel/ui';
import { useEmpresas, useDeleteEmpresa } from '../hooks/useReferences';

export default function EmpresasList() {
  const { data: empresas, isLoading, error } = useEmpresas();
  const deleteEmpresa = useDeleteEmpresa();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta empresa?')) return;
    try {
      await deleteEmpresa.mutateAsync(id);
      alert('Empresa excluída.');
    } catch {
      alert('Falha ao excluir.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Empresas</h1>
        <Link to="/empresas/new">
          <Button>Novo</Button>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>Erro ao carregar empresas.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>NOME</TableHeader>
                  <TableHeader>CNPJ</TableHeader>
                  <TableHeader>AÇÃO</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {empresas && empresas.length > 0 ? (
                  empresas.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.razaoSocial}</TableCell>
                      <TableCell>{e.cnpj}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/empresas/${e.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="ghost" onClick={() => handleDelete(e.id)}>
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhuma empresa encontrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
