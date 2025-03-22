
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/lib/supabase/types/user';
import { Role } from '@/types/common';

// Əgər User tipi xaricində əlavə məlumatlar lazımdırsa
interface UserWithPaginationResult {
  data: User[];
  count: number;
}

// Mock data interface to ensure type compatibility 
interface MockUser extends User {
  roles: Role | string;
}

export const useUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  // Mock users data for development use
  const mockFetchUsers = async (): Promise<UserWithPaginationResult> => {
    // Simulate API call 
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    const users: MockUser[] = Array.from({ length: 30 }, (_, index) => ({
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
      first_name: `First${index + 1}`,
      last_name: `Last${index + 1}`,
      role_id: `role-${(index % 4) + 1}`,
      is_active: index % 5 !== 0,
      created_at: new Date(Date.now() - (index * 86400000)).toISOString(),
      roles: { 
        id: `role-${(index % 4) + 1}`,
        name: ['super-admin', 'region-admin', 'sector-admin', 'school-admin'][index % 4]
      }
    }));
    
    // Apply filters (only for mock data)
    let filteredUsers = users;
    
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(lowerFilter) || 
        user.first_name.toLowerCase().includes(lowerFilter) || 
        user.last_name.toLowerCase().includes(lowerFilter)
      );
    }
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => 
        typeof user.roles === 'object' && user.roles.name === roleFilter
      );
    }
    
    if (statusFilter) {
      filteredUsers = filteredUsers.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }
    
    // Apply sorting (only for mock data)
    filteredUsers.sort((a, b) => {
      const valueA = a[sortColumn as keyof User] || '';
      const valueB = b[sortColumn as keyof User] || '';
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Apply pagination
    const paginatedUsers = filteredUsers.slice(
      (currentPage - 1) * pageSize, 
      currentPage * pageSize
    );
    
    return {
      data: paginatedUsers,
      count: filteredUsers.length
    };
  };

  const { data, isLoading, isError, refetch } = useQuery<UserWithPaginationResult>({
    queryKey: ['users', currentPage, pageSize, sortColumn, sortDirection, filter, roleFilter, statusFilter],
    queryFn: mockFetchUsers,
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    
    if (newFilters.search !== undefined) {
      setFilter(newFilters.search);
    }
    
    if (newFilters.role !== undefined) {
      setRoleFilter(newFilters.role);
    }
    
    if (newFilters.status !== undefined) {
      setStatusFilter(newFilters.status);
    }
  };

  const deleteUser = async (userId: string) => {
    // Mock implementation
    console.log(`Deleting user with ID: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  };

  return {
    users: data?.data || [],
    totalCount: data?.count || 0,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    sortColumn,
    sortDirection,
    handleSortChange,
    filter,
    setFilter,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    isError,
    refetch,
    handleFilterChange,
    filters,
    deleteUser
  };
};

export default useUsers;
