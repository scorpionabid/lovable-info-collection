
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SchoolType {
  id: string;
  name: string;
  description?: string;
}

const fetchSchoolTypes = async (): Promise<SchoolType[]> => {
  const { data, error } = await supabase
    .from('school_types')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export default function useSchoolTypes() {
  const { data: schoolTypes = [], isLoading, error } = useQuery({
    queryKey: ['schoolTypes'],
    queryFn: fetchSchoolTypes
  });

  return {
    schoolTypes,
    isLoading,
    error
  };
}
