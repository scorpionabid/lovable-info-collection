
import { useState } from 'react';
import { FilterParams } from "@/services/supabase/regionService";

export const useRegionFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    completionRate: 'all'
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  return {
    showFilters,
    searchQuery,
    currentPage,
    filters,
    setCurrentPage,
    setShowFilters,
    handleSearchChange,
    handleApplyFilters,
    toggleFilters
  };
};
