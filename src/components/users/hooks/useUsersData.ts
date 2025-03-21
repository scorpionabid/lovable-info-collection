
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/supabase/services/users';
import { UserFilters } from '@/supabase/types';

export const useUsersData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({
    role_id: '',
    region_id: '',
    sector_id: '',
    school_id: '',
    search: '',
    status: 'active'
  });
  const [sortBy, setSortBy] = useState('last_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (filterKey: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const { data: usersResult, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', currentPage, itemsPerPage, filters, sortBy, sortOrder],
    queryFn: async () => {
      const result = await getUsers(filters);
      return { 
        data: result, 
        count: result.length 
      };
    }
  });

  return {
    users: usersResult?.data || [],
    totalItems: usersResult?.count || 0,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    isLoading,
    isError,
    error,
    filters,
    searchTerm: filters.search,
    setSearchTerm: (search: string) => handleSearchChange(search),
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleSearchChange,
    handleSort,
    setPage: setCurrentPage,
    setPerPage: setItemsPerPage,
    handleFilterChange,
    refetch
  };
};
