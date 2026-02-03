import { Router } from 'express';
import { createContract } from '../controllers/contractsController';
import { requireRole } from '../middleware/rbac';

const router = Router();

// Create contract (collaborator+)
router.post('/', requireRole(['colaborador', 'admin']), createContract as any);

// Additional endpoints should be added here (GET list, GET detail, update, delete)

export default router;
