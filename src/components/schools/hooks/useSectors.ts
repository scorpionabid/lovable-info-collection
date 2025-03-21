
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Sector {
  id: string;
  name: string;
  region_id: string;
  description?: string;
}

const fetchSectors = async (regionId?: string): Promise<Sector[]> => {
  let query = supabase.from('sectors').select('*');
  
  if (regionId) {
    query = query.eq('region_id', regionId);
  }
  
  query = query.order('name');
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return (data || []).map(sector => ({
    ...sector,
    description: sector.description || '' // Ensure description is not undefined
  }));
};

export default function useSectors(regionId?: string) {
  const { data: sectors = [], isLoading, error } = useQuery({
    queryKey: ['sectors', regionId],
    queryFn: () => fetchSectors(regionId),
    enabled: !!regionId
  });

  return {
    sectors,
    isLoading,
    error
  };
}
