
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SectorTable } from './SectorTable';
import { SectorFilterPanel } from './SectorFilterPanel';
import { SectorModal } from './SectorModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";
import { FilterParams } from "@/services/supabase/sector/types";
import { getSectors } from "@/services/supabase/sector/querySectors";
import { useToast } from "@/hooks/use-toast";
import { fileExport } from "@/utils/fileExport";
import { useLogger } from '@/hooks/useLogger';

export const SectorsOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logger = useLogger('SectorsOverview');
  
  // State for UI controls
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterParams>({
    searchQuery: '',
    regionId: '',
    dateFrom: '',
    dateTo: '',
    completionRate: 'all'
  });

  // Log component initialization
  useEffect(() => {
    logger.info('SectorsOverview component initialized', {
      initialPage: currentPage,
      sortColumn,
      sortDirection,
      filtersApplied: Object.keys(filters).filter(key => !!filters[key as keyof FilterParams]).length > 0
    });
  }, []);

  // Query to fetch sectors with filters
  const { 
    data: sectorsResponse, 
    isLoading, 
    isError, 
    error,
    refetch,
    status
  } = useQuery({
    queryKey: ['sectors', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: async () => {
      const reqId = logger.apiRequest('getSectors', { 
        pagination: { page: currentPage, pageSize },
        sort: { column: sortColumn, direction: sortDirection },
        filters: { ...filters, searchQuery }
      });
      
      try {
        // Explicitly log the request parameters again for clarity
        logger.debug('Sending getSectors request with parameters', {
          reqId,
          pagination: { page: currentPage, pageSize },
          sort: { column: sortColumn, direction: sortDirection },
          filters: { ...filters, searchQuery }
        });
        
        // Direct call to the service function with all parameters
        const response = await getSectors(
          { page: currentPage, pageSize },
          { column: sortColumn, direction: sortDirection },
          { ...filters, searchQuery }
        );
        
        // Log response details for debugging
        logger.apiResponse('getSectors', {
          reqId,
          receivedData: !!response,
          hasData: !!response?.data,
          dataCount: response?.data?.length || 0,
          totalCount: response?.count || 0,
          success: true
        });
        
        // Return null instead of empty array to trigger empty state UI
        if (!response || (response.data.length === 0 && response.count === 0)) {
          logger.info('No sectors found, returning explicit empty result');
          return { data: [], count: 0 };
        }
        
        return response;
      } catch (err) {
        logger.apiError('getSectors', err, reqId);
        // Rethrow to let React Query handle it
        throw err;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,  // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });

  // Log data status changes
  useEffect(() => {
    logger.info(`Query status changed: ${status}`, {
      hasData: !!sectorsResponse,
      dataCount: sectorsResponse?.data?.length || 0,
      isLoading,
      isError
    });
    
    if (isError && error) {
      logger.error('Error fetching sectors', error);
      
      // Show error toast only if not a network/connection error (those are handled in the table)
      if (!(error instanceof Error && error.message.includes('connection'))) {
        toast({
          title: "Sektor məlumatları yüklənərkən xəta baş verdi",
          description: error instanceof Error ? error.message : 'Naməlum xəta',
          variant: "destructive",
        });
      }
    }
  }, [status, sectorsResponse, isLoading, isError, error, toast]);

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    
    // Debounce filter application
    const timeoutId = setTimeout(() => {
      logger.info(`Search filter applied: "${newValue}"`);
      setFilters(prev => ({ ...prev, searchQuery: newValue }));
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: FilterParams) => {
    logger.info('Applying new filters', { 
      previousFilters: filters,
      newFilters 
    });
    
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setShowFilters(false);
  };

  // Handle sorting change
  const handleSortChange = (column: string) => {
    logger.info(`Sorting changed: column=${column}, current=${sortColumn}, direction=${sortDirection}`);
    
    if (sortColumn === column) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      logger.info(`Sort direction changed to ${newDirection}`);
    } else {
      setSortColumn(column);
      setSortDirection('asc');
      logger.info(`Sort column changed to ${column} (asc)`);
    }
  };

  // Handle refresh with proper loading state
  const handleRefresh = () => {
    logger.info('Manual refresh triggered');
    
    // Show loading toast
    toast({
      title: "Məlumatlar yenilənir",
      description: "Sektor siyahısı yenilənir...",
    });
    
    // Force refetch with invalidation
    queryClient.invalidateQueries({ queryKey: ['sectors'] });
    refetch().then(() => {
      toast({
        title: "Məlumatlar yeniləndi",
        description: "Sektor siyahısı uğurla yeniləndi",
      });
    }).catch(err => {
      logger.error('Error during manual refresh', err);
      toast({
        title: "Yeniləmə zamanı xəta",
        description: err instanceof Error ? err.message : 'Naməlum xəta',
        variant: "destructive",
      });
    });
  };

  // Handle export with proper data validation
  const handleExport = () => {
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
        'Yaradılma tarixi': sector.created_at ? new Date(sector.created_at).toLocaleDateString('az-AZ') : 'N/A'
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
  };

  // Handle import (placeholder for now)
  const handleImport = () => {
    logger.info('Import function triggered (not implemented)');
    toast({
      title: "İdxal funksiyası",
      description: "Bu funksiya hazırda işləmə mərhələsindədir",
    });
  };

  // Simplified JSX structure
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Input
            placeholder="Axtarış..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
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
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtrlər
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            Yenilə
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={isLoading || !sectorsResponse?.data?.length}
          >
            <Download size={16} />
            İxrac et
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImport}
          >
            <Upload size={16} />
            İdxal et
          </Button>
          
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
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
      <SectorTable 
        sectors={sectorsResponse?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorDetails={error instanceof Error ? error.message : 'Unknown error'} 
        totalCount={sectorsResponse?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRefresh={refetch}
      />
      
      {/* Create sector modal */}
      <SectorModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSuccess={() => {
          logger.info('New sector created successfully, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['sectors'] });
          toast({
            title: "Sektor uğurla yaradıldı",
            description: "Yeni sektor məlumatları sistemə əlavə edildi",
          });
        }}
      />
    </div>
  );
};
