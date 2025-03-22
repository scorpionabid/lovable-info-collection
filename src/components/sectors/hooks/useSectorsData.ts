
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectorWithStats } from '@/lib/supabase/types/sector';
import { toast } from 'sonner';

// Sektorlar üçün ilkin datasını gətirən hook
export const useSectorsData = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    search: '',
    region_id: '',
    status: 'active' as 'active' | 'inactive' | 'all',
    dateFrom: '',
    dateTo: '',
    min_completion_rate: undefined as number | undefined,
    max_completion_rate: undefined as number | undefined
  });

  // Simulated data for development purposes
  const mockSectors: SectorWithStats[] = [];
  for (let i = 1; i <= 20; i++) {
    mockSectors.push({
      id: `sector-${i}`,
      name: `Sektor ${i}`,
      region_id: `region-${Math.ceil(i / 3)}`,
      code: `S${i.toString().padStart(3, '0')}`,
      description: `Sektor ${i} təsviri`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      schoolCount: Math.floor(Math.random() * 30) + 5,
      completionRate: Math.floor(Math.random() * 100),
      schools_count: Math.floor(Math.random() * 30) + 5,
      completion_rate: Math.floor(Math.random() * 100),
      region: `Region ${Math.ceil(i / 3)}`
    });
  }

  // Sektorları fetch edən query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: async () => {
      // Development üçün Mock Datanı qaytarırıq
      // Əsl istehsal mühitində burada API sorğusu göndəriləcək
      return {
        data: [...mockSectors].slice((currentPage - 1) * pageSize, currentPage * pageSize),
        count: mockSectors.length
      };
    },
    staleTime: 60000, // 1 dəqiqə
  });

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Filtrlər dəyişdikdə birinci səhifəyə qayıt
  };

  useEffect(() => {
    // Component yüklənəndə sektorları yüklə
  }, []);

  return {
    sectors: data?.data || [],
    totalCount: data?.count || 0,
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
    refetch
  };
};
