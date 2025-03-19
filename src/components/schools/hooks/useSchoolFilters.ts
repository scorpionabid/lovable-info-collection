
import { useState, useCallback } from 'react';
import { SchoolFilter } from '@/services/supabase/school/types';

// Default empty filter
const defaultFilters: SchoolFilter = {
  search: '',
  region_id: '',
  sector_id: '',
  type_id: '',
  status: 'all',
  min_student_count: '',
  max_student_count: ''
};

export const useSchoolFilters = (initialFilters: SchoolFilter = defaultFilters) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SchoolFilter>(initialFilters);

  // Handler for search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset page when search changes
    
    // Update filters with search
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  }, []);

  // Handler for applying filters
  const handleApplyFilters = useCallback((newFilters: SchoolFilter) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page when filters change
  }, []);

  return {
    currentPage,
    searchQuery,
    filters,
    setCurrentPage,
    handleSearchChange,
    handleApplyFilters
  };
};
