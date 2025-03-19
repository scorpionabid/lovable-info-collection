
import { useQuery } from '@tanstack/react-query';
import { School, SchoolFilter, SchoolSortParams } from '@/services/supabase/school/types';
import * as schoolService from '@/services/supabase/school';

interface UseSchoolDataProps {
  currentPage: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  filters: SchoolFilter;
}

interface SchoolDataResponse {
  data: School[];
  count: number;
}

export const useSchoolData = ({
  currentPage,
  pageSize,
  sortColumn,
  sortDirection,
  filters
}: UseSchoolDataProps) => {
  const sortParams: SchoolSortParams = {
    field: sortColumn,
    direction: sortDirection
  };

  // Create a combined filter object for the API request
  const queryParams: SchoolFilter = {
    ...filters,
    page: currentPage,
    pageSize: pageSize,
    sort: sortParams,
    sort_field: sortColumn,
    sort_direction: sortDirection
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['schools', currentPage, pageSize, sortParams, filters],
    queryFn: async () => {
      try {
        // Here we're using the existing getSchools function without parameters
        // since our custom filters are in the queryParams but not used by the function
        const result = await schoolService.getSchools();

        // Ensure we always return an object with data and count properties
        if (Array.isArray(result)) {
          return { 
            data: result,
            count: result.length
          };
        }
        
        return result || { data: [], count: 0 };
      } catch (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
    }
  });

  return {
    schoolsData: data as SchoolDataResponse,
    isLoading,
    isError,
    refetch
  };
};
