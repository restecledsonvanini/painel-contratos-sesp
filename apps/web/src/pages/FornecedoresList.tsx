import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@painel/ui';
import { useFornecedores, useDeleteFornecedor } from '../hooks/useReferences';

export default function FornecedoresList() {
  const { data: fornecedores, isLoading, error } = useFornecedores();
  const del = useDeleteFornecedor();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este fornecedor?')) return;
    try {
      await del.mutateAsync(id);
      alert('Excluído');
    } catch {
      alert('Falha ao excluir');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <Link to="/fornecedores/new">
          <Button>Novo</Button>
        </Link>
      </div>
      <Card>
        {isLoading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>Erro ao carregar.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>CNPJ</TableHeader>
                  <TableHeader>Ação</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedores && fornecedores.length > 0 ? (
                  fornecedores.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.nome}</TableCell>
                      <TableCell>{f.cnpj}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/fornecedores/${f.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="ghost" onClick={() => handleDelete(f.id)}>Excluir</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhum fornecedor encontrado.</TableCell>
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
 
