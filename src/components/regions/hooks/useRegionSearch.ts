
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
// searchRegions eksport edilmədiyindən onu daxil etmirik
// bunun əvəzinə getRegions funksiyasını istifadə edirik
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
        // searchRegions funksiyası olmadığı üçün, bunun əvəzinə getRegions istifadə edirik
        const data = await getRegions({
          search: debouncedSearchTerm,
          status: 'all',
        });
        
        if (Array.isArray(data)) {
          setResults(data);
        } else if (data && 'data' in data) {
          setResults(data.data);
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
