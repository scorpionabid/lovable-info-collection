
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
import { RegionWithStats } from '@/services/supabase/region/types';

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
    refetch,
    searchTerm,
    setSearchTerm
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

  // Prepare data structure for the RegionTable component
  const processedRegionsData = {
    data: regionsData?.data?.map(region => {
      return {
        ...region,
        description: region.description || '',
        sectorCount: region.sectorCount || region.sectors_count || 0,
        schoolCount: region.schoolCount || region.schools_count || 0,
        studentCount: region.studentCount || 0,
        teacherCount: region.teacherCount || 0,
        completionRate: region.completionRate || region.completion_rate || 0,
        sectors_count: region.sectors_count || region.sectorCount || 0,
        schools_count: region.schools_count || region.schoolCount || 0,
        completion_rate: region.completion_rate || region.completionRate || 0
      } as RegionWithStats;
    }) || [],
    count: regionsData?.count || 0
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RegionToolbar 
        searchQuery={searchTerm || searchQuery}
        onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
          handleSearchChange(e);
        }}
        onRefresh={handleRefresh}
        onExport={() => handleExport(processedRegionsData)}
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
        regions={processedRegionsData.data}
        totalCount={processedRegionsData.count}
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
