
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getRegions } from '@/services/supabase/region';

export const useRegionSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const regionsResult = await getRegions({
          search: debouncedSearchTerm,
          status: 'all',
        });
        
        // Handle the results
        if (Array.isArray(regionsResult)) {
          setResults(regionsResult);
        } else if (regionsResult && typeof regionsResult === 'object' && 'data' in regionsResult) {
          setResults(regionsResult.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error searching regions'));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
  };
};

export default useRegionSearch;
