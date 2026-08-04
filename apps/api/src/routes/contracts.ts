import { Router } from 'express';
import {
  createContract,
  deleteContract,
  getContract,
  listContracts,
  updateContract,
} from '../controllers/contractsController';
import { asyncHandler } from '../lib/errors';
import { requireRole } from '../middleware/rbac';

const router = Router();
const writeRoles = requireRole(['colaborador', 'admin']);

router.get('/', asyncHandler(listContracts));
router.get('/:id', asyncHandler(getContract));
router.post('/', writeRoles, asyncHandler(createContract));
router.put('/:id', writeRoles, asyncHandler(updateContract));
router.delete('/:id', writeRoles, asyncHandler(deleteContract));

export default router;
