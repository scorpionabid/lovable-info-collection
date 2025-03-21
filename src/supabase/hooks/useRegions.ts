
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRegions, 
  getRegionById, 
  createRegion, 
  updateRegion, 
  deleteRegion,
  getRegionsForDropdown
} from '../services/regions';
import { useState } from 'react';
import { 
  Region, 
  RegionWithStats, 
  CreateRegionDto, 
  UpdateRegionDto, 
  PaginationParams,
  RegionFilters
} from '../types';
import { toast } from 'sonner';

export const useRegions = (filters: Partial<PaginationParams & RegionFilters> = {}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const queryClient = useQueryClient();
  
  const queryParams = {
    page: currentPage,
    pageSize,
    search: searchQuery,
    ...filters
  };
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['regions', queryParams, sortField, sortDirection],
    queryFn: () => getRegions(queryParams, sortField, sortDirection),
  });
  
  const createMutation = useMutation({
    mutationFn: (data: CreateRegionDto) => createRegion(data),
    onSuccess: () => {
      toast.success('Region created successfully');
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: (error: any) => {
      toast.error(`Error creating region: ${error.message}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegionDto }) => 
      updateRegion(id, data),
    onSuccess: () => {
      toast.success('Region updated successfully');
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating region: ${error.message}`);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRegion(id),
    onSuccess: () => {
      toast.success('Region deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['regions'] });
    },
    onError: (error: any) => {
      toast.error(`Error deleting region: ${error.message}`);
    }
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const invalidateCache = async () => {
    await queryClient.invalidateQueries({ queryKey: ['regions'] });
    return refetch();
  };
  
  return {
    regions: data?.data || [],
    count: data?.count || 0,
    isLoading,
    isError,
    filters: { ...queryParams },
    sortField,
    sortDirection,
    handleSearch,
    handleSort,
    setCurrentPage,
    setPageSize,
    createRegion: createMutation.mutate,
    updateRegion: updateMutation.mutate,
    deleteRegion: deleteMutation.mutate,
    invalidateCache
  };
};

// Hook for dropdowns
export const useRegionsDropdown = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['regions-dropdown'],
    queryFn: getRegionsForDropdown,
  });

  return {
    regions: data || [],
    isLoading,
    error
  };
};

// Hook for getting a single region
export const useRegion = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['region', id],
    queryFn: () => getRegionById(id),
    enabled: !!id,
  });

  return {
    region: data as RegionWithStats | undefined,
    isLoading,
    isError
  };
};
