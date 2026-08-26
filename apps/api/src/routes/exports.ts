import { Router } from 'express';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';
import {
  exportAcervoCsv,
  exportAcervoXlsx,
  exportContractCsv,
  exportContractPdf,
  exportContractXlsx,
  searchGlobal,
} from '../controllers/exportsController';

const router = Router();
const exportRoles = requireMinRole('ANALISTA');

router.get('/exports/contratos.csv', exportRoles, asyncHandler(exportAcervoCsv));
router.get('/exports/contratos.xlsx', exportRoles, asyncHandler(exportAcervoXlsx));
router.get('/search', exportRoles, asyncHandler(searchGlobal));

export { exportContractCsv, exportContractXlsx, exportContractPdf };

export default router;
