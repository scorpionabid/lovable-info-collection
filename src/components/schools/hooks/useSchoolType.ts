
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
      // Use a direct SQL query using RPC
      const { data, error } = await supabase
        .rpc('get_school_type_by_id', { type_id: typeId });

      if (error) throw error;
      
      // Make sure we have valid data
      if (data && typeof data === 'object' && 'id' in data && 'name' in data) {
        return data as SchoolType;
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
