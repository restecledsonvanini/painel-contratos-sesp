import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import type {
  FornecedorContatoCreateInput,
  FornecedorContatoDTO,
  FornecedorContatoUpdateInput,
  FornecedorCreateInput,
  FornecedorDTO,
  FornecedorSancaoCreateInput,
  FornecedorSancaoDTO,
  FornecedorSancaoUpdateInput,
  FornecedorUpdateInput,
  ServidorCreateInput,
  ServidorDTO,
  ServidorUpdateInput,
  UnidadeFspCreateInput,
  UnidadeFspDTO,
  UnidadeFspUpdateInput,
  UnidadeOrganizacionalDTO,
} from '@painel/schema';
import { http } from '../lib/http';
import { createCrudHooks } from '../lib/createCrudHooks';
import { invalidateFornecedor } from '../lib/invalidate';
import { qk } from '../lib/queryKeys';

export type {
  FornecedorContatoDTO as FornecedorContato,
  FornecedorDTO as Fornecedor,
  FornecedorSancaoDTO as FornecedorSancao,
  ServidorDTO as Servidor,
  UnidadeFspDTO as UnidadeFsp,
};

export type ContatoInput = FornecedorContatoCreateInput;
export type SancaoInput = FornecedorSancaoCreateInput;

const fornecedorCrud = createCrudHooks<
  FornecedorDTO,
  FornecedorCreateInput,
  FornecedorUpdateInput
>({
  resource: 'fornecedores',
  listKey: qk.fornecedores,
  detailKey: qk.fornecedor,
  paths: {
    list: '/fornecedores',
    detail: (id) => `/fornecedores/${id}`,
  },
});

export const useFornecedores = fornecedorCrud.useList;
export const useFornecedor = fornecedorCrud.useOne;
export const useCreateFornecedor = fornecedorCrud.useCreate;
export const useUpdateFornecedor = fornecedorCrud.useUpdate;
export const useDeleteFornecedor = fornecedorCrud.useRemove;

export function useCreateFornecedorContato(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FornecedorContatoCreateInput) =>
      (await http.post(`/fornecedores/${fornecedorId}/contatos`, payload)).data as FornecedorContatoDTO,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

export function useUpdateFornecedorContato(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contatoId,
      payload,
    }: {
      contatoId: string;
      payload: FornecedorContatoUpdateInput;
    }) =>
      (await http.put(`/fornecedores/${fornecedorId}/contatos/${contatoId}`, payload)).data,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

export function useDeleteFornecedorContato(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contatoId: string) =>
      (await http.delete(`/fornecedores/${fornecedorId}/contatos/${contatoId}`)).data,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

export function useCreateFornecedorSancao(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FornecedorSancaoCreateInput) =>
      (await http.post(`/fornecedores/${fornecedorId}/sancoes`, payload)).data as FornecedorSancaoDTO,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

export function useUpdateFornecedorSancao(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sancaoId,
      payload,
    }: {
      sancaoId: string;
      payload: FornecedorSancaoUpdateInput;
    }) =>
      (await http.put(`/fornecedores/${fornecedorId}/sancoes/${sancaoId}`, payload)).data,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

export function useDeleteFornecedorSancao(fornecedorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sancaoId: string) =>
      (await http.delete(`/fornecedores/${fornecedorId}/sancoes/${sancaoId}`)).data,
    onSuccess: () => invalidateFornecedor(qc, fornecedorId),
  });
}

const servidorCrud = createCrudHooks<ServidorDTO, ServidorCreateInput, ServidorUpdateInput>({
  resource: 'servidores',
  listKey: qk.servidores,
  detailKey: qk.servidor,
  paths: {
    list: '/servidores',
    detail: (id) => `/servidores/${id}`,
  },
});

export const useServidores = servidorCrud.useList;
export const useServidor = servidorCrud.useOne;
export const useCreateServidor = servidorCrud.useCreate;
export const useUpdateServidor = servidorCrud.useUpdate;
export const useDeleteServidor = servidorCrud.useRemove;

const unidadeFspCrud = createCrudHooks<
  UnidadeFspDTO,
  UnidadeFspCreateInput,
  UnidadeFspUpdateInput
>({
  resource: 'unidadesFsp',
  listKey: qk.unidadesFsp,
  detailKey: qk.unidadeFsp,
  paths: {
    list: '/references/unidades-fsp',
    detail: (id) => `/references/unidades-fsp/${id}`,
  },
});

export const useUnidadesFsp = unidadeFspCrud.useList;
export const useUnidadeFspById = unidadeFspCrud.useOne;
export const useCreateUnidadeFsp = unidadeFspCrud.useCreate;
export const useUpdateUnidadeFsp = unidadeFspCrud.useUpdate;
export const useDeleteUnidadeFsp = unidadeFspCrud.useRemove;

/** Lista flat de unidades (lookup rápido em formulários). */
export function useUnidadesOrganizacionais(
  queryOptions?: Partial<UseQueryOptions<UnidadeOrganizacionalDTO[]>>,
) {
  return useQuery({
    queryKey: ['unidadesOrganizacionais'] as const,
    queryFn: async () => (await http.get<UnidadeOrganizacionalDTO[]>('/unidades')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
    ...queryOptions,
  });
}
