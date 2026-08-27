/**
 * Eventos de sessão. A credencial vive no cookie HttpOnly `painel_session`;
 * o front não persiste JWT.
 */

type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

/** 401: avisa o AuthProvider (RequireAuth redireciona). */
export function emitUnauthorized() {
  unauthorizedListeners.forEach((fn) => fn());
}
