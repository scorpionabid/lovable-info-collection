
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/supabase/client';
import { Region } from '../types';

export const useRegions = () => {
  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name, code, description')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
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
