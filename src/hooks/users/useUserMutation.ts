
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword 
} from '@/services/index';

/**
 * Custom hook for user CRUD operations
 */
export const useUserMutation = () => {
  const queryClient = useQueryClient();

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message || 'Unknown error'}`);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message || 'Unknown error'}`);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message || 'Unknown error'}`);
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: resetUserPassword,
    onSuccess: () => {
      toast.success('Password reset email sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to reset password: ${error.message || 'Unknown error'}`);
    }
  });

  return {
    createUserMutation,
    isCreating: createUserMutation.isPending,
    updateUserMutation,
    isUpdating: updateUserMutation.isPending,
    deleteUserMutation,
    isDeleting: deleteUserMutation.isPending,
    resetPasswordMutation,
    isResetting: resetPasswordMutation.isPending,
    // Helper methods for easier use in components
    updateUser: (id: string, data: any) => updateUserMutation.mutate({ id, data }),
    deleteUser: (id: string) => deleteUserMutation.mutate(id),
    resetUserPassword: (id: string) => resetPasswordMutation.mutate(id),
    isLoading: createUserMutation.isPending || 
               updateUserMutation.isPending || 
               deleteUserMutation.isPending || 
               resetPasswordMutation.isPending
  };
};
