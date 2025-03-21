
import { useQuery } from '@tanstack/react-query';
import { getSchools } from '@/services/supabase/school/queries/schoolQueries';
import { SchoolFilter, SchoolSortParams } from '@/services/supabase/school/types';

interface UseSchoolDataParams {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: Omit<SchoolFilter, 'page' | 'pageSize' | 'sort_field' | 'sort_direction'>;
}

export const useSchoolData = ({
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  filters
}: UseSchoolDataParams) => {
  // Create a properly typed filter object
  const transformedFilters: SchoolFilter = {
    ...filters,
    page: currentPage,
    pageSize,
    sort_field: sortColumn,
    sort_direction: sortDirection,
    sort: {
      field: sortColumn,
      direction: sortDirection
    }
  };

  return useQuery({
    queryKey: ['schools', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: async () => {
      try {
        // Get schools with the transformed filters
        const schools = await getSchools(transformedFilters);
        
        // Manually add count for pagination until backend supports it properly
        // In a production app, this count would come from the backend
        return {
          data: schools,
          count: 100, // Placeholder total count - replace with actual API value when available
          error: null
        };
      } catch (error) {
        console.error('Error fetching schools:', error);
        return {
          data: [],
          count: 0,
          error
        };
      }
    }
  });
};
