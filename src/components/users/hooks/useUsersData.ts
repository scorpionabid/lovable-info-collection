
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, UserFilter } from '@/services/userService/types';
import userService from '@/services/userService';

export const useUsersData = (initialFilters: UserFilter = {}) => {
  const [filters, setFilters] = useState<UserFilter>(initialFilters);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', filters, page, perPage, search, sortColumn, sortOrder],
    queryFn: async () => {
      // Create proper filter object for the API
      const apiFilters: UserFilter = {
        ...filters,
        page,
        pageSize: perPage,
        search,
        sortField: sortColumn || 'created_at',
        sortOrder: sortOrder || 'desc'
      };
      
      return userService.getUsers(apiFilters);
    }
  });

  // Clear selected rows when data changes
  useEffect(() => {
    setSelectedRows([]);
  }, [userData]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page when sorting
  };

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
    refetch,
    page,
    perPage,
    search,
    sortColumn,
    sortOrder,
    handleSearchChange,
    handleSort,
    setPage,
    setPerPage,
  };
};
