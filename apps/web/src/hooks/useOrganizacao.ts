import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export type Orgao = {
  id: string;
  sigla: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  parentId?: string | null;
  parent?: { id: string; sigla: string; nome: string } | null;
};

export type UnidadeOrganizacional = {
  id: string;
  orgaoId: string;
  parentId?: string | null;
  sigla: string;
  nome: string;
  nivel: string;
  municipioId: string;
  ativo: boolean;
  orgao?: { id: string; sigla: string; nome: string };
  municipio?: { id: string; nome: string; uf: string; codigoIbge?: string };
  parent?: { id: string; sigla: string; nome: string } | null;
};

export type ArvoreOrgao = {
  id: string;
  kind?: 'orgao' | 'unidade';
  label: string;
  sigla: string;
  nome?: string;
  tipo?: string;
  nivel?: string;
  parentId?: string | null;
  municipio?: { id: string; nome: string; uf: string };
  children: ArvoreOrgao[];
};

export type Municipio = {
  id: string;
  nome: string;
  uf: string;
  codigoIbge: string;
};

const UNIDADES_KEY = ['unidadesOrganizacionais'] as const;
const ORGAOS_KEY = ['orgaos'] as const;
const ARVORE_KEY = ['unidades', 'arvore'] as const;

export function useOrgaos() {
  return useQuery({
    queryKey: ORGAOS_KEY,
    queryFn: async () => (await http.get<Orgao[]>('/orgaos')).data,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUnidadesList() {
  return useQuery({
    queryKey: UNIDADES_KEY,
    queryFn: async () => (await http.get<UnidadeOrganizacional[]>('/unidades')).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUnidadesArvore() {
  return useQuery({
    queryKey: ARVORE_KEY,
    queryFn: async () => (await http.get<ArvoreOrgao[]>('/unidades/arvore')).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUnidade(id?: string) {
  return useQuery({
    queryKey: id ? ['unidade', id] : ['unidade', 'empty'],
    queryFn: async () => (await http.get<UnidadeOrganizacional>(`/unidades/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useMunicipioSearch(q: string) {
  return useQuery({
    queryKey: ['municipios', q],
    queryFn: async () => {
      const res = await http.get<{ data: Municipio[] }>('/municipios', { params: { q, pageSize: 20 } });
      return res.data.data ?? [];
    },
    enabled: q.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}

function invalidateOrg(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: UNIDADES_KEY });
  queryClient.invalidateQueries({ queryKey: ORGAOS_KEY });
  queryClient.invalidateQueries({ queryKey: ARVORE_KEY });
  queryClient.invalidateQueries({ queryKey: qk.lookups });
}

export function useCreateUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) =>
      (await http.post<UnidadeOrganizacional>('/unidades', payload)).data,
    onSuccess: () => invalidateOrg(queryClient),
  });
}

export function useUpdateUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      (await http.put<UnidadeOrganizacional>(`/unidades/${id}`, payload)).data,
    onSuccess: (_data, vars) => {
      invalidateOrg(queryClient);
      queryClient.invalidateQueries({ queryKey: ['unidade', vars.id] });
    },
  });
}

export function useDeleteUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/unidades/${id}`)).data,
    onSuccess: () => invalidateOrg(queryClient),
  });
}
