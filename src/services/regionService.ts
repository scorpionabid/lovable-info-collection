
// Import all functions from the supabase region service
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
} from '@/lib/supabase/services/regions';

// Import types
import type { 
  Region, 
  RegionWithStats, 
  CreateRegionDto, 
  UpdateRegionDto, 
  RegionFilters 
} from '@/lib/supabase/types';

// Helper function to get regions for dropdown menus
export const getRegionsForDropdown = async (): Promise<{ id: string; name: string; }[]> => {
  try {
    const regions = await getRegions();
    return (regions || []).map(region => ({
      id: region.id,
      name: region.name
    }));
  } catch (error) {
    console.error('Error fetching regions for dropdown:', error);
    return [];
  }
};

// Re-export all functions and types
export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
};
export type {
  Region,
  RegionWithStats,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters
};

// Default export for backward compatibility
const regionService = {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion,
  getRegionsForDropdown
};

export default regionService;
