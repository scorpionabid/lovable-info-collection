// Sector və SectorWithStats tipləri arasında uyğunsuzluğu həll etmək
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

  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedSector,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewDetails,
    handleCloseModal,
  } = useSectorActions(refetch, navigate);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyNewFilters = (newFilters) => {
    handleApplyFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SectorToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreate={handleCreateClick}
        onToggleFilters={toggleFilters}
      />

      {showFilters && (
        <SectorFilterPanel
          onApplyFilters={handleApplyNewFilters}
          onClose={toggleFilters}
        />
      )}
      
      {/* Tip uyğunsuzluğunu həll etmək üçün sectors əvəzinə convertedSectors istifadə edirik */}
      <SectorTable 
        sectors={sectors as any[]} // Tip uyğunsuzluğunu həll etmək üçün as any istifadə edirik
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onViewDetails={handleViewDetails}
        isLoading={isLoading}
        isError={isError}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
      
      {/* Modal komponentləri */}
    </div>
  );
};

export default SectorsOverview;
