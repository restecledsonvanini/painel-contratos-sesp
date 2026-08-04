import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { Plus } from 'lucide-react';
import { useEntidadesGestoras, useDeleteEntidadeGestora } from '../hooks/useReferences';

export default function EntidadesGestorasList() {
  const { data: entidades, isLoading, error } = useEntidadesGestoras();
  const del = useDeleteEntidadeGestora();

  return (
    <Page
      title="Entidades gestoras"
      description="Gestores e fiscais de contrato."
      actions={
        <Link to="/entidades-gestoras/new">
          <Button>
            <Plus size={16} /> Nova
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
                  <TableHeader>CPF</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {entidades?.length ? (
                  entidades.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-semibold">{e.nome}</TableCell>
                      <TableCell>{e.cpf}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/entidades-gestoras/${e.id}/edit`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm('Excluir?')) return;
                              await del.mutateAsync(e.id);
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
                      Nenhuma entidade.
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
