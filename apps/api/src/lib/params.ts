import { Request } from 'express';
import { badRequest } from './errors';

/** Express 5 tipa params como string | string[]; normaliza para um único id. */
export function routeParam(req: Request, name: string): string {
  const value = req.params[name];
  const id = Array.isArray(value) ? value[0] : value;
  if (!id || typeof id !== 'string') {
    throw badRequest(`Missing route param: ${name}`);
  }
  return id;
}
