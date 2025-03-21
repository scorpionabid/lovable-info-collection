
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '@/supabase/types';

export interface UseSchoolTypeOptions {
  typeId?: string;
  enabled?: boolean;
}

export const useSchoolType = (options: UseSchoolTypeOptions = {}) => {
  const { typeId, enabled = true } = options;

  const fetchSchoolType = async (): Promise<SchoolType | null> => {
    if (!typeId) return null;

    try {
      // Call the stored function for getting school types
      const { data, error } = await supabase
        .rpc('get_school_types')
        .filter('id', 'eq', typeId)
        .maybeSingle();

      if (error) throw error;
      return data || null;
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
