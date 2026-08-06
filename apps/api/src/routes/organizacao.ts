import { Router } from 'express';
import {
  arvoreOrgaos,
  arvoreUnidades,
  createOrgao,
  createUnidade,
  deleteOrgao,
  deleteUnidade,
  getOrgao,
  getUnidade,
  listMunicipios,
  listOrgaos,
  listUnidades,
  updateOrgao,
  updateUnidade,
} from '../controllers/lookupsController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('GESTOR');

router.get('/orgaos', asyncHandler(listOrgaos));
router.get('/orgaos/arvore', asyncHandler(arvoreOrgaos));
router.post('/orgaos', writeRoles, asyncHandler(createOrgao));
router.get('/orgaos/:id', asyncHandler(getOrgao));
router.put('/orgaos/:id', writeRoles, asyncHandler(updateOrgao));
router.delete('/orgaos/:id', writeRoles, asyncHandler(deleteOrgao));

router.get('/unidades/arvore', asyncHandler(arvoreUnidades));
router.get('/unidades', asyncHandler(listUnidades));
router.post('/unidades', writeRoles, asyncHandler(createUnidade));
router.get('/unidades/:id', asyncHandler(getUnidade));
router.put('/unidades/:id', writeRoles, asyncHandler(updateUnidade));
router.delete('/unidades/:id', writeRoles, asyncHandler(deleteUnidade));

router.get('/municipios', asyncHandler(listMunicipios));

export default router;
