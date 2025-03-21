
import { useSectorsByRegion } from '@/supabase/hooks/useSectors';

export const useSectors = (regionId: string) => {
  const { sectors, isLoading, error } = useSectorsByRegion(regionId);
  
  return {
    sectors,
    isLoading,
    error
  };
};

export default useSectors;
