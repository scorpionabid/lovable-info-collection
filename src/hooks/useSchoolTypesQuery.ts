
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

export function useSchoolTypesQuery() {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // Use a PostgreSQL function call instead of direct table access
      const { data, error } = await supabase
        .rpc('get_school_types');
      
      if (error) throw error;
      
      // Transform the data to match the SchoolType interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: '', // Default empty description as this field isn't returned by the RPC
      }));
    } catch (error) {
      console.error('Error fetching school types:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['schoolTypes'],
    queryFn: fetchSchoolTypes,
  });
}
