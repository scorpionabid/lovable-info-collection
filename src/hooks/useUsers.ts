
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserById, getUsers, deleteUser as deleteUserService } from '@/services/supabase/user';
import { User } from '@/lib/supabase/types/user';

interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all';
}

export const useUsers = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<UserFilters>({
    status: 'active',
  });

  // Fetch users with pagination, sorting, and filtering
  const { data: usersData, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: async () => {
      try {
        return await getUsers({
          ...filters,
          page: currentPage,
          pageSize: pageSize,
        }, {
          column: sortColumn,
          direction: sortDirection,
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUserService,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return {
    users: usersData?.data || [],
    totalCount: usersData?.count || 0,
    isLoading,
    isError,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
    setCurrentPage,
    setPageSize,
    handleSortChange,
    handleFilterChange,
    refetch,
    deleteUser: deleteUserMutation.mutate,
  };
};

export default useUsers;
