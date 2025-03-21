
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '../types';

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // Use the stored procedure to get school types
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching school types:', error);
      return [];
    }
  };

  const { data: schoolTypes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['school_types'],
    queryFn: fetchSchoolTypes
  });

  return { schoolTypes, isLoading, isError, refetch };
};
