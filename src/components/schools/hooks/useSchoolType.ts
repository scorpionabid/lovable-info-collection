
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { SchoolType } from '@/lib/supabase/types/school';

export function useSchoolType(id: string | undefined) {
  const fetchSchoolType = async (): Promise<SchoolType | null> => {
    if (!id) return null;
    
    try {
      // RPC funksiyası çağırmaq üçün
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) {
        return null;
      }
      
      // Məlumatları JSON Array olaraq qəbul edirik
      const schoolType = data.find((item: any) => item.id === id);
      
      if (!schoolType) {
        return null;
      }
      
      return {
        id: schoolType.id,
        name: schoolType.name,
        description: schoolType.description || '' // Əgər description gəlmirsə boş string istifadə edirik
      };
    } catch (error) {
      console.error(`Error fetching school type with ID ${id}:`, error);
      return null;
    }
  };

  return useQuery<SchoolType | null>({
    queryKey: ['schoolType', id],
    queryFn: fetchSchoolType,
    enabled: !!id // Yalnız ID mövcud olduqda sorğu göndərmək
  });
}

export default useSchoolType;
