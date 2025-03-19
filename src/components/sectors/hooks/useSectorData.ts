
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectorWithStats, FilterParams, SortParams, PaginationParams } from '@/services/supabase/sector/types';
import sectorService, { getSectors } from '@/services/supabase/sector';

interface UseSectorDataProps {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: FilterParams;
}

interface SectorDataResponse {
  data: SectorWithStats[];
  count: number;
}

export const useSectorData = ({
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  filters
}: UseSectorDataProps) => {
  const paginationParams: PaginationParams = {
    page: currentPage,
    pageSize: pageSize
  };
  
  const sortParams: SortParams = {
    column: sortColumn,
    direction: sortDirection
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: async () => {
      try {
        // Use the getSectors function from the imported sectorService
        const result = await getSectors(paginationParams, sortParams, filters);
        
        return {
          data: result.data || [],
          count: result.count || 0
        } as SectorDataResponse;
      } catch (error) {
        console.error('Error fetching sectors:', error);
        throw error;
      }
    }
  });

  return {
    sectorsData: data,
    isLoading,
    isError,
    refetch
  };
};
