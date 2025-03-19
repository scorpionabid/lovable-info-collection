
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { User } from '@/services/userService';
import userService from "@/services/userService";
import { useLogger } from '@/hooks/useLogger';

export function useUsersData() {
  const logger = useLogger('useUsersData');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // User data query with improved caching and error handling
  const { 
    data: usersData, 
    refetch,
    isError,
    error: queryError
  } = useQuery({
    queryKey: ['users', page, perPage, search, sortColumn, sortOrder],
    queryFn: async () => {
      logger.info('Fetching users', { page, perPage, search, sortColumn, sortOrder });
      
      try {
        const data = await userService.getUsers({
          sortBy: sortColumn || undefined,
          sortOrder: sortOrder,
          search: search || undefined,
          pageSize: perPage,
          page: page,
        });
        
        logger.info('Users fetched successfully', { count: data?.length || 0 });
        return data;
      } catch (error) {
        logger.error('Error fetching users', error);
        throw error;
      }
    },
    staleTime: 30000, // 30 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (usersData) {
      logger.info('Processing users data', { dataType: typeof usersData, isArray: Array.isArray(usersData) });
      handleFetchSuccess(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (isError && queryError) {
      setError(queryError as Error);
      setIsLoading(false);
      logger.error('Query error in useUsersData', queryError);
      toast.error(`İstifadəçiləri yükləyərkən xəta baş verdi: ${(queryError as Error).message}`);
    }
  }, [isError, queryError]);

  // Adapter function to normalize user data
  const adaptUserData = (userData: any): User => {
    logger.debug('Adapting user data', { userData });
    return {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      role_id: userData.role_id || '', 
      region_id: userData.region_id,
      sector_id: userData.sector_id,
      school_id: userData.school_id,
      phone: userData.phone,
      utis_code: userData.utis_code,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      last_login: userData.last_login,
      roles: userData.roles,
      role: userData.roles ? userData.roles.name : undefined
    };
  };

  // Handle successful data fetch
  const handleFetchSuccess = (data: any) => {
    try {
      logger.info('Raw data received', { data: JSON.stringify(data).substring(0, 200) + '...' });
      
      if (Array.isArray(data)) {
        setUsers(data.map(adaptUserData));
      } else if (data && typeof data === 'object') {
        // Handle if it's an object with a data property
        if ('data' in data && Array.isArray(data.data)) {
          setUsers(data.data.map(adaptUserData));
        } else {
          // Try to handle it as a single user object
          logger.warn('Unexpected data format', { data: JSON.stringify(data).substring(0, 200) + '...' });
          setUsers([]);
        }
      } else {
        logger.warn('Unexpected data type', { type: typeof data });
        setUsers([]);
      }
    } catch (e) {
      logger.error('Error processing users data', e);
      setError(e as Error);
      toast.error('İstifadəçi məlumatları işlənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page when sorting changes
  };

  return {
    users,
    isLoading,
    error,
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
