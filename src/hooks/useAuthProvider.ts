/**
 * Adapter hook: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu hook köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase/hooks/useAuth istifadə edin.
 */
import { useAuth } from '@/lib/supabase/hooks/useAuth';
export type { UserRole, LoginCredentials } from '@/lib/supabase/hooks/useAuth';

export const useAuthProvider = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    user: auth.user,
    userRole: auth.userRole,
    loading: auth.loading,
    isAuthenticated: Boolean(auth.user) || Boolean(auth.session),
    isLoading: auth.loading && !auth.user,
    isUserReady: Boolean(auth.user) || Boolean(auth.session),
    login: auth.login,
    logout: auth.logout,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword
  };
};

export default useAuthProvider;
