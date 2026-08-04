import { NextFunction, Request, Response } from 'express';

/**
 * Dev auth stub (JWT/Supabase deferred).
 *
 * Contract:
 * - No Authorization header → { id: 'system', role: 'colaborador' }
 * - Authorization: Bearer admin → role admin
 * - Authorization: Bearer colaborador → role colaborador
 * - Any other Bearer token → role colaborador (unknown user)
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    (req as any).user = { id: 'system', role: 'colaborador' };
    return next();
  }

  const parts = auth.split(' ');
  const token = parts[1];
  if (token === 'admin') {
    (req as any).user = { id: 'user-admin', role: 'admin' };
  } else if (token === 'colaborador') {
    (req as any).user = { id: 'user-colab', role: 'colaborador' };
  } else {
    (req as any).user = { id: 'user-unknown', role: 'colaborador' };
  }

  return next();
}
