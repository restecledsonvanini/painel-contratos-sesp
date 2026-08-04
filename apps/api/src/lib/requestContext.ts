import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';

export type RequestContext = {
  requestId: string;
  actorId: string | null;
  actorRole: string | null;
};

const storage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return storage.getStore();
}

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

export function getActorFromContext(): string | null {
  return storage.getStore()?.actorId ?? null;
}

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const incoming = req.header('x-request-id');
  const requestId = incoming && incoming.trim() ? incoming.trim() : randomUUID();
  const user = (req as Request & { user?: { id?: string; role?: string } }).user;
  const ctx: RequestContext = {
    requestId,
    actorId: user?.id ?? null,
    actorRole: user?.role ?? null,
  };
  res.setHeader('x-request-id', requestId);
  storage.run(ctx, () => next());
}
