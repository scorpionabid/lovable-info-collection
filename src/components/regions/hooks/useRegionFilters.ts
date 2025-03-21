
import { useState } from 'react';
import { FilterParams } from '@/supabase/types';

export const useRegionFilters = () => {
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    status: 'all',
  });

  const updateFilter = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters
  };
};

export default useRegionFilters;
