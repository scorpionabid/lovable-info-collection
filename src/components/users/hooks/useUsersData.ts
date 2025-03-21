import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';
import { UserFilters } from '@/services/supabase/user/types';

interface UseUsersDataProps {
  page?: number;
  limit?: number;
  filters?: UserFilters;
}

export const useUsersData = ({ 
  page = 1, 
  limit = 10,
  filters = {}
}: UseUsersDataProps = {}) => {
  // Get all users with pagination and filters
  const fetchUsers = async () => {
    const combinedFilters = {
      ...filters,
      page,
      limit
    };
    
    return await userService.getUsers(combinedFilters);
  };

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', page, limit, filters],
    queryFn: fetchUsers
  });

  // Format the data to meet the expected structure
  const formattedData = usersData 
    ? { 
        data: usersData.data || [], 
        count: usersData.count || 0 
      }
    : { data: [], count: 0 };

  return {
    users: formattedData.data,
    totalItems: formattedData.count,
    currentPage: page,
    setCurrentPage: (newPage: number) => {}, // This will be handled by the parent component
    itemsPerPage: limit,
    setItemsPerPage: (newLimit: number) => {}, // This will be handled by the parent component
    isLoading,
    isError,
    error,
    refetch
  };
};
