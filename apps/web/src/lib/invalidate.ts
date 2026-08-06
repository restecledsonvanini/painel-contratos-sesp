import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { qk } from './queryKeys';

export function invalidateKeys(qc: QueryClient, keys: QueryKey[]) {
  for (const key of keys) {
    void qc.invalidateQueries({ queryKey: key });
  }
}

export function invalidateLookups(qc: QueryClient) {
  void qc.invalidateQueries({ queryKey: qk.lookups });
}

export function invalidateFornecedor(qc: QueryClient, fornecedorId?: string) {
  invalidateKeys(qc, [
    qk.fornecedores,
    ...(fornecedorId ? [qk.fornecedor(fornecedorId)] : []),
    qk.lookups,
  ]);
}

export function invalidateServidor(qc: QueryClient, servidorId?: string) {
  invalidateKeys(qc, [
    qk.servidores,
    ...(servidorId ? [qk.servidor(servidorId)] : []),
    qk.lookups,
  ]);
}

export function invalidateUnidadeFsp(qc: QueryClient, id?: string) {
  invalidateKeys(qc, [
    qk.unidadesFsp,
    ...(id ? [qk.unidadeFsp(id)] : []),
    qk.lookups,
  ]);
}

export function invalidateOrganizacao(qc: QueryClient, unidadeId?: string) {
  invalidateKeys(qc, [
    ['unidadesOrganizacionais'],
    ['orgaos'],
    ['unidades', 'arvore'],
    qk.lookups,
    ...(unidadeId ? [['unidade', unidadeId] as const] : []),
  ]);
}

export function invalidateContratos(qc: QueryClient, contratoId?: string) {
  invalidateKeys(qc, [
    ['contratos'],
    ['dashboard'],
    ...(contratoId ? [qk.contrato(contratoId)] : []),
  ]);
}

export function invalidateDotacoes(qc: QueryClient) {
  invalidateKeys(qc, [qk.dotacoes]);
}
