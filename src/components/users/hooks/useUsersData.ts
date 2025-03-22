
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { User, FilterParams } from '@/lib/supabase/types';

export const useUsersData = (initialFilters = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterParams>({
    status: 'active',
    ...initialFilters,
  });

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          roles:role_id (
            id,
            name,
            permissions
          )
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.role_id) {
        query = query.eq('role_id', filters.role_id);
      }

      if (filters.region_id) {
        query = query.eq('region_id', filters.region_id);
      }

      if (filters.sector_id) {
        query = query.eq('sector_id', filters.sector_id);
      }

      if (filters.school_id) {
        query = query.eq('school_id', filters.school_id);
      }

      if (filters.status === 'active') {
        query = query.eq('is_active', true);
      } else if (filters.status === 'inactive') {
        query = query.eq('is_active', false);
      }

      // Get total count
      const { count, error: countError } = await query.count();
      if (countError) throw countError;

      // Apply sorting and pagination
      query = query
        .order(sortColumn, { ascending: sortDirection === 'asc' })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      const { data, error } = await query;
      if (error) throw error;

      return { data: data as User[], count: count || 0 };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['users', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: fetchUsers,
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when changing filters
  };

  return {
    users: data?.data || [],
    totalCount: data?.count || 0,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    sortColumn,
    sortDirection,
    isLoading,
    isError,
    onSortChange: handleSortChange,
    filters,
    onFilterChange: handleFilterChange,
    refetch,
  };
};

export default useUsersData;
