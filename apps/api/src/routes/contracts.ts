import { Router } from 'express';
import {
  createContract,
  deleteContract,
  getContract,
  listContracts,
  updateContract,
} from '../controllers/contractsController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';
import {
  exportContractCsv,
  exportContractPdf,
  exportContractXlsx,
} from './exports';

const router = Router();
const writeRoles = requireMinRole('COLABORADOR');

router.get('/', asyncHandler(listContracts));
router.get('/:id/export.csv', asyncHandler(exportContractCsv));
router.get('/:id/export.xlsx', asyncHandler(exportContractXlsx));
router.get('/:id/export.pdf', asyncHandler(exportContractPdf));
router.get('/:id', asyncHandler(getContract));
router.post('/', writeRoles, asyncHandler(createContract));
router.put('/:id', writeRoles, asyncHandler(updateContract));
router.patch('/:id', writeRoles, asyncHandler(updateContract));
router.delete('/:id', writeRoles, asyncHandler(deleteContract));

export default router;
