
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

// Import school stats
import {
  getSchoolStats as fetchSchoolStats
} from './queries/statsQueries';

// Custom functions for school activities
export const getSchoolStats = async (schoolId: string): Promise<SchoolStats> => {
  return fetchSchoolStats(schoolId);
};

export const getSchoolActivities = async (schoolId: string): Promise<any[]> => {
  // Placeholder implementation
  return [
    { id: '1', type: 'data_entry', date: new Date().toISOString(), user: 'Admin', description: 'Updated school data' },
    { id: '2', type: 'login', date: new Date(Date.now() - 86400000).toISOString(), user: 'Teacher', description: 'Logged in' }
  ];
};

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
  generateSchoolCode,
  
  // Stats and activities
  getSchoolStats,
  getSchoolActivities
};
