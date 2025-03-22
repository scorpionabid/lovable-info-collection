
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/services/supabase/region';
import { FilterParams, SortParams } from '@/lib/supabase/types';
import { Region, RegionWithStats } from '@/lib/supabase/types/region';

interface PaginatedResult<T> {
  data: T[];
  count: number;
}

export const useRegionsData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterParams>({
    status: 'active',
  });

  // Wrap the API call to transform the result into PaginatedResult format
  const fetchRegions = async (): Promise<PaginatedResult<RegionWithStats>> => {
    const sortParams: SortParams = {
      column: sortColumn,
      direction: sortDirection
    };

    // Request regions with pagination and sorting
    const regionsData = await getRegions({
      ...filters,
      page: currentPage,
      pageSize: pageSize
    }, sortParams);

    // If the API doesn't return paginated result already, transform it
    if (Array.isArray(regionsData)) {
      return {
        data: regionsData,
        count: regionsData.length // This is a simplification
      };
    }

    // If already in the correct format (has data and count properties)
    if (regionsData && typeof regionsData === 'object' && 'data' in regionsData && 'count' in regionsData) {
      return regionsData as PaginatedResult<RegionWithStats>;
    }

    // Default empty result
    return { data: [], count: 0 };
  };

  // Use React Query for data fetching
  const { 
    data: paginatedResult = { data: [], count: 0 }, 
    isLoading, 
    isError,
    refetch
  } = useQuery<PaginatedResult<RegionWithStats>, Error>({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: fetchRegions,
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return {
    regions: paginatedResult.data || [],
    totalCount: paginatedResult.count || 0,
    isLoading,
    isError,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
    setCurrentPage,
    setPageSize,
    handleSortChange,
    handleFilterChange,
    refetch
  };
};

export default useRegionsData;
