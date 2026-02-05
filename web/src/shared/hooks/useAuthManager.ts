import { useState, useEffect, useRef } from 'react';
import { authService } from '@features/auth/services/authService';
import { db } from '@shared/persistence/database';

export function useAuthManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const effectRan = useRef(false);

  const checkAuthStatus = async () => {
    try {
      await authService.checkSession();
      setIsAuthenticated(true);
    } catch (error: any) {
      const status = error.response?.status;
      if (!error.response || (status >= 500 && status <= 599)) {
        const local = await authService.getLocalSession();
        setIsAuthenticated(!!local);
      } else if (status === 401) {
        await db.session.clear();
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      checkAuthStatus();
      effectRan.current = true;
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login: () => setIsAuthenticated(true),
    logout: async () => {
      try { await authService.logout(); } 
      finally { setIsAuthenticated(false); }
    }
  };
}