
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegionToolbar from './RegionToolbar';
import RegionTable from './table/RegionTable';
import RegionFilterPanel from './RegionFilterPanel';
import useRegionsData from './hooks/useRegionsData';
import RegionModal from './RegionModal';

export const RegionsOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    regions,
    totalCount,
    isLoading,
    isError,
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters,
    setCurrentPage,
    handleSortChange,
    handleFilterChange,
    refetch
  } = useRegionsData();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange({
      ...filters,
      search: value
    });
  };

  const handleOpenFilters = () => {
    setIsFilterPanelOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFilterPanelOpen(false);
  };

  const handleApplyFilters = (newFilters: any) => {
    handleFilterChange({
      ...filters,
      ...newFilters
    });
  };

  const handleAddRegion = () => {
    setIsModalOpen(true);
  };

  const handleExportRegions = () => {
    console.log('Export regions not implemented');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRegionCreated = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handleViewRegion = (regionId: string) => {
    navigate(`/regions/${regionId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <RegionToolbar
        onAddRegion={handleAddRegion}
        onExportRegions={handleExportRegions}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenFilters={handleOpenFilters}
      />

      <RegionFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilters}
        filters={{ search: searchQuery, status: filters.status || 'active' }}
        onApplyFilters={handleApplyFilters}
      />

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
        onViewRegion={handleViewRegion}
        onRefresh={refetch}
      />

      <RegionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleRegionCreated}
      />
    </div>
  );
};

export default RegionsOverview;
