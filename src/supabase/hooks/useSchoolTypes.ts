
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

export interface SchoolType {
  id: string;
  name: string;
}

export interface UseSchoolTypeOptions {
  id?: string;
  enabled?: boolean;
}

export const useSchoolTypes = (options?: UseSchoolTypeOptions) => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // Use the stored procedure to get school types
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching school types:', error);
      return [];
    }
  };

  const fetchSchoolTypeById = async (id: string): Promise<SchoolType | null> => {
    try {
      const { data, error } = await supabase
        .from('school_types')
        .select('id, name')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching school type with id ${id}:`, error);
      return null;
    }
  };

  // Query for all school types
  const allTypesQuery = useQuery({
    queryKey: ['school_types'],
    queryFn: fetchSchoolTypes,
    enabled: options?.enabled !== false && !options?.id
  });

  // Query for specific school type
  const singleTypeQuery = useQuery({
    queryKey: ['school_type', options?.id],
    queryFn: () => fetchSchoolTypeById(options?.id!),
    enabled: !!options?.id && options?.enabled !== false
  });

  // Return the appropriate query result based on whether an ID was provided
  if (options?.id) {
    return {
      ...singleTypeQuery,
      schoolType: singleTypeQuery.data,
      schoolTypes: [] as SchoolType[]
    };
  } else {
    return {
      ...allTypesQuery,
      schoolTypes: allTypesQuery.data || [],
      schoolType: null as SchoolType | null
    };
  }
};
