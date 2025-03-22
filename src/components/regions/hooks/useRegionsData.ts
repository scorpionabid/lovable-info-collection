
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/lib/supabase/services/regions';
import { RegionWithStats } from '@/lib/supabase/types/region';

export const useRegionsData = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({});

  // Sorğu parametrləri
  const queryParams = {
    ...filters,
    pageSize,
    page: currentPage,
    sortField: sortColumn,
    sortDirection,
  };

  // Sorğu funksiyası regionları və ümumi sayı qaytarır
  const fetchRegions = async () => {
    try {
      const response = await getRegions(queryParams);
      
      // Nəticələri düzgün formatda qaytarırıq
      // Əgər response bir array deyilsə və data və count xüsusiyyətləri varsa
      if (response && typeof response === 'object' && 'data' in response && 'count' in response) {
        const regionsData = response.data as RegionWithStats[];
        const totalCount = response.count as number;
        return { data: regionsData, count: totalCount };
      }
      
      // Əgər response birbaşa RegionWithStats[] arrayidirsə
      if (Array.isArray(response)) {
        return { data: response, count: response.length };
      }
      
      // Heç bir cavab alınmadığı halda boş nəticə qaytarırıq
      return { data: [] as RegionWithStats[], count: 0 };
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  };

  const { 
    data = { data: [] as RegionWithStats[], count: 0 }, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: fetchRegions,
  });

  // Nəticələri düzgün formatda qaytarırıq
  const regions = data?.data || [];
  const count = data?.count || 0;

  // Sort funksiyası
  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filterləri tətbiq et
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Filterlər dəyişdikdə ilk səhifəyə qayıt
  };

  return {
    regions,
    totalCount: count,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    sortColumn,
    sortDirection,
    handleSortChange,
    isLoading,
    isError,
    filters,
    handleApplyFilters,
    refetch,
  };
};

export default useRegionsData;
