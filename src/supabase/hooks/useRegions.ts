
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as regionsService from '../services/regions';
import { FilterParams, RegionWithStats, PaginationParams, SortParams } from '../types';

interface UseRegionsProps {
  initialFilters?: FilterParams;
  pagination?: PaginationParams;
  sort?: SortParams;
}

export const useRegions = (props?: UseRegionsProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterParams>(props?.initialFilters || {});
  const [pagination, setPagination] = useState<PaginationParams>(props?.pagination || { page: 1, pageSize: 10 });
  const [sort, setSort] = useState<SortParams>(props?.sort || { field: 'name', direction: 'asc' });

  // Query for fetching regions
  const { 
    data: regionsData,
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['regions', filters, pagination, sort],
    queryFn: async () => {
      const result = await regionsService.getRegions(filters, sort);
      return { 
        data: result, 
        count: result.length 
      };
    }
  });

  // Sort function
  const handleSort = useCallback((field: string) => {
    setSort(prevSort => {
      if (prevSort.field === field) {
        return { ...prevSort, direction: prevSort.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'asc' };
    });
  }, []);

  // Filter function
  const handleFilterChange = useCallback(<K extends keyof FilterParams>(key: K, value: FilterParams[K]) => {
    setFilters(prev => {
      // Reset to first page when filters change
      setPagination(prev => ({ ...prev, page: 1 }));
      return { ...prev, [key]: value };
    });
  }, []);

  // Pagination function
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Page size function
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination({ page: 1, pageSize: 10 });
    setSort({ field: 'name', direction: 'asc' });
  }, []);

  // Update filters if initialFilters prop changes
  useEffect(() => {
    if (props?.initialFilters && JSON.stringify(props.initialFilters) !== JSON.stringify(filters)) {
      setFilters(props.initialFilters);
    }
  }, [props?.initialFilters]);

  return {
    regions: regionsData?.data || [],
    count: regionsData?.count || 0,
    isLoading,
    isError,
    error,
    filters,
    sort,
    pagination,
    handleSort,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refetch,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: ['regions'] })
  };
};

export default useRegions;
