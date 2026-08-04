import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export interface Contract {
  id: string;
  protocoloCabeca?: string | null;
  numGms: number;
  anoGms: number;
  unidadeFspId: string;
  unidadeFsp?: { id: string; sigla: string; nome: string };
  gestorId?: string;
  gestorName?: string;
  fiscalId?: string;
  fiscalName?: string;
  empresaId?: string;
  empresaName?: string;
  modalidade?: string;
  objeto?: string;
  valorAnual?: number;
  valorAnualCents?: number;
  dataInicio?: string | null;
  dataFimOrig?: string | null;
  status?: string;
  aditivos?: Array<{
    numAditivo: number;
    protocoloAdit: string;
    novoFimVigencia?: string | null;
    valorAdicional?: number;
  }>;
}

async function getContracts() {
  const res = await http.get<Contract[]>('/contracts');
  return res.data;
}

async function getContract(id: string) {
  const res = await http.get<Contract>(`/contracts/${id}`);
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
    mutationFn: async (payload: Partial<Contract>) => {
      const res = await http.post('/contracts', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Contract> }) => {
      const res = await http.put(`/contracts/${id}`, payload);
      return res.data;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: qk.contrato(vars.id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
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
      queryClient.invalidateQueries({ queryKey: ['contratos'] });
      queryClient.invalidateQueries({ queryKey: qk.contrato(id) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
