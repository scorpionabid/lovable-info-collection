
// Import all the functions from the individual modules and re-export
import * as sectorOperations from './sector';
import { getRegionsForDropdown, getSectorsByRegionId } from './sector/helperFunctions';

// Re-export everything for backward compatibility
export * from './sector';
export * from './sector/types';  // Export types explicitly

// Add helper functions to the exports
export { getRegionsForDropdown, getSectorsByRegionId };

// Default export for existing code that uses this pattern
export default {
  ...sectorOperations,
  getRegionsForDropdown,
  getSectorsByRegionId
};
