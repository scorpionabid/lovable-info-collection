
// Re-export everything from crudOperations
export * from './crudOperations';

// Re-export from querySchools using explicit export to avoid naming conflicts
import * as querySchools from './querySchools';
export const {
  getSchools,
  getSchoolById,
  getSchoolsByRegion
} = querySchools;

// Re-export everything from helperFunctions
export * from './helperFunctions';

// Re-export from schoolActivities
export * from './schoolActivities';

// Re-export types
export * from './types';
