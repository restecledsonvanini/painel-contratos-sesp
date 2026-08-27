import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  DataTable,
  Input,
  Page,
  Select,
  Skeleton,
  StatusBadge,
  useToast,
  type ColumnDef,
} from '@painel/ui';
import { ROLE_LABELS, type Role } from '@painel/domain';
import type { UsuarioCreateInput, UsuarioDTO, UsuarioUpdateInput } from '@painel/schema';
import { getErrorMessage, http } from '../../../lib/http';
import { useOrgaos } from '../../../hooks/useOrganizacao';
import { useServidores } from '../../../hooks/useReferences';

const ROLES: Role[] = ['VISITANTE', 'ANALISTA', 'GESTOR', 'ADMIN'];
const NONE = '__none__';

export default function UsuariosPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data: orgaos = [] } = useOrgaos();
  const { data: servidoresPage } = useServidores({ pageSize: 100 });
  const servidores = servidoresPage?.data ?? [];
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('ANALISTA');
  const [orgaoId, setOrgaoId] = useState('');
  const [servidorId, setServidorId] = useState('');

  const list = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => (await http.get<UsuarioDTO[]>('/usuarios')).data,
  });

  const create = useMutation({
    mutationFn: async () => {
      const body: UsuarioCreateInput = {
        email: email.trim(),
        nome: nome.trim() || null,
        password,
        role,
        orgaoId: orgaoId && orgaoId !== NONE ? orgaoId : null,
        servidorId: servidorId && servidorId !== NONE ? servidorId : null,
      };
      return (await http.post<UsuarioDTO>('/usuarios', body)).data;
    },
    onSuccess: () => {
      toast.success('Usuário criado.');
      setEmail('');
      setNome('');
      setPassword('');
      setRole('ANALISTA');
      setOrgaoId('');
      setServidorId('');
      void qc.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (err) => toast.error('Falha ao criar.', getErrorMessage(err)),
  });

  const patch = useMutation({
    mutationFn: async (input: { id: string; data: UsuarioUpdateInput }) =>
      (await http.patch<UsuarioDTO>(`/usuarios/${input.id}`, input.data)).data,
    onSuccess: () => {
      toast.success('Usuário atualizado.');
      void qc.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (err) => toast.error('Falha ao atualizar.', getErrorMessage(err)),
  });

  const orgaoOptions = useMemo(
    () => [
      { id: NONE, label: '— sem órgão —' },
      ...orgaos.map((o: { id: string; sigla: string; nome: string }) => ({
        id: o.id,
        label: `${o.sigla} — ${o.nome}`,
      })),
    ],
    [orgaos],
  );

  const servidorOptions = useMemo(
    () => [
      { id: NONE, label: '— sem servidor —' },
      ...servidores.map((s) => ({
        id: s.id,
        label: s.cpf ? `${s.nome} (${s.cpf})` : s.nome,
      })),
    ],
    [servidores],
  );

  const rows = list.data ?? [];

  const columns: ColumnDef<UsuarioDTO>[] = useMemo(
    () => [
      {
        id: 'email',
        header: 'E-mail',
        enableSorting: false,
        cell: ({ row }) => <span className="font-semibold">{row.original.email}</span>,
      },
      {
        accessorKey: 'nome',
        header: 'Nome',
        enableSorting: false,
        cell: ({ row }) => row.original.nome || '—',
      },
      {
        id: 'papel',
        header: 'Papel',
        enableSorting: false,
        cell: ({ row }) => (
          <Select
            className="min-w-[9rem]"
            aria-label={`Papel de ${row.original.email}`}
            value={row.original.role}
            onChange={(v) => patch.mutate({ id: row.original.id, data: { role: v as Role } })}
            options={ROLES.map((r) => ({ id: r, label: ROLE_LABELS[r] }))}
          />
        ),
      },
      {
        id: 'orgao',
        header: 'Órgão',
        enableSorting: false,
        cell: ({ row }) => (
          <Select
            className="min-w-[12rem]"
            aria-label={`Órgão de ${row.original.email}`}
            value={row.original.orgaoId ?? NONE}
            onChange={(v) =>
              patch.mutate({
                id: row.original.id,
                data: { orgaoId: v === NONE ? null : v },
              })
            }
            options={orgaoOptions}
          />
        ),
      },
      {
        id: 'servidor',
        header: 'Servidor',
        enableSorting: false,
        cell: ({ row }) => (
          <Select
            className="min-w-[14rem]"
            aria-label={`Servidor de ${row.original.email}`}
            value={row.original.servidorId ?? NONE}
            onChange={(v) =>
              patch.mutate({
                id: row.original.id,
                data: { servidorId: v === NONE ? null : v },
              })
            }
            options={servidorOptions}
          />
        ),
      },
      {
        id: 'situacao',
        header: 'Situação',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge status={row.original.ativo ? 'ATIVO' : 'INATIVO'} />
        ),
      },
      {
        id: 'acoes',
        header: 'Ações',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            disabled={patch.isPending}
            onClick={() =>
              patch.mutate({ id: row.original.id, data: { ativo: !row.original.ativo } })
            }
          >
            {row.original.ativo ? 'Desativar' : 'Ativar'}
          </Button>
        ),
      },
    ],
    [orgaoOptions, patch, servidorOptions],
  );

  return (
    <Page
      title="Usuários"
      description="Papéis de acesso, órgão de escopo, vínculo com servidor e ativação. Somente ADMIN."
    >
      <Card variant="bordered" className="mb-4 space-y-3 p-4">
        <h2 className="text-sm font-semibold">Novo usuário</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            label="Papel"
            value={role}
            onChange={(v) => setRole(v as Role)}
            options={ROLES.map((r) => ({ id: r, label: ROLE_LABELS[r] }))}
          />
          <Select
            label="Órgão"
            value={orgaoId || undefined}
            onChange={setOrgaoId}
            options={orgaoOptions}
            placeholder="— sem órgão —"
          />
          <Select
            label="Servidor"
            value={servidorId || undefined}
            onChange={setServidorId}
            options={servidorOptions}
            placeholder="— sem servidor —"
          />
        </div>
        <Button
          disabled={create.isPending || !email.trim() || password.length < 6}
          onClick={() => create.mutate()}
        >
          {create.isPending ? 'Salvando…' : 'Criar usuário'}
        </Button>
      </Card>

      {list.isLoading ? (
        <Skeleton variant="table" lines={6} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          emptyMessage="Nenhum usuário cadastrado."
        />
      )}
    </Page>
  );
}
