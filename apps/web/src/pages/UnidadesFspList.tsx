import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Page, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { Plus } from 'lucide-react';
import { useUnidadesFsp, useDeleteUnidadeFsp } from '../hooks/useReferences';

export default function UnidadesFspList() {
  const { data: unidades, isLoading, error } = useUnidadesFsp();
  const del = useDeleteUnidadeFsp();

  return (
    <Page
      title="Unidades FSP"
      description="Forças e unidades de segurança pública."
      actions={
        <Link to="/unidades-fsp/new">
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
                  <TableHeader>Sigla</TableHeader>
                  <TableHeader>Nome</TableHeader>
                  <TableHeader>Ações</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {unidades?.length ? (
                  unidades.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-semibold">{u.sigla}</TableCell>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/unidades-fsp/${u.id}/edit`}>
                            <Button size="sm" variant="secondary">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm('Excluir?')) return;
                              await del.mutateAsync(u.id);
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
                      Nenhuma unidade.
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
