
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('school_types')
        .select('id, name, description')
        .order('name');
      
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
