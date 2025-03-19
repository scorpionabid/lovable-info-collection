
// Re-export everything from crudOperations
export * from './crudOperations';

// Re-export everything from querySchools except getSchoolsByRegion 
// which will be explicitly re-exported to avoid ambiguity
import * as querySchools from './querySchools';
export const {
  getSchools,
  getSchoolById,
  getSchoolsWithStats,
  getSchoolWithStats,
  searchSchools
} = querySchools;
export { getSchoolsByRegion } from './querySchools';

// Re-export everything from helperFunctions
export * from './helperFunctions';

// Re-export from schoolActivities
export * from './schoolActivities';

// Re-export types
export * from './types';
