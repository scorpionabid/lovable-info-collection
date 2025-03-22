
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

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
      // Məktəb növlərini almaq üçün RPC funksiyasını çağırırıq
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
      // Bütün məktəb növlərini alaraq içərisindən istədiyimizi tapırıq
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        throw error;
      }
      
      if (!data || !Array.isArray(data)) return null;
      
      // ID-yə görə filtrlənir
      const schoolType = data.find(type => type.id === id);
      return schoolType || null;
    } catch (error) {
      console.error(`Error fetching school type with id ${id}:`, error);
      return null;
    }
  };

  // Bütün məktəb növləri üçün sorğu
  const allTypesQuery = useQuery({
    queryKey: ['school_types'],
    queryFn: fetchSchoolTypes,
    enabled: options?.enabled !== false && !options?.id
  });

  // Xüsusi bir məktəb növü üçün sorğu
  const singleTypeQuery = useQuery({
    queryKey: ['school_type', options?.id],
    queryFn: () => fetchSchoolTypeById(options?.id!),
    enabled: !!options?.id && options?.enabled !== false
  });

  // ID təqdim olunub-olunmamasına görə müvafiq sorğu nəticəsini qaytarırıq
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
