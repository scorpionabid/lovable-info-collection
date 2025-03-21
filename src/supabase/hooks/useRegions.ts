
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as regionsService from '../services/regions';
import type { RegionWithStats, Region } from '../types';

// Define FilterParams type for use with regions
export interface FilterParams {
  search?: string;
  status?: 'active' | 'archived' | 'all';
  dateFrom?: string;
  dateTo?: string;
  minCompletionRate?: number;
  maxCompletionRate?: number;
}

export const useRegions = (initialFilters?: FilterParams) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterParams>(initialFilters || {});
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    data: regions = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['regions', filters, sortField, sortDirection],
    queryFn: () => regionsService.getRegions(filters, { field: sortField || 'name', direction: sortDirection }),
    refetchOnWindowFocus: false
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = <K extends keyof FilterParams>(key: K, value: FilterParams[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSortField(null);
    setSortDirection('asc');
  };

  useEffect(() => {
    if (initialFilters && JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Process the data to ensure it has the expected structure
  const processedData = {
    data: Array.isArray(regions) 
      ? regions
      : Array.isArray(regions.data) 
        ? regions.data 
        : [],
    count: typeof regions.count === 'number' ? regions.count : (Array.isArray(regions) ? regions.length : 0)
  };

  return {
    regions: processedData,
    isLoading,
    isError,
    filters,
    sortField,
    sortDirection,
    handleSort,
    handleFilterChange,
    resetFilters,
    refetch,
    invalidateCache: () => queryClient.invalidateQueries({ queryKey: ['regions'] })
  };
};

export const useRegionsData = useRegions;
