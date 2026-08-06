import { Router } from 'express';
import {
  createFornecedor,
  createUnidadeFsp,
  deleteFornecedor,
  deleteUnidadeFsp,
  getFornecedor,
  getUnidadeFsp,
  listFornecedores,
  listUnidadesFsp,
  updateFornecedor,
  updateUnidadeFsp,
} from '../controllers/referenceController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('ANALISTA');

router.get('/unidades-fsp', asyncHandler(listUnidadesFsp));
router.post('/unidades-fsp', writeRoles, asyncHandler(createUnidadeFsp));
router.get('/unidades-fsp/:id', asyncHandler(getUnidadeFsp));
router.put('/unidades-fsp/:id', writeRoles, asyncHandler(updateUnidadeFsp));
router.delete('/unidades-fsp/:id', writeRoles, asyncHandler(deleteUnidadeFsp));

router.get('/fornecedores', asyncHandler(listFornecedores));
router.post('/fornecedores', writeRoles, asyncHandler(createFornecedor));
router.get('/fornecedores/:id', asyncHandler(getFornecedor));
router.put('/fornecedores/:id', writeRoles, asyncHandler(updateFornecedor));
router.delete('/fornecedores/:id', writeRoles, asyncHandler(deleteFornecedor));

export default router;
