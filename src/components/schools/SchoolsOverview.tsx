
import { useState } from 'react';
import { SchoolTable } from "./SchoolTable";
import { SchoolToolbar } from "./SchoolToolbar";
import { SchoolFilterPanel } from "./SchoolFilterPanel";
import { SchoolModal } from './modal/SchoolModal';
import { useSchoolData } from './hooks/useSchoolData';
import { useSchoolFilters } from './hooks/useSchoolFilters';
import { useSchoolSort } from './hooks/useSchoolSort';
import { useSchoolActions } from './hooks/useSchoolActions';
import { School } from '@/services/supabase/school/types';

export const SchoolsOverview = () => {
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Hooks to manage state
  const { sortColumn, sortDirection, handleSortChange } = useSchoolSort();
  const { currentPage, searchQuery, filters, setCurrentPage, handleSearchChange, handleApplyFilters } = useSchoolFilters();

  // Hook for fetching data
  const { schoolsData, isLoading, isError, refetch } = useSchoolData({
    currentPage,
    pageSize,
    sortColumn,
    sortDirection,
    filters
  });

  // Hooks for actions
  const { isCreateModalOpen, setIsCreateModalOpen, handleRefresh, handleCreateSuccess, handleExport, handleImport, handleEditSchool, handleDeleteSchool } = useSchoolActions(refetch);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleApplyNewFilters = (newFilters) => {
    handleApplyFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SchoolToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onExport={() => handleExport(schoolsData?.data || [])}
        onImport={handleImport}
        onCreateSchool={() => setIsCreateModalOpen(true)}
        onToggleFilters={toggleFilters}
      />

      {showFilters && (
        <SchoolFilterPanel
          onApplyFilters={handleApplyNewFilters}
          onClose={toggleFilters}
        />
      )}

      <SchoolTable
        schools={schoolsData?.data || []}
        totalCount={schoolsData?.count || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        isLoading={isLoading}
        isError={isError}
        onRefresh={handleRefresh}
        onEditSchool={handleEditSchool}
        onDeleteSchool={handleDeleteSchool}
      />

      <SchoolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};
