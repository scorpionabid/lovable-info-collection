
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; 
import { RegionWithStats } from '@/services/supabase/region';
import regionService from '@/services/supabase/region';

export const useRegionSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<RegionWithStats[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults([]);
      return;
    }

    const searchRegions = async () => {
      setIsSearching(true);
      try {
        const results = await regionService.searchRegionsByName(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching regions:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchRegions();
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
  };
};
