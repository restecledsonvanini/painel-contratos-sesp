import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@painel/ui';
import { useServicos, useDeleteServico } from '../hooks/useReferences';

export default function ServicosList() {
  const { data: servicos, isLoading, error } = useServicos();
  const del = useDeleteServico();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir este serviço?')) return;
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
        <h1 className="text-2xl font-semibold">Serviços</h1>
        <Link to="/servicos/new">
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
                  <TableHeader>Título</TableHeader>
                  <TableHeader>Descrição</TableHeader>
                  <TableHeader>Ação</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicos && servicos.length > 0 ? (
                  servicos.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.titulo}</TableCell>
                      <TableCell>{s.descricao}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/servicos/${s.id}/edit`}>
                            <Button variant="secondary">Editar</Button>
                          </Link>
                          <Button variant="ghost" onClick={() => handleDelete(s.id)}>Excluir</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>Nenhum serviço encontrado.</TableCell>
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
 
