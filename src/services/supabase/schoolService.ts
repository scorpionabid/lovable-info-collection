
// Import all the functions from the individual modules and re-export
import * as schoolService from './school';

// Re-export everything for backward compatibility
export * from './school';

// Default export for existing code that uses this pattern
export default schoolService;
