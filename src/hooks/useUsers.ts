
import { useState, useEffect } from 'react';
import { User } from '@/lib/supabase/types/user';
import { UserRole } from '@/types/UserRole';

// Mock users that conform to the User interface
const mockUsers: User[] = [
  {
    id: '1',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    role_id: '1',
    is_active: true,
    created_at: new Date().toISOString(),
    role: 'super-admin',
  },
  {
    id: '2',
    first_name: 'Region',
    last_name: 'Admin',
    email: 'region@example.com',
    role_id: '2',
    region_id: '1',
    is_active: true,
    created_at: new Date().toISOString(),
    role: 'region-admin',
  },
  {
    id: '3',
    first_name: 'School',
    last_name: 'Admin',
    email: 'school@example.com',
    role_id: '3',
    region_id: '1',
    sector_id: '1',
    school_id: '1',
    is_active: true,
    created_at: new Date().toISOString(),
    role: 'school-admin',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(mockUsers.length);
  
  // For pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(mockUsers);
        setTotalCount(mockUsers.length);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSortChange = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser: User = {
        id: String(Date.now()),
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        role_id: userData.role_id || '',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        created_at: new Date().toISOString(),
        role: userData.role || 'school-admin',
      };
      
      setUsers(prev => [...prev, newUser]);
      setTotalCount(prev => prev + 1);
      return newUser;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.filter(user => user.id !== userId));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  return {
    users,
    totalCount,
    isLoading,
    isError: error !== null,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
    setCurrentPage,
    handleSortChange,
    handleFilterChange,
    refetch: async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
      setTotalCount(mockUsers.length);
      setIsLoading(false);
    },
    createUser,
    deleteUser
  };
};

export default useUsers;
