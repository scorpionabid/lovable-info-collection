
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/services/supabase/region';
import { RegionWithStats } from '@/lib/supabase/types';

interface UseRegionDataParams {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: {
    search: string;
    status: 'active' | 'inactive' | 'all';
  };
}

export const useRegionData = ({
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  filters
}: UseRegionDataParams) => {
  const fetchRegions = async () => {
    // Map UI filters to API filters
    const apiFilters = {
      search: filters.search,
      status: filters.status,
      page: currentPage,
      page_size: pageSize
    };

    try {
      return await getRegions(apiFilters);
    } catch (error) {
      console.error('Error fetching regions data:', error);
      throw error;
    }
  };

  const { 
    data = { data: [] as RegionWithStats[], count: 0 }, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: fetchRegions
  });

  return { 
    regionsData: data, 
    isLoading, 
    isError, 
    refetch 
  };
};
