import { useState, useEffect } from 'react';
import { authService } from '@features/auth/services/authService';

export function useAuthManager() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const bootstrapAuth = async () => {
    try {
      await authService.checkSession();
      setIsAuthenticated(true);
    } catch (error: any) {
      const status = error.response?.status;

      if (!error.response || (status >= 500 && status <= 599)) {
        const local = await authService.getLocalSession();
        setIsAuthenticated(!!local);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated: !!isAuthenticated,
    isLoading: isAuthenticated === null,
    login,
    logout
  };
}
