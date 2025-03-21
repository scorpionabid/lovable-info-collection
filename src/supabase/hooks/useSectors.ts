
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { Sector } from '@/supabase/types';

interface UseSectorsOptions {
  regionId?: string;
  enabled?: boolean;
}

export const useSectors = (options: UseSectorsOptions = {}) => {
  const { regionId, enabled = true } = options;
  
  const fetchSectors = async (): Promise<Sector[]> => {
    try {
      let query = supabase.from('sectors').select('*').order('name');
      
      if (regionId) {
        query = query.eq('region_id', regionId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };
  
  return useQuery({
    queryKey: ['sectors', regionId],
    queryFn: fetchSectors,
    enabled: enabled
  });
};

export const useSectorsByRegion = (regionId?: string, enabled: boolean = true) => {
  return useSectors({ regionId, enabled });
};

export default useSectors;
