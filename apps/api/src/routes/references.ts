import { Router } from 'express';
import {
  createEmpresa,
  createEntidadeGestora,
  createFornecedor,
  createServico,
  createUnidadeFsp,
  deleteEmpresa,
  deleteEntidadeGestora,
  deleteFornecedor,
  deleteServico,
  deleteUnidadeFsp,
  getEmpresa,
  getEntidadeGestora,
  getFornecedor,
  getServico,
  getUnidadeFsp,
  listEmpresas,
  listEntidadesGestoras,
  listFornecedores,
  listServicos,
  listUnidadesFsp,
  updateEmpresa,
  updateEntidadeGestora,
  updateFornecedor,
  updateServico,
  updateUnidadeFsp,
} from '../controllers/referenceController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('ANALISTA');

router.get('/empresas', asyncHandler(listEmpresas));
router.post('/empresas', writeRoles, asyncHandler(createEmpresa));
router.get('/empresas/:id', asyncHandler(getEmpresa));
router.put('/empresas/:id', writeRoles, asyncHandler(updateEmpresa));
router.delete('/empresas/:id', writeRoles, asyncHandler(deleteEmpresa));

router.get('/entidades-gestoras', asyncHandler(listEntidadesGestoras));
router.post('/entidades-gestoras', writeRoles, asyncHandler(createEntidadeGestora));
router.get('/entidades-gestoras/:id', asyncHandler(getEntidadeGestora));
router.put('/entidades-gestoras/:id', writeRoles, asyncHandler(updateEntidadeGestora));
router.delete('/entidades-gestoras/:id', writeRoles, asyncHandler(deleteEntidadeGestora));

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

router.get('/servicos', asyncHandler(listServicos));
router.post('/servicos', writeRoles, asyncHandler(createServico));
router.get('/servicos/:id', asyncHandler(getServico));
router.put('/servicos/:id', writeRoles, asyncHandler(updateServico));
router.delete('/servicos/:id', writeRoles, asyncHandler(deleteServico));

export default router;
