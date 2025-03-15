
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { User } from '@/services/api/userService';
import userService from "@/services/api/userService";

export function useUsersData() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // User data query
  const { data: usersData, refetch } = useQuery({
    queryKey: ['users', page, perPage, search, sortColumn, sortOrder],
    queryFn: () => userService.getUsers({
      sortBy: sortColumn || undefined,
      sortOrder: sortOrder,
      search: search || undefined,
      pageSize: perPage,
      page: page,
    })
  });

  useEffect(() => {
    setIsLoading(true);
    if (usersData) {
      handleFetchSuccess(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if ((usersData as any)?.error) {
      toast(`İstifadəçiləri yükləyərkən xəta baş verdi: ${(usersData as any).error?.toString()}`);
      setIsLoading(false);
    }
  }, [(usersData as any)?.error]);

  // Adapter function to normalize user data
  const adaptUserData = (userData: any): User => {
    return {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: userData.role_id || '', 
      region_id: userData.region_id,
      sector_id: userData.sector_id,
      school_id: userData.school_id,
      phone: userData.phone,
      utis_code: userData.utis_code,
      is_active: userData.is_active,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      last_login: userData.last_login,
      roles: userData.roles,
      role: userData.roles ? userData.roles.name : undefined
    };
  };

  // Handle successful data fetch
  const handleFetchSuccess = (data: any) => {
    if (Array.isArray(data)) {
      setUsers(data.map(adaptUserData));
    } else if (data && 'data' in data && Array.isArray(data.data)) {
      setUsers(data.data.map(adaptUserData));
    }
    setIsLoading(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return {
    users,
    isLoading,
    page,
    perPage,
    search,
    sortColumn,
    sortOrder,
    usersData,
    refetch,
    handleSearchChange,
    handleSort,
    setPage,
    setPerPage,
  };
}
