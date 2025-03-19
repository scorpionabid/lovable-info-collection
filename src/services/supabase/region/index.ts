
import { getRegions, getRegionById } from './queries';
import { searchRegions } from './search';
import { getSectorsByRegion } from './sectorQueries';
import { createRegion, updateRegion, deleteRegion, archiveRegion, createSector, updateSector, deleteSector, archiveSector } from './crudOperations';
import { Region, RegionWithStats, Sector, FilterParams, SortConfig, PaginationParams } from './types';

// Export type definitions
export type { Region, RegionWithStats, Sector, FilterParams, SortConfig, PaginationParams };

// Export queries and operations
export {
  getRegions,
  getRegionById,
  searchRegions,
  getSectorsByRegion,
  createRegion,
  updateRegion,
  deleteRegion,
  archiveRegion,
  createSector,
  updateSector,
  deleteSector,
  archiveSector
};

// Default export providing all region functionality
export default {
  getRegions,
  getRegionById,
  searchRegions,
  getSectorsByRegion,
  createRegion,
  updateRegion,
  deleteRegion,
  archiveRegion,
  createSector,
  updateSector,
  deleteSector,
  archiveSector
};
