
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/supabaseClient';

// Fetch sectors based on selected region
export const useSectors = (regionId?: string) => {
  const fetchSectors = async () => {
    try {
      let query = supabase.from('sectors').select('id, name, region_id, code');
      
      if (regionId) {
        query = query.eq('region_id', regionId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        throw error;
      }
      
      return data.map(sector => ({
        id: sector.id,
        name: sector.name,
        region_id: sector.region_id,
        description: '', // Adding description to satisfy type requirements
        archived: false  // Adding archived to satisfy type requirements
      }));
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };

  const { data: sectors = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors_dropdown', regionId],
    queryFn: fetchSectors,
    enabled: !!regionId
  });

  return { sectors, isLoading, isError, refetch };
};
