
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/types/user';

// Filterlər üçün tip
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all';
  pageSize?: number;
  page?: number;
}

export const useUsers = (initialFilters: UserFilters = {}) => {
  const queryClient = useQueryClient();
  
  // State dəyişənləri
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // İstifadəçiləri məlumat bazasından əldə etmək üçün funksiya
  const fetchUsers = async (): Promise<{ data: User[], count: number }> => {
    try {
      // Count sorğusu
      const countQuery = supabase
        .from('users')
        .select('id', { count: 'exact' });
        
      if (filters.search) {
        countQuery.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      
      if (filters.role_id) {
        countQuery.eq('role_id', filters.role_id);
      }
      
      if (filters.region_id) {
        countQuery.eq('region_id', filters.region_id);
      }
      
      if (filters.sector_id) {
        countQuery.eq('sector_id', filters.sector_id);
      }
      
      if (filters.school_id) {
        countQuery.eq('school_id', filters.school_id);
      }
      
      if (filters.status && filters.status !== 'all') {
        countQuery.eq('is_active', filters.status === 'active');
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Əsas məlumat sorğusu
      let query = supabase
        .from('users')
        .select(`
          *,
          roles:role_id(id, name)
        `);
        
      // Filtrlər tətbiq edilir
      if (filters.search) {
        query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      
      if (filters.role_id) {
        query.eq('role_id', filters.role_id);
      }
      
      if (filters.region_id) {
        query.eq('region_id', filters.region_id);
      }
      
      if (filters.sector_id) {
        query.eq('sector_id', filters.sector_id);
      }
      
      if (filters.school_id) {
        query.eq('school_id', filters.school_id);
      }
      
      if (filters.status && filters.status !== 'all') {
        query.eq('is_active', filters.status === 'active');
      }
      
      // Sıralama
      query.order(sortColumn, { ascending: sortDirection === 'asc' });
      
      // Səhifələmə
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query.range(from, to);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { 
        data: data.map(user => ({
          ...user,
          role: user.roles?.name || user.role || 'unknown'
        })) as User[], 
        count: count || 0 
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: [], count: 0 };
    }
  };
  
  const { 
    data = { data: [], count: 0 }, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['users', filters, sortColumn, sortDirection, currentPage, pageSize],
    queryFn: fetchUsers
  });
  
  // Filter dəyişmək üçün funksiya
  const handleFilterChange = <K extends keyof UserFilters>(key: K, value: UserFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Filtrlər dəyişdikdə birinci səhifəyə qayıt
  };
  
  // Sıralama sütununu dəyişmək üçün funksiya
  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Bütün filterleri sıfırlamaq üçün
  const resetFilters = () => {
    setFilters({});
    setSortColumn('created_at');
    setSortDirection('desc');
    setCurrentPage(1);
  };
  
  return {
    users: data.data,
    totalCount: data.count,
    filters,
    sortColumn,
    sortDirection,
    currentPage,
    pageSize,
    isLoading,
    isError,
    setCurrentPage,
    handleSortChange,
    handleFilterChange,
    resetFilters,
    refetch,
    // Keşi təmizləmək üçün
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  };
};

export default useUsers;
