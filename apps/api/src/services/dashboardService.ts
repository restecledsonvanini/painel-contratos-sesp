import type { Request } from 'express';
import { notFound } from '../lib/errors';
import { assertContratoInScope } from '../lib/scope';
import { dashboardRepository } from '../repositories/dashboardRepository';

export const dashboardService = {
  kpis: () => dashboardRepository.kpis(),
  vencimentos: () => dashboardRepository.vencimentos(),
  porOrgao: () => dashboardRepository.porOrgao(),
  custos: (agrupar?: string) => dashboardRepository.custos(agrupar),
  aditivos: () => dashboardRepository.aditivos(),
  fornecedores: (limite?: number) => dashboardRepository.fornecedores(limite),
  fiscalizacao: () => dashboardRepository.fiscalizacao(),
  publicidade: () => dashboardRepository.publicidade(),
  modalidade: () => dashboardRepository.modalidade(),
  frota: () => dashboardRepository.frota(),
  imoveis: () => dashboardRepository.imoveis(),
  postos: () => dashboardRepository.postos(),
  alimentacao: () => dashboardRepository.alimentacao(),
  itens: (categoria?: string) => dashboardRepository.itens(categoria),
  refresh: () => dashboardRepository.refresh(),

  async timeline(contratoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    return dashboardRepository.timeline(contratoId);
  },

  async limites(contratoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    const row = await dashboardRepository.limites(contratoId);
    if (!row) throw notFound('Limites not found');
    return row;
  },

  async financeiro(contratoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    const row = await dashboardRepository.financeiro(contratoId);
    if (!row) throw notFound('Financeiro not found');
    return row;
  },

  async auditoria(contratoId: string, req: Request) {
    await assertContratoInScope(contratoId, req);
    return dashboardRepository.auditoria(contratoId);
  },
};
