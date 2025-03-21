
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase/supabaseClient';

// Fetch regions for dropdowns and filtering
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
      
      return data.map(region => ({
        id: region.id,
        name: region.name,
        code: region.code || '',
        description: '' // Adding description to satisfy type requirements
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
