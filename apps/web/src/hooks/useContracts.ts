import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export interface Contract {
  id: string;
  protocoloCabeca?: string | null;
  eProtocolo?: string | null;
  numGms: number;
  numeroGms?: string;
  anoGms: number;
  unidadeFspId?: string;
  unidadeFsp?: { id: string; sigla: string; nome: string };
  unidadeGestoraId?: string;
  unidadeGestora?: { id: string; sigla: string; nome: string; orgao?: { sigla: string } };
  gestorId?: string;
  gestorName?: string;
  fiscalId?: string;
  fiscalName?: string;
  fornecedorId?: string;
  fornecedorName?: string;
  /** @deprecated */
  empresaId?: string;
  /** @deprecated */
  empresaName?: string;
  modalidade?: string;
  pilar?: string;
  naturezaObjeto?: string;
  situacao?: string;
  objeto?: string;
  valorAnual?: number;
  valorAnualCents?: number;
  valorGlobalOriginal?: number;
  dataInicio?: string | null;
  dataInicioVigencia?: string | null;
  dataFimOrig?: string | null;
  dataFimVigenciaOriginal?: string | null;
  status?: string;
  observacoes?: string | null;
  itens?: Array<{
    id: string;
    sequencia: number;
    catalogoItemId: string;
    catalogoNome?: string;
    categoria?: string;
    quantidade: number;
    unidadeMedida?: string;
    valorUnitario?: number;
    valorTotal?: number;
    periodicidade?: string;
    atributos?: Record<string, unknown> | null;
  }>;
  alteracoes?: Array<{
    id: string;
    tipo: string;
    numero: number;
    eProtocolo?: string | null;
    novaDataFimVigencia?: string | null;
    valorAcrescido?: number;
    situacao?: string;
  }>;
  aditivos?: Array<{
    id?: string;
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
