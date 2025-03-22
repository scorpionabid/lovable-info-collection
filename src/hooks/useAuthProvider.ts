
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/supabase/hooks/useAuth';

// Əgər LoginCredentials tipi export edilmirsə, onu burada təyin edək
interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthProvider = () => {
  const { user, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      const errorMessage = error.message || 'Login zamanı xəta baş verdi';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Çıxış zamanı xəta baş verdi';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    user,
    loading,
    authError,
    login,
    logout,
  };
};

export default useAuthProvider;
