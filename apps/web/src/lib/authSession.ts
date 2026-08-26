/** Sessão JWT no `localStorage`. Única fonte para HTTP e AuthProvider. */

export const AUTH_TOKEN_KEY = 'auth_token';

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function getAuthToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

/** JWT recusado. Limpa o token e avisa o AuthProvider (RequireAuth redireciona). */
export function emitUnauthorized() {
  setAuthToken(null);
  unauthorizedListeners.forEach((fn) => fn());
}
