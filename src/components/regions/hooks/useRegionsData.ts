
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
    // RegionWithStats[]
    try {
      const response = await getRegions(queryParams);
      
      // Əgər cavab formatı { data: RegionWithStats[], count: number } şəklindədirsə
      if (response && !Array.isArray(response) && 'data' in response && 'count' in response) {
        setTotalCount(response.count);
        return {
          data: response.data,
          count: response.count
        };
      }
      
      // Əgər cavab formatı sadəcə RegionWithStats[] şəklindədirsə
      if (Array.isArray(response)) {
        setTotalCount(response.length);
        return {
          data: response,
          count: response.length
        };
      }
      
      // Heç bir cavab alınmadığı halda
      return {
        data: [],
        count: 0
      };
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  };

  const { 
    data: result,
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: fetchRegions,
  });

  // Nəticələri düzgün formatda qaytarırıq
  const regions = result?.data || [];
  const count = result?.count || 0;

  // Sorğu parametrləri dəyişdikdə avtomatik olaraq regionları yeniləyirik
  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, sortColumn, sortDirection, filters, refetch]);

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
