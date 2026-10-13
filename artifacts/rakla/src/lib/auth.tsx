import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetMeQueryKey, useGetMe } from '@workspace/api-client-react';
import type { AuthResponse, User } from '@workspace/api-client-react';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  acceptSession: (response: AuthResponse) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const me = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      staleTime: 60 * 1000,
    },
  });

  const acceptSession = useCallback((response: AuthResponse) => {
    queryClient.setQueryData(getGetMeQueryKey(), response.user);
    queryClient.removeQueries({ predicate: (query) => String(query.queryKey[0] ?? '').startsWith('/api/orders') });
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // Clear the local account state even if the session has already expired.
    } finally {
      queryClient.removeQueries({ queryKey: getGetMeQueryKey(), exact: true });
      queryClient.removeQueries({ predicate: (query) => String(query.queryKey[0] ?? '').startsWith('/api/orders') });
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => ({
    user: me.data ?? null,
    loading: me.isLoading,
    acceptSession,
    logout,
  }), [me.data, me.isLoading, acceptSession, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
