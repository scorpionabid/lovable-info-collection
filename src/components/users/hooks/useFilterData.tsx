
import { useState, useEffect } from 'react';
import { UserFilters } from '@/services/supabase/user/types';
import userService from '@/services/userService';

export const useFilterData = () => {
  const [filters, setFilters] = useState<UserFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ id: string; name: string }[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  // Load initial data for filters
  useEffect(() => {
    const loadFilterData = async () => {
      setIsLoading(true);
      try {
        const [rolesData, regionsData] = await Promise.all([
          userService.getRoles(),
          userService.getRegions()
        ]);
        
        setRoles(rolesData || []);
        setRegions(regionsData || []);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Load sectors when region changes
  useEffect(() => {
    const loadSectors = async () => {
      if (!filters.region_id) {
        setSectors([]);
        return;
      }

      setIsLoading(true);
      try {
        const sectorsData = await userService.getSectors(filters.region_id);
        setSectors(sectorsData || []);
      } catch (error) {
        console.error('Error loading sectors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSectors();
  }, [filters.region_id]);

  // Load schools when sector changes
  useEffect(() => {
    const loadSchools = async () => {
      if (!filters.sector_id) {
        setSchools([]);
        return;
      }

      setIsLoading(true);
      try {
        const schoolsData = await userService.getSchools(filters.sector_id);
        setSchools(schoolsData || []);
      } catch (error) {
        console.error('Error loading schools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, [filters.sector_id]);

  return {
    filters,
    setFilters,
    isLoading,
    roles,
    regions,
    sectors,
    schools
  };
};
