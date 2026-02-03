import { Request, Response, NextFunction } from 'express';

// NOTE: This is a lightweight placeholder for development. Replace with Supabase JWT verification in production.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) {
    // For public endpoints, you may allow anonymous; for now we attach a default 'colaborador' fallback.
    (req as any).user = { id: 'system', role: 'colaborador' };
    return next();
  }

  // Example Authorization: 'Bearer admin' or 'Bearer colaborador'
  const parts = auth.split(' ');
  const token = parts[1];
  if (token === 'admin') {
    (req as any).user = { id: 'user-admin', role: 'admin' };
  } else if (token === 'colaborador') {
    (req as any).user = { id: 'user-colab', role: 'colaborador' };
  } else {
    // In production: verify JWT and set user id and roles based on claims
    (req as any).user = { id: 'user-unknown', role: 'colaborador' };
  }

  return next();
}
