
import { supabase } from '../supabaseClient';
import { CreateSchoolDto, School, SchoolFilter, UpdateSchoolDto } from './types';
import { getSchoolById, getSchools } from './queries/schoolQueries';
import { getSchoolStats, getSchoolActivities } from './queries/statsQueries';

// Generate a random school code
export const generateSchoolCode = (): string => {
  return `SCH-${Math.floor(1000 + Math.random() * 9000)}`;
};

// Delete a school by ID
export const deleteSchool = async (schoolId: string) => {
  const { data, error } = await supabase
    .from('schools')
    .delete()
    .eq('id', schoolId);
  
  if (error) throw error;
  return data;
};

// Add dedicated function for querying schools with filters
export const querySchools = async (filters: SchoolFilter = {}) => {
  return getSchools(filters);
};

// Export everything
export {
  getSchoolById,
  getSchools,
  getSchoolStats,
  getSchoolActivities
};
