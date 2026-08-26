import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  Input,
  Page,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useToast,
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
        <Card variant="bordered" className="overflow-hidden p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>E-mail</TableHeader>
                <TableHeader>Nome</TableHeader>
                <TableHeader>Papel</TableHeader>
                <TableHeader>Órgão</TableHeader>
                <TableHeader>Servidor</TableHeader>
                <TableHeader>Situação</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold">{u.email}</TableCell>
                  <TableCell>{u.nome || '—'}</TableCell>
                  <TableCell>
                    <select
                      className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                      value={u.role}
                      onChange={(e) =>
                        patch.mutate({ id: u.id, data: { role: e.target.value as Role } })
                      }
                      aria-label={`Papel de ${u.email}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <select
                      className="max-w-[12rem] rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                      value={u.orgaoId ?? NONE}
                      onChange={(e) => {
                        const v = e.target.value;
                        patch.mutate({
                          id: u.id,
                          data: { orgaoId: v === NONE ? null : v },
                        });
                      }}
                      aria-label={`Órgão de ${u.email}`}
                    >
                      {orgaoOptions.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <select
                      className="max-w-[14rem] rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
                      value={u.servidorId ?? NONE}
                      onChange={(e) => {
                        const v = e.target.value;
                        patch.mutate({
                          id: u.id,
                          data: { servidorId: v === NONE ? null : v },
                        });
                      }}
                      aria-label={`Servidor de ${u.email}`}
                    >
                      {servidorOptions.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.ativo ? 'success' : 'default'}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={patch.isPending}
                      onClick={() => patch.mutate({ id: u.id, data: { ativo: !u.ativo } })}
                    >
                      {u.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Page>
  );
}
