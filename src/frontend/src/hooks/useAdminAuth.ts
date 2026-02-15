import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';
import { useQueryClient } from '@tanstack/react-query';

const ADMIN_SESSION_KEY = 'admin_session';

interface AdminAuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isLoggedIn: false,
    isLoading: true,
    error: null,
  });

  // Check if there's a stored session and validate it
  const validateSession = useCallback(async () => {
    const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    
    if (!storedSession || !actor) {
      setAuthState({ isLoggedIn: false, isLoading: false, error: null });
      return;
    }

    try {
      // Validate the session by checking admin status with backend
      const isAdmin = await actor.isAdminUser();
      setAuthState({
        isLoggedIn: isAdmin,
        isLoading: false,
        error: isAdmin ? null : 'Session expired',
      });

      if (!isAdmin) {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setAuthState({ isLoggedIn: false, isLoading: false, error: null });
    }
  }, [actor]);

  // Validate session on mount and when actor changes
  useEffect(() => {
    if (actor) {
      validateSession();
    }
  }, [actor, validateSession]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!actor) {
      setAuthState({ isLoggedIn: false, isLoading: false, error: 'System not ready' });
      return false;
    }

    setAuthState({ isLoggedIn: false, isLoading: true, error: null });

    try {
      const success = await actor.adminLogin(username, password);
      
      if (success) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'active');
        setAuthState({ isLoggedIn: true, isLoading: false, error: null });
        return true;
      } else {
        setAuthState({
          isLoggedIn: false,
          isLoading: false,
          error: 'Invalid username or password',
        });
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        error: 'Login failed. Please try again.',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthState({ isLoggedIn: false, isLoading: false, error: null });
    // Clear all cached queries to prevent showing stale admin data
    queryClient.clear();
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    isLoggedIn: authState.isLoggedIn,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    clearError,
    validateSession,
  };
}
