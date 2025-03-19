
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import regionService, { RegionWithStats } from '@/services/supabase/region';

export const useRegionSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<RegionWithStats[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce delay

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        try {
          const results = await regionService.searchRegions(debouncedSearchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching regions:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching
  };
};
