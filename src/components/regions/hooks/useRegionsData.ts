
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/lib/supabase/services/regions';
import { RegionWithStats, RegionFilters } from '@/lib/supabase/types/region';
import { PaginatedResult } from '@/lib/supabase/types';

interface UseRegionsDataProps {
  initialFilters?: RegionFilters;
  initialPage?: number;
  initialPageSize?: number;
  initialSortColumn?: string;
  initialSortDirection?: 'asc' | 'desc';
}

export const useRegionsData = ({
  initialFilters = { status: 'active' },
  initialPage = 1,
  initialPageSize = 10,
  initialSortColumn = 'name',
  initialSortDirection = 'asc'
}: UseRegionsDataProps = {}) => {
  const [filters, setFilters] = useState<RegionFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortColumn, setSortColumn] = useState(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery<PaginatedResult<RegionWithStats>>({
    queryKey: ['regions', filters, currentPage, pageSize, sortColumn, sortDirection],
    queryFn: () => getRegions({
      ...filters,
      page: currentPage,
      page_size: pageSize,
      field: sortColumn,
      direction: sortDirection
    }),
    keepPreviousData: true,
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (newFilters: RegionFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  return {
    regions: data?.data || [],
    totalCount: data?.count || 0,
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
