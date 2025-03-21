
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';

export const useRegions = () => {
  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name, description')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (!data) return [];
      
      // Map the data and ensure description is included
      return data.map(region => ({
        id: region.id || '',
        name: region.name || '',
        description: region.description || ''
      }));
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  };

  const { data: regions = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['regions_dropdown'],
    queryFn: fetchRegions
  });

  return { regions, isLoading, isError, refetch };
};
