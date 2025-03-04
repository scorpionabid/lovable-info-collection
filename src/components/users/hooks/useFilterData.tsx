
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import userService, { UserFilters } from "@/services/api/userService";

export const useFilterData = (initialFilters: UserFilters = {}) => {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(initialFilters.region_id);
  const [selectedSector, setSelectedSector] = useState<string | undefined>(initialFilters.sector_id);

  // Fetch filter data
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => userService.getRoles(),
  });

  const { data: regions = [], isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regions'],
    queryFn: () => userService.getRegions(),
  });
  
  const { data: sectors = [], isLoading: isLoadingSectors } = useQuery({
    queryKey: ['sectors', selectedRegion],
    queryFn: () => userService.getSectors(selectedRegion),
    enabled: !!selectedRegion,
  });

  const { data: schools = [], isLoading: isLoadingSchools } = useQuery({
    queryKey: ['schools', selectedSector],
    queryFn: () => userService.getSchools(selectedSector),
    enabled: !!selectedSector,
  });

  const updateFilters = (field: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setSelectedRegion(undefined);
    setSelectedSector(undefined);
  };

  // Change region handling
  const handleRegionChange = (regionId: string | undefined) => {
    setSelectedRegion(regionId);
    
    // Reset sector and school if region changes
    if (regionId !== filters.region_id) {
      setFilters(prev => ({
        ...prev,
        region_id: regionId,
        sector_id: undefined,
        school_id: undefined
      }));
      setSelectedSector(undefined);
    }
  };

  // Change sector handling
  const handleSectorChange = (sectorId: string | undefined) => {
    setSelectedSector(sectorId);
    
    // Reset school if sector changes
    if (sectorId !== filters.sector_id) {
      setFilters(prev => ({
        ...prev,
        sector_id: sectorId,
        school_id: undefined
      }));
    }
  };

  const isLoading = isLoadingRoles || isLoadingRegions || isLoadingSectors || isLoadingSchools;

  return {
    filters,
    roles,
    regions,
    sectors,
    schools,
    selectedRegion,
    selectedSector,
    isLoading,
    isLoadingRoles,
    isLoadingRegions,
    isLoadingSectors,
    isLoadingSchools,
    updateFilters,
    resetFilters,
    handleRegionChange,
    handleSectorChange
  };
};
