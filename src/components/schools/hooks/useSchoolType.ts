
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

export interface UseSchoolTypeOptions {
  typeId?: string;
  enabled?: boolean;
}

export const useSchoolType = (options: UseSchoolTypeOptions = {}) => {
  const { typeId, enabled = true } = options;

  const fetchSchoolType = async (): Promise<SchoolType | null> => {
    if (!typeId) return null;

    try {
      // Use the RPC function to get school types safely
      const { data, error } = await supabase
        .rpc('get_school_types');

      if (error) {
        console.error('Error fetching school type:', error);
        // Fallback to a mock school type for testing
        return {
          id: typeId,
          name: 'Unknown Type',
          description: ''
        };
      }
      
      // Find the school type with the matching ID
      if (data && Array.isArray(data)) {
        const schoolType = data.find(type => type.id === typeId);
        if (schoolType) {
          return {
            id: schoolType.id,
            name: schoolType.name,
            description: schoolType.description || ''
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching school type:', error);
      return null;
    }
  };

  return useQuery({
    queryKey: ['school_type', typeId],
    queryFn: fetchSchoolType,
    enabled: enabled && !!typeId,
  });
};

export default useSchoolType;
