
import { useState } from 'react';
import { SectorTable } from "./SectorTable";
import { SectorToolbar } from "./SectorToolbar";
import { SectorFilterPanel } from "./SectorFilterPanel";
import { SectorModal } from './SectorModal';
import { useToast } from "@/hooks/use-toast";
import { useSectorData } from './hooks/useSectorData';
import { useSectorFilters } from './hooks/useSectorFilters';
import { useSectorSort } from './hooks/useSectorSort';
import { useSectorActions } from './hooks/useSectorActions';
import { FilterParams } from '@/services/supabase/sector/types';

export const SectorsOverview = () => {
  const { toast } = useToast();
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Initial filter state
  const initialFilters: FilterParams = {
    search: '',
    region_id: '',
    status: 'all',
    searchQuery: '',
  };
  
  // Hooks to manage state
  const { sortColumn, sortDirection, handleSortChange } = useSectorSort();
  const { 
    currentPage, 
    searchTerm, 
    filters, 
    setCurrentPage, 
    handleSearchChange, 
    handleApplyFilters 
  } = useSectorFilters(initialFilters);

  // Data fetching
  const { 
    sectorsData, 
    isLoading, 
    isError, 
    refetch 
  } = useSectorData({ 
    currentPage, 
    pageSize, 
    sortColumn, 
    sortDirection, 
    filters 
  });

  // Actions
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    handleRefresh,
    handleCreateSuccess,
    handleExport,
    handleImport
  } = useSectorActions(refetch);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handleSearch = (query: string) => {
    handleSearchChange(query);
    
    // Update filters with search query
    const updatedFilters = {
      ...filters,
      searchQuery: query
    };
    
    handleApplyFilters(updatedFilters);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SectorToolbar 
        searchQuery={searchTerm}
        onSearchChange={handleSearch}
        onRefresh={handleRefresh}
        onExport={() => handleExport(sectorsData?.data || [])}
        onImport={handleImport}
        onCreateSector={() => setIsCreateModalOpen(true)}
        onToggleFilters={toggleFilters}
      />
      
      {showFilters && (
        <SectorFilterPanel 
          initialFilters={filters}
          onApplyFilters={handleApplyFilters}
          onClose={toggleFilters}
        />
      )}
      
      <SectorTable 
        sectors={sectorsData?.data || []}
        totalCount={sectorsData?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
        onRefresh={handleRefresh}
      />
      
      <SectorModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
