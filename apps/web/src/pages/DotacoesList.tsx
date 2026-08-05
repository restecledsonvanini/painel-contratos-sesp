import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, ErrorState, Page, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@painel/ui';
import { http, getErrorMessage } from '../lib/http';

type Dotacao = {
  id: string;
  exercicio: number;
  codigo: string;
  descricao?: string | null;
  naturezaDespesa?: { codigo: string; label: string };
  fonteRecurso?: { codigo: string; label: string };
};

export default function DotacoesList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dotacoes'],
    queryFn: async () => (await http.get<Dotacao[]>('/dotacoes')).data,
  });

  if (isLoading) {
    return (
      <Page title="Dotações orçamentárias" description="Carregando...">
        <Skeleton variant="card" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Dotações orçamentárias">
        <ErrorState
          title="Falha ao carregar"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      </Page>
    );
  }

  return (
    <Page
      title="Dotações orçamentárias"
      description="Natureza de despesa e fonte de recurso por exercício."
      actions={
        <Link to="/contracts">
          <Button variant="ghost">Contratos</Button>
        </Link>
      }
    >
      <Card variant="bordered" className="overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exercício</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Natureza</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length ? (
              data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.exercicio}</TableCell>
                  <TableCell className="font-semibold">{d.codigo}</TableCell>
                  <TableCell>{d.naturezaDespesa?.label || d.naturezaDespesa?.codigo || '—'}</TableCell>
                  <TableCell>{d.fonteRecurso?.label || d.fonteRecurso?.codigo || '—'}</TableCell>
                  <TableCell>{d.descricao || '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Nenhuma dotação cadastrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Page>
  );
}
