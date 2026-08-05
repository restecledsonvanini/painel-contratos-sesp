import { Router } from 'express';
import {
  createUsuario,
  listUsuarios,
  login,
  me,
  updateUsuario,
} from '../controllers/authController';
import { asyncHandler } from '../lib/errors';
import { requireMinRole } from '../middleware/rbac';

const router = Router();

router.post('/auth/login', asyncHandler(login));
router.get('/auth/me', asyncHandler(me));

router.get('/usuarios', requireMinRole('ADMIN'), asyncHandler(listUsuarios));
router.post('/usuarios', requireMinRole('ADMIN'), asyncHandler(createUsuario));
router.patch('/usuarios/:id', requireMinRole('ADMIN'), asyncHandler(updateUsuario));

export default router;
