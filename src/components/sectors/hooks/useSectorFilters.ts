
import { useState, useCallback } from 'react';
import { FilterParams } from '@/services/supabase/sector/types';

export const useSectorFilters = (initialFilters: FilterParams) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  // Handler for search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset page when search changes
  }, []);

  // Handler for applying filters
  const handleApplyFilters = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page when filters change
  }, []);

  // Toggle filter panel visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    currentPage,
    searchTerm,
    filters,
    showFilters,
    setCurrentPage,
    handleSearchChange,
    handleApplyFilters,
    toggleFilters
  };
};
