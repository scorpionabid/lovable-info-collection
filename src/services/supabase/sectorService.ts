
// Import all the functions from the individual modules and re-export
import * as sectorOperations from './sector';

// Re-export everything for backward compatibility
export * from './sector';

// Default export for existing code that uses this pattern
export default sectorOperations;
