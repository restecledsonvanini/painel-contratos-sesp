import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { hasMinRole as rankHasMinRole } from '@painel/domain';
import type { AuthUserDTO } from '@painel/schema';
import { http } from '../lib/http';
import { onUnauthorized } from '../lib/authSession';

export type AuthUser = AuthUserDTO;

type AuthContextValue = {
  user: AuthUser | null;
  /** Compat: true quando há sessão (cookie), sem expor o JWT. */
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  hasMinRole: (min: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => onUnauthorized(clearSession), [clearSession]);

  const refreshMe = useCallback(async () => {
    try {
      const res = await http.get<AuthUser>('/auth/me');
      const id = res.data?.id;
      // Bypass/sintéticos da API não são sessão de browser.
      if (!id || id === 'system' || id.startsWith('user-')) {
        setUser(null);
      } else {
        setUser(res.data);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await http.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });
    setUser(res.data.user);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await http.post('/auth/logout');
    } catch {
      /* cookie pode já ter expirado */
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token: user ? 'session' : null,
      isLoading,
      login,
      logout,
      refreshMe,
      hasMinRole: (min: string) => rankHasMinRole(user?.role, min),
    }),
    [user, isLoading, login, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
