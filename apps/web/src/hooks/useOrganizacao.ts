import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type {
  ArvoreOrgaoDTO,
  MunicipioDTO,
  OrgaoDTO,
  UnidadeOrganizacionalCreateInput,
  UnidadeOrganizacionalDTO,
  UnidadeOrganizacionalUpdateInput,
} from '@painel/schema';
import { http } from '../lib/http';
import { invalidateOrganizacao } from '../lib/invalidate';

export type {
  ArvoreOrgaoDTO as ArvoreOrgao,
  MunicipioDTO as Municipio,
  OrgaoDTO as Orgao,
  UnidadeOrganizacionalDTO as UnidadeOrganizacional,
};

const UNIDADES_KEY = ['unidadesOrganizacionais'] as const;
const ORGAOS_KEY = ['orgaos'] as const;
const ARVORE_KEY = ['unidades', 'arvore'] as const;

export function useOrgaos(queryOptions?: Partial<UseQueryOptions<OrgaoDTO[]>>) {
  return useQuery({
    queryKey: ORGAOS_KEY,
    queryFn: async () => (await http.get<OrgaoDTO[]>('/orgaos')).data,
    staleTime: 1000 * 60 * 10,
    ...queryOptions,
  });
}

export function useUnidadesList() {
  return useQuery({
    queryKey: UNIDADES_KEY,
    queryFn: async () => (await http.get<UnidadeOrganizacionalDTO[]>('/unidades')).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUnidadesArvore() {
  return useQuery({
    queryKey: ARVORE_KEY,
    queryFn: async () => (await http.get<ArvoreOrgaoDTO[]>('/unidades/arvore')).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUnidade(id?: string) {
  return useQuery({
    queryKey: id ? ['unidade', id] : ['unidade', 'empty'],
    queryFn: async () => (await http.get<UnidadeOrganizacionalDTO>(`/unidades/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useMunicipioSearch(q: string) {
  return useQuery({
    queryKey: ['municipios', q],
    queryFn: async () => {
      const res = await http.get<{ data: MunicipioDTO[] }>('/municipios', {
        params: { q, pageSize: 20 },
      });
      return res.data.data ?? [];
    },
    enabled: q.trim().length >= 2,
    staleTime: 1000 * 60,
  });
}

export function useCreateUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UnidadeOrganizacionalCreateInput) =>
      (await http.post<UnidadeOrganizacionalDTO>('/unidades', payload)).data,
    onSuccess: () => invalidateOrganizacao(queryClient),
  });
}

export function useUpdateUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UnidadeOrganizacionalUpdateInput;
    }) => (await http.put<UnidadeOrganizacionalDTO>(`/unidades/${id}`, payload)).data,
    onSuccess: (_data, vars) => invalidateOrganizacao(queryClient, vars.id),
  });
}

export function useDeleteUnidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/unidades/${id}`)).data,
    onSuccess: () => invalidateOrganizacao(queryClient),
  });
}
