import { createContext, useContext } from 'react';
import { useAuthManager } from '@shared/hooks/useAuthManager';

const AuthContext = createContext<ReturnType<typeof useAuthManager> | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthManager();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
