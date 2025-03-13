
import { useEffect } from "react";
import { UserFilters } from "@/services/supabase/user/types";
import { FilterHeader } from "./filters/FilterHeader";
import { FilterButtons } from "./filters/FilterButtons";
import { SearchFilter } from "./filters/SearchFilter";
import { RoleFilter } from "./filters/RoleFilter";
import { RegionFilter } from "./filters/RegionFilter";
import { SectorFilter } from "./filters/SectorFilter";
import { SchoolFilter } from "./filters/SchoolFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { LoadingIndicator } from "./filters/LoadingIndicator";
import { useFilterData } from "./hooks/useFilterData";

interface UserFilterPanelProps {
  onClose: () => void;
  onApplyFilters: (filters: UserFilters) => void;
  currentFilters?: UserFilters;
}

export const UserFilterPanel = ({ onClose, onApplyFilters, currentFilters = {} }: UserFilterPanelProps) => {
  const { 
    filters, 
    roles, 
    regions, 
    sectors, 
    schools,
    selectedRegion,
    selectedSector,
    isLoading,
    updateFilters,
    resetFilters,
    handleRegionChange,
    handleSectorChange
  } = useFilterData(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-scale-in">
      <FilterHeader onClose={onClose} />
      
      {isLoading && <LoadingIndicator />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchFilter 
          value={filters.search || ''} 
          onChange={(value) => updateFilters('search', value)} 
        />
        
        <RoleFilter 
          roles={roles} 
          selectedRole={filters.roleId} 
          onChange={(value) => updateFilters('roleId', value)}
          isLoading={isLoading}
        />
        
        <RegionFilter 
          regions={regions}
          selectedRegion={selectedRegion}
          onChange={handleRegionChange}
          isLoading={isLoading}
        />
        
        <SectorFilter 
          sectors={sectors}
          selectedSector={selectedSector}
          onChange={handleSectorChange}
          isLoading={isLoading}
          disabled={!selectedRegion || sectors.length === 0}
        />
        
        <SchoolFilter 
          schools={schools}
          selectedSchool={filters.schoolId}
          onChange={(value) => updateFilters('schoolId', value)}
          isLoading={isLoading}
          disabled={!selectedSector || schools.length === 0}
        />
        
        <StatusFilter 
          selectedStatus={filters.status} 
          onChange={(value) => updateFilters('status', value)}
        />
      </div>
      
      <FilterButtons 
        onReset={resetFilters} 
        onClose={onClose} 
        onApply={handleApply} 
      />
    </div>
  );
};
