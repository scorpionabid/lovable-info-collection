
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

export function useSchoolType(id: string | undefined) {
  const fetchSchoolType = async (): Promise<SchoolType | null> => {
    if (!id) return null;
    
    try {
      // RPC funksiyası ilə məlumatları əldə edirik
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      // Əgər məlumat yoxdursa, null qaytarırıq
      if (!data || !Array.isArray(data)) {
        return null;
      }
      
      // Verilmiş ID ilə məktəb növünü tapırıq
      const schoolType = data.find((item: any) => item.id === id);
      
      if (!schoolType) {
        return null;
      }
      
      return {
        id: schoolType.id,
        name: schoolType.name,
        description: schoolType.description || ''
      };
    } catch (error) {
      console.error(`Error fetching school type with ID ${id}:`, error);
      return null;
    }
  };

  return useQuery<SchoolType | null>({
    queryKey: ['schoolType', id],
    queryFn: fetchSchoolType,
    enabled: !!id // Yalnız ID mövcud olduqda sorğu göndəririk
  });
}

export default useSchoolType;
