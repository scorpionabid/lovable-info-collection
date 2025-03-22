
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchRegions } from '@/lib/supabase/services/regions';
import { RegionWithStats } from '@/lib/supabase/types/region';

export const useRegionSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [regions, setRegions] = useState<RegionWithStats[]>([]);

  // Debounce search input 
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchQuery]);

  // Fetch regions based on search query
  const { data, isLoading } = useQuery({
    queryKey: ['regionSearch', debouncedSearchQuery],
    queryFn: () => searchRegions(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length > 1,
  });

  useEffect(() => {
    if (data) {
      // Type assertion to ensure data is treated as RegionWithStats[]
      setRegions(data as RegionWithStats[]);
    }
  }, [data]);

  return {
    searchQuery,
    setSearchQuery,
    regions,
    isLoading,
  };
};

export default useRegionSearch;
