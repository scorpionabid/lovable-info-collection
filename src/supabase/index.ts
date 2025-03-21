
/**
 * Central export point for all Supabase related functionality
 */

// Export the client and configuration
export { supabase } from './client';
export { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG,
  CACHE_CONFIG,
  TABLES
} from './config';

// Export services
export {
  loginUser,
  logoutUser,
  getCurrentUser,
  resetPassword as supabaseResetPassword,
  updatePassword,
  refreshSession,
  getSession
} from './services/auth';

export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion
} from './services/regions';

export {
  getSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  getSectorsByRegionId
} from './services/sectors';

export {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByRegionId,
  getSchoolsBySectorId,
  getSchoolTypes
} from './services/schools';

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
} from './services/users';

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryColumns
} from './services/categories';

export {
  getData,
  getDataById,
  createData,
  updateData,
  deleteData
} from './services/data';

export {
  getNotifications,
  markNotificationRead, 
  markAllNotificationsRead,
  sendNotification
} from './services/notifications';

// Export hooks
export { useAuth } from './hooks/useAuth';
export { useRegions } from './hooks/useRegions';
export { useSectors } from './hooks/useSectors';
export { useSchools } from './hooks/useSchools';
export { useSchoolTypes } from './hooks/useSchoolTypes';
export { useUsers } from './hooks/useUsers';
export { useCategories } from './hooks/useCategories';
export { useData } from './hooks/useData';
export { useQuerySupabase } from './hooks/useQuerySupabase';
export { useMutateSupabase } from './hooks/useMutateSupabase';

// Export types 
export * from './types';
