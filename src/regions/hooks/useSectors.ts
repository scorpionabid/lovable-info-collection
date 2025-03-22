
import { useSectorsByRegion } from '@/lib/supabase/hooks/useSectors';

export const useSectors = (regionId: string) => {
  const { data: sectors, isLoading, error } = useSectorsByRegion(regionId);
  
  return {
    sectors,
    isLoading,
    error
  };
};

export default useSectors;
