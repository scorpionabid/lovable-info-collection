import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SectorTable } from './SectorTable';
import { SectorFilterPanel } from './SectorFilterPanel';
import { SectorModal } from './SectorModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload, AlertTriangle } from "lucide-react";
import { FilterParams } from "@/services/supabase/sector/types";
import { getSectors } from "@/services/supabase/sector/querySectors";
import { useToast } from "@/hooks/use-toast";
import { fileExport } from "@/utils/fileExport";
import { useLogger } from '@/hooks/useLogger';
import { useDebounce } from '@/hooks/useDebounce';
import { checkConnection } from '@/integrations/supabase/client';
import { useQueryWithPerformance } from '@/hooks/useQueryWithPerformance';

// Sabit dəyərlər üçün genişləndirilə bilən konstant obyekt
const CONSTANTS = {
  INITIAL_PAGE: 1,
  PAGE_SIZE: 5, // Daha az məlumat yükləmək üçün azaldılıb
  DEFAULT_SORT_COLUMN: 'name',
  DEFAULT_SORT_DIRECTION: 'asc' as const,
  STALE_TIME: 5 * 60 * 1000, // 5 dəqiqə - daha uzun stale time
  CACHE_TIME: 10 * 60 * 1000, // 10 dəqiqə - daha uzun cache time
  RETRY_COUNT: 1,
  DEBOUNCE_DELAY: 300,
  INITIAL_FETCH_SIZE: 5, // İlk yükləmə üçün daha az məlumat
};

// Filtr üçün başlanğıc dəyərlər
const INITIAL_FILTERS: FilterParams = {
  searchQuery: '',
  regionId: '',
  dateFrom: '',
  dateTo: '',
  completionRate: 'all',
};

