
// Export core region operations
import { 
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector
} from './crudOperations';

// Export other region functionality
import { getRegions, getRegionById, getRegionWithStats } from './queries';
import { searchRegionsByName } from './search';
import { FilterParams, SortConfig, RegionWithStats } from './types';

// Combined exports
export {
  // Core operations
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector,
  
  // Queries
  getRegions, getRegionById, getRegionWithStats,
  
  // Search
  searchRegionsByName
};

// Export types
export type { FilterParams, SortConfig, RegionWithStats };

// Default export with all functions
export default {
  // Core operations
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector,
  
  // Queries
  getRegions, getRegionById, getRegionWithStats,
  
  // Search
  searchRegionsByName
};
