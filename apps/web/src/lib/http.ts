import axios, { AxiosError, type AxiosInstance } from 'axios';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function newRequestId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  config.headers.set('x-request-id', newRequestId());
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError('TIMEOUT', 'A requisição excedeu o tempo limite', 0));
    }
    if (!error.response) {
      return Promise.reject(new ApiError('NETWORK_ERROR', 'Falha de rede ao contatar a API', 0));
    }
    const status = error.response.status;
    const body = error.response.data?.error;
    if (status === 503) {
      return Promise.reject(
        new ApiError(
          body?.code ?? 'SERVICE_UNAVAILABLE',
          body?.message ?? 'Banco de dados indisponível',
          status,
          body?.details,
        ),
      );
    }
    return Promise.reject(
      new ApiError(
        body?.code ?? 'INTERNAL_ERROR',
        body?.message ?? 'Erro inesperado',
        status,
        body?.details,
      ),
    );
  },
);

export function getErrorMessage(err: unknown, fallback = 'Erro inesperado'): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
