
/**
 * Regionlar üçün universal hook
 * Supabase ilə regionları idarə edir
 */
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Region } from '@/types/supabase';
import { TABLES } from '@/lib/supabase/types-util';

// RegionWithStats tipini əlavə edirik
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  studentCount: number;
  teacherCount: number;
  description: string;
}

export interface RegionsQueryOptions {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface RegionsData {
  data: RegionWithStats[];
  count: number;
}

/**
 * Region məlumatlarını əldə etmək üçün hook
 */
export const useRegionsData = (options: RegionsQueryOptions) => {
  const { page, pageSize, sortColumn, sortDirection, filters } = options;
  const [searchTerm, setSearchTerm] = useState('');
  
  // Əlavə filtrlər
  const allFilters = {
    ...filters,
    ...(searchTerm ? { name: `%${searchTerm}%` } : {})
  };
  
  const fetchRegions = useCallback(async () => {
    try {
      // Ümumi sayı əldə et
      const countQuery = supabase
        .from(TABLES.REGIONS)
        .select('*', { count: 'exact', head: true });
        
      if (allFilters && allFilters.name) {
        countQuery.ilike('name', allFilters.name);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Səhifələnmiş məlumatları əldə et
      let query = supabase
        .from(TABLES.REGIONS)
        .select(`
          *,
          sectors:sectors(count)
        `);
      
      if (allFilters && allFilters.name) {
        query.ilike('name', allFilters.name);
      }
      
      query = query.order(sortColumn || 'created_at', { ascending: sortDirection === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
        
      const { data: regionsData, error: dataError } = await query;
        
      if (dataError) throw dataError;
      
      // Regionları formatla və lazımi məlumatları əlavə et
      const regionsWithStats: RegionWithStats[] = regionsData.map(region => ({
        ...region,
        // Add default values for missing properties
        description: region.description || '',
        sectorCount: region.sectors?.length || 0,
        schoolCount: 0, // This data would need to be fetched separately
        completionRate: 0, // This data would need to be fetched separately
        studentCount: 0,
        teacherCount: 0
      }));
      
      return {
        data: regionsWithStats,
        count: count || 0
      };
    } catch (error) {
      console.error("Regionları gətirərkən xəta baş verdi:", error);
      throw error;
    }
  }, [page, pageSize, sortColumn, sortDirection, allFilters]);
  
  // Supabase sorğusu yaradırıq
  const regionsQuery = useQuery({
    queryKey: ['regions', page, pageSize, sortColumn, sortDirection, allFilters],
    queryFn: fetchRegions,
    refetchOnWindowFocus: true,
    staleTime: 3 * 60 * 1000 // 3 dəqiqə
  });
  
  return {
    ...regionsQuery,
    searchTerm,
    setSearchTerm,
  };
};
