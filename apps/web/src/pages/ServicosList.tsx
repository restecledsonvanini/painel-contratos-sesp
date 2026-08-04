import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { Plus } from 'lucide-react';
import { useServicos, useDeleteServico } from '../hooks/useReferences';

export default function ServicosList() {
  const { data: servicos, isLoading, error } = useServicos();
  const del = useDeleteServico();

  return (
    <Page
      title="Serviços"
      description="Catálogo de serviços."
      actions={
        <Link to="/servicos/new">
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
                  <TableHeader>Título</TableHeader>
                  <TableHeader>Descrição</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicos?.length ? (
                  servicos.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-semibold">{s.titulo}</TableCell>
                      <TableCell>{s.descricao || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/servicos/${s.id}/edit`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm('Excluir?')) return;
                              await del.mutateAsync(s.id);
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
                      Nenhum serviço.
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
