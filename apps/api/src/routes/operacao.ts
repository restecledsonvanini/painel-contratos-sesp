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
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('COLABORADOR');
const importRoles = requireMinRole('ANALISTA');

router.get('/alertas', asyncHandler(listAlertas));
router.get('/alertas/configs', asyncHandler(listAlertaConfigs));
router.post('/alertas/:id/reconhecer', writeRoles, asyncHandler(reconhecerAlerta));
router.post('/admin/gerar-alertas', writeRoles, asyncHandler(gerarAlertas));

router.post('/importacoes', importRoles, asyncHandler(createImportacao));
router.get('/importacoes/:id', importRoles, asyncHandler(getImportacao));
router.post('/importacoes/:id/aplicar', importRoles, asyncHandler(aplicarImportacao));

export default router;
