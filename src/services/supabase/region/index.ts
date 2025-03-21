
// Import all functions from individual files
import { getRegions } from './queries';
import { searchRegions } from './search';
import { createRegion, updateRegion, deleteRegion } from './crudOperations';
import { getSectorsByRegion } from './sectorQueries';

// Export types
import { 
  Region, 
  RegionWithStats, 
  Sector, 
  FilterParams, 
  SortConfig, 
  PaginationParams 
} from './types';

// Export types
export type { 
  Region, 
  RegionWithStats, 
  Sector, 
  FilterParams, 
  SortConfig, 
  PaginationParams 
};

// Define a getRegionById function since it's missing
export const getRegionById = async (id: string): Promise<Region | null> => {
  try {
    const { data, error } = await import('../supabaseClient').then(module => 
      module.supabase
        .from('regions')
        .select('*')
        .eq('id', id)
        .single()
    );
    
    if (error) throw error;
    return data as Region;
  } catch (error) {
    console.error(`Error fetching region with ID ${id}:`, error);
    return null;
  }
};

// Export all functions
export {
  getRegions,
  // getRegionById is defined above
  searchRegions,
  getSectorsByRegion,
  createRegion,
  updateRegion,
  deleteRegion
};

// Default export for backward compatibility
export default {
  getRegions,
  getRegionById,
  searchRegions,
  getSectorsByRegion,
  createRegion,
  updateRegion,
  deleteRegion
};
