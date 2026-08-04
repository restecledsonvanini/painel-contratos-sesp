import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

const baseUrl = '/.netlify/functions/api/references';
const http = { timeout: 8000 };

async function getUnidadesFsp() {
  const response = await axios.get<UnidadeFsp[]>(`${baseUrl}/unidades-fsp`, http);
  return response.data;
}

async function getEmpresas() {
  const response = await axios.get<Empresa[]>(`${baseUrl}/empresas`, http);
  return response.data;
}

async function getEmpresa(id: string) {
  const res = await axios.get<Empresa>(`${baseUrl}/empresas/${id}`, http);
  return res.data;
}

async function getEntidadesGestoras() {
  const response = await axios.get<EntidadeGestora[]>(`${baseUrl}/entidades-gestoras`, http);
  return response.data;
}

export function useUnidadesFsp() {
  return useQuery({ queryKey: ['unidadesFsp'], queryFn: getUnidadesFsp, staleTime: 1000 * 60 * 10, retry: 1 });
}

export function useEmpresas() {
  return useQuery({ queryKey: ['empresas'], queryFn: getEmpresas, staleTime: 1000 * 60 * 10, retry: 1 });
}

export function useEmpresa(id?: string) {
  return useQuery({ queryKey: ['empresa', id], queryFn: () => getEmpresa(id!), enabled: Boolean(id) });
}

export function useEntidadesGestoras() {
  return useQuery({ queryKey: ['entidadesGestoras'], queryFn: getEntidadesGestoras, staleTime: 1000 * 60 * 10, retry: 1 });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Empresa>) => axios.post(`${baseUrl}/empresas`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Empresa> }) => axios.put(`${baseUrl}/empresas/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`${baseUrl}/empresas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['empresas'] }),
  });
}

export function useCreateUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UnidadeFsp>) => axios.post(`${baseUrl}/unidades-fsp`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unidadesFsp'] }),
  });
}

async function getUnidadeById(id: string) {
  const res = await axios.get<UnidadeFsp>(`${baseUrl}/unidades-fsp/${id}`);
  return res.data;
}

export function useUnidadeFspById(id?: string) {
  return useQuery({ queryKey: ['unidadeFsp', id], queryFn: () => getUnidadeById(id!), enabled: Boolean(id) });
}

export function useUpdateUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UnidadeFsp> }) => axios.put(`${baseUrl}/unidades-fsp/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unidadesFsp'] }),
  });
}

export function useDeleteUnidadeFsp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`${baseUrl}/unidades-fsp/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unidadesFsp'] }),
  });
}

export function useCreateEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<EntidadeGestora>) => axios.post(`${baseUrl}/entidades-gestoras`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entidadesGestoras'] }),
  });
}

// Fornecedores
async function getFornecedores() {
  const res = await axios.get<Fornecedor[]>(`${baseUrl}/fornecedores`);
  return res.data;
}

async function getFornecedorById(id: string) {
  const res = await axios.get<Fornecedor>(`${baseUrl}/fornecedores/${id}`);
  return res.data;
}

export function useFornecedores() {
  return useQuery({ queryKey: ['fornecedores'], queryFn: getFornecedores, staleTime: 1000 * 60 * 10 });
}

export function useFornecedor(id?: string) {
  return useQuery({ queryKey: ['fornecedor', id], queryFn: () => getFornecedorById(id!), enabled: Boolean(id) });
}

export function useCreateFornecedor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<Fornecedor>) => axios.post(`${baseUrl}/fornecedores`, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }) });
}

export function useUpdateFornecedor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Fornecedor> }) => axios.put(`${baseUrl}/fornecedores/${id}`, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }) });
}

export function useDeleteFornecedor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => axios.delete(`${baseUrl}/fornecedores/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['fornecedores'] }) });
}

// Serviços
async function getServicos() {
  const res = await axios.get<Servico[]>(`${baseUrl}/servicos`);
  return res.data;
}

async function getServicoById(id: string) {
  const res = await axios.get<Servico>(`${baseUrl}/servicos/${id}`);
  return res.data;
}

export function useServicos() {
  return useQuery({ queryKey: ['servicos'], queryFn: getServicos, staleTime: 1000 * 60 * 10 });
}

export function useServico(id?: string) {
  return useQuery({ queryKey: ['servico', id], queryFn: () => getServicoById(id!), enabled: Boolean(id) });
}

export function useCreateServico() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<Servico>) => axios.post(`${baseUrl}/servicos`, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['servicos'] }) });
}

export function useUpdateServico() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Servico> }) => axios.put(`${baseUrl}/servicos/${id}`, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['servicos'] }) });
}

export function useDeleteServico() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => axios.delete(`${baseUrl}/servicos/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['servicos'] }) });
}

async function getEntidadeById(id: string) {
  const res = await axios.get<EntidadeGestora>(`${baseUrl}/entidades-gestoras/${id}`);
  return res.data;
}

export function useEntidadeGestora(id?: string) {
  return useQuery({ queryKey: ['entidadeGestora', id], queryFn: () => getEntidadeById(id!), enabled: Boolean(id) });
}

export function useUpdateEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<EntidadeGestora> }) => axios.put(`${baseUrl}/entidades-gestoras/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entidadesGestoras'] }),
  });
}

export function useDeleteEntidadeGestora() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete(`${baseUrl}/entidades-gestoras/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['entidadesGestoras'] }),
  });
}
