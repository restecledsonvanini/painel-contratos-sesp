import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export interface UnidadeFsp {
  id: string;
  sigla: string;
  nome: string;
}

export interface Fornecedor {
  id: string;
  tipoPessoa?: 'JURIDICA' | 'FISICA';
  documento: string;
  razaoSocial: string;
  nomeFantasia?: string | null;
  inscricaoEstadual?: string | null;
  porte?: string | null;
  municipioId?: string | null;
  situacao?: string;
  /** aliases */
  cnpj?: string;
  nome?: string;
  contatos?: FornecedorContato[];
  sancoes?: FornecedorSancao[];
}

export interface FornecedorContato {
  id: string;
  nome: string;
  cargo?: string | null;
  email?: string | null;
  telefone?: string | null;
  principal: boolean;
}

export interface FornecedorSancao {
  id: string;
  tipo: string;
  processo?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  abrangencia?: string | null;
  fonte?: string | null;
}

export interface Servidor {
  id: string;
  nome: string;
  cpf?: string | null;
  rgFuncional?: string | null;
  cargo?: string | null;
  orgaoId?: string | null;
  unidadeId?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativo?: boolean;
}

export interface Servico {
  id: string;
  titulo: string;
  descricao?: string;
}

/** @deprecated shape compat — same as Fornecedor resumido */
export type Empresa = { id: string; cnpj: string; razaoSocial: string };
/** @deprecated */
export type EntidadeGestora = { id: string; nome: string; cpf: string };

export function useUnidadesFsp() {
  return useQuery({
    queryKey: qk.unidadesFsp,
    queryFn: async () => (await http.get<UnidadeFsp[]>('/references/unidades-fsp')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useFornecedores() {
  return useQuery({
    queryKey: qk.fornecedores,
    queryFn: async () => (await http.get<Fornecedor[]>('/fornecedores?flat=true')).data,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFornecedor(id?: string) {
  return useQuery({
    queryKey: id ? qk.fornecedor(id) : ['fornecedores', 'empty'],
    queryFn: async () => (await http.get<Fornecedor>(`/fornecedores/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Fornecedor>) =>
      (await http.post('/fornecedores', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fornecedores });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useUpdateFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Fornecedor> }) =>
      (await http.put(`/fornecedores/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: qk.fornecedores });
      qc.invalidateQueries({ queryKey: qk.fornecedor(vars.id) });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/fornecedores/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fornecedores });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useServidores() {
  return useQuery({
    queryKey: qk.servidores,
    queryFn: async () => (await http.get<Servidor[]>('/servidores?flat=true')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useServidor(id?: string) {
  return useQuery({
    queryKey: id ? qk.servidor(id) : ['servidores', 'empty'],
    queryFn: async () => (await http.get<Servidor>(`/servidores/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateServidor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Servidor>) => (await http.post('/servidores', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.servidores });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useUpdateServidor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Servidor> }) =>
      (await http.put(`/servidores/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: qk.servidores });
      qc.invalidateQueries({ queryKey: qk.servidor(vars.id) });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteServidor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/servidores/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.servidores });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

/** Compat aliases — apontam para Fornecedor/Servidor */
export function useEmpresas() {
  return useQuery({
    queryKey: qk.empresas,
    queryFn: async () => (await http.get<Empresa[]>('/references/empresas')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useEntidadesGestoras() {
  return useQuery({
    queryKey: qk.entidadesGestoras,
    queryFn: async () => (await http.get<EntidadeGestora[]>('/references/entidades-gestoras')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useCreateUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<UnidadeFsp>) =>
      (await http.post('/references/unidades-fsp', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.unidadesFsp });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useUnidadeFspById(id?: string) {
  return useQuery({
    queryKey: id ? qk.unidadeFsp(id) : ['unidadesFsp', 'empty'],
    queryFn: async () => (await http.get<UnidadeFsp>(`/references/unidades-fsp/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useUpdateUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<UnidadeFsp> }) =>
      (await http.put(`/references/unidades-fsp/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: qk.unidadesFsp });
      queryClient.invalidateQueries({ queryKey: qk.unidadeFsp(vars.id) });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/references/unidades-fsp/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.unidadesFsp });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useServicos() {
  return useQuery({
    queryKey: qk.servicos,
    queryFn: async () => (await http.get<Servico[]>('/references/servicos')).data,
    staleTime: 1000 * 60 * 10,
  });
}

export function useServico(id?: string) {
  return useQuery({
    queryKey: id ? qk.servico(id) : ['servicos', 'empty'],
    queryFn: async () => (await http.get<Servico>(`/references/servicos/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateServico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Servico>) => (await http.post('/references/servicos', payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.servicos });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useUpdateServico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Servico> }) =>
      (await http.put(`/references/servicos/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: qk.servicos });
      qc.invalidateQueries({ queryKey: qk.servico(vars.id) });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteServico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/references/servicos/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.servicos });
      qc.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}
