
import { useState } from 'react';

export const useSectorFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const applyFilters = (filters: any) => {
    // Filters-ı tətbiq et - sektor listesində filtrləmə funksiyası
    console.log('Applying filters:', filters);
  };

  return {
    searchQuery,
    handleSearchChange,
    applyFilters
  };
};
