import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/http';
import { qk } from '../lib/queryKeys';

export interface UnidadeFsp {
  id: string;
  sigla: string;
  nome: string;
}

export interface Empresa {
  id: string;
  cnpj: string;
  razaoSocial: string;
}

export interface EntidadeGestora {
  id: string;
  nome: string;
  cpf: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
}

export interface Servico {
  id: string;
  titulo: string;
  descricao?: string;
}

export function useUnidadesFsp() {
  return useQuery({
    queryKey: qk.unidadesFsp,
    queryFn: async () => (await http.get<UnidadeFsp[]>('/references/unidades-fsp')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useEmpresas() {
  return useQuery({
    queryKey: qk.empresas,
    queryFn: async () => (await http.get<Empresa[]>('/references/empresas')).data,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useEmpresa(id?: string) {
  return useQuery({
    queryKey: id ? qk.empresa(id) : ['empresas', 'empty'],
    queryFn: async () => (await http.get<Empresa>(`/references/empresas/${id}`)).data,
    enabled: Boolean(id),
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

export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Empresa>) =>
      (await http.post('/references/empresas', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.empresas });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Empresa> }) =>
      (await http.put(`/references/empresas/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: qk.empresas });
      queryClient.invalidateQueries({ queryKey: qk.empresa(vars.id) });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/references/empresas/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.empresas });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
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

export function useCreateEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<EntidadeGestora>) =>
      (await http.post('/references/entidades-gestoras', payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.entidadesGestoras });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useFornecedores() {
  return useQuery({
    queryKey: qk.fornecedores,
    queryFn: async () => (await http.get<Fornecedor[]>('/references/fornecedores')).data,
    staleTime: 1000 * 60 * 10,
  });
}

export function useFornecedor(id?: string) {
  return useQuery({
    queryKey: id ? qk.fornecedor(id) : ['fornecedores', 'empty'],
    queryFn: async () => (await http.get<Fornecedor>(`/references/fornecedores/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useCreateFornecedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Fornecedor>) =>
      (await http.post('/references/fornecedores', payload)).data,
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
      (await http.put(`/references/fornecedores/${id}`, payload)).data,
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
    mutationFn: async (id: string) => (await http.delete(`/references/fornecedores/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fornecedores });
      qc.invalidateQueries({ queryKey: qk.lookups });
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

export function useEntidadeGestora(id?: string) {
  return useQuery({
    queryKey: id ? qk.entidadeGestora(id) : ['entidadesGestoras', 'empty'],
    queryFn: async () => (await http.get<EntidadeGestora>(`/references/entidades-gestoras/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useUpdateEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<EntidadeGestora> }) =>
      (await http.put(`/references/entidades-gestoras/${id}`, payload)).data,
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: qk.entidadesGestoras });
      queryClient.invalidateQueries({ queryKey: qk.entidadeGestora(vars.id) });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}

export function useDeleteEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await http.delete(`/references/entidades-gestoras/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.entidadesGestoras });
      queryClient.invalidateQueries({ queryKey: qk.lookups });
    },
  });
}
