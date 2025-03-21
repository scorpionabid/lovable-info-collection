
/**
 * Re-export all services for easier imports
 */

// Import and reexport specific services from centralized supabase module
export { 
  loginUser as login,
  logoutUser as logout,
  getCurrentUser,
  resetPassword as supabaseResetPassword,
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
  getSectorsByRegionId
} from '@/supabase/services/sectors';

export {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByRegionId as getSchoolsByRegion,
  getSchoolsBySectorId as getSchoolsBySector,
  getSchoolTypes
} from '@/supabase/services/schools';

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} from '@/supabase/services/users';

// Export Supabase client and configuration
export { supabase } from '@/supabase/client';
export { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  CACHE_CONFIG 
} from '@/supabase/config';
