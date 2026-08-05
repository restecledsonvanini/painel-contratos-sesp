import { Router } from 'express';
import {
  createAtributoDef,
  createCatalogoItem,
  createItemContrato,
  deleteAtributoDef,
  deleteCatalogoItem,
  deleteItemContrato,
  getCatalogoItem,
  getItemContrato,
  listAtributosCategoria,
  listCatalogo,
  listItensContrato,
  updateAtributoDef,
  updateCatalogoItem,
  updateItemContrato,
} from '../controllers/catalogoController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('COLABORADOR');

router.get('/catalogo-itens', asyncHandler(listCatalogo));
router.post('/catalogo-itens', writeRoles, asyncHandler(createCatalogoItem));
router.get('/catalogo-itens/:id', asyncHandler(getCatalogoItem));
router.put('/catalogo-itens/:id', writeRoles, asyncHandler(updateCatalogoItem));
router.delete('/catalogo-itens/:id', writeRoles, asyncHandler(deleteCatalogoItem));

router.get('/categorias-item/:id/atributos', asyncHandler(listAtributosCategoria));
router.post('/categorias-item/:id/atributos', writeRoles, asyncHandler(createAtributoDef));
router.put('/categorias-item/:id/atributos/:atributoId', writeRoles, asyncHandler(updateAtributoDef));
router.delete(
  '/categorias-item/:id/atributos/:atributoId',
  writeRoles,
  asyncHandler(deleteAtributoDef),
);

export const contratoItensRouter = Router({ mergeParams: true });
contratoItensRouter.get('/', asyncHandler(listItensContrato));
contratoItensRouter.post('/', writeRoles, asyncHandler(createItemContrato));
contratoItensRouter.get('/:itemId', asyncHandler(getItemContrato));
contratoItensRouter.put('/:itemId', writeRoles, asyncHandler(updateItemContrato));
contratoItensRouter.delete('/:itemId', writeRoles, asyncHandler(deleteItemContrato));

export default router;
