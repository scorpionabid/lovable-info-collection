
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { SchoolType } from '@/lib/supabase/types/school';

export const useSchoolTypes = () => {
  const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
    try {
      // RPC funksiyası çağırmaq üçün
      const { data, error } = await supabase.rpc('get_school_types');
      
      if (error) {
        console.error('Error fetching school types:', error);
        throw error;
      }
      
      // Əgər data yoxdursa və ya array deyilsə, boş array qaytaraq
      if (!data || !Array.isArray(data)) {
        return [];
      }
      
      // Məlumatları SchoolType formatına çevirmək
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
    queryKey: ["schoolTypes"],
    queryFn: fetchSchoolTypes,
  });
};

export default useSchoolTypes;
