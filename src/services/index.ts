
/**
 * Re-export all services for easier imports
 */

// Import and reexport specific services from centralized supabase module
export { 
  loginUser as login,
  logoutUser as logout,
  getCurrentUser,
  resetPassword,
  updatePassword as changePassword,
  refreshSession,
  getSession
} from '@/supabase/services/auth';

export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion
} from '@/supabase/services/regions';

export {
  getSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  getSectorsByRegion as getSectorsByRegionId
} from '@/supabase/services/sectors';

export {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByRegion,
  getSchoolsBySector,
  getSchoolTypes
} from '@/supabase/services/schools';

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '@/supabase/services/users';

// Export Supabase client 
export { supabase } from '@/supabase/client';

// Re-export config values
export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  CACHE_CONFIG
} from '@/supabase/config';
