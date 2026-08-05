import { Router } from 'express';
import {
  aplicarImportacao,
  createImportacao,
  gerarAlertas,
  getImportacao,
  listAlertaConfigs,
  listAlertas,
  reconhecerAlerta,
} from '../controllers/operacaoController';
import { asyncHandler } from '../lib/errors';
import { requireRole } from '../middleware/rbac';

const router = Router();
const adminRoles = requireRole(['admin', 'colaborador']);

router.get('/alertas', asyncHandler(listAlertas));
router.get('/alertas/configs', asyncHandler(listAlertaConfigs));
router.post('/alertas/:id/reconhecer', asyncHandler(reconhecerAlerta));
router.post('/admin/gerar-alertas', adminRoles, asyncHandler(gerarAlertas));

router.post('/importacoes', adminRoles, asyncHandler(createImportacao));
router.get('/importacoes/:id', asyncHandler(getImportacao));
router.post('/importacoes/:id/aplicar', adminRoles, asyncHandler(aplicarImportacao));

export default router;
