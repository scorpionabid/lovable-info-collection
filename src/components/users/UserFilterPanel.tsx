
import React from 'react';
import { UserFilters, UserStatus } from '@/services/supabase/user/types';
import { RoleFilter } from './filters/RoleFilter';
import { RegionFilter } from './filters/RegionFilter';
import { SectorFilter } from './filters/SectorFilter';
import { SchoolFilter } from './filters/SchoolFilter';
import { StatusFilter } from './filters/StatusFilter';
import { SearchFilter } from './filters/SearchFilter';
import { FilterHeader } from './filters/FilterHeader';
import { FilterButtons } from './filters/FilterButtons';

interface UserFilterPanelProps {
  filters: UserFilters;
  setFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export const UserFilterPanel: React.FC<UserFilterPanelProps> = ({
  filters,
  setFilters,
  onApplyFilters,
  onResetFilters,
  isLoading = false,
}) => {
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleRoleChange = (value: string) => {
    setFilters(prev => ({ ...prev, role_id: value }));
  };

  const handleRegionChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      region_id: value, 
      sector_id: undefined, 
      school_id: undefined 
    }));
  };

  const handleSectorChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sector_id: value, 
      school_id: undefined 
    }));
  };

  const handleSchoolChange = (value: string) => {
    setFilters(prev => ({ ...prev, school_id: value }));
  };

  const handleStatusChange = (value: UserStatus) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
      <FilterHeader title="Filters" />

      <SearchFilter 
        value={filters.search || ''}
        onChange={handleSearchChange}
      />

      <RoleFilter 
        value={filters.role_id || ''}
        onChange={handleRoleChange}
      />

      <RegionFilter 
        value={filters.region_id || ''}
        onChange={handleRegionChange}
      />

      <SectorFilter 
        regionId={filters.region_id}
        value={filters.sector_id || ''}
        onChange={handleSectorChange}
      />

      <SchoolFilter 
        sectorId={filters.sector_id}
        value={filters.school_id || ''}
        onChange={handleSchoolChange}
      />

      <StatusFilter 
        value={filters.status as UserStatus || 'all'}
        onChange={handleStatusChange}
      />

      <FilterButtons 
        onApply={onApplyFilters}
        onReset={onResetFilters}
        isLoading={isLoading}
      />
    </div>
  );
};
