import { Router } from 'express';
import {
  createDominioValor,
  deleteDominioValor,
  getDominio,
  getLookupSlug,
  getLookups,
  listDominioValores,
  listDominios,
  updateDominioValor,
} from '../controllers/lookupsController';
import { asyncHandler } from '../lib/errors';
import { requireRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireRole(['colaborador', 'admin']);

router.get('/lookups', asyncHandler(getLookups));
router.get('/lookups/:slug', asyncHandler(getLookupSlug));

router.get('/dominios', asyncHandler(listDominios));
router.get('/dominios/:slug', asyncHandler(getDominio));
router.get('/dominios/:slug/valores', asyncHandler(listDominioValores));
router.post('/dominios/:slug/valores', writeRoles, asyncHandler(createDominioValor));
router.put('/dominios/:slug/valores/:id', writeRoles, asyncHandler(updateDominioValor));
router.delete('/dominios/:slug/valores/:id', writeRoles, asyncHandler(deleteDominioValor));

export default router;
