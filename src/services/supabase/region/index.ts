
// Import core types
import type { 
  Region, 
  RegionWithStats, 
  RegionFilters, 
  CreateRegionDto, 
  UpdateRegionDto 
} from '@/lib/supabase/types';

// Import region operations
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
} from '@/lib/supabase/services/regions';

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

// Re-export all functions
export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
};

// Re-export all types
export type {
  Region,
  RegionWithStats,
  CreateRegionDto,
  UpdateRegionDto,
  RegionFilters
};

// Default export for backward compatibility
const regionModule = {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion,
  getRegionsForDropdown
};

export default regionModule;
