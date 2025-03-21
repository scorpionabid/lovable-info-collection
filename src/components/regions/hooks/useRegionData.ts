
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterParams } from "@/supabase/types";
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
  
  const { 
    data: regionsData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: () => getRegions(
      filters, 
      { field: sortColumn, direction: sortDirection }
    ),
  });

  return {
    regionsData: { data: regionsData || [], count: regionsData?.length || 0 },
    isLoading,
    isError,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
