
import { useCallback } from 'react';
import { toast } from 'sonner';
import { LoginCredentials } from '../types/authTypes';
import * as authService from '@/supabase/services/auth';

export const useAuthActions = (
  handleUserLoggedIn: (userData: any) => void,
  handleUserLoggedOut: () => void
) => {
  const login = useCallback(
    async (emailOrCredentials: string | LoginCredentials, password?: string) => {
      try {
        let email: string;
        let pwd: string;

        if (typeof emailOrCredentials === 'string') {
          if (!password) {
            throw new Error('Password is required when email is provided as a string');
          }
          email = emailOrCredentials;
          pwd = password;
        } else {
          email = emailOrCredentials.email;
          pwd = emailOrCredentials.password;
        }

        const data = await authService.loginUser(email, pwd);

        if (!data.session || !data.user) {
          throw new Error('Invalid login response from server');
        }

        // Attempt to get user profile data
        const currentUser = data.user;
        
        // Adapt this user object to your UserProfile structure
        const userProfile = {
          id: currentUser.id,
          email: currentUser.email || '',
          role: currentUser.role || 'school-admin',
          isActive: true,
          createdAt: currentUser.created_at || new Date().toISOString(),
          // Map other properties as needed
        };

        handleUserLoggedIn(userProfile);
        toast.success('Uğurla daxil oldunuz');
      } catch (error: any) {
        console.error('Login error:', error);
        handleUserLoggedOut();
        throw error;
      }
    },
    [handleUserLoggedIn, handleUserLoggedOut]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logoutUser();
      handleUserLoggedOut();
      toast.success('Uğurla çıxış etdiniz');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Çıxış zamanı xəta baş verdi');
    }
  }, [handleUserLoggedOut]);

  return { login, logout };
};
