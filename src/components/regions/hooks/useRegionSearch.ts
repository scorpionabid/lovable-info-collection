
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
          // Convert Region[] to RegionWithStats[]
          const regionsWithStats = results.map(region => ({
            ...region,
            sectors_count: 0,
            schools_count: 0,
            completion_rate: 0,
            sectorCount: 0,
            schoolCount: 0,
            completionRate: 0
          }));
          setSearchResults(regionsWithStats);
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
