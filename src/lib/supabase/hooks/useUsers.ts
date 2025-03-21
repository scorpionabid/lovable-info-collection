
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  resetPassword,
  User,
  UserFilters,
  CreateUserDto,
  UpdateUserDto
} from '../services/users';

export const useUsers = (filters?: UserFilters) => {
  const queryClient = useQueryClient();

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters)
  });

  // Fetch user by ID
  const useUserById = (id: string) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: () => getUserById(id),
      enabled: !!id
    });
  };

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`İstifadəçi yaradılarkən xəta: ${error.message}`);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`İstifadəçi yenilənərkən xəta: ${error.message}`);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`İstifadəçi silinərkən xəta: ${error.message}`);
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => resetPassword(email),
    onSuccess: () => {
      toast.success('Şifrə sıfırlama linki göndərildi');
    },
    onError: (error: any) => {
      toast.error(`Şifrə sıfırlama xətası: ${error.message}`);
    }
  });

  return {
    // Queries
    users,
    isLoading,
    isError,
    refetch,
    useUserById,
    
    // Mutations
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    
    // Loading states
    isCreatingUser: createUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending
  };
};
