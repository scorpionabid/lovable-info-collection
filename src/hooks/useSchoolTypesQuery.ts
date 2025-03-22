
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

/**
 * Custom hook to fetch school types with proper typing
 */
export const useSchoolTypesQuery = () => {
  return useQuery({
    queryKey: ['schoolTypes'],
    queryFn: async (): Promise<SchoolType[]> => {
      try {
        // Query the school_types table directly
        const { data, error } = await supabase
          .from('school_types')
          .select('*')
          .order('name');

        if (error) {
          throw new Error(`Error fetching school types: ${error.message}`);
        }

        // Map the response to the SchoolType interface
        return (data || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || ''
        }));
      } catch (error) {
        console.error('Error in useSchoolTypesQuery:', error);
        throw error;
      }
    }
  });
};
