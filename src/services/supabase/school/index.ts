
import { supabase } from '../supabaseClient';
import { CreateSchoolDto, School, SchoolFilter, UpdateSchoolDto } from './types';
import { getSchoolById, getSchools, querySchools } from './queries/schoolQueries';
import { getSchoolStats, getSchoolActivities } from './queries/statsQueries';

// Generate a random school code
export const generateSchoolCode = (): string => {
  return `SCH-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Export everything
export {
  getSchoolById,
  getSchools,
  querySchools,
  getSchoolStats,
  getSchoolActivities
};
