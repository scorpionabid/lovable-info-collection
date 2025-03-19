
// Export school services and types

// Import types
import { 
  School, 
  CreateSchoolDto,
  UpdateSchoolDto,
  SchoolFilter,
  SchoolSummary,
  SchoolStats,
  SchoolWithAdmin,
  SchoolDatabaseRow
} from './types';

// Export all types
export type { 
  School, 
  CreateSchoolDto,
  UpdateSchoolDto,
  SchoolFilter,
  SchoolSummary,
  SchoolStats,
  SchoolWithAdmin,
  SchoolDatabaseRow
};

// Import query functions
import {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegion as getSchoolsByRegionFromQueries
} from './queries/schoolQueries';

// Import CRUD operations
import {
  createSchool,
  updateSchool,
  deleteSchool,
  archiveSchool
} from './crudOperations';

// Import helper functions
import {
  getSchoolTypes,
  generateSchoolCode
} from './helperFunctions';

// Re-export everything
export {
  // Queries
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegionFromQueries as getSchoolsByRegion,
  
  // CRUD operations
  createSchool,
  updateSchool,
  deleteSchool,
  archiveSchool,
  
  // Helper functions
  getSchoolTypes,
  generateSchoolCode
};

// Default export
export default {
  // Queries
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegion: getSchoolsByRegionFromQueries,
  
  // CRUD operations
  createSchool,
  updateSchool,
  deleteSchool,
  archiveSchool,
  
  // Helper functions
  getSchoolTypes,
  generateSchoolCode
};
