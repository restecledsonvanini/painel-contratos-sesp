import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Input,
  Page,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
} from '@painel/ui';
import { EMAIL_DOMAINS_SLUG } from '@painel/domain';
import { getErrorMessage, http } from '../lib/http';

type DominioValor = {
  id: string;
  codigo: string;
  label: string;
  ordem: number;
  ativo: boolean;
};

export default function SegurancaPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const [domain, setDomain] = useState('');

  const valores = useQuery({
    queryKey: ['dominios', EMAIL_DOMAINS_SLUG, 'valores'],
    queryFn: async () =>
      (
        await http.get<DominioValor[]>(`/dominios/${EMAIL_DOMAINS_SLUG}/valores`, {
          params: { includeInativos: true },
        })
      ).data,
  });

  const create = useMutation({
    mutationFn: async () => {
      const d = domain.trim().toLowerCase();
      return (
        await http.post(`/dominios/${EMAIL_DOMAINS_SLUG}/valores`, {
          codigo: d,
          label: d,
          ordem: (valores.data?.length ?? 0) + 1,
        })
      ).data;
    },
    onSuccess: () => {
      toast.success('Domínio adicionado.');
      setDomain('');
      void qc.invalidateQueries({ queryKey: ['dominios', EMAIL_DOMAINS_SLUG] });
    },
    onError: (err) => toast.error('Falha ao adicionar.', getErrorMessage(err)),
  });

  const toggle = useMutation({
    mutationFn: async (row: DominioValor) =>
      (
        await http.patch(`/dominios/${EMAIL_DOMAINS_SLUG}/valores/${row.id}`, {
          ativo: !row.ativo,
        })
      ).data,
    onSuccess: () => {
      toast.success('Atualizado.');
      void qc.invalidateQueries({ queryKey: ['dominios', EMAIL_DOMAINS_SLUG] });
    },
    onError: (err) => toast.error('Falha ao atualizar.', getErrorMessage(err)),
  });

  return (
    <Page
      title="Segurança"
      description="Domínios de e-mail permitidos no login e no cadastro de usuários. AUTH_EMAIL_DOMAINS na API sobrescreve esta lista."
    >
      <Card variant="bordered" className="mb-4 flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[16rem] flex-1">
          <Input
            label="Novo domínio"
            placeholder="sesp.pr.gov.br"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <Button
          disabled={create.isPending || !domain.includes('.')}
          onClick={() => create.mutate()}
        >
          Adicionar
        </Button>
      </Card>

      {valores.isLoading ? (
        <Skeleton variant="table" lines={4} />
      ) : (
        <Card variant="bordered" className="overflow-hidden p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Domínio</TableHeader>
                <TableHeader>Situação</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {(valores.data ?? []).map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-semibold">{v.codigo}</TableCell>
                  <TableCell>{v.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => toggle.mutate(v)}>
                      {v.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!valores.data?.length && (
                <TableRow>
                  <TableCell colSpan={3} className="text-[var(--text-muted)]">
                    Nenhum domínio cadastrado — rode o seed ou adicione acima.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </Page>
  );
}
