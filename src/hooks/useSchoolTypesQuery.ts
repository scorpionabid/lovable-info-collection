
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

export const useSchoolTypesQuery = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // RPC funksiyası ilə məlumatları əldə edirik
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      // Əgər məlumat yoxdursa və ya array deyilsə, boş array qaytarırıq
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Məlumatları SchoolType formatına çeviririk
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || ''
      }));
    } catch (error) {
      console.error("Error fetching school types:", error);
      return [];
    }
  };

  return useQuery<SchoolType[]>({
    queryKey: ["schoolTypesQuery"],
    queryFn: fetchSchoolTypes,
  });
};

export default useSchoolTypesQuery;
