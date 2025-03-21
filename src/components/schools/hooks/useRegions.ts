
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export const useRegions = () => {
  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name, code')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (!data) return [];
      
      // Map the data with safe defaults
      return data.map(region => ({
        id: region.id || '',
        name: region.name || '',
        code: region.code || '',
        description: '' // Default empty description
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
