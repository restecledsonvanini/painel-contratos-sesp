import { Router } from 'express';
import {
  createAlteracao,
  deleteAlteracao,
  getAlteracao,
  listAlteracoes,
  simularAlteracao,
  simularAlteracaoAlias,
  updateAlteracao,
} from '../controllers/alteracaoController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const writeRoles = requireMinRole('GESTOR');

/** Montado em /contracts/:id/alteracoes */
export const contratoAlteracoesRouter = Router({ mergeParams: true });
contratoAlteracoesRouter.get('/', asyncHandler(listAlteracoes));
contratoAlteracoesRouter.post('/simular', writeRoles, asyncHandler(simularAlteracao));
contratoAlteracoesRouter.post('/', writeRoles, asyncHandler(createAlteracao));
contratoAlteracoesRouter.get('/:alteracaoId', asyncHandler(getAlteracao));
contratoAlteracoesRouter.put('/:alteracaoId', writeRoles, asyncHandler(updateAlteracao));
contratoAlteracoesRouter.delete('/:alteracaoId', writeRoles, asyncHandler(deleteAlteracao));

/** Alias plano: POST /alteracoes/:id/simular (id = contratoId) */
export const alteracoesAliasRouter = Router();
alteracoesAliasRouter.post('/:id/simular', writeRoles, asyncHandler(simularAlteracaoAlias));

export default contratoAlteracoesRouter;
