import { NextFunction, Request, Response } from 'express';
import { forbidden } from '../lib/errors';

export function requireRole(roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return next(forbidden());
    }
    return next();
  };
}
