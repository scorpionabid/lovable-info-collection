
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRegions } from '@/supabase/services/regions';
import type { RegionWithStats, FilterParams } from '@/supabase/types';

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
    queryFn: () => getRegions(filters, { field: sortField || 'name', direction: sortDirection }),
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

  return {
    regions,
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
