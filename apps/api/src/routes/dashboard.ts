import { Router } from 'express';
import {
  getAditivos,
  getAlimentacao,
  getCustos,
  getFinanceiro,
  getFiscalizacao,
  getFornecedores,
  getFrota,
  getImoveis,
  getItens,
  getKpis,
  getLimites,
  getModalidade,
  getPorOrgao,
  getPostos,
  getPublicidade,
  getTimeline,
  getVencimentos,
  refreshAnalytics,
} from '../controllers/dashboardController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const adminRoles = requireMinRole('ADMIN');

router.get('/dashboard/kpis', asyncHandler(getKpis));
router.get('/dashboard/vencimentos', asyncHandler(getVencimentos));
router.get('/dashboard/por-orgao', asyncHandler(getPorOrgao));
router.get('/dashboard/custos', asyncHandler(getCustos));
router.get('/dashboard/aditivos', asyncHandler(getAditivos));
router.get('/dashboard/fornecedores', asyncHandler(getFornecedores));
router.get('/dashboard/fiscalizacao', asyncHandler(getFiscalizacao));
router.get('/dashboard/publicidade', asyncHandler(getPublicidade));
router.get('/dashboard/modalidade', asyncHandler(getModalidade));
router.get('/dashboard/frota', asyncHandler(getFrota));
router.get('/dashboard/imoveis', asyncHandler(getImoveis));
router.get('/dashboard/postos', asyncHandler(getPostos));
router.get('/dashboard/alimentacao', asyncHandler(getAlimentacao));
router.get('/dashboard/itens', asyncHandler(getItens));
router.post('/admin/refresh-analytics', adminRoles, asyncHandler(refreshAnalytics));

export const contratoAnaliticoRouter = Router({ mergeParams: true });
contratoAnaliticoRouter.get('/timeline', asyncHandler(getTimeline));
contratoAnaliticoRouter.get('/limites', asyncHandler(getLimites));
contratoAnaliticoRouter.get('/financeiro', asyncHandler(getFinanceiro));

export default router;
