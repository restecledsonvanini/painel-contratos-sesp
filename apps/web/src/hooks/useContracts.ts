import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ContractCreateInput, ContractUpdateInput, ContratoDTO } from '@painel/schema';
import { http } from '../lib/http';
import { invalidateContratos } from '../lib/invalidate';
import { qk } from '../lib/queryKeys';

export type { ContratoDTO as Contract };

async function getContracts() {
  const res = await http.get<ContratoDTO[]>('/contracts');
  return res.data;
}

async function getContract(id: string) {
  const res = await http.get<ContratoDTO>(`/contracts/${id}`);
  return res.data;
}

export function useContracts() {
  return useQuery({
    queryKey: qk.contratos(),
    queryFn: getContracts,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useContract(id?: string) {
  return useQuery({
    queryKey: id ? qk.contrato(id) : ['contratos', 'empty'],
    queryFn: () => getContract(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ContractCreateInput) => {
      const res = await http.post<ContratoDTO>('/contracts', payload);
      return res.data;
    },
    onSuccess: () => invalidateContratos(queryClient),
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ContractUpdateInput }) => {
      const res = await http.patch<ContratoDTO>(`/contracts/${id}`, payload);
      return res.data;
    },
    onSuccess: (_data, vars) => invalidateContratos(queryClient, vars.id),
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/contracts/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      // Evita refetch 404 do detalhe já excluído.
      queryClient.removeQueries({ queryKey: qk.contrato(id) });
      invalidateContratos(queryClient);
    },
  });
}
