import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@painel/ui';
import { useUnidadesFsp, useDeleteUnidadeFsp } from '../hooks/useReferences';

export default function UnidadesFspList() {
  const { data: unidades, isLoading, error } = useUnidadesFsp();
  const del = useDeleteUnidadeFsp();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta unidade?')) return;
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
        <h1 className="text-2xl font-semibold">Unidades FSP</h1>
        <Link to="/unidades-fsp/new">
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
                  <TableHeader>Sigla</TableHeader>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Ação</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {unidades && unidades.length > 0 ? (
                  unidades.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.sigla}</TableCell>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/unidades-fsp/${u.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="ghost" onClick={() => handleDelete(u.id)}>Excluir</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhuma unidade encontrada.</TableCell>
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
