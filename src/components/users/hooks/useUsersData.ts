
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import userService from '@/services/userService';
import type { User } from '@/supabase/types';

export const useUsersData = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'blocked' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters object for API
  const filters = {
    search: searchText,
    role_id: roleFilter,
    region_id: regionFilter,
    sector_id: sectorFilter,
    school_id: schoolFilter,
    status: statusFilter,
    page: currentPage,
    limit: itemsPerPage
  };
  
  // Fetch users
  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      // Fetch data
      const data = await userService.getUsers(filters);
      
      // Update total count - assuming we get count from a header or metadata
      // Gerçek kullanımda doğru API modelini kullanmanız gerekir
      setTotalItems(Array.isArray(data) ? data.length : 0);
      
      return data;
    }
  });
  
  // Handlers for bulk operations
  const resetFilters = useCallback(() => {
    setSearchText('');
    setRoleFilter('');
    setRegionFilter('');
    setSectorFilter('');
    setSchoolFilter('');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);
  
  const blockUserMutation = useMutation({
    mutationFn: userService.blockUser,
    onSuccess: () => {
      toast.success('İstifadəçi bloklandı');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(`Xəta: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });
  
  const activateUserMutation = useMutation({
    mutationFn: userService.activateUser,
    onSuccess: () => {
      toast.success('İstifadəçi aktivləşdirildi');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(`Xəta: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      toast.success('İstifadəçi silindi');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(`Xəta: ${error instanceof Error ? error.message : 'Bilinməyən xəta'}`);
    }
  });
  
  return {
    users,
    totalItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    isLoading,
    isError,
    searchText,
    setSearchText,
    roleFilter,
    setRoleFilter,
    regionFilter,
    setRegionFilter,
    sectorFilter,
    setSectorFilter,
    schoolFilter,
    setSchoolFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    blockUser: blockUserMutation.mutate,
    activateUser: activateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    refetch
  };
};
