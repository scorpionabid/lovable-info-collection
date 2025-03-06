
import { useState } from 'react';
import { RegionWithStats } from "@/services/supabase/regionService";
import { RegionModal } from '../RegionModal';
import { RegionExportModal } from '../RegionExportModal';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { RegionTableHeader } from './RegionTableHeader';
import { RegionTableRow } from './RegionTableRow';
import { RegionTablePagination } from './RegionTablePagination';
import { RegionTableEmptyState } from './RegionTableEmptyState';
import { RegionTableLoading } from './RegionTableLoading';
import { useRegionTableActions } from './useRegionTableActions';

interface RegionTableProps {
  regions: RegionWithStats[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onRefresh: () => void;
}

export const RegionTable = ({ 
  regions, 
  isLoading, 
  isError, 
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSortChange,
  onRefresh
}: RegionTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    selectedRegion,
    isEditModalOpen,
    isExportModalOpen,
    setIsEditModalOpen,
    setIsExportModalOpen,
    handleView,
    handleEdit,
    handleArchive,
    handleExport
  } = useRegionTableActions(onRefresh);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  // Show loading state
  if (isLoading) {
    return <RegionTableLoading />;
  }

  // Show error state
  if (isError) {
    return <RegionTableEmptyState onRefresh={onRefresh} isError={true} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <RegionTableHeader 
            sortColumn={sortColumn} 
            sortDirection={sortDirection} 
            onSortChange={onSortChange} 
          />
          <tbody>
            {regions.map((region) => (
              <RegionTableRow 
                key={region.id}
                region={region}
                onView={handleView}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onExport={handleExport}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty state */}
      {regions.length === 0 && <RegionTableEmptyState onRefresh={onRefresh} />}
      
      {/* Pagination */}
      <RegionTablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Modals */}
      {selectedRegion && (
        <>
          <RegionModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            mode="edit"
            region={selectedRegion}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['regions'] });
              toast({
                title: "Region uğurla yeniləndi",
                description: `${selectedRegion.name} regionunun məlumatları yeniləndi`,
              });
            }}
          />
          
          <RegionExportModal 
            isOpen={isExportModalOpen} 
            onClose={() => setIsExportModalOpen(false)} 
            region={selectedRegion}
          />
        </>
      )}
    </div>
  );
};
