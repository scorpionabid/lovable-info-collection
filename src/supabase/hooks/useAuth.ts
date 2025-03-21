
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import auth functions directly
import * as authService from '@/services/supabase/authService';

// Export the LoginCredentials type for consistency
export interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.getSession();
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error getting session'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authService.login(credentials);
      
      if (error) {
        toast({
          title: "Xəta",
          description: "Giriş xətası. E-poçt və ya şifrə səhvdir.",
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Uğurlu giriş",
        description: "Sistemə daxil oldunuz.",
      });
      
      navigate('/');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown login error'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.logout();
      
      toast({
        title: "Çıxış",
        description: "Sistemdən çıxış edildi.",
      });
      
      navigate('/login');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown logout error'));
      toast({
        title: "Çıxış xətası",
        description: "Sistemdən çıxış edərkən bir xəta baş verdi.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await authService.sendResetPasswordEmail(email);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Şifrə sıfırlama e-poçtu göndərildi",
        description: "Zəhmət olmasa e-poçtunuzu yoxlayın.",
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error sending password reset'));
      toast({
        title: "Xəta",
        description: "Şifrə sıfırlama e-poçtu göndərilərkən xəta baş verdi.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const changePassword = useCallback(async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await authService.resetPassword(newPassword);
      
      if (!success) {
        throw error;
      }
      
      toast({
        title: "Şifrə yeniləndi",
        description: "Şifrəniz uğurla yeniləndi.",
      });
      
      navigate('/login');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error changing password'));
      toast({
        title: "Xəta",
        description: "Şifrə dəyişdirilməsi zamanı xəta baş verdi.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const hasRole = useCallback((userRole: string, requiredRole: string) => {
    return authService.checkRole(userRole, requiredRole);
  }, []);

  return {
    loading,
    error,
    login,
    logout,
    getSession,
    sendPasswordResetEmail,
    changePassword,
    hasRole,
  };
};
