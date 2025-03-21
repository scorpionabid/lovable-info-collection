
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as userService from '@/services/userService';
import * as regionService from '@/services/regionService';
import * as sectorService from '@/services/sectorService';
import * as schoolService from '@/services/schoolService';

export const useFilterData = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  
  // Fetch roles
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: userService.getRoles,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Fetch regions
  const { data: regionsData } = useQuery({
    queryKey: ['regions'],
    queryFn: regionService.getRegionsForDropdown,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Fetch sectors based on selected region
  const { data: sectorsData } = useQuery({
    queryKey: ['sectors', selectedRegion],
    queryFn: () => selectedRegion 
      ? sectorService.getSectorsByRegionId(selectedRegion)
      : sectorService.getSectorsForDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(regionsData?.length)
  });
  
  // Fetch schools based on selected sector
  const { data: schoolsData } = useQuery({
    queryKey: ['schools', selectedRegion, selectedSector],
    queryFn: () => {
      if (selectedSector) {
        return schoolService.getSchoolsBySectorId(selectedSector);
      } else if (selectedRegion) {
        return schoolService.getSchoolsByRegionId(selectedRegion);
      } else {
        return schoolService.getSchoolsForDropdown();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(regionsData?.length)
  });
  
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]);
  
  useEffect(() => {
    if (regionsData) {
      setRegions(regionsData);
    }
  }, [regionsData]);
  
  useEffect(() => {
    if (sectorsData) {
      setSectors(sectorsData);
    }
  }, [sectorsData]);
  
  useEffect(() => {
    if (schoolsData) {
      setSchools(schoolsData);
    }
  }, [schoolsData]);
  
  // Reset selections when region changes
  useEffect(() => {
    if (selectedRegion === '') {
      setSelectedSector('');
    }
  }, [selectedRegion]);
  
  return {
    roles,
    regions,
    sectors,
    schools,
    selectedRegion,
    setSelectedRegion,
    selectedSector,
    setSelectedSector
  };
};
