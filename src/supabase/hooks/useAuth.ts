
/**
 * Autentifikasiya üçün hook
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as authService from '../services/auth';
import { LoginCredentials } from '../services/auth';

// Login, çıxış və istifadəçi məlumatlarını idarə etmək üçün hook
export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Sessiya məlumatlarını əldə etmək
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: () => authService.getSession(),
    retry: false
  });

  // Cari istifadəçi məlumatlarını əldə etmək (Aktiv sessiya varsa)
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: !!session,
    retry: false
  });

  // Login olmaq üçün mutasiya
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      toast.success('Uğurla daxil oldunuz');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      let message = 'Daxil olmaq mümkün olmadı';
      if (error.message.includes('Invalid login')) {
        message = 'E-mail və ya şifrə səhvdir';
      }
      toast.error(message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // Çıxış etmək üçün mutasiya
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Uğurla çıxış etdiniz');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(`Çıxış xətası: ${error.message}`);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // Şifrə sıfırlama linki göndərmək üçün mutasiya
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.sendPasswordResetEmail(email),
    onSuccess: () => {
      toast.success('Şifrə sıfırlama linki e-poçt ünvanınıza göndərildi');
    },
    onError: (error: any) => {
      toast.error(`Şifrə sıfırlama xətası: ${error.message}`);
    }
  });

  // Şifrə dəyişmək üçün mutasiya
  const changePasswordMutation = useMutation({
    mutationFn: (newPassword: string) => authService.changePassword(newPassword),
    onSuccess: () => {
      toast.success('Şifrəniz uğurla dəyişdirildi');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(`Şifrə dəyişmə xətası: ${error.message}`);
    }
  });

  return {
    user,
    session,
    isLoading: loading || isSessionLoading || isUserLoading,
    isAuthenticated: !!session,
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    sendPasswordResetEmail: (email: string) => resetPasswordMutation.mutate(email),
    changePassword: (newPassword: string) => changePasswordMutation.mutate(newPassword),
    hasRole: (role: string) => authService.hasRole(role)
  };
};
