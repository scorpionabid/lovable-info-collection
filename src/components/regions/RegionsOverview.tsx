
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useRegionData } from './hooks/useRegionData';
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

  // Data fetching
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
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
          onClose={() => toggleFilters()}
        />
      )}
      
      <RegionTable 
        data={regionsData?.data || []}
        totalRegions={regionsData?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
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
