
// Re-export all region-related functions and types
export * from './types';
export * from './getRegions';
export * from './getRegionSectors';
export * from './crudOperations';

// Export as default for backward compatibility
import * as regionService from './getRegions';
import { createRegion, updateRegion, deleteRegion, archiveRegion } from './crudOperations';

export default {
  ...regionService,
  createRegion,
  updateRegion,
  deleteRegion,
  archiveRegion
};
