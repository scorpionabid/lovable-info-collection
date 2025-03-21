
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterParams } from "@/services/supabase/region/types";
import regionService from "@/services/regionService";

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
    queryFn: () => regionService.getRegions(filters, { field: sortColumn, direction: sortDirection }),
  });

  return {
    regionsData,
    isLoading,
    isError,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
