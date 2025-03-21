
/**
 * İstifadəçilər üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as usersService from "../services/users";

// Bütün istifadəçiləri almaq üçün hook
export const useUsers = (filters?: usersService.UserFilters) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsers(filters),
    keepPreviousData: true
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch
  };
};

// İstifadəçi detaylarını almaq üçün hook
export const useUser = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id
  });

  return {
    user: data,
    isLoading,
    error
  };
};

// Rolları almaq üçün hook
export const useRoles = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: () => usersService.getRoles()
  });

  return {
    roles: data || [],
    isLoading,
    error
  };
};

// UTIS kodu mövcudluğunu yoxlamaq üçün hook
export const useCheckUtisCode = () => {
  const mutation = useMutation({
    mutationFn: ({ utisCode, userId }: { utisCode: string; userId?: string }) => 
      usersService.checkUtisCodeExists(utisCode, userId)
  });

  return mutation;
};

// İstifadəçi yaratmaq üçün hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userData: usersService.CreateUserDto) => 
      usersService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('İstifadəçi uğurla yaradıldı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi yaradılarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçi yeniləmək üçün hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: usersService.UpdateUserDto }) => 
      usersService.updateUser(id, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables.id]);
      toast.success('İstifadəçi uğurla yeniləndi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi yenilənərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçi silmək üçün hook
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('İstifadəçi uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçini bloklamaq üçün hook
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.blockUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables]);
      toast.success('İstifadəçi uğurla bloklandı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi bloklanarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçini aktivləşdirmək üçün hook
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.activateUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables]);
      toast.success('İstifadəçi uğurla aktivləşdirildi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi aktivləşdirilərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Şifrə sıfırlamaq üçün hook
export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onSuccess: () => {
      toast.success('Şifrə sıfırlama bağlantısı istifadəçiyə göndərildi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Şifrə sıfırlanarkən problem baş verdi'}`);
    }
  });

  return mutation;
};
