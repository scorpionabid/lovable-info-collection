
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SchoolFilter } from '@/services/supabase/school/types';

export const useSchoolFilters = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SchoolFilter>({});
  
  // Debounce search input to reduce API calls
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch) {
      setFilters(prev => ({ ...prev, search: debouncedSearch }));
      setCurrentPage(1); // Reset to first page on search
    } else {
      setFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters.search;
        return newFilters;
      });
    }
  }, [debouncedSearch]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleApplyFilters = (newFilters: SchoolFilter) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  return {
    currentPage,
    setCurrentPage,
    searchQuery,
    filters,
    handleSearchChange,
    handleApplyFilters
  };
};
