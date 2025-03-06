
import { getRegions, getRegionById, searchRegionsByName } from './getRegions';
import { getRegionSectors } from './getRegionSectors';
import { createRegion, updateRegion, deleteRegion, archiveRegion } from './crudOperations';
import { RegionWithStats, PaginationParams, SortParams, FilterParams } from './types';

const regionService = {
  getRegions,
  getRegionById,
  getRegionSectors,
  createRegion,
  updateRegion,
  deleteRegion,
  archiveRegion,
  searchRegionsByName
};

export default regionService;
export type { RegionWithStats, PaginationParams, SortParams, FilterParams };
