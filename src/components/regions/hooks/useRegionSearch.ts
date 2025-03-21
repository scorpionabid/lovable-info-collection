
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Region } from '@/supabase/types';
import { searchRegions } from '@/services/supabase/region'; // Make sure this exists

interface UseRegionSearchProps {
  initialValue?: string;
  delay?: number;
}

export const useRegionSearch = ({ initialValue = '', delay = 300 }: UseRegionSearchProps = {}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Region[]>([]);
  const debouncedQuery = useDebounce(searchQuery, delay);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await searchRegions(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching regions:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    results
  };
};

export default useRegionSearch;
