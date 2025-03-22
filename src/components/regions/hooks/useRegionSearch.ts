
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getRegions } from '@/lib/supabase/services/regions';
import { RegionWithStats } from '@/lib/supabase/types/region';

export const useRegionSearch = (initialQuery = '') => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [regions, setRegions] = useState<RegionWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const search = async (query: string) => {
    if (!query.trim()) {
      setRegions([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getRegions({ search: query });
      // Əgər bize [{data:..., count:...}] formatında qaytarırsa, uyğunlaşdırmaq:
      if (result && Array.isArray(result)) {
        setRegions(result);
      }
      // Əgər {data:..., count:...} formatında qaytarırsa:
      else if (result && 'data' in result) {
        setRegions(result.data);
      }
      // Başqa bir format gəlirsə:
      else {
        setRegions([]);
      }
    } catch (err) {
      console.error('Error searching regions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    search(debouncedSearchQuery);
  }, [debouncedSearchQuery]);
  
  return {
    searchQuery,
    setSearchQuery,
    regions,
    loading,
    error,
    search
  };
};

export default useRegionSearch;
