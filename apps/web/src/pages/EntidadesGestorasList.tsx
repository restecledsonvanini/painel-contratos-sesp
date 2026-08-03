import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@painel/ui';
import { useEntidadesGestoras, useDeleteEntidadeGestora } from '../hooks/useReferences';

export default function EntidadesGestorasList() {
  const { data: entidades, isLoading, error } = useEntidadesGestoras();
  const deleteEntidade = useDeleteEntidadeGestora();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta entidade?')) return;
    try {
      await deleteEntidade.mutateAsync(id);
      alert('Excluído');
    } catch {
      alert('Falha ao excluir');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Entidades Gestoras</h1>
        <Link to="/entidades-gestoras/new">
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
                  <TableHeader>CPF</TableHeader>
                  <TableHeader>Ação</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {entidades && entidades.length > 0 ? (
                  entidades.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.nome}</TableCell>
                      <TableCell>{e.cpf}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/entidades-gestoras/${e.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="ghost" onClick={() => handleDelete(e.id)}>Excluir</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhuma entidade encontrada.</TableCell>
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
