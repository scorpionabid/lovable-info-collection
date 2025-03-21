
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

export const useSectors = (regionId: string) => {
  const fetchSectors = async () => {
    if (!regionId) return [];
    
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name, code, description')
        .eq('region_id', regionId)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
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
