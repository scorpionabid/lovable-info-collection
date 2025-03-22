
import { useSectorsByRegion } from '@/lib/supabase/hooks/useSectors';
import { Sector } from '@/lib/supabase/types/sector';

export const useSectors = (regionId: string) => {
  const { data, isLoading, error } = useSectorsByRegion(regionId);
  
  return {
    sectors: data || [] as Sector[],
    isLoading,
    error
  };
};

export default useSectors;
