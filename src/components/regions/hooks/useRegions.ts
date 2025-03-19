/**
 * Regionlar üçün universal hook
 * Yeni Supabase hook-larını istifadə edərək regionları idarə edir
 */
import { useState } from 'react';
import { useSupabaseQuery, createSelectQuery } from '@/hooks/supabase';
import { Region } from '@/types/supabase';

// RegionWithStats tipini əlavə edirik
export interface RegionWithStats extends Region {
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
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
  const regionQuery = useSupabaseQuery<RegionsData>(
    'regions',
    async (client, options) => {
      // Sorğu nəticəsini RegionWithStats tipinə çeviririk
      const { data, error, count } = await client
        .from('regions')
        .select('*, sectors(count)', { count: 'exact' })
        .order(options.sort?.column || 'created_at', { ascending: options.sort?.direction === 'asc' })
        .range(
          (options.pagination?.page || 0) * (options.pagination?.pageSize || 10),
          ((options.pagination?.page || 0) + 1) * (options.pagination?.pageSize || 10) - 1
        );
        
      // Məlumatları RegionWithStats tipinə çevirmək
      const regionsWithStats = data?.map(region => ({
        ...region,
        sectorCount: region.sectors?.count || 0,
        schoolCount: 0, // Bu məlumatı əlavə sorğu ilə almaq lazım olacaq
        completionRate: 0 // Bu məlumatı əlavə sorğu ilə almaq lazım olacaq
      })) || [];
      
      // Bu formada qaytarmaq lazımdır ki, RegionsData tipinə uyğun olsun
      return { 
        data: {
          data: regionsWithStats,
          count: count || 0
        }, 
        error
      };
    },
    {
      queryKey: ['regions', page, pageSize, sortColumn, sortDirection, allFilters],
      select: '*, sectors(count)',
      pagination: { page, pageSize },
      sort: { column: sortColumn, direction: sortDirection },
      filters: allFilters,
      refetchOnWindowFocus: true,
      staleTime: 3 * 60 * 1000 // 3 dəqiqə
    }
  );
  
  return {
    ...regionQuery,
    searchTerm,
    setSearchTerm,
  };
};
