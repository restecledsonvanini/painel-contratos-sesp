import { Router } from 'express';
import {
  createContract,
  deleteContract,
  getContract,
  listContracts,
  updateContract,
} from '../controllers/contractsController';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', listContracts as any);
router.get('/:id', getContract as any);
router.post('/', requireRole(['colaborador', 'admin']), createContract as any);
router.put('/:id', requireRole(['colaborador', 'admin']), updateContract as any);
router.delete('/:id', requireRole(['colaborador', 'admin']), deleteContract as any);

export default router;
