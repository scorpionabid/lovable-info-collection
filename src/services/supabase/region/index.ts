
// Export core region operations
import { 
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector
} from './crudOperations';

// Export other region functionality
import { getRegions, getRegionById, getRegionWithStats } from './queries';
import { searchRegionsByName } from './search';
import { getRegionSectors, getSectorById, getSectorsWithSchoolCounts } from './sectorQueries';
import { FilterParams, SortConfig, RegionWithStats, Region, Sector } from './types';

// Combined exports
export {
  // Core operations
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector,
  
  // Queries
  getRegions, getRegionById, getRegionWithStats,
  
  // Search
  searchRegionsByName,
  
  // Sector queries
  getRegionSectors, getSectorById, getSectorsWithSchoolCounts
};

// Export types
export type { FilterParams, SortConfig, RegionWithStats, Region, Sector };

// Default export with all functions
export default {
  // Core operations
  createRegion, updateRegion, deleteRegion, archiveRegion,
  createSector, updateSector, deleteSector, archiveSector,
  
  // Queries
  getRegions, getRegionById, getRegionWithStats,
  
  // Search
  searchRegionsByName,
  
  // Sector queries
  getRegionSectors, getSectorById, getSectorsWithSchoolCounts
};
