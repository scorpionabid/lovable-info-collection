
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as regionService from '@/services/regionService';
import * as sectorService from '@/services/sectorService';
import * as schoolService from '@/services/schoolService';
import * as userService from '@/services/userService';

export const useOrganizationData = (activeStep = 0) => {
  const [regionId, setRegionId] = useState<string>('');
  const [sectorId, setSectorId] = useState<string>('');
  const [schoolId, setSchoolId] = useState<string>('');
  
  // Get roles
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: userService.getRoles,
    enabled: activeStep === 0
  });
  
  // Get regions
  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: regionService.getRegionsForDropdown,
    enabled: activeStep === 1
  });
  
  // Get sectors based on selected region
  const sectorsQuery = useQuery({
    queryKey: ['sectors', regionId],
    queryFn: () => regionId ? sectorService.getSectorsByRegionId(regionId) : [],
    enabled: Boolean(regionId) && activeStep === 1
  });
  
  // Get schools based on selected sector
  const schoolsQuery = useQuery({
    queryKey: ['schools', sectorId],
    queryFn: () => sectorId ? schoolService.getSchoolsBySectorId(sectorId) : [],
    enabled: Boolean(sectorId) && activeStep === 1
  });
  
  // Reset sector when region changes
  useEffect(() => {
    if (regionId) {
      setSectorId('');
      setSchoolId('');
    }
  }, [regionId]);
  
  // Reset school when sector changes
  useEffect(() => {
    if (sectorId) {
      setSchoolId('');
    }
  }, [sectorId]);
  
  return {
    roles: rolesQuery.data || [],
    regions: regionsQuery.data || [],
    sectors: sectorsQuery.data || [],
    schools: schoolsQuery.data || [],
    isLoading: rolesQuery.isLoading || regionsQuery.isLoading || sectorsQuery.isLoading || schoolsQuery.isLoading,
    regionId,
    setRegionId,
    sectorId,
    setSectorId,
    schoolId,
    setSchoolId
  };
};
