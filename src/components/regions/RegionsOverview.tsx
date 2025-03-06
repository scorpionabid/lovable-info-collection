import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RegionTable } from './table/RegionTable';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionModal } from './RegionModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";
import regionService, { FilterParams } from "@/services/supabase/regionService";
import { useToast } from "@/hooks/use-toast";
import { fileExport } from "@/utils/fileExport";

export const RegionsOverview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterParams>({
    searchQuery: '',
    dateFrom: '',
    dateTo: '',
    completionRate: 'all'
  });

  const { data: regionsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['regions', currentPage, pageSize, sortColumn, sortDirection, filters],
    queryFn: () => regionService.getRegions(
      { page: currentPage, pageSize },
      { column: sortColumn, direction: sortDirection },
      { ...filters, searchQuery }
    ),
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

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Məlumatlar yeniləndi",
      description: "Region siyahısı yeniləndi",
    });
  };

  const handleExport = () => {
    if (!regionsData || regionsData.data.length === 0) {
      toast({
        title: "İxrac ediləcək məlumat yoxdur",
        description: "Region siyahısında məlumat tapılmadı",
        variant: "destructive",
      });
      return;
    }

    const exportData = regionsData.data.map(region => ({
      'Ad': region.name,
      'Kod': region.code || '',
      'Təsvir': region.description || '',
      'Sektor sayı': region.sectorCount,
      'Məktəb sayı': region.schoolCount,
      'Doldurma faizi': `${region.completionRate}%`,
      'Yaradılma tarixi': new Date(region.created_at).toLocaleDateString('az-AZ')
    }));

    fileExport({
      data: exportData,
      fileName: 'Regionlar',
      fileType: 'xlsx'
    });

    toast({
      title: "İxrac əməliyyatı uğurla tamamlandı",
      description: "Məlumatlar Excel formatında ixrac edildi",
    });
  };

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
            Yeni Region
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <RegionFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
      )}
      
      <RegionTable 
        regions={regionsData?.data || []}
        isLoading={isLoading}
        isError={isError}
        totalCount={regionsData?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRefresh={refetch}
      />
      
      <RegionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['regions'] });
          toast({
            title: "Region uğurla yaradıldı",
            description: "Yeni region məlumatları sistemə əlavə edildi",
          });
        }}
      />
    </div>
  );
};
