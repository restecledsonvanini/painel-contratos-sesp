import { NextFunction, Request, Response } from 'express';
import { forbidden } from '../lib/errors';
import { hasMinRole, normalizeRole } from '../lib/authTypes';

/** Exige que o papel do usuário esteja na lista (após normalização). */
export function requireRole(roles: string[]) {
  const allowed = new Set(roles.map((r) => normalizeRole(r)));
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !allowed.has(normalizeRole(user.role))) {
      return next(forbidden());
    }
    return next();
  };
}

/** Exige papel >= mínimo (VISITANTE < ANALISTA < GESTOR < ADMIN). Aceita aliases legados. */
export function requireMinRole(min: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !hasMinRole(req.user.role, min)) {
      return next(forbidden());
    }
    return next();
  };
}
