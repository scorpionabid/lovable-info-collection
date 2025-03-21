
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Region {
  id: string;
  name: string;
  description?: string;
}

const fetchRegions = async (): Promise<Region[]> => {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return (data || []).map(region => ({
    ...region,
    description: region.description || '' // Ensure description is not undefined
  }));
};

export default function useRegions() {
  const { data: regions = [], isLoading, error } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegions
  });

  return {
    regions,
    isLoading,
    error
  };
}
