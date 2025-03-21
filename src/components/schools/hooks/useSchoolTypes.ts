
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '@/supabase/types/school';

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // Use a direct SQL query using RPC
      const { data, error } = await supabase
        .rpc('get_school_types');

      if (error) throw error;
      
      // Make sure we have valid data
      if (data && Array.isArray(data)) {
        return data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || ''
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching school types:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['school_types'],
    queryFn: fetchSchoolTypes
  });
};

export default useSchoolTypes;
