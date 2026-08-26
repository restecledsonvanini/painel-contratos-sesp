import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { hasMinRole as rankHasMinRole } from '@painel/domain';
import type { AuthUserDTO } from '@painel/schema';
import { http } from '../lib/http';
import { getAuthToken, onUnauthorized, setAuthToken } from '../lib/authSession';

export type AuthUser = AuthUserDTO;

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  hasMinRole: (min: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => onUnauthorized(clearSession), [clearSession]);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await http.get<AuthUser>('/auth/me');
      setUser(res.data);
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [token, clearSession]);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await http.post<{ token: string; user: AuthUser }>('/auth/login', {
      email,
      password,
    });
    setAuthToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
      refreshMe,
      hasMinRole: (min: string) => rankHasMinRole(user?.role, min),
    }),
    [user, token, isLoading, login, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
