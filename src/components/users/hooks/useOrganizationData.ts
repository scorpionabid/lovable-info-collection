
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import regionService from '@/services/regionService';
import sectorService from '@/services/sectorService';
import schoolService from '@/services/schoolService';

export const useOrganizationData = () => {
  const [regions, setRegions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  
  // Define async functions to fetch data
  const fetchRegions = async () => {
    try {
      const data = await regionService.getRegionsForDropdown();
      return data || [];
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  };
  
  const fetchSectors = async (regionId: string) => {
    if (!regionId) return [];
    
    try {
      const data = await sectorService.getSectorsByRegionId(regionId);
      return data.map(sector => ({
        id: sector.id,
        name: sector.name
      }));
    } catch (error) {
      console.error('Error fetching sectors:', error);
      return [];
    }
  };
  
  const fetchSchools = async (sectorId: string) => {
    if (!sectorId) return [];
    
    try {
      const data = await schoolService.getSchoolsBySectorId(sectorId);
      return data.map(school => ({
        id: school.id,
        name: school.name
      }));
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  };

  // Use queries to fetch organization data
  const regionsQuery = useQuery({
    queryKey: ['regions', 'dropdown'],
    queryFn: fetchRegions
  });
  
  const sectorsQuery = useQuery({
    queryKey: ['sectors', 'dropdown', selectedRegionId],
    queryFn: () => fetchSectors(selectedRegionId || ''),
    enabled: !!selectedRegionId
  });
  
  const schoolsQuery = useQuery({
    queryKey: ['schools', 'dropdown', selectedSectorId],
    queryFn: () => fetchSchools(selectedSectorId || ''),
    enabled: !!selectedSectorId
  });
  
  // Update state from query results
  useEffect(() => {
    if (regionsQuery.data) {
      setRegions(regionsQuery.data);
    }
  }, [regionsQuery.data]);
  
  useEffect(() => {
    if (sectorsQuery.data) {
      setSectors(sectorsQuery.data);
    }
  }, [sectorsQuery.data]);
  
  useEffect(() => {
    if (schoolsQuery.data) {
      setSchools(schoolsQuery.data);
    }
  }, [schoolsQuery.data]);
  
  // Handlers for dropdown changes
  const handleRegionChange = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedSectorId(null);
    setSchools([]);
  };
  
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
    isLoadingSchools: schoolsQuery.isLoading
  };
};
