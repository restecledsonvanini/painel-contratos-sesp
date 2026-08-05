import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFound(message = 'Resource not found') {
  return new AppError(404, 'NOT_FOUND', message);
}

export function badRequest(message: string, details?: unknown) {
  return new AppError(400, 'BAD_REQUEST', message, details);
}

export function forbidden(message = 'Forbidden') {
  return new AppError(403, 'FORBIDDEN', message);
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError(401, 'UNAUTHORIZED', message);
}

export function legalRuleViolation(message: string, details?: unknown) {
  return new AppError(422, 'LEGAL_RULE_VIOLATION', message, details);
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const zodLike =
    err instanceof ZodError ||
    (typeof err === 'object' &&
      err !== null &&
      (err as { name?: string }).name === 'ZodError' &&
      (Array.isArray((err as { errors?: unknown }).errors) ||
        Array.isArray((err as { issues?: unknown }).issues)));

  if (zodLike) {
    const details =
      err instanceof ZodError
        ? err.errors
        : ((err as { errors?: unknown; issues?: unknown }).errors ??
          (err as { issues?: unknown }).issues);
    const body: ApiErrorBody = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details,
      },
    };
    return res.status(400).json(body);
  }

  if (err instanceof AppError) {
    const body: ApiErrorBody = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    return res.status(err.status).json(body);
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  const name = err instanceof Error ? err.name : '';
  console.error(JSON.stringify({ code: 'INTERNAL_ERROR', name, message, err: String(err) }));

  const dbDown =
    name === 'PrismaClientInitializationError' ||
    message.includes('DATABASE_URL') ||
    message.includes("Can't reach database server") ||
    message.includes('P1001') ||
    message.includes('ECONNREFUSED');

  if (dbDown) {
    const body: ApiErrorBody = {
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Banco de dados indisponível. Verifique se o Postgres (Docker) está rodando na porta 5434.',
      },
    };
    return res.status(503).json(body);
  }

  const body: ApiErrorBody = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  };
  return res.status(500).json(body);
}
