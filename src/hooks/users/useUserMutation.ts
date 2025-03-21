/**
 * Adapter hook: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu hook köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase/hooks/useUsers istifadə edin.
 */
import { useUsers } from '@/lib/supabase/hooks/useUsers';

export const useUserMutation = () => {
  const { createUserMutation, updateUserMutation, deleteUserMutation, resetPasswordMutation } = useUsers();
  
  return {
    createUserMutation,
    isCreating: createUserMutation.isPending,
    updateUserMutation,
    isUpdating: updateUserMutation.isPending,
    deleteUserMutation,
    isDeleting: deleteUserMutation.isPending,
    resetPasswordMutation,
    isResetting: resetPasswordMutation.isPending
  };
};

export default useUserMutation;
