import { Router } from 'express';
import {
  createFornecedor,
  createFornecedorContato,
  createFornecedorSancao,
  createServidor,
  deleteFornecedor,
  deleteFornecedorContato,
  deleteFornecedorSancao,
  deleteServidor,
  getFornecedor,
  getServidor,
  listFornecedores,
  listServidores,
  updateFornecedor,
  updateFornecedorContato,
  updateFornecedorSancao,
  updateServidor,
} from '../controllers/partesController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireMinRole('COLABORADOR');

router.get('/fornecedores', asyncHandler(listFornecedores));
router.post('/fornecedores', writeRoles, asyncHandler(createFornecedor));
router.get('/fornecedores/:id', asyncHandler(getFornecedor));
router.put('/fornecedores/:id', writeRoles, asyncHandler(updateFornecedor));
router.delete('/fornecedores/:id', writeRoles, asyncHandler(deleteFornecedor));

router.post('/fornecedores/:id/contatos', writeRoles, asyncHandler(createFornecedorContato));
router.put(
  '/fornecedores/:id/contatos/:contatoId',
  writeRoles,
  asyncHandler(updateFornecedorContato),
);
router.delete(
  '/fornecedores/:id/contatos/:contatoId',
  writeRoles,
  asyncHandler(deleteFornecedorContato),
);

router.post('/fornecedores/:id/sancoes', writeRoles, asyncHandler(createFornecedorSancao));
router.put(
  '/fornecedores/:id/sancoes/:sancaoId',
  writeRoles,
  asyncHandler(updateFornecedorSancao),
);
router.delete(
  '/fornecedores/:id/sancoes/:sancaoId',
  writeRoles,
  asyncHandler(deleteFornecedorSancao),
);

router.get('/servidores', asyncHandler(listServidores));
router.post('/servidores', writeRoles, asyncHandler(createServidor));
router.get('/servidores/:id', asyncHandler(getServidor));
router.put('/servidores/:id', writeRoles, asyncHandler(updateServidor));
router.delete('/servidores/:id', writeRoles, asyncHandler(deleteServidor));

export default router;
