
import { useState, useCallback } from 'react';
import { RegionTable } from './table/RegionTable';
import { RegionToolbar } from './RegionToolbar';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionModal } from './RegionModal';
import { useRegionsData } from './hooks/useRegionsData';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const RegionsOverview = () => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    search: '',
    status: 'active' as const,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch regions data
  const { regionsData, isLoading, isError, refetch } = useRegionsData({
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
  });

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle search change
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  };

  // Handle filter application
  const handleApplyFilters = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      // Use the queryClient to invalidate the regions query instead of calling refetch directly
      await queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Regions data refreshed');
    } catch (error) {
      console.error('Error refreshing regions:', error);
      toast.error('Failed to refresh regions data');
    }
  }, [queryClient]);

  // Handle export
  const handleExport = () => {
    // Implementation for exporting regions
    toast.info('Export functionality not implemented yet');
  };

  // Handle create success
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    toast.success('Region created successfully');
    // Refresh the data
    queryClient.invalidateQueries({ queryKey: ['regions'] });
  };
  
  // Extract the data from the result of useRegionsData
  const regions = regionsData?.data || [];
  const totalCount = regionsData?.count || 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RegionToolbar
        searchQuery={filters.search}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onCreateRegion={() => setIsCreateModalOpen(true)}
        onToggleFilters={toggleFilters}
      />

      {showFilters && (
        <RegionFilterPanel
          onApplyFilters={handleApplyFilters}
          onClose={toggleFilters}
          filters={filters}
        />
      )}

      <RegionTable
        regions={regions}
        totalCount={totalCount}
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

      {isCreateModalOpen && (
        <RegionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};
