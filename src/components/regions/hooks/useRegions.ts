
/**
 * Regionlar üçün universal hook
 * Yeni Supabase hook-larını istifadə edərək regionları idarə edir
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Region } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

// RegionWithStats tipini əlavə edirik
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  studentCount?: number;
  teacherCount?: number;
  description?: string;
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
  
  // Supabase sorğusu yaradırıq
  const regionQuery = useQuery({
    queryKey: ['regions', page, pageSize, sortColumn, sortDirection, allFilters],
    queryFn: async () => {
      // Get total count
      const countQuery = await supabase
        .from('regions')
        .select('*', { count: 'exact', head: true });
      
      // Get paginated data with stats
      const { data, error } = await supabase
        .from('regions')
        .select('*, sectors(count)')
        .order(sortColumn || 'created_at', { ascending: sortDirection === 'asc' })
        .range(
          (page || 0) * (pageSize || 10),
          ((page || 0) + 1) * (pageSize || 10) - 1
        );
        
      if (error) throw error;
        
      // Məlumatları RegionWithStats tipinə çevirmək
      const regionsWithStats = data?.map(region => ({
        ...region,
        sectorCount: region.sectors?.count || 0,
        schoolCount: 0, // Bu məlumatı əlavə sorğu ilə almaq lazım olacaq
        completionRate: 0, // Bu məlumatı əlavə sorğu ilə almaq lazım olacaq
        description: region.description || ''
      })) || [];
      
      // Bu formada qaytarmaq lazımdır ki, RegionsData tipinə uyğun olsun
      return { 
        data: regionsWithStats,
        count: countQuery.count || 0
      };
    },
    refetchOnWindowFocus: true,
    staleTime: 3 * 60 * 1000 // 3 dəqiqə
  });
  
  return {
    ...regionQuery,
    searchTerm,
    setSearchTerm,
  };
};
