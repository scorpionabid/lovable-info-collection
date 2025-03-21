
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '@/supabase/types/school';

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      const { data, error } = await supabase
        .from('school_types')
        .select('id, name, description')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return (data || []) as SchoolType[];
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
