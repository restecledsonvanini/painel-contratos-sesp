import { Router } from 'express';
import {
  createContratoDocumento,
  createContratoDotacao,
  createContratoPublicacao,
  createDocumento,
  createDotacao,
  createEmpenho,
  createPublicacao,
  createReserva,
  deleteContratoDotacao,
  deleteDocumento,
  deleteDotacao,
  deleteEmpenho,
  deletePublicacao,
  deleteReserva,
  getDotacao,
  listContratoDocumentos,
  listContratoDotacoes,
  listContratoPublicacoes,
  listDocumentos,
  listDotacoes,
  listEmpenhos,
  listPublicacoes,
  listReservas,
  updateDotacao,
  updateEmpenho,
} from '../controllers/orcamentoController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const writeRoles = requireMinRole('ANALISTA');

const router = Router();

router.get('/dotacoes', asyncHandler(listDotacoes));
router.post('/dotacoes', writeRoles, asyncHandler(createDotacao));
router.get('/dotacoes/:id', asyncHandler(getDotacao));
router.put('/dotacoes/:id', writeRoles, asyncHandler(updateDotacao));
router.delete('/dotacoes/:id', writeRoles, asyncHandler(deleteDotacao));

router.get('/reservas', asyncHandler(listReservas));
router.post('/reservas', writeRoles, asyncHandler(createReserva));
router.delete('/reservas/:id', writeRoles, asyncHandler(deleteReserva));

router.get('/publicacoes', asyncHandler(listPublicacoes));
router.post('/publicacoes', writeRoles, asyncHandler(createPublicacao));
router.delete('/publicacoes/:id', writeRoles, asyncHandler(deletePublicacao));

router.get('/documentos', asyncHandler(listDocumentos));
router.post('/documentos', writeRoles, asyncHandler(createDocumento));
router.delete('/documentos/:id', writeRoles, asyncHandler(deleteDocumento));

export const contratoOrcamentoRouter = Router({ mergeParams: true });
contratoOrcamentoRouter.get('/dotacoes', asyncHandler(listContratoDotacoes));
contratoOrcamentoRouter.post('/dotacoes', writeRoles, asyncHandler(createContratoDotacao));
contratoOrcamentoRouter.delete(
  '/dotacoes/:dotacaoLinkId',
  writeRoles,
  asyncHandler(deleteContratoDotacao),
);
contratoOrcamentoRouter.get('/empenhos', asyncHandler(listEmpenhos));
contratoOrcamentoRouter.post('/empenhos', writeRoles, asyncHandler(createEmpenho));
contratoOrcamentoRouter.put('/empenhos/:empenhoId', writeRoles, asyncHandler(updateEmpenho));
contratoOrcamentoRouter.delete('/empenhos/:empenhoId', writeRoles, asyncHandler(deleteEmpenho));
contratoOrcamentoRouter.get('/publicacoes', asyncHandler(listContratoPublicacoes));
contratoOrcamentoRouter.post('/publicacoes', writeRoles, asyncHandler(createContratoPublicacao));
contratoOrcamentoRouter.get('/documentos', asyncHandler(listContratoDocumentos));
contratoOrcamentoRouter.post('/documentos', writeRoles, asyncHandler(createContratoDocumento));

export default router;
