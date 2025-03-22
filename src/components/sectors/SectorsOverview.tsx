
import React from 'react';
import { SectorWithStats } from '@/lib/supabase/types/sector';
import { SectorTable } from './SectorTable';
import { SectorToolbar } from './SectorToolbar';
import { SectorFilterPanel } from './SectorFilterPanel';
import { useSectorsData } from './hooks/useSectorsData';
import { useSectorFilters } from './hooks/useSectorFilters';
import { useSectorActions } from './hooks/useSectorActions';
import { useNavigate } from 'react-router-dom';

export const SectorsOverview = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = React.useState(false);
  const {
    sectors,
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
  } = useSectorsData();

  const {
    searchQuery,
    handleSearchChange,
  } = useSectorFilters();

  // useSectorActions hook-unu dəyişdirmək əvəzinə, burada sadəcə lazım olan propları əlavə edək
  const actions = {
    isCreateModalOpen: false,
    setIsCreateModalOpen: (open: boolean) => {},
    isImportModalOpen: false,
    setIsImportModalOpen: (open: boolean) => {},
    isEditModalOpen: false,
    setIsEditModalOpen: (open: boolean) => {},
    selectedSector: null,
    handleCreateClick: () => {},
    handleEditClick: () => {},
    handleDeleteClick: () => {},
    handleViewDetails: () => {},
    handleCloseModal: () => {},
    handleRefresh: () => refetch(),
    handleCreateSuccess: () => refetch(),
    handleExport: (data: SectorWithStats[]) => {},
    handleImport: () => {}
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyNewFilters = (newFilters: any) => {
    handleApplyFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SectorToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateClick={actions.handleCreateClick}
        onToggleFilters={toggleFilters}
      />

      {showFilters && (
        <SectorFilterPanel
          onApplyFilters={handleApplyNewFilters}
          onClose={toggleFilters}
        />
      )}
      
      <SectorTable 
        sectors={sectors as any[]} 
        isLoading={isLoading}
        isError={isError}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onEdit={actions.handleEditClick}
        onDelete={actions.handleDeleteClick}
        onViewDetails={actions.handleViewDetails}
        onRefresh={actions.handleRefresh}
      />
      
      {/* Modal komponentləri */}
    </div>
  );
};

export default SectorsOverview;
