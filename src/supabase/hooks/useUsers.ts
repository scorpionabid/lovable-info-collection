
/**
 * İstifadəçilər üçün hook
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as usersService from "../services/users";
import { 
  User, 
  UserFilters,
  CreateUserDto,
  UpdateUserDto
} from "../types";

// Bütün istifadəçiləri almaq üçün hook
export const useUsers = (filters?: UserFilters) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getUsers(filters),
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
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
    enabled: !!id,
    staleTime: 1000 * 60 * 5 // 5 dəqiqə
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
    queryFn: () => usersService.getRoles(),
    staleTime: 1000 * 60 * 30 // 30 dəqiqə
  });

  return {
    roles: data || [],
    isLoading,
    error
  };
};

// İstifadəçi yaratmaq üçün hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userData: CreateUserDto) => 
      usersService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserDto }) => 
      usersService.updateUser(id, userData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
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
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('İstifadəçi uğurla silindi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi silinərkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçi bloklamaq üçün hook
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.blockUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      toast.success('İstifadəçi uğurla bloklandı');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi bloklanarkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// İstifadəçi aktivləşdirmək üçün hook
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.activateUser(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables] });
      toast.success('İstifadəçi uğurla aktivləşdirildi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'İstifadəçi aktivləşdirilirkən problem baş verdi'}`);
    }
  });

  return mutation;
};

// Şifrə sıfırlamaq üçün hook
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onSuccess: () => {
      toast.success('Şifrə sıfırlama linki istifadəçiyə göndərildi');
    },
    onError: (error: any) => {
      toast.error(`Xəta: ${error.message || 'Şifrə sıfırlanarkən problem baş verdi'}`);
    }
  });

  return mutation;
};
