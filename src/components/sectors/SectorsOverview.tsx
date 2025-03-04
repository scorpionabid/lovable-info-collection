
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SectorTable } from './SectorTable';
import { SectorFilterPanel } from './SectorFilterPanel';
import { SectorModal } from './SectorModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";
import sectorService, { FilterParams } from "@/services/supabase/sectorService";
import { useToast } from "@/hooks/use-toast";
import { fileExport } from "@/utils/fileExport";

export const SectorsOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  // Query to fetch sectors with filters
  const { data: sectorsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['sectors', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: () => sectorService.getSectors(
      { page: currentPage, pageSize },
      { column: sortColumn, direction: sortDirection },
      { ...filters, searchQuery }
    ),
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce filter application
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setShowFilters(false);
  };

  // Handle sorting change
  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Məlumatlar yeniləndi",
      description: "Sektor siyahısı yeniləndi",
    });
  };

  // Handle export
  const handleExport = () => {
    if (!sectorsData || sectorsData.data.length === 0) {
      toast({
        title: "İxrac ediləcək məlumat yoxdur",
        description: "Sektor siyahısında məlumat tapılmadı",
        variant: "destructive",
      });
      return;
    }

    const exportData = sectorsData.data.map(sector => ({
      'Ad': sector.name,
      'Təsvir': sector.description || '',
      'Region': sector.regionName || '',
      'Məktəb sayı': sector.schoolCount,
      'Doldurma faizi': `${sector.completionRate}%`,
      'Yaradılma tarixi': new Date(sector.created_at).toLocaleDateString('az-AZ')
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
  };

  // Handle import (placeholder for now)
  const handleImport = () => {
    toast({
      title: "İdxal funksiyası",
      description: "Bu funksiya hazırda işləmə mərhələsindədir",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
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
          >
            <RefreshCcw size={16} />
            Yenilə
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
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
      
      {showFilters && (
        <SectorFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
      )}
      
      <SectorTable 
        sectors={sectorsData?.data || []}
        isLoading={isLoading}
        isError={isError}
        totalCount={sectorsData?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRefresh={refetch}
      />
      
      <SectorModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSuccess={() => {
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
