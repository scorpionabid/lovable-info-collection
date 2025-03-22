// Yalnız onViewRegion prop'unu əlavə edərək mövcud kodu qoruyuruq
import { useState } from 'react';
import { RegionTable } from './table/RegionTable';
import { RegionToolbar } from './RegionToolbar';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionModal } from './RegionModal';
import useRegionsData from './hooks/useRegionsData';
import { useNavigate } from 'react-router-dom';

export const RegionsOverview = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  const {
    regions,
    totalCount,
    currentPage,
    pageSize,
    setCurrentPage,
    sortColumn,
    sortDirection,
    handleSortChange,
    isLoading,
    isError,
    filters,
    handleApplyFilters,
    refetch,
  } = useRegionsData();

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (region) => {
    setSelectedRegion(region);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (regionId) => {
    // Handle delete logic here
    console.log('Delete region with ID:', regionId);
  };

  // onViewRegion funksiyasını əlavə et
  const handleViewRegion = (region) => {
    // Region parametrini alır və region detalları səhifəsinə yönləndirir
    navigate(`/regions/${region.id}`);
  };

  return (
    <div className="space-y-6">
      <RegionToolbar
        onCreateClick={handleCreateClick}
        onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
      />

      {isFilterPanelOpen && (
        <RegionFilterPanel
          onApply={handleApplyFilters}
          onClose={() => setIsFilterPanelOpen(false)}
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
        onViewRegion={handleViewRegion}
        onEditRegion={handleEditClick}
        onDeleteRegion={handleDeleteClick}
        onRefresh={refetch}
      />
      
      <RegionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onCreated={refetch}
      />

      {selectedRegion && (
        <RegionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={selectedRegion}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default RegionsOverview;
