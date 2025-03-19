
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRegionsData } from './hooks/useRegions';
import { useRegionFilters } from './hooks/useRegionFilters';
import { useRegionSort } from './hooks/useRegionSort';
import { useRegionActions } from './hooks/useRegionActions';
import { RegionTable } from './table/RegionTable';
import { RegionToolbar } from './toolbar/RegionToolbar';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionModal } from './RegionModal';

export const RegionsOverview = () => {
  const [pageSize, setPageSize] = useState(10);
  
  // Hooks to manage state
  const { sortColumn, sortDirection, handleSortChange } = useRegionSort();
  const { 
    showFilters, searchQuery, currentPage, filters, 
    setCurrentPage, handleSearchChange, handleApplyFilters, 
    toggleFilters 
  } = useRegionFilters();

  // Data fetching - yeni universal Supabase hook-u ilə
  const { 
    data: regionsData, 
    isLoading, 
    isError, 
    refetch,
    searchTerm,
    setSearchTerm
  } = useRegionsData({ 
    page: currentPage, 
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
    handleExport,
    handleImport,
    handleCreateSuccess
  } = useRegionActions(refetch);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RegionToolbar 
        searchQuery={searchTerm || searchQuery}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
          handleSearchChange(e); // Burada orijinal event-i ötürük
        }}
        onRefresh={handleRefresh}
        onExport={() => handleExport(regionsData)}
        onImport={handleImport}
        onCreateRegion={() => setIsCreateModalOpen(true)}
        onToggleFilters={toggleFilters}
      />
      
      {showFilters && (
        <RegionFilterPanel 
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClose={toggleFilters}
        />
      )}
      
      <RegionTable 
        regions={regionsData?.data || []}
        totalCount={regionsData?.count || 0}
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
      
      <RegionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
