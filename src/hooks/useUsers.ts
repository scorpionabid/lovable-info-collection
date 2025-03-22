
import { useState, useEffect } from 'react';
import { User } from '@/lib/supabase/types/user';
import { UserRole } from '@/types/UserRole';

// Yalnız type birləşdirmə problemi üçün, real istifadədə tələb olunmaya bilər
type CompatibleRole = {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
};

// Mock data
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
    userRole: 'super-admin',
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
    userRole: 'region-admin',
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
    userRole: 'school-admin',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(mockUsers.length);

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
        role: userData.role || 'user',
        userRole: userData.userRole || 'user',
      };
      
      setUsers(prev => [...prev, newUser]);
      setTotalCount(prev => prev + 1);
      return newUser;
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  };

  return {
    users,
    totalCount,
    isLoading,
    isError: error !== null,
    refetch: async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
      setTotalCount(mockUsers.length);
      setIsLoading(false);
    },
    createUser,
  };
};

export default useUsers;
