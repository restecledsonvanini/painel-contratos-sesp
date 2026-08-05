import { NextFunction, Request, Response } from 'express';
import { getRequestId } from './requestContext';
import { recordLatency } from './metrics';

function routeKey(req: Request) {
  const base = req.baseUrl || '';
  const path = req.route?.path ? String(req.route.path) : req.path;
  return `${req.method} ${base}${path}`;
}

export function observabilityMiddleware(req: Request, res: Response, next: NextFunction) {
  const started = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - started;
    const requestId = getRequestId() ?? res.getHeader('x-request-id');
    const key = routeKey(req);
    recordLatency(key, durationMs);
    console.log(
      JSON.stringify({
        level: 'info',
        msg: 'http_request',
        requestId,
        method: req.method,
        path: req.originalUrl,
        route: key,
        status: res.statusCode,
        durationMs,
      }),
    );
  });
  next();
}
