
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/supabase/services/users';
import { UserFilters } from '@/supabase/types';

export const useUsersData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // When search term changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, regionFilter, sectorFilter, schoolFilter, statusFilter]);

  // Build filters object
  const filters: UserFilters = {
    search: searchTerm,
    role_id: roleFilter,
    region_id: regionFilter,
    sector_id: sectorFilter,
    school_id: schoolFilter,
    status: statusFilter,
  };

  // Query users with filters and pagination
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters, currentPage, itemsPerPage, sortBy, sortOrder],
    queryFn: () => getUsers(filters, {
      page: currentPage,
      pageSize: itemsPerPage
    }, {
      field: sortBy,
      direction: sortOrder
    }),
  });

  // Transform API response format if needed
  const users = data?.data || [];
  const totalItems = data?.count || 0;

  return {
    users,
    totalItems,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refetch
  };
};
