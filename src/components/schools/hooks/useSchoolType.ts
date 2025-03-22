
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
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
      // Direct query to school_types table
      const { data, error } = await supabase
        .from('school_types')
        .select('*')
        .eq('id', typeId)
        .single();

      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description
        };
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