export const SectorsOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logger = useLogger('SectorsOverview');
  
  // Reducer əvəzinə useState istifadə edirik, amma daha təşkilatlı şəkildə
  // UI controls
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounce(searchQuery, CONSTANTS.DEBOUNCE_DELAY);
  
  // Pagination və sorting
  const [currentPage, setCurrentPage] = useState(CONSTANTS.INITIAL_PAGE);
  const [pageSize] = useState(CONSTANTS.PAGE_SIZE);
  const [sortColumn, setSortColumn] = useState(CONSTANTS.DEFAULT_SORT_COLUMN);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(CONSTANTS.DEFAULT_SORT_DIRECTION);
  
  // Filtrlər
  const [filters, setFilters] = useState<FilterParams>(INITIAL_FILTERS);

  // useEffect yerinə useLogger hook istifadə edə bilərik
  useEffect(() => {
    logger.info('SectorsOverview component initialized', {
      initialPage: currentPage,
      sortColumn,
      sortDirection,
      filtersApplied: Object.keys(filters).filter(key => !!filters[key as keyof FilterParams]).length > 0
    });
    
    // Bu useEffect yalnız komponent mount olduqda işləməlidir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sorğu açarını useMemo ilə optimallaşdırırıq - daha strukturlu şəkildə
  const queryKey = useMemo(() => [
    'sectors', 
    {
      pagination: { page: currentPage, pageSize },
      sort: { column: sortColumn, direction: sortDirection },
      filters: { ...filters, searchQuery: debouncedSearchQuery }
    }
  ], [currentPage, pageSize, sortColumn, sortDirection, filters, debouncedSearchQuery]);

  // Query funksiyasını useCallback ilə optimallaşdırırıq
  const queryFn = useCallback(async () => {
    logger.info('Fetching sectors with params', { 
      pagination: { page: currentPage, pageSize },
      sort: { column: sortColumn, direction: sortDirection },
      filters: { ...filters, searchQuery: debouncedSearchQuery }
    });
    
    try {
      return await getSectors(
        { page: currentPage, pageSize },
        { column: sortColumn, direction: sortDirection },
        { ...filters, searchQuery: debouncedSearchQuery }
      );
    } catch (err) {
      logger.error('Error fetching sectors', err);
      throw err;
    }
  }, [currentPage, pageSize, sortColumn, sortDirection, filters, debouncedSearchQuery, logger]);

  // Yüklənmə vəziyyəti üçün skeleton komponent - useMemo ilə optimallaşdırılıb
  const LoadingSkeleton = useMemo(() => {
    return () => (
      <div className="space-y-2">
        {Array(CONSTANTS.PAGE_SIZE).fill(0).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }, []);

  // Performans monitorinqi ilə genişləndirilmiş React Query hook
  const { 
    data: sectorsResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    status,
    isFetching
  } = useQueryWithPerformance('getSectors', {
    queryKey,
    queryFn,
    staleTime: CONSTANTS.STALE_TIME,
    gcTime: CONSTANTS.CACHE_TIME, // cacheTime əvəzinə gcTime istifadə edilir
    retry: 1, // Retry sayını azaldırıq ki, daha tez xəta alınsın
    retryDelay: (attemptIndex) => 1000, // Sabit gecikmə ilə yenidən cəhd
    refetchOnWindowFocus: false, // Pəncərə fokusunda avtomatik yeniləməni söndürmək
    placeholderData: (previousData) => previousData, // keepPreviousData əvəzinə placeholderData istifadə edilir
  });

  // Xəta və status dəyişliklərini izləmək
  useEffect(() => {
    logger.info(`Query status changed: ${status}`, {
      hasData: !!sectorsResponse,
      dataCount: sectorsResponse?.data?.length || 0,
      isLoading,
      isError
    });
    
    if (isError && error) {
      // Xəta məlumatlarını daha ətraflı loqlayaq
      logger.error('Error fetching sectors', {
        error,
        message: error instanceof Error ? error.message : 'Naməlum xəta',
        stack: error instanceof Error ? error.stack : undefined,
        status,
        queryKey: JSON.stringify(queryKey)
      });
      
      // Bağlantı xətasını yoxlayaq
      checkConnection()
        .then(isConnected => {
          if (!isConnected) {
            toast({
              title: "Supabase bağlantısı mövcud deyil",
              description: "Serverin bağlantısını yoxlayın və yenidən cəhd edin",
              variant: "destructive",
            });
          } else {
            // Xətanın növünü yönləndirək
            const errorMessage = error instanceof Error ? error.message : 'Naməlum xəta';
            
            // Vaxt aşımı xətasını yönləndirək
            if (errorMessage.includes('timeout')) {
              toast({
                title: "Sorğu vaxt aşımına uğradı",
                description: "Sorğu çox uzun çəkdi. Əlaqənizi yoxlayın və ya daha az məlumat yükləməyə çalışın.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Sektor məlumatları yüklənərkən xəta baş verdi",
                description: errorMessage,
                variant: "destructive",
              });
            }
          }
        });
        
      // 5 saniyə sonra avtomatik yenidən cəhd etməyək
      const retryTimer = setTimeout(() => {
        logger.info('Attempting automatic retry after error');
        refetch();
      }, 5000);
      
      // Komponent unmount olduqda timer'i təmizləyək
      return () => clearTimeout(retryTimer);
    }
  }, [status, sectorsResponse, isLoading, isError, error, toast, logger]);

  // Event handler'ları useCallback ilə optimallaşdırırıq
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterParams) => {
    logger.info('Applying new filters', { 
      previousFilters: filters,
      newFilters 
    });
    
    setFilters(newFilters);
    setCurrentPage(CONSTANTS.INITIAL_PAGE); // Reset to first page when filters change
    setShowFilters(false);
  }, [filters, logger]);

  const handleSortChange = useCallback((column: string) => {
    logger.info(`Sorting changed: column=${column}, current=${sortColumn}, direction=${sortDirection}`);
    
    setSortColumn(prevColumn => {
      if (prevColumn === column) {
        // Direction dəyişir əgər eyni sütundursa
        setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        return prevColumn;
      } else {
        // Yeni sütun, standard 'asc' yönü
        setSortDirection('asc');
        return column;
      }
    });
  }, [sortColumn, sortDirection, logger]);

  // Yeniləmə, toast ilə birlikdə
  const handleRefresh = useCallback(() => {
    logger.info('Manual refresh triggered');
    
    // Show loading toast
    const toastId = toast({
      title: "Məlumatlar yenilənir",
      description: "Sektor siyahısı yenilənir...",
    });
    
    // Force refetch with invalidation
    queryClient.invalidateQueries({ queryKey: ['sectors'] });
    refetch()
      .then(() => {
        toast({
          title: "Məlumatlar yeniləndi",
          description: "Sektor siyahısı uğurla yeniləndi",
        });
      })
      .catch(err => {
        logger.error('Error during manual refresh', err);
        toast({
          title: "Yeniləmə zamanı xəta",
          description: err instanceof Error ? err.message : 'Naməlum xəta',
          variant: "destructive",
        });
      });
  }, [queryClient, refetch, toast, logger]);

  // Data export funksiyası
  const handleExport = useCallback(() => {
    if (!sectorsResponse || !sectorsResponse.data || sectorsResponse.data.length === 0) {
      logger.warn('Export attempted with no data');
      toast({
        title: "İxrac ediləcək məlumat yoxdur",
        description: "Sektor siyahısında məlumat tapılmadı",
        variant: "destructive",
      });
      return;
    }

    logger.info(`Exporting ${sectorsResponse.data.length} sectors`);
    
    try {
      const exportData = sectorsResponse.data.map(sector => ({
        'Ad': sector.name || 'N/A',
        'Təsvir': sector.description || '',
        'Region': sector.regionName || '',
        'Məktəb sayı': sector.schoolCount || 0,
        'Doldurma faizi': `${sector.completionRate || 0}%`,
        'Yaradılma tarixi': sector.created_at 
          ? new Date(sector.created_at).toLocaleDateString('az-AZ') 
          : 'N/A'
      }));

      fileExport({
        data: exportData,
        fileName: 'Sektorlar',
        fileType: 'xlsx'
      });

      toast({
        title: "İxrac əməliyyatı uğurla tamamlandı",
        description: "Məlumatlar Excel formatında ixrac edildi",
      });
    } catch (err) {
      logger.error('Error exporting sectors', err);
      toast({
        title: "İxrac zamanı xəta",
        description: err instanceof Error ? err.message : 'Naməlum xəta',
        variant: "destructive",
      });
    }
  }, [sectorsResponse, toast, logger]);

  // Import funksiyası (hələ implementasiya edilməyib)
  const handleImport = useCallback(() => {
    logger.info('Import function triggered (not implemented)');
    toast({
      title: "İdxal funksiyası",
      description: "Bu funksiya hazırda işləmə mərhələsindədir",
    });
  }, [toast, logger]);

  // Supabase bağlantısını yoxlamaq üçün funksiya
  const testSupabaseConnection = useCallback(async () => {
    logger.info('Testing Supabase connection');
    
    toast({
      title: "Supabase bağlantısı yoxlanılır",
      description: "Zəhmət olmasa gözləyin...",
    });
    
    try {
      const isConnected = await checkConnection();
      
      if (isConnected) {
        logger.info('Supabase connection test successful');
        toast({
          title: "Bağlantı uğurludur",
          description: "Supabase ilə bağlantı uğurla quruldu",
        });
      } else {
        logger.error('Supabase connection test failed');
        toast({
          title: "Bağlantı xətası",
          description: "Supabase ilə bağlantı qurula bilmədi",
          variant: "destructive",
        });
      }
    } catch (error) {
      logger.error('Error during Supabase connection test', error);
      toast({
        title: "Bağlantı xətası",
        description: error instanceof Error ? error.message : "Naməlum xəta",
        variant: "destructive",
      });
    }
  }, [toast, logger]);

  // Yeni sektor yaratmaq üçün modal açma
  const handleCreateSectorSuccess = useCallback(() => {
    logger.info('New sector created successfully, invalidating query cache');
    queryClient.invalidateQueries({ queryKey: ['sectors'] });
    setIsCreateModalOpen(false);
    toast({
      title: "Sektor uğurla yaradıldı",
      description: "Yeni sektor məlumatları sistemə əlavə edildi",
    });
  }, [queryClient, toast, logger]);

  // JSX strukturu - daha yaxşı təşkil edilmiş
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Input
            placeholder="Axtarış..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label="Sektorlar üzrə axtarış"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-label="Filter göstər/gizlət"
          >
            <Filter size={16} />
            Filtrlər
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Məlumatları yenilə"
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            Yenilə
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={testSupabaseConnection}
            aria-label="Bağlantını yoxla"
          >
            <AlertTriangle size={16} />
            Bağlantını yoxla
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={isLoading || !sectorsResponse?.data?.length}
            aria-label="Məlumatları ixrac et"
          >
            <Download size={16} />
            İxrac et
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImport}
            aria-label="Məlumatları idxal et"
          >
            <Upload size={16} />
            İdxal et
          </Button>
          
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Yeni sektor əlavə et"
          >
            <Plus size={16} />
            Yeni Sektor
          </Button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <SectorFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
      )}
      
      {/* Table component */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <SectorTable 
          sectors={sectorsResponse?.data || []}
          isLoading={false} // Skeleton istifadə etdiyimiz üçün isLoading=false veririk
          isError={isError}
          errorDetails={error instanceof Error ? error.message : 'Naməlum xəta'} 
          totalCount={sectorsResponse?.count || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          setCurrentPage={setCurrentPage}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onRefresh={refetch}
        />
      )}
      
      {/* Create sector modal */}
      <SectorModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSuccess={handleCreateSectorSuccess}
      />
    </div>
  );
};