
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
          // Convert to RegionWithStats and add missing required properties
          const regionsWithStats = results.map(region => ({
            ...region,
            sectorCount: 0,
            schoolCount: 0,
            completionRate: 0,
            studentCount: 0, // Add required fields
            teacherCount: 0, // Add required fields
            description: region.description || '' // Add required field
          } as RegionWithStats));
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
