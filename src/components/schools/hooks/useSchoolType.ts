
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { SchoolType } from '@/supabase/types/school';

export interface UseSchoolTypeOptions {
  typeId?: string;
  enabled?: boolean;
}

export const useSchoolType = (options: UseSchoolTypeOptions = {}) => {
  const { typeId, enabled = true } = options;

  const fetchSchoolType = async (): Promise<SchoolType | null> => {
    if (!typeId) return null;

    try {
      // Fetch from school_types table directly
      const { data, error } = await supabase
        .from('school_types')
        .select('id, name, description')
        .eq('id', typeId)
        .maybeSingle();

      if (error) throw error;
      return data as SchoolType;
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
