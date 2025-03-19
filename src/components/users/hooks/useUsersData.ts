
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, UserFilter } from '@/services/userService/types';
import userService from '@/services/userService';

export const useUsersData = (initialFilters: UserFilter = {}) => {
  const [filters, setFilters] = useState<UserFilter>(initialFilters);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      // Convert sortBy to sortField and sortOrder for compatibility
      const apiFilters: UserFilter = {
        ...filters,
        sortField: filters.sortField || 'created_at',
        sortOrder: filters.sortOrder || 'desc'
      };
      
      return userService.getUsers(apiFilters);
    }
  });

  // Clear selected rows when data changes
  useEffect(() => {
    setSelectedRows([]);
  }, [userData]);

  const users = userData?.data || [];
  const totalCount = userData?.count || 0;
  
  return {
    users,
    totalCount,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    selectedRows,
    setSelectedRows,
    refetch
  };
};
