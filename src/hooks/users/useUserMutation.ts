
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser as deleteUserService, resetPassword } from '@/services';
import { toast } from 'sonner';

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  
  // Create user mutation
  const { mutateAsync: createUserMutation, isPending: isCreating } = useMutation({
    mutationFn: (userData: any) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla yaradıldı');
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast.error('İstifadəçi yaradılarkən xəta baş verdi');
    }
  });
  
  // Update user mutation
  const { mutateAsync: updateUserMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla yeniləndi');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error('İstifadəçi yenilənərkən xəta baş verdi');
    }
  });
  
  // Delete user mutation
  const { mutateAsync: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteUserService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla silindi');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast.error('İstifadəçi silinərkən xəta baş verdi');
    }
  });
  
  // Reset password mutation
  const { mutateAsync: resetPasswordMutation, isPending: isResetting } = useMutation({
    mutationFn: (id: string) => resetPassword(id),
    onSuccess: () => {
      toast.success('Şifrə sıfırlama e-poçtu göndərildi');
    },
    onError: (error) => {
      console.error('Error resetting password:', error);
      toast.error('Şifrə sıfırlanarkən xəta baş verdi');
    }
  });
  
  // Wrapper functions with better error handling
  const createUserWithHandling = async (userData: any) => {
    try {
      return await createUserMutation(userData);
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  };
  
  const updateUserWithHandling = async (id: string, userData: any) => {
    try {
      return await updateUserMutation({ id, userData });
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  };
  
  const deleteUserWithHandling = async (id: string) => {
    try {
      return await deleteUserMutation(id);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  };
  
  const resetUserPasswordWithHandling = async (id: string) => {
    try {
      return await resetPasswordMutation(id);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  };
  
  return {
    createUser: createUserWithHandling,
    updateUser: updateUserWithHandling,
    deleteUser: deleteUserWithHandling,
    resetUserPassword: resetUserPasswordWithHandling,
    isLoading: isCreating || isUpdating || isDeleting || isResetting
  };
};
