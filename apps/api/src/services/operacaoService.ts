import type { AlertaQuery, ImportacaoCreateInput } from '@painel/schema';
import { getActorFromContext } from '../lib/requestContext';
import { alertaRepository } from '../repositories/alertaRepository';
import { importacaoRepository } from '../repositories/importacaoRepository';

export const alertaService = {
  list: (query: AlertaQuery, scope?: { orgaoId?: string | null }) =>
    alertaRepository.list(query, scope),
  configs: () => alertaRepository.listConfigs(),
  reconhecer: (id: string) => alertaRepository.reconhecer(id, getActorFromContext()),
  async gerar() {
    const candidates = await alertaRepository.collectCandidates();
    const result = await alertaRepository.upsertMany(candidates);
    return { ok: true, ...result };
  },
};

export const importacaoService = {
  create: (input: ImportacaoCreateInput) =>
    importacaoRepository.createDryRun(input, getActorFromContext()),
  get: (id: string) => importacaoRepository.get(id),
  aplicar: (id: string) => importacaoRepository.aplicar(id, getActorFromContext()),
};
