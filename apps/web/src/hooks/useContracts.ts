import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

const apiUrl = '/.netlify/functions/api/contracts';
const http = { timeout: 8000 };

async function getContracts() {
  const res = await axios.get<Contract[]>(apiUrl, http);
  return res.data;
}

async function getContract(id: string) {
  const res = await axios.get<Contract>(`${apiUrl}/${id}`, http);
  return res.data;
}

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: getContracts,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useContract(id?: string) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => getContract(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Contract>) => axios.post(apiUrl, payload, { timeout: 10000 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Contract> }) =>
      axios.put(`${apiUrl}/${id}`, payload, { timeout: 10000 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`${apiUrl}/${id}`, { timeout: 10000 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
