
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterParams, SortParams, PaginationParams, RegionWithStats, PaginatedResult } from "@/supabase/types";
import { getRegions } from "@/supabase/services/regions";

interface UseRegionDataProps {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: FilterParams;
}

export const useRegionData = ({ 
  currentPage, 
  pageSize, 
  sortColumn, 
  sortDirection, 
  filters 
}: UseRegionDataProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortParams: SortParams = {
    field: sortColumn,
    direction: sortDirection
  };
  
  const paginationParams: PaginationParams = {
    page: currentPage,
    pageSize
  };
  
  const { 
    data: regionsResponse, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<PaginatedResult<RegionWithStats>>({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: () => getRegions(filters, sortParams, paginationParams),
  });

  return {
    regionsData: regionsResponse || { data: [], count: 0 },
    isLoading,
    isError,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
