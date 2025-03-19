
import { useState } from 'react';
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

        return result || { data: [], count: 0 };
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
