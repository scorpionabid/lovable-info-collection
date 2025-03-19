
// Export all the necessary functions and types from the school service
import { getSchools, getSchoolById, getSchoolWithAdmin, getSchoolsByRegion } from './queries/schoolQueries';
import { createSchool, updateSchool, deleteSchool, archiveSchool } from './crudOperations';
import { getSchoolStats } from './queries/statsQueries';
import { getSchoolTypes } from './helperFunctions';
import { School, SchoolWithStats, SchoolStats, SchoolFilter, SchoolSortParams, SchoolPaginationParams, CreateSchoolDto, UpdateSchoolDto } from './types';

// Export type definitions
export type {
  School,
  SchoolWithStats,
  SchoolStats,
  SchoolFilter,
  SchoolSortParams,
  SchoolPaginationParams,
  CreateSchoolDto,
  UpdateSchoolDto
};

// Export query functions
export {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegion,
  createSchool,
  updateSchool,
  deleteSchool,
  archiveSchool,
  getSchoolStats,
  getSchoolTypes
};

// Default export for backward compatibility
const schoolService = {
  getSchools,
  getSchoolById,
  getSchoolWithAdmin,
  getSchoolsByRegion,
  createSchool,
  updateSchool,
  deleteSchool,
  archiveSchool,
  getSchoolStats,
  getSchoolTypes
};

export default schoolService;
