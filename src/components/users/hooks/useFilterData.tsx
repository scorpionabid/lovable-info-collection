
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import regionService from '@/services/regionService';
import sectorService from '@/services/sectorService';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase/types/user';

export const useFilterData = () => {
  const { user, userRole } = useAuth();
  const [regions, setRegions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  
  // Custom function to fetch regions
  const fetchRegions = async () => {
    try {
      const data = await regionService.getRegionsForDropdown();
      return data || [];
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  };

  // Query for regions
  const regionsQuery = useQuery({
    queryKey: ['regions', 'dropdown'],
    queryFn: fetchRegions,
    enabled: userRole !== UserRole.Unknown
  });

  // Set regions from query result
  useEffect(() => {
    if (regionsQuery.data) {
      setRegions(regionsQuery.data);
    }
  }, [regionsQuery.data]);

  // Custom function to fetch sectors based on region
  const fetchSectors = async (regionId: string) => {
    if (!regionId) return [];
    
    try {
      const sectors = await sectorService.getSectorsByRegionId(regionId);
      return sectors.map(sector => ({
        id: sector.id,
        name: sector.name
      }));
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };

  // Query for sectors
  const sectorsQuery = useQuery({
    queryKey: ['sectors', 'dropdown', selectedRegionId],
    queryFn: () => fetchSectors(selectedRegionId || ''),
    enabled: !!selectedRegionId
  });

  // Set sectors from query result
  useEffect(() => {
    if (sectorsQuery.data && Array.isArray(sectorsQuery.data)) {
      setSectors(sectorsQuery.data);
    }
  }, [sectorsQuery.data]);

  // Handle region change
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedSectorId(null);
    setSchools([]);
  };

  // Handle sector change
  const handleSectorChange = (sectorId: string) => {
    setSelectedSectorId(sectorId);
  };

  return {
    regions,
    sectors,
    schools,
    selectedRegionId,
    selectedSectorId,
    handleRegionChange,
    handleSectorChange,
    isLoadingRegions: regionsQuery.isLoading,
    isLoadingSectors: sectorsQuery.isLoading,
    isLoadingSchools: false
  };
};
