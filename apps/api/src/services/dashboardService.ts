import { notFound } from '../lib/errors';
import { getPrisma } from '../lib/prisma';
import { dashboardRepository } from '../repositories/dashboardRepository';

async function ensureContrato(id: string) {
  const db = getPrisma();
  const c = await db.contrato.findUnique({ where: { id }, select: { id: true } });
  if (!c) throw notFound('Contract not found');
}

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

  async timeline(contratoId: string) {
    await ensureContrato(contratoId);
    return dashboardRepository.timeline(contratoId);
  },

  async limites(contratoId: string) {
    await ensureContrato(contratoId);
    const row = await dashboardRepository.limites(contratoId);
    if (!row) throw notFound('Limites not found');
    return row;
  },

  async financeiro(contratoId: string) {
    await ensureContrato(contratoId);
    const row = await dashboardRepository.financeiro(contratoId);
    if (!row) throw notFound('Financeiro not found');
    return row;
  },
};
