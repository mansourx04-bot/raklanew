import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey, setAuthTokenGetter, useGetMe } from '@workspace/api-client-react';
import type { AuthResponse, User } from '@workspace/api-client-react';

const TOKEN_KEY = 'rakla:token';
const safeReadToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};

setAuthTokenGetter(safeReadToken);

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  acceptSession: (response: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(safeReadToken);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const me = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: Boolean(token),
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  });

  const acceptSession = useCallback((response: AuthResponse) => {
    tokenRef.current = response.token;
    setToken(response.token);
    try { localStorage.setItem(TOKEN_KEY, response.token); } catch { /* token remains in memory for this tab */ }
    queryClient.setQueryData(getGetMeQueryKey(), response.user);
    queryClient.removeQueries({ predicate: (query) => String(query.queryKey[0] ?? '').startsWith('/api/orders') });
  }, [queryClient]);

  const logout = useCallback(() => {
    tokenRef.current = null;
    setToken(null);
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore storage failures */ }
    queryClient.removeQueries({ predicate: (query) => String(query.queryKey[0] ?? '').startsWith('/api/orders') });
    queryClient.setQueryData(getGetMeQueryKey(), undefined);
  }, [queryClient]);

  useEffect(() => {
    if (me.error && (me.error as { status?: number }).status === 401) logout();
  }, [me.error, logout]);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    user: token ? me.data ?? null : null,
    loading: Boolean(token) && me.isLoading,
    acceptSession,
    logout,
  }), [token, me.data, me.isLoading, acceptSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
