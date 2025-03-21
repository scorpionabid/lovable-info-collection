
import React from 'react';
import { RegionTableRow } from './RegionTableRow';
import { RegionWithStats } from '@/lib/supabase/types';
import { Pagination } from '@/components/ui/pagination';
import { RegionTableHeader } from './RegionTableHeader';

export interface RegionTableProps {
  regions: RegionWithStats[];
  currentSort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onEdit: (region: RegionWithStats) => void;
  onDelete: (region: RegionWithStats) => void;
  onSort: (column: string, direction: 'asc' | 'desc') => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const RegionTable: React.FC<RegionTableProps> = ({
  regions,
  currentSort,
  currentPage,
  pageSize,
  totalItems,
  onEdit,
  onDelete,
  onSort,
  onPageChange,
  onPageSizeChange
}) => {
  const handleSort = (field: string) => {
    const direction = 
      currentSort.field === field && currentSort.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    onSort(field, direction);
  };

  if (regions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-infoline-light-gray p-8 text-center">
        <p className="text-infoline-dark-gray">Region tapılmadı.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-infoline-light-gray overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <RegionTableHeader 
            currentSort={currentSort}
            onSort={handleSort}
          />
          <tbody>
            {regions.map((region) => (
              <RegionTableRow 
                key={region.id} 
                region={region} 
                onEdit={() => onEdit(region)}
                onDelete={() => onDelete(region)}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
