
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // Use the RPC function instead of direct table access
      const { data, error } = await supabase
        .rpc('get_school_types');

      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      // Map the raw data to the SchoolType interface
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
