
// Re-export all functions, types, etc.
export * from './types';
export * from './querySectors';
export * from './crudOperations';
export * from './helperFunctions';

// Import and re-export specific functions for easier access
import { getSectors, getSectorById, getSectorSchools } from './querySectors';
import { createSector, updateSector, archiveSector, deleteSector } from './crudOperations';
import * as helperFunctions from './helperFunctions';
import * as types from './types';

// Create default export with grouped functions for legacy support
const sectorService = {
  // Query functions
  getSectors,
  getSectorById,
  getSectorSchools,
  
  // CRUD operations
  createSector,
  updateSector,
  archiveSector,
  deleteSector,
  
  // Helper functions
  ...helperFunctions,
  
  // Types
  types
};

export default sectorService;
