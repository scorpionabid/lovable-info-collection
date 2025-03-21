
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useRegionData } from './hooks/useRegionData';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionTable } from './table/RegionTable';
import { RegionModal } from './RegionModal';
import { Plus, Filter } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { FilterBar } from "@/components/shared/FilterBar";
import { RegionExportModal } from './RegionExportModal';
import { type RegionWithStats } from '@/supabase/types';

const RegionsOverview = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionWithStats | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'active' as const
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { 
    regionsData, 
    isLoading, 
    isError, 
    refetch 
  } = useRegionData({
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters
  });

  const regions = regionsData.data;
  const totalCount = regionsData.count;

  const toggleFilter = () => {
    setIsFilterVisible(prev => !prev);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderLoading = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  const renderError = () => (
    <div className="p-4 text-red-600 bg-red-50 rounded-md">
      Regionları yükləmək mümkün olmadı. Zəhmət olmasa, yenidən cəhd edin.
    </div>
  );

  return (
    <div>
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Regionlar</h1>
          <p className="text-infoline-dark-gray">Bu bölmədə regionları idarə edə bilərsiniz</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrlər
          </Button>
          <Button onClick={() => setIsExportModalOpen(true)} variant="outline">
            İxrac et
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Region əlavə et
          </Button>
        </div>
      </div>

      {/* Filter bar and filters */}
      <FilterBar
        searchValue={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onSearch={() => refetch()}
        filterCount={Object.keys(filters).filter(k => filters[k as keyof typeof filters] !== '').length}
        onClearAll={() => setFilters({ search: '', status: 'active' })}
      />

      {isFilterVisible && (
        <RegionFilterPanel 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onFiltersChange={setFilters} 
          onFilterApply={() => refetch()}
        />
      )}

      {/* Region data */}
      {isLoading ? (
        renderLoading()
      ) : isError ? (
        renderError()
      ) : (
        <RegionTable 
          regions={regions}
          onEdit={(region) => {
            setSelectedRegion(region);
            setIsModalOpen(true);
          }}
          onDelete={(region) => {
            // Handle delete logic
            console.log('Delete region:', region);
          }}
          onSort={(column, direction) => {
            setSortColumn(column);
            setSortDirection(direction);
          }}
          currentSort={{ field: sortColumn, direction: sortDirection }}
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Create/Edit Region Modal */}
      <RegionModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRegion(null);
        }}
        mode={selectedRegion ? 'edit' : 'create'}
        region={selectedRegion || undefined}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
          setSelectedRegion(null);
        }}
      />

      {/* Export Modal */}
      <RegionExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={filters}
      />
    </div>
  );
};

export default RegionsOverview;
