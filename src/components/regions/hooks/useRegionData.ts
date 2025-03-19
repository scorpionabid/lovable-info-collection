
import { useQuery } from '@tanstack/react-query';
import { FilterParams, SortConfig } from "@/services/supabase/region";
import regionService from "@/services/supabase/region";

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
  const { 
    data: regionsData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: () => regionService.getRegions(
      { page: currentPage, pageSize },
      { field: sortColumn, direction: sortDirection }, // Use field instead of column
      filters
    ),
  });

  return {
    regionsData,
    isLoading,
    isError,
    refetch
  };
};
