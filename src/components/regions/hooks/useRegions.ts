
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegions, RegionWithStats, FilterParams } from '@/services/supabase/region/getRegions';

export const useRegions = (initialFilters: FilterParams = {}) => {
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: regions, isLoading, isError, refetch } = useQuery({
    queryKey: ['regions', filters, sortField, sortDirection, page, pageSize],
    queryFn: () => getRegions(
      filters,
      { column: sortField, direction: sortDirection },
      page,
      pageSize
    ),
    keepPreviousData: true,
  });

  // Ensure every region has a description property (fix for TS error)
  const regionsWithDescription = (regions || []).map(region => ({
    ...region,
    description: region.description || '',
    studentCount: region.studentCount || 0,
    teacherCount: region.teacherCount || 0
  }));

  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleSortChange = useCallback((field: string) => {
    setSortDirection(prev => (field === sortField && prev === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  }, [sortField]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  return {
    regions: regionsWithDescription,
    isLoading,
    isError,
    filters,
    sortField,
    sortDirection,
    page,
    pageSize,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handlePageSizeChange,
    refetch,
  };
};
