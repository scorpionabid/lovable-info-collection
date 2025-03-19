
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { School, SchoolFilter } from '@/services/supabase/school/types';
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
  const sortParams = {
    field: sortColumn,
    direction: sortDirection
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['schools', currentPage, pageSize, sortParams, filters],
    queryFn: async () => {
      try {
        const result = await schoolService.getSchools({
          page: currentPage,
          pageSize: pageSize,
          sort: sortParams,
          filters: filters
        });

        return {
          data: result.data || [],
          count: result.count || 0
        } as SchoolDataResponse;
      } catch (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
    }
  });

  return {
    schoolsData: data,
    isLoading,
    isError,
    refetch
  };
};
