
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectorWithStats, FilterParams, SortParams } from '@/services/supabase/sector/types';
import sectorService from '@/services/supabase/sectorService';

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
  const sortParams: SortParams = {
    column: sortColumn,
    direction: sortDirection
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors', currentPage, pageSize, sortParams, filters],
    queryFn: async () => {
      try {
        const result = await sectorService.getSectors({
          page: currentPage,
          pageSize: pageSize,
          sort: sortParams,
          filters: filters
        });

        return {
          data: result.data,
          count: result.count
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
