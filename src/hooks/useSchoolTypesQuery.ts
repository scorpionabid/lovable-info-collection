
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

export function useSchoolTypesQuery() {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // RPC funksiyası çağırmaq üçün
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // RPC cavabını SchoolType[] formatına dəyişmək
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '' // Əgər description gəlmirsə boş string istifadə edirik
      }));
    } catch (error) {
      console.error('Error fetching school types:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['schoolTypes'],
    queryFn: fetchSchoolTypes
  });
}

export default useSchoolTypesQuery;
