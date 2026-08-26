import { NextFunction, Request, Response } from 'express';
import { forbidden } from '../lib/errors';
import { hasMinRole } from '../lib/authTypes';

/** Exige papel >= mínimo (VISITANTE < ANALISTA < GESTOR < ADMIN). Aceita aliases legados. */
export function requireMinRole(min: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !hasMinRole(req.user.role, min)) {
      return next(forbidden());
    }
    return next();
  };
}
