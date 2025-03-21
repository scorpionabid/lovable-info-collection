
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export const useSectors = (regionId: string) => {
  const fetchSectors = async () => {
    if (!regionId) return [];
    
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('region_id', regionId)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data?.map(sector => ({
        id: sector.id,
        name: sector.name,
        description: '' // Default empty description
      })) || [];
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };

  const { data: sectors = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors_dropdown', regionId],
    queryFn: fetchSectors,
    enabled: !!regionId,
  });

  return { sectors, isLoading, isError, refetch };
};
